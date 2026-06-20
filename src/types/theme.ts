export interface StoryTheme {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  age_min: number | null;
  age_max: number | null;
  page_count: number;
  is_active: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryTemplate {
  id: string;
  theme_id: string;
  title: string | null;
  prompt_template: string;
  illustration_style: string | null;
  page_structure: PageStructureItem[] | null;
  default_reading_level: string | null;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageStructureItem {
  page_number: number;
  page_type: "cover" | "dedication" | "story" | "activity" | "ending";
  description: string;
}
