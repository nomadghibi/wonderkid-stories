import { z } from "zod";

export const createBookSchema = z.object({
  child_id: z.string().uuid("Invalid child profile"),
  theme_id: z.string().uuid("Invalid theme"),
  dedication: z.string().max(300, "Dedication too long").optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const bookReviewSchema = z.object({
  status: z.enum(["approved", "needs_changes", "regenerate_requested", "admin_review_required"]),
  feedback: z.string().max(1000).optional(),
});

export type BookReviewInput = z.infer<typeof bookReviewSchema>;
