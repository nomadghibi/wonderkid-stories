-- ============================================================
-- WonderKid Stories — Replace The Magical Forest Path with real images
-- Lily, Mei, Mateo, Amina. Cover + 9 story pages.
-- Run AFTER 012_image_pages.sql
-- ============================================================

update public.library_books
  set
    cover_image_url = '/library/magical-forest-path/cover.png',
    book_type       = 'ready_made_image_pages',
    page_count      = 9
  where slug = 'magical-forest-path';

delete from public.library_book_pages
  where book_id = (select id from public.library_books where slug = 'magical-forest-path');

-- Cover
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 0, 'cover', 'The Magical Forest Path', null,
  '/library/magical-forest-path/cover.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 1 — Lily steps onto the glowing golden path
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 1, 'story', null, null,
  '/library/magical-forest-path/page-01.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 2 — Squirrel drops acorns, Lily helps gather them
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 2, 'story', null, null,
  '/library/magical-forest-path/page-02.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 3 — Lily holds Mei's hand across the stepping stones
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 3, 'story', null, null,
  '/library/magical-forest-path/page-03.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 4 — Mateo and Lily bring berries to baby birds
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 4, 'story', null, null,
  '/library/magical-forest-path/page-04.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 5 — Lily and Amina free a songbird from vines
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 5, 'story', null, null,
  '/library/magical-forest-path/page-05.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 6 — Lost fox cub found, whole group reunites it with mother
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 6, 'story', null, null,
  '/library/magical-forest-path/page-06.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 7 — Wide glowing trail, kindness is the magic
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 7, 'story', null, null,
  '/library/magical-forest-path/page-07.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 8 — The Kindness Tree with glowing gifts on every branch
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 8, 'story', null, null,
  '/library/magical-forest-path/page-08.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';

-- Page 9 — Picnic under the Kindness Tree, friendship is the treasure
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type, has_embedded_text)
select b.id, 9, 'story', null, null,
  '/library/magical-forest-path/page-09.png', 'image_only', true
from public.library_books b where b.slug = 'magical-forest-path';
