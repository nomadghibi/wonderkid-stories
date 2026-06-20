import type { BookPage } from "@/types/book";

export interface QualityReport {
  passed: boolean;
  issues: string[];
  missingImages: number[];
  missingText: number[];
}

export function checkBookQuality(pages: BookPage[]): QualityReport {
  const issues: string[] = [];
  const missingImages: number[] = [];
  const missingText: number[] = [];

  if (pages.length === 0) {
    issues.push("Book has no pages");
    return { passed: false, issues, missingImages, missingText };
  }

  for (const page of pages) {
    if (page.page_type === "story" && !page.text_content) {
      missingText.push(page.page_number);
      issues.push(`Page ${page.page_number} has no text`);
    }
    if (!page.image_url) {
      missingImages.push(page.page_number);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    missingImages,
    missingText,
  };
}
