export type JobType =
  | "story_generation"
  | "image_generation"
  | "pdf_generation"
  | "audio_generation"
  | "full_book_generation";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface GenerationJob {
  id: string;
  book_id: string;
  user_id: string;
  job_type: JobType;
  status: JobStatus;
  current_step: string | null;
  provider: string | null;
  provider_job_id: string | null;
  attempt_count: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
