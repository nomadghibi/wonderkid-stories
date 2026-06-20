-- ============================================================
-- Fix: RLS infinite recursion on users table
-- The admin subquery in policies causes recursion because
-- querying public.users triggers its own RLS policies.
-- Solution: security definer function that bypasses RLS.
-- ============================================================

-- Create a security definer function to check admin role
-- Runs as postgres (superuser), bypasses RLS on users table
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- Drop old recursive policies and replace with is_admin()
-- ============================================================

-- USERS
drop policy if exists "users_select_admin" on public.users;
create policy "users_select_admin" on public.users
  for select using (is_admin());

-- CHILD PROFILES
drop policy if exists "child_profiles_admin" on public.child_profiles;
create policy "child_profiles_admin" on public.child_profiles
  for all using (is_admin());

-- CHILD PHOTOS
drop policy if exists "child_photos_admin" on public.child_photos;
create policy "child_photos_admin" on public.child_photos
  for all using (is_admin());

-- STORY THEMES
drop policy if exists "story_themes_select_all" on public.story_themes;
create policy "story_themes_select_all" on public.story_themes
  for select using (is_active = true or is_admin());

drop policy if exists "story_themes_admin_write" on public.story_themes;
create policy "story_themes_admin_write" on public.story_themes
  for all using (is_admin());

-- STORY TEMPLATES
drop policy if exists "story_templates_select_all" on public.story_templates;
create policy "story_templates_select_all" on public.story_templates
  for select using (is_active = true or is_admin());

drop policy if exists "story_templates_admin_write" on public.story_templates;
create policy "story_templates_admin_write" on public.story_templates
  for all using (is_admin());

-- BOOKS
drop policy if exists "books_admin" on public.books;
create policy "books_admin" on public.books
  for all using (is_admin());

-- BOOK PAGES
drop policy if exists "book_pages_admin" on public.book_pages;
create policy "book_pages_admin" on public.book_pages
  for all using (is_admin());

-- GENERATION JOBS
drop policy if exists "generation_jobs_admin" on public.generation_jobs;
create policy "generation_jobs_admin" on public.generation_jobs
  for all using (is_admin());

-- ORDERS
drop policy if exists "orders_admin" on public.orders;
create policy "orders_admin" on public.orders
  for all using (is_admin());

-- DOWNLOADS
drop policy if exists "downloads_admin" on public.downloads;
create policy "downloads_admin" on public.downloads
  for all using (is_admin());

-- BOOK REVIEWS
drop policy if exists "book_reviews_admin" on public.book_reviews;
create policy "book_reviews_admin" on public.book_reviews
  for all using (is_admin());

-- AUDIT LOGS
drop policy if exists "audit_logs_admin" on public.audit_logs;
create policy "audit_logs_admin" on public.audit_logs
  for all using (is_admin());
