-- ============================================================
-- WonderKid Stories — Make books.theme_id nullable
-- Template-first books use template_id; theme_id not required
-- ============================================================
alter table public.books alter column theme_id drop not null;
