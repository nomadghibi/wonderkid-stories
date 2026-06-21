-- ============================================================
-- WonderKid Stories — Image-Page Book Support
-- Adds has_embedded_text column + backfills Liam book
-- Run AFTER 011_liam_book.sql
-- ============================================================

-- Add has_embedded_text to library_book_pages
alter table public.library_book_pages
  add column if not exists has_embedded_text boolean not null default false;

-- Update library_books book_type to allow ready_made_image_pages
alter table public.library_books
  drop constraint if exists library_books_book_type_check;

alter table public.library_books
  add constraint library_books_book_type_check
  check (book_type in ('ready_made', 'variable_personalized', 'ai_custom', 'ready_made_image_pages'));

-- Backfill: Liam's Big Dream pages have text embedded in the images.
-- Also update the book_type to the explicit image-page type.
update public.library_book_pages
  set has_embedded_text = true
  where book_id = (select id from public.library_books where slug = 'liams-big-dream')
    and page_type in ('cover', 'story');

update public.library_books
  set book_type = 'ready_made_image_pages'
  where slug = 'liams-big-dream';
