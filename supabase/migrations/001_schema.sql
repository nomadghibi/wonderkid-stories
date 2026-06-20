-- ============================================================
-- WonderKid Stories — Database Schema
-- Run in Supabase SQL editor or via Supabase CLI
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS
-- Mirrors auth.users with application-level role/profile data
-- ============================================================
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  full_name    text,
  role         text not null default 'customer' check (role in ('customer', 'admin', 'school_admin')),
  stripe_customer_id text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create user row on auth signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- CHILD PROFILES
-- ============================================================
create table if not exists public.child_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  name            text not null,
  age             int check (age >= 1 and age <= 18),
  gender          text,
  skin_tone       text,
  hair_note       text,
  favorite_color  text,
  favorite_animal text,
  favorite_sport  text,
  reading_level   text default 'early_reader' check (reading_level in ('beginner', 'early_reader', 'reader')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger set_child_profiles_updated_at
  before update on public.child_profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- CHILD PHOTOS
-- ============================================================
create table if not exists public.child_photos (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references public.child_profiles(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  file_url     text not null,
  storage_path text not null,
  is_primary   boolean not null default false,
  status       text not null default 'uploaded' check (status in ('uploaded', 'processing', 'ready', 'failed')),
  created_at   timestamptz not null default now()
);

-- Only one primary photo per child
create unique index if not exists child_photos_primary_unique
  on public.child_photos (child_id)
  where is_primary = true;

-- ============================================================
-- STORY THEMES
-- ============================================================
create table if not exists public.story_themes (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  description     text,
  category        text,
  age_min         int default 3,
  age_max         int default 10,
  page_count      int not null default 10,
  is_active       boolean not null default true,
  cover_image_url text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger set_story_themes_updated_at
  before update on public.story_themes
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- STORY TEMPLATES
-- ============================================================
create table if not exists public.story_templates (
  id                   uuid primary key default gen_random_uuid(),
  theme_id             uuid not null references public.story_themes(id) on delete cascade,
  title                text,
  prompt_template      text not null,
  illustration_style   text,
  page_structure       jsonb,
  default_reading_level text default 'early_reader',
  version              int not null default 1,
  is_active            boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger set_story_templates_updated_at
  before update on public.story_templates
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- BOOKS
-- ============================================================
create table if not exists public.books (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  child_id           uuid not null references public.child_profiles(id),
  theme_id           uuid not null references public.story_themes(id),
  title              text,
  dedication         text,
  status             text not null default 'draft' check (status in (
    'draft', 'payment_pending', 'queued', 'story_generating',
    'images_generating', 'reader_ready', 'review_pending',
    'approved', 'pdf_generating', 'completed', 'failed', 'cancelled'
  )),
  review_status      text not null default 'not_ready' check (review_status in (
    'not_ready', 'approved', 'needs_changes', 'regenerate_requested', 'admin_review_required'
  )),
  pdf_url            text,
  reader_share_token text unique,
  approved_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger set_books_updated_at
  before update on public.books
  for each row execute procedure public.set_updated_at();

create index if not exists books_user_id_idx on public.books(user_id);
create index if not exists books_status_idx on public.books(status);

-- ============================================================
-- BOOK PAGES
-- ============================================================
create table if not exists public.book_pages (
  id           uuid primary key default gen_random_uuid(),
  book_id      uuid not null references public.books(id) on delete cascade,
  page_number  int not null,
  page_type    text not null default 'story' check (page_type in ('cover', 'dedication', 'story', 'activity', 'ending')),
  title        text,
  text_content text,
  image_prompt text,
  image_url    text,
  audio_url    text,
  status       text not null default 'pending' check (status in ('pending', 'generating', 'ready', 'failed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (book_id, page_number)
);

create trigger set_book_pages_updated_at
  before update on public.book_pages
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- GENERATION JOBS
-- ============================================================
create table if not exists public.generation_jobs (
  id              uuid primary key default gen_random_uuid(),
  book_id         uuid not null references public.books(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
  job_type        text not null check (job_type in (
    'story_generation', 'image_generation', 'pdf_generation',
    'audio_generation', 'full_book_generation'
  )),
  status          text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  current_step    text,
  provider        text,
  provider_job_id text,
  attempt_count   int not null default 0,
  error_message   text,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger set_generation_jobs_updated_at
  before update on public.generation_jobs
  for each row execute procedure public.set_updated_at();

create index if not exists generation_jobs_book_id_idx on public.generation_jobs(book_id);
create index if not exists generation_jobs_status_idx on public.generation_jobs(status);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users(id) on delete cascade,
  book_id                  uuid references public.books(id),
  stripe_payment_intent_id text,
  amount_cents             int not null,
  currency                 text not null default 'usd',
  status                   text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- DOWNLOADS
-- ============================================================
create table if not exists public.downloads (
  id             uuid primary key default gen_random_uuid(),
  book_id        uuid not null references public.books(id) on delete cascade,
  user_id        uuid not null references public.users(id) on delete cascade,
  download_url   text not null,
  expires_at     timestamptz not null,
  download_count int not null default 0,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- BOOK REVIEWS
-- ============================================================
create table if not exists public.book_reviews (
  id        uuid primary key default gen_random_uuid(),
  book_id   uuid not null references public.books(id) on delete cascade,
  user_id   uuid not null references public.users(id) on delete cascade,
  status    text not null check (status in ('approved', 'needs_changes', 'regenerate_requested', 'admin_review_required')),
  feedback  text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id),
  action      text not null,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
