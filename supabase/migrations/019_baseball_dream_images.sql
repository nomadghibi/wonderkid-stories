-- ============================================================
-- WonderKid Stories — Replace The Big Baseball Dream with real images
-- Corey. Cover + 10 story pages.
-- Run AFTER 012_image_pages.sql
-- ============================================================

update public.library_books
  set
    cover_image_url = '/library/baseball-dream/cover.png',
    book_type       = 'ready_made_image_pages',
    page_count      = 10
  where slug = 'baseball-dream';

delete from public.library_book_pages
  where book_id = (select id from public.library_books where slug = 'baseball-dream');

-- Cover
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 0, 'cover', 'The Big Baseball Dream', null,
  '/library/baseball-dream/cover.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 1 — Corey loved baseball
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 1, 'story', null, null,
  '/library/baseball-dream/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 2 — Every day after school, Corey practiced
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 2, 'story', null, null,
  '/library/baseball-dream/page-02.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 3 — Struck out, made errors, felt frustrated
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 3, 'story', null, null,
  '/library/baseball-dream/page-03.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 4 — Coach: heart and hard work make you great
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 4, 'story', null, null,
  '/library/baseball-dream/page-04.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 5 — Friends practiced together, never gave up
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 5, 'story', null, null,
  '/library/baseball-dream/page-05.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 6 — Game day, family cheering
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 6, 'story', null, null,
  '/library/baseball-dream/page-06.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 7 — Close game, stepped to plate, swung hard
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 7, 'story', null, null,
  '/library/baseball-dream/page-07.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 8 — Crack! Ball flew high, crowd roared
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 8, 'story', null, null,
  '/library/baseball-dream/page-08.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 9 — After the game, learned what matters most
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 9, 'story', null, null,
  '/library/baseball-dream/page-09.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';

-- Page 10 — That night, looked at stars, dream just beginning
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 10, 'story', null, null,
  '/library/baseball-dream/page-10.png', 'image_only', true
from public.library_books b where b.slug = 'baseball-dream';
