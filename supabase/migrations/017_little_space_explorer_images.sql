-- ============================================================
-- WonderKid Stories — Replace The Little Space Explorer with real images
-- Zoe, Kai, Amina, Mateo. Cover + 9 story pages.
-- Run AFTER 012_image_pages.sql
-- ============================================================

update public.library_books
  set
    cover_image_url = '/library/little-space-explorer/cover.png',
    book_type       = 'ready_made_image_pages',
    page_count      = 9
  where slug = 'little-space-explorer';

delete from public.library_book_pages
  where book_id = (select id from public.library_books where slug = 'little-space-explorer');

-- Cover
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 0, 'cover', 'The Little Space Explorer', null,
  '/library/little-space-explorer/cover.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 1 — Zoe finds the tiny silver rocket
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 1, 'story', null, null,
  '/library/little-space-explorer/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 2 — Lands on moon, meets Kai
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 2, 'story', null, null,
  '/library/little-space-explorer/page-02.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 3 — Hopping in low gravity with Kai
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 3, 'story', null, null,
  '/library/little-space-explorer/page-03.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 4 — Fixing Amina's rover together
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 4, 'story', null, null,
  '/library/little-space-explorer/page-04.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 5 — Crystal cave with Mateo, secret door opens
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 5, 'story', null, null,
  '/library/little-space-explorer/page-05.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 6 — Moon Garden, freeing the moon bunny
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 6, 'story', null, null,
  '/library/little-space-explorer/page-06.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 7 — Telescope: Earth glowing blue and beautiful
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 7, 'story', null, null,
  '/library/little-space-explorer/page-07.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 8 — Starberry muffins, moonflower seeds
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 8, 'story', null, null,
  '/library/little-space-explorer/page-08.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';

-- Page 9 — Zoe home, friendship makes the universe shine
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 9, 'story', null, null,
  '/library/little-space-explorer/page-09.png', 'image_only', true
from public.library_books b where b.slug = 'little-space-explorer';
