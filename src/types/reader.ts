export type ReaderMode = "sample" | "review" | "final";
export type FontSize = "small" | "normal" | "large" | "extraLarge";
export type BookPageType = "cover" | "dedication" | "story" | "certificate" | "ending";

export const FONT_SIZE_PX: Record<FontSize, number> = {
  small: 18,
  normal: 22,
  large: 26,
  extraLarge: 30,
};

export const FONT_SIZE_LABELS: Record<FontSize, string> = {
  small: "A",
  normal: "A",
  large: "A",
  extraLarge: "A",
};

export const FONT_SIZES: FontSize[] = ["small", "normal", "large", "extraLarge"];

export interface BookReaderPage {
  pageId?: string;
  pageNumber: number;
  pageType: BookPageType;
  title?: string;
  text?: string;
  imageUrl?: string;
}

export interface BookReaderData {
  id: string;
  title: string;
  childName?: string;
  coverImageUrl?: string;
  mode: ReaderMode;
  templateSlug?: string;
  pages: BookReaderPage[];
}
