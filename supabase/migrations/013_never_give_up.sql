-- ============================================================
-- WonderKid Stories — "Never Give Up!" (Mia)
-- Image-page book: 10 finished illustrated pages
-- Mia's art contest perseverance story
-- Run AFTER 012_image_pages.sql
-- ============================================================

insert into public.library_books
  (subject_id, slug, title, subtitle, description,
   reading_level, age_min, age_max, page_count,
   cover_image_url, cover_color, book_type, is_free, is_active, sort_order)
select s.id,
  'never-give-up-mia',
  'Never Give Up!',
  'The Story of Mia and Her Big Goal',
  'Mia wants to enter the school art contest, but her pictures don''t look right. With her mom''s encouragement she keeps trying — and learns that never giving up is the real win.',
  'beginner', 4, 7, 10,
  '/library/never-give-up-mia/page-01.png',
  'A855F7', 'ready_made_image_pages', true, true, 7
from public.subjects s where s.slug = 'social-skills'
on conflict (slug) do nothing;

-- Cover (uses page-01 image)
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 0, 'cover', 'Never Give Up!', null,
  '/library/never-give-up-mia/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 1 — Mia loved to draw
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 1, 'story', null, null,
  '/library/never-give-up-mia/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 2 — didn't look perfect
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 2, 'story', null, null,
  '/library/never-give-up-mia/page-02.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 3 — friend says not ready yet
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 3, 'story', null, null,
  '/library/never-give-up-mia/page-03.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 4 — mom's advice: keep going
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 4, 'story', null, null,
  '/library/never-give-up-mia/page-04.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 5 — practiced more, made mistakes
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 5, 'story', null, null,
  '/library/never-give-up-mia/page-05.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 6 — tried again and again
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 6, 'story', null, null,
  '/library/never-give-up-mia/page-06.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 7 — picture got better and better
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 7, 'story', null, null,
  '/library/never-give-up-mia/page-07.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 8 — day of the contest
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 8, 'story', null, null,
  '/library/never-give-up-mia/page-08.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 9 — teacher's ribbon: hard work showed
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 9, 'story', null, null,
  '/library/never-give-up-mia/page-09.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;

-- Page 10 — never giving up is the real win
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 10, 'story', null, null,
  '/library/never-give-up-mia/page-10.png', 'image_only', true
from public.library_books b where b.slug = 'never-give-up-mia'
on conflict (book_id, page_number) do nothing;
