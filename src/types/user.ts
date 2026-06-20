export type UserRole = "customer" | "admin" | "school_admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}
