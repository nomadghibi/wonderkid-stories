import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const MOCK_PAYMENT_MODE = process.env.MOCK_PAYMENT_MODE === "true";
