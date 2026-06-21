-- ============================================================
-- WonderKid Stories — Fix Liam book cover + title
-- Safe to run even if 011 was run before cover was added.
-- Run AFTER 011_liam_book.sql
-- ============================================================

update public.library_books
  set
    title            = 'Liam''s Dream Under the Stars',
    subtitle         = 'A Story of Wonder, Hope, and Big Dreams',
    cover_image_url  = '/library/liam-big-dream/cover.png'
  where slug = 'liams-big-dream';

update public.library_book_pages
  set
    image_url = '/library/liam-big-dream/cover.png',
    title     = 'Liam''s Dream Under the Stars'
  where book_id = (select id from public.library_books where slug = 'liams-big-dream')
    and page_number = 0;
