export type TemplatePageType =
  | "cover"
  | "dedication"
  | "story"
  | "activity"
  | "certificate"
  | "ending";

export type TemplateLayoutType =
  | "cover_full"
  | "image_top_text_bottom"
  | "image_left_text_right"
  | "text_only"
  | "certificate";

export interface BookTemplate {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  age_min: number | null;
  age_max: number | null;
  reading_level: string | null;
  page_count: number;
  price_cents: number;
  sample_child_profile: SampleChildProfile | null;
  sample_cover_url: string | null;
  illustration_style: string | null;
  pdf_layout_type: string;
  reader_layout_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SampleChildProfile {
  name: string;
  age: number;
  favorite_color?: string;
  favorite_animal?: string;
  favorite_sport?: string;
  hair_note?: string;
  skin_tone?: string;
}

export interface TemplatePage {
  id: string;
  template_id: string;
  page_number: number;
  page_type: TemplatePageType;
  title_template: string | null;
  story_beat: string;
  placeholder_text: string | null;
  text_prompt_template: string | null;
  visual_prompt_template: string | null;
  layout_type: TemplateLayoutType;
  created_at: string;
  updated_at: string;
}

export interface BookTemplateWithPages extends BookTemplate {
  template_pages: TemplatePage[];
}

/** Generic page shape used by both SampleReader and BookReader */
export interface ReaderPage {
  pageNumber: number;
  pageType: TemplatePageType | "story" | "dedication" | "ending";
  title: string;
  text: string;
  imageUrl: string | null;
  layoutType?: string;
}

/** Generic book shape passed to the reader components */
export interface ReaderBook {
  id: string | null;
  title: string;
  status: string;
  mode: "sample" | "review" | "final";
  templateSlug?: string;
  themeTitle?: string;
  childName?: string;
}
