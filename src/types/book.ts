export type BookStatus =
  | "draft"
  | "payment_pending"
  | "queued"
  | "story_generating"
  | "images_generating"
  | "reader_ready"
  | "review_pending"
  | "approved"
  | "pdf_generating"
  | "completed"
  | "failed"
  | "cancelled";

export type ReviewStatus =
  | "not_ready"
  | "approved"
  | "needs_changes"
  | "regenerate_requested"
  | "admin_review_required";

export type PageType = "cover" | "dedication" | "story" | "activity" | "ending";
export type PageStatus = "pending" | "generating" | "ready" | "failed";

export interface Book {
  id: string;
  user_id: string;
  child_id: string;
  theme_id: string;
  title: string | null;
  dedication: string | null;
  status: BookStatus;
  review_status: ReviewStatus;
  pdf_url: string | null;
  reader_share_token: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookPage {
  id: string;
  book_id: string;
  page_number: number;
  page_type: PageType;
  title: string | null;
  text_content: string | null;
  image_prompt: string | null;
  image_url: string | null;
  audio_url: string | null;
  status: PageStatus;
  created_at: string;
  updated_at: string;
}

export interface BookWithDetails extends Book {
  story_themes: { id: string; title: string; slug: string } | null;
  child_profiles: { id: string; name: string; age: number | null } | null;
}
