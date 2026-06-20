export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  book_id: string;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}
