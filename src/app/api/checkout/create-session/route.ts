import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { stripe, MOCK_PAYMENT_MODE } from "@/lib/stripe";
import { PRICING } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { z } from "zod";

const schema = z.object({
  book_id: z.string().uuid(),
  product: z.enum(["singleBook", "bundleThree"]),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { book_id, product } = parsed.data;
  const pricing = PRICING[product];

  // Verify book belongs to user and is in draft/payment_pending state
  const { data: book } = await supabase
    .from("books")
    .select("id, status")
    .eq("id", book_id)
    .eq("user_id", user.id)
    .single();

  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  if (MOCK_PAYMENT_MODE) {
    // Skip Stripe in mock mode — directly create order and queue generation
    const serviceClient = await createServiceClient();

    await serviceClient.from("orders").insert({
      user_id: user.id,
      book_id,
      amount_cents: pricing.amountCents,
      currency: "usd",
      status: "paid",
      stripe_payment_intent_id: `mock_${Date.now()}`,
    });

    await serviceClient.from("books").update({ status: "queued" }).eq("id", book_id);

    return NextResponse.json({
      mock: true,
      redirect: `${siteConfig.url}/dashboard/books/${book_id}`,
    });
  }

  // Real Stripe session
  const { data: profile } = await supabase
    .from("users")
    .select("email, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: profile?.stripe_customer_id ? undefined : profile?.email,
    customer: profile?.stripe_customer_id ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pricing.amountCents,
          product_data: {
            name: pricing.label,
            description: pricing.description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      book_id,
      user_id: user.id,
      product,
    },
    success_url: `${siteConfig.url}/dashboard/books/${book_id}?payment=success`,
    cancel_url: `${siteConfig.url}/dashboard/books/${book_id}?payment=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
