-- ============================================================
-- WonderKid Stories — Row Level Security Policies
-- Run AFTER 001_schema.sql
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================
alter table public.users enable row level security;

-- Users can read own profile
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

-- Users can update own profile (non-role fields)
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Admins can read all users
create policy "users_select_admin" on public.users
  for select using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- CHILD PROFILES
-- ============================================================
alter table public.child_profiles enable row level security;

create policy "child_profiles_select_own" on public.child_profiles
  for select using (auth.uid() = user_id);

create policy "child_profiles_insert_own" on public.child_profiles
  for insert with check (auth.uid() = user_id);

create policy "child_profiles_update_own" on public.child_profiles
  for update using (auth.uid() = user_id);

create policy "child_profiles_delete_own" on public.child_profiles
  for delete using (auth.uid() = user_id);

create policy "child_profiles_admin" on public.child_profiles
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- CHILD PHOTOS
-- ============================================================
alter table public.child_photos enable row level security;

create policy "child_photos_select_own" on public.child_photos
  for select using (auth.uid() = user_id);

create policy "child_photos_insert_own" on public.child_photos
  for insert with check (auth.uid() = user_id);

create policy "child_photos_update_own" on public.child_photos
  for update using (auth.uid() = user_id);

create policy "child_photos_delete_own" on public.child_photos
  for delete using (auth.uid() = user_id);

create policy "child_photos_admin" on public.child_photos
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- STORY THEMES (public read, admin write)
-- ============================================================
alter table public.story_themes enable row level security;

create policy "story_themes_select_all" on public.story_themes
  for select using (is_active = true or
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy "story_themes_admin_write" on public.story_themes
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- STORY TEMPLATES (public read, admin write)
-- ============================================================
alter table public.story_templates enable row level security;

create policy "story_templates_select_all" on public.story_templates
  for select using (is_active = true or
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy "story_templates_admin_write" on public.story_templates
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- BOOKS
-- ============================================================
alter table public.books enable row level security;

create policy "books_select_own" on public.books
  for select using (auth.uid() = user_id);

create policy "books_insert_own" on public.books
  for insert with check (auth.uid() = user_id);

create policy "books_update_own" on public.books
  for update using (auth.uid() = user_id);

-- Share token access (unauthenticated read for shared books)
create policy "books_select_share_token" on public.books
  for select using (reader_share_token is not null and status = 'completed');

create policy "books_admin" on public.books
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- BOOK PAGES
-- ============================================================
alter table public.book_pages enable row level security;

create policy "book_pages_select_own" on public.book_pages
  for select using (
    exists (select 1 from public.books b where b.id = book_id and b.user_id = auth.uid())
  );

create policy "book_pages_insert_service" on public.book_pages
  for insert with check (
    exists (select 1 from public.books b where b.id = book_id and b.user_id = auth.uid())
  );

create policy "book_pages_admin" on public.book_pages
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- GENERATION JOBS
-- ============================================================
alter table public.generation_jobs enable row level security;

create policy "generation_jobs_select_own" on public.generation_jobs
  for select using (auth.uid() = user_id);

create policy "generation_jobs_admin" on public.generation_jobs
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- ORDERS
-- ============================================================
alter table public.orders enable row level security;

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "orders_admin" on public.orders
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- DOWNLOADS
-- ============================================================
alter table public.downloads enable row level security;

create policy "downloads_select_own" on public.downloads
  for select using (auth.uid() = user_id);

create policy "downloads_insert_own" on public.downloads
  for insert with check (auth.uid() = user_id);

create policy "downloads_admin" on public.downloads
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- BOOK REVIEWS
-- ============================================================
alter table public.book_reviews enable row level security;

create policy "book_reviews_select_own" on public.book_reviews
  for select using (auth.uid() = user_id);

create policy "book_reviews_insert_own" on public.book_reviews
  for insert with check (auth.uid() = user_id);

create policy "book_reviews_admin" on public.book_reviews
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- AUDIT LOGS (insert-only for users, all for admin)
-- ============================================================
alter table public.audit_logs enable row level security;

create policy "audit_logs_insert_own" on public.audit_logs
  for insert with check (auth.uid() = user_id);

create policy "audit_logs_admin" on public.audit_logs
  for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );
