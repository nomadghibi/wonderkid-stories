import type { BookPage } from "@/types/book";
import type { StoryPlan } from "./story-planner";

export interface AssembledBook {
  title: string;
  pages: BookPage[];
}

export function assembleBook(plan: StoryPlan, bookId: string, imageUrls: Record<number, string>): Partial<BookPage>[] {
  return plan.pages.map((page) => ({
    book_id: bookId,
    page_number: page.page_number,
    page_type: "story" as const,
    title: page.title,
    text_content: page.text,
    image_prompt: page.visual_description,
    image_url: imageUrls[page.page_number] ?? null,
    status: "ready" as const,
  }));
}
