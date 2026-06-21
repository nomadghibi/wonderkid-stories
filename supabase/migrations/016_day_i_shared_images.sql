-- ============================================================
-- WonderKid Stories — Replace The Day I Shared My Toy with real images
-- Ava, Ben, and the bright red train. Cover + 8 story pages.
-- Run AFTER 012_image_pages.sql
-- ============================================================

update public.library_books
  set
    cover_image_url = '/library/day-i-shared/cover.png',
    book_type       = 'ready_made_image_pages',
    page_count      = 8
  where slug = 'day-i-shared';

delete from public.library_book_pages
  where book_id = (select id from public.library_books where slug = 'day-i-shared');

-- Cover
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 0, 'cover', 'The Day I Shared My Toy', null,
  '/library/day-i-shared/cover.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 1 — Ava and her bright red train
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 1, 'story', null, null,
  '/library/day-i-shared/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 2 — Moving truck, Ben arrives
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 2, 'story', null, null,
  '/library/day-i-shared/page-02.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 3 — Ben spots the train, sharing feels hard
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 3, 'story', null, null,
  '/library/day-i-shared/page-03.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 4 — Mom's words: sharing makes joy bigger
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 4, 'story', null, null,
  '/library/day-i-shared/page-04.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 5 — Ava hands Ben the train
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 5, 'story', null, null,
  '/library/day-i-shared/page-05.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 6 — Building the track together
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 6, 'story', null, null,
  '/library/day-i-shared/page-06.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 7 — Station and ticket booth, smiles grow bigger
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 7, 'story', null, null,
  '/library/day-i-shared/page-07.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';

-- Page 8 — Snack time: train still hers, gained a friend
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 8, 'story', null, null,
  '/library/day-i-shared/page-08.png', 'image_only', true
from public.library_books b where b.slug = 'day-i-shared';
