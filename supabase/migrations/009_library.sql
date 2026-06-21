-- ============================================================
-- WonderKid Stories — Static Book Library
-- Run AFTER 001–008 migrations
-- ============================================================

-- ============================================================
-- SUBJECTS  (Sports, Adventure, Science, Social Skills, Math)
-- ============================================================
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  emoji       text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- LIBRARY BOOKS
-- ============================================================
create table if not exists public.library_books (
  id              uuid primary key default gen_random_uuid(),
  subject_id      uuid references public.subjects(id),
  slug            text unique not null,
  title           text not null,
  subtitle        text,
  description     text,
  reading_level   text not null default 'early_reader'
                    check (reading_level in ('beginner', 'early_reader', 'reader')),
  age_min         int not null default 4,
  age_max         int not null default 8,
  page_count      int not null default 10,
  cover_image_url text,
  cover_color     text not null default '6C63FF',
  book_type       text not null default 'ready_made'
                    check (book_type in ('ready_made', 'variable_personalized', 'ai_custom')),
  is_free         boolean not null default true,
  is_active       boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger set_library_books_updated_at
  before update on public.library_books
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- LIBRARY BOOK PAGES
-- ============================================================
create table if not exists public.library_book_pages (
  id           uuid primary key default gen_random_uuid(),
  book_id      uuid not null references public.library_books(id) on delete cascade,
  page_number  int not null,
  page_type    text not null default 'story'
                 check (page_type in ('cover','story','activity','certificate','ending','dedication')),
  title        text,
  text_content text,
  image_url    text,
  audio_url    text,
  layout_type  text not null default 'image_top_text_bottom',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (book_id, page_number)
);

create trigger set_library_book_pages_updated_at
  before update on public.library_book_pages
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- CHILD BOOK SESSIONS  (reading progress, optional)
-- ============================================================
create table if not exists public.child_book_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  child_id     uuid references public.child_profiles(id) on delete set null,
  book_id      uuid not null references public.library_books(id) on delete cascade,
  current_page int not null default 0,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, book_id)
);

create trigger set_child_book_sessions_updated_at
  before update on public.child_book_sessions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================
alter table public.subjects           enable row level security;
alter table public.library_books      enable row level security;
alter table public.library_book_pages enable row level security;
alter table public.child_book_sessions enable row level security;

-- Public read (anon + authenticated)
create policy "subjects_public_read"
  on public.subjects for select using (is_active = true);

create policy "library_books_public_read"
  on public.library_books for select using (is_active = true);

create policy "library_book_pages_public_read"
  on public.library_book_pages for select
  using (exists (
    select 1 from public.library_books b
    where b.id = book_id and b.is_active = true
  ));

-- Admin write
create policy "subjects_admin_all"
  on public.subjects for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "library_books_admin_all"
  on public.library_books for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "library_book_pages_admin_all"
  on public.library_book_pages for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Sessions: own read/write only
create policy "sessions_own"
  on public.child_book_sessions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
