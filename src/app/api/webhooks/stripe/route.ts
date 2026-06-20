import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe webhook] Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { book_id, user_id } = session.metadata ?? {};

    if (!book_id || !user_id) {
      console.error("[stripe webhook] Missing metadata on session", session.id);
      return NextResponse.json({ received: true });
    }

    // Create order record
    await supabase.from("orders").insert({
      user_id,
      book_id,
      stripe_payment_intent_id: session.payment_intent as string,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: "paid",
    });

    // Store Stripe customer ID if new
    if (session.customer) {
      await supabase
        .from("users")
        .update({ stripe_customer_id: session.customer as string })
        .eq("id", user_id);
    }

    // Move book to queued
    await supabase.from("books").update({ status: "queued" }).eq("id", book_id);

    await logAudit(user_id, "payment_completed", "books", book_id, {
      stripe_session_id: session.id,
      amount: session.amount_total,
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    // Find the order and mark it failed
    await supabase
      .from("orders")
      .update({ status: "failed" })
      .eq("stripe_payment_intent_id", intent.id);
  }

  return NextResponse.json({ received: true });
}
