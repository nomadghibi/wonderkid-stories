-- ============================================================
-- WonderKid Stories — Replace Number Treasure Hunt with real images
-- Replaces placeholder pages with 9 finished illustrated pages.
-- Safe to run after 010_library_seed.sql (deletes old pages first).
-- ============================================================

-- Update book metadata
update public.library_books
  set
    cover_image_url = '/library/number-treasure-hunt/cover.png',
    book_type       = 'ready_made_image_pages',
    page_count      = 9
  where slug = 'number-treasure-hunt';

-- Remove all old placeholder pages
delete from public.library_book_pages
  where book_id = (select id from public.library_books where slug = 'number-treasure-hunt');

-- Cover
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 0, 'cover', 'The Number Treasure Hunt', null,
  '/library/number-treasure-hunt/cover.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 1 — Pip finds the map
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 1, 'story', null, null,
  '/library/number-treasure-hunt/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 2 — Count the stones, start on five
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 2, 'story', null, null,
  '/library/number-treasure-hunt/page-02.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 3 — Two butterflies + three = five
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 3, 'story', null, null,
  '/library/number-treasure-hunt/page-03.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 4 — Red, blue pattern
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 4, 'story', null, null,
  '/library/number-treasure-hunt/page-04.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 5 — Stream: four + two = six
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 5, 'story', null, null,
  '/library/number-treasure-hunt/page-05.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 6 — Door with shapes: 3+2+1=6
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 6, 'story', null, null,
  '/library/number-treasure-hunt/page-06.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 7 — Glowing lanterns pattern
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 7, 'story', null, null,
  '/library/number-treasure-hunt/page-07.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 8 — Treasure chest: joy of learning
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 8, 'story', null, null,
  '/library/number-treasure-hunt/page-08.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';

-- Page 9 — Pip shares with friends
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 9, 'story', null, null,
  '/library/number-treasure-hunt/page-09.png', 'image_only', true
from public.library_books b where b.slug = 'number-treasure-hunt';
