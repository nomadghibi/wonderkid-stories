export type ReadingLevel = "beginner" | "early_reader" | "reader";

export interface ChildProfile {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  gender: string | null;
  skin_tone: string | null;
  hair_note: string | null;
  favorite_color: string | null;
  favorite_animal: string | null;
  favorite_sport: string | null;
  reading_level: ReadingLevel | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChildPhoto {
  id: string;
  child_id: string;
  user_id: string;
  file_url: string;
  storage_path: string;
  is_primary: boolean;
  status: "uploaded" | "processing" | "ready" | "failed";
  created_at: string;
}
