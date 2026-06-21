export type BookType = "ready_made" | "variable_personalized" | "ai_custom" | "ready_made_image_pages";
export type LibraryPageType = "cover" | "story" | "activity" | "certificate" | "ending" | "dedication";
export type ReadingLevel = "beginner" | "early_reader" | "reader";

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  emoji: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface LibraryBook {
  id: string;
  subject_id: string | null;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  reading_level: ReadingLevel;
  age_min: number;
  age_max: number;
  page_count: number;
  cover_image_url: string | null;
  cover_color: string;
  book_type: BookType;
  is_free: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  subjects?: Subject;
}

export interface LibraryBookPage {
  id: string;
  book_id: string;
  page_number: number;
  page_type: LibraryPageType;
  title: string | null;
  text_content: string | null;
  image_url: string | null;
  audio_url: string | null;
  layout_type: string;
  has_embedded_text: boolean;
  created_at: string;
  updated_at: string;
}

export interface LibraryBookWithPages extends LibraryBook {
  library_book_pages: LibraryBookPage[];
}
