export type ReaderMode = "sample" | "review" | "final" | "library";

export type FontFamily = "nunito" | "lexend" | "abeezee" | "andika" | "fredoka";

export const FONT_FAMILY_LABEL: Record<FontFamily, string> = {
  nunito:   "Nunito",
  lexend:   "Lexend",
  abeezee:  "ABeeZee",
  andika:   "Andika",
  fredoka:  "Fredoka",
};

export const FONT_FAMILY_CSS: Record<FontFamily, string> = {
  nunito:   "var(--font-nunito)",
  lexend:   "var(--font-lexend)",
  abeezee:  "var(--font-abeezee)",
  andika:   "var(--font-andika)",
  fredoka:  "var(--font-fredoka)",
};

export const FONT_FAMILY_DESC: Record<FontFamily, string> = {
  nunito:   "Warm & rounded",
  lexend:   "Research-backed reading clarity",
  abeezee:  "Designed for young children",
  andika:   "Literacy-focused spacing",
  fredoka:  "Playful & friendly",
};

export const FONT_FAMILIES: FontFamily[] = ["nunito", "lexend", "abeezee", "andika", "fredoka"];
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
  layoutType?: string;
  hasEmbeddedText?: boolean;
}

export interface BookReaderData {
  id: string;
  title: string;
  childName?: string;
  coverImageUrl?: string;
  mode: ReaderMode;
  templateSlug?: string;
  pages: BookReaderPage[];
  slug?: string;
  quizQuestions?: import("@/lib/bookQuizzes").QuizQuestion[];
}
