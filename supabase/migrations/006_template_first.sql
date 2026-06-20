-- ============================================================
-- WonderKid Stories — Template-First Architecture (Step 1)
-- Run AFTER 001–005 migrations
-- ============================================================

-- ============================================================
-- BOOK TEMPLATES
-- The product catalog — each row is a purchasable book product
-- ============================================================
create table if not exists public.book_templates (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  title               text not null,
  subtitle            text,
  description         text,
  category            text,
  age_min             int default 3,
  age_max             int default 10,
  reading_level       text default 'early_reader',
  page_count          int not null default 10,
  price_cents         int not null default 1499,
  sample_child_profile jsonb,
  sample_cover_url    text,
  illustration_style  text,
  pdf_layout_type     text not null default 'standard_storybook',
  reader_layout_type  text not null default 'standard_reader',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger set_book_templates_updated_at
  before update on public.book_templates
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- TEMPLATE PAGES
-- Per-page structure: story beats, placeholder text, AI prompts
-- ============================================================
create table if not exists public.template_pages (
  id                     uuid primary key default gen_random_uuid(),
  template_id            uuid not null references public.book_templates(id) on delete cascade,
  page_number            int not null,
  page_type              text not null default 'story'
                           check (page_type in ('cover','dedication','story','activity','certificate','ending')),
  title_template         text,
  story_beat             text not null,
  placeholder_text       text,
  text_prompt_template   text,
  visual_prompt_template text,
  layout_type            text not null default 'image_top_text_bottom',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (template_id, page_number)
);

create trigger set_template_pages_updated_at
  before update on public.template_pages
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ALTER EXISTING TABLES — non-breaking, nullable FKs
-- ============================================================

-- Link books to the book_template they were generated from
alter table public.books
  add column if not exists template_id uuid references public.book_templates(id);

-- Link generated pages back to their source template page
alter table public.book_pages
  add column if not exists template_page_id uuid references public.template_pages(id);

create index if not exists books_template_id_idx on public.books(template_id);
create index if not exists book_pages_template_page_id_idx on public.book_pages(template_page_id);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================
alter table public.book_templates enable row level security;
alter table public.template_pages enable row level security;

-- Anyone (anon or authenticated) can read active templates
create policy "book_templates_public_read"
  on public.book_templates for select
  using (is_active = true);

-- Admin can do everything
create policy "book_templates_admin_all"
  on public.book_templates for all
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ))
  with check (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- Anyone can read template pages for active templates
create policy "template_pages_public_read"
  on public.template_pages for select
  using (exists (
    select 1 from public.book_templates bt
    where bt.id = template_id and bt.is_active = true
  ));

create policy "template_pages_admin_all"
  on public.template_pages for all
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ))
  with check (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));
