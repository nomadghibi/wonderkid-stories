-- ============================================================
-- WonderKid Stories — Liam's Big Dream Adventure
-- Full-page illustrated book from real artwork
-- layout_type 'full_page' = image fills entire page, no text panel
-- ============================================================

-- Add to Adventure subject
insert into public.library_books
  (subject_id, slug, title, subtitle, description,
   reading_level, age_min, age_max, page_count,
   cover_color, book_type, is_free, is_active, sort_order)
select s.id,
  'liams-big-dream',
  'Liam''s Big Dream Adventure',
  'A magical journey of bravery, kindness, and believing in yourself',
  'Liam is a curious boy with a big heart and an even bigger dream. One night he makes a wish on a falling star — and the very next morning, a glowing map appears under his pillow pointing to the Forest of Dreams.',
  'early_reader', 5, 9, 10,
  '5B21B6', 'ready_made', true, true, 10
from public.subjects s where s.slug = 'adventure'
on conflict (slug) do nothing;

-- Cover page (uses page-1 illustration — Liam at window gazing at stars)
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 0, 'cover',
  'Liam''s Big Dream Adventure',
  'A magical journey of bravery, kindness, and believing in yourself.',
  '/library/liam-big-dream/page-1.png',
  'cover_full'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 1
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 1, 'story',
  'A Big Heart and an Even Bigger Dream',
  'Liam was a curious boy with a big heart and an even bigger dream. Each night he looked at the stars and imagined the wonderful things he might do.',
  '/library/liam-big-dream/page-1.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 2
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 2, 'story',
  'A Wish on a Falling Star',
  'One quiet night, Liam made a wish on a falling star. "I wish I could do something wonderful one day," he whispered.',
  '/library/liam-big-dream/page-2.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 3
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 3, 'story',
  'The Glowing Map',
  'The next morning, Liam found a glowing map under his pillow. It shimmered softly and pointed toward the Forest of Dreams.',
  '/library/liam-big-dream/page-3.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 4
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 4, 'story',
  'A Brave Heart Keeps Moving',
  'Liam packed his backpack, took a deep breath, and set off down the winding path. He felt a little nervous, but his brave heart kept him moving.',
  '/library/liam-big-dream/page-4.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 5
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 5, 'story',
  'The Lost Rabbit',
  'In the forest, Liam met a little rabbit who was lost and afraid. Liam knelt down, smiled kindly, and helped the rabbit find its family.',
  '/library/liam-big-dream/page-5.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 6
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 6, 'story',
  'One Step at a Time',
  'Soon Liam reached a wobbly bridge over a rushing river. He was scared, but he remembered his wish and carefully crossed one step at a time.',
  '/library/liam-big-dream/page-6.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 7
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 7, 'story',
  'You Are Braver Than You Believe',
  'At the top of the hill, Liam found a stone door with a shining golden key. A note beside it said, "You are braver than you believe."',
  '/library/liam-big-dream/page-7.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 8
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 8, 'story',
  'The Joyful Town',
  'Liam turned the key, and the door opened to a joyful town filled with music and light. The people cheered because someone kind and brave had finally arrived.',
  '/library/liam-big-dream/page-8.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 9
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 9, 'story',
  'What Real Adventures Are About',
  'Liam learned that real adventures are not about being the best. They are about helping others, trying again, and believing in yourself.',
  '/library/liam-big-dream/page-9.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Page 10
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 10, 'story',
  'A Happy Heart and a Brand-New Dream',
  'That night Liam returned home with a happy heart and a brand-new dream. He knew that every day could be an adventure when he chose kindness and courage.',
  '/library/liam-big-dream/page-10.png',
  'full_page'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;

-- Certificate
insert into public.library_book_pages
  (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 11, 'certificate',
  'Dream Big Certificate',
  'For showing kindness, courage, and believing in yourself every step of the way. Keep dreaming big — the adventure never stops!',
  null,
  'certificate'
from public.library_books b where b.slug = 'liams-big-dream'
on conflict (book_id, page_number) do nothing;
