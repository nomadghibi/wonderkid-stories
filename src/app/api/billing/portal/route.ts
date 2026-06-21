import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { stripe, MOCK_PAYMENT_MODE } from "@/lib/stripe";
import { siteConfig } from "@/config/site";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (MOCK_PAYMENT_MODE || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ mock: true });
  }

  const { data: profile } = await supabase.from("users").select("stripe_customer_id, email").eq("id", user.id).single();

  let customerId = profile?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    const service = await createServiceClient();
    await service.from("users").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteConfig.url}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
