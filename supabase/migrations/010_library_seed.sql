-- ============================================================
-- WonderKid Stories — Library Seed Data
-- 5 ready-made books, 12 pages each (cover + 10 story + certificate)
-- Run AFTER 009_library.sql
-- ============================================================

-- ============================================================
-- SUBJECTS
-- ============================================================
insert into public.subjects (name, slug, description, emoji, sort_order) values
  ('Sports',        'sports',        'Athletic adventures and teamwork stories',          '⚾', 1),
  ('Adventure',     'adventure',     'Magical journeys and brave explorers',              '🌲', 2),
  ('Science',       'science',       'Discovery, curiosity and exploring the universe',   '🚀', 3),
  ('Social Skills', 'social-skills', 'Friendship, kindness and sharing with others',      '💛', 4),
  ('Math & Numbers','math',          'Counting, patterns and number adventures',          '🔢', 5)
on conflict (slug) do nothing;

-- ============================================================
-- LIBRARY BOOKS
-- ============================================================
insert into public.library_books
  (subject_id, slug, title, subtitle, description, reading_level, age_min, age_max, page_count, cover_color, book_type, is_free, is_active, sort_order)
select s.id, 'baseball-dream', 'The Big Baseball Dream',
  'A story about practice, teamwork, and never giving up',
  'Corey loves baseball but struggles at first. Through practice, patience, and helping a teammate, he discovers what it really means to win.',
  'early_reader', 5, 9, 10, '16A34A', 'ready_made', true, true, 1
from public.subjects s where s.slug = 'sports'
on conflict (slug) do nothing;

insert into public.library_books
  (subject_id, slug, title, subtitle, description, reading_level, age_min, age_max, page_count, cover_color, book_type, is_free, is_active, sort_order)
select s.id, 'magical-forest-path', 'The Magical Forest Path',
  'A journey of kindness through an enchanted forest',
  'Lily follows a glowing path into a magical forest, where every creature she helps brings her closer to a beautiful secret at the heart of the woods.',
  'early_reader', 4, 8, 10, '7C3AED', 'ready_made', true, true, 2
from public.subjects s where s.slug = 'adventure'
on conflict (slug) do nothing;

insert into public.library_books
  (subject_id, slug, title, subtitle, description, reading_level, age_min, age_max, page_count, cover_color, book_type, is_free, is_active, sort_order)
select s.id, 'little-space-explorer', 'The Little Space Explorer',
  'A rocket, a moon, and a new friend among the stars',
  'Zoe finds a tiny rocket in her backyard and blasts off on an adventure to the moon, where she meets a creature who needs her help finding the way home.',
  'reader', 5, 9, 10, '1D4ED8', 'ready_made', true, true, 3
from public.subjects s where s.slug = 'science'
on conflict (slug) do nothing;

insert into public.library_books
  (subject_id, slug, title, subtitle, description, reading_level, age_min, age_max, page_count, cover_color, book_type, is_free, is_active, sort_order)
select s.id, 'day-i-shared', 'The Day I Shared My Toy',
  'A brave little story about friendship and letting go',
  'When a new neighbour moves in, one child learns that sharing is not about losing something — it is about gaining a friend.',
  'beginner', 3, 6, 10, 'D97706', 'ready_made', true, true, 4
from public.subjects s where s.slug = 'social-skills'
on conflict (slug) do nothing;

insert into public.library_books
  (subject_id, slug, title, subtitle, description, reading_level, age_min, age_max, page_count, cover_color, book_type, is_free, is_active, sort_order)
select s.id, 'number-treasure-hunt', 'The Number Treasure Hunt',
  'Count, add, and solve your way to the treasure!',
  'Pip finds a mysterious treasure map filled with number puzzles. Follow along as she counts, adds, and spots patterns to unlock the greatest treasure of all.',
  'early_reader', 4, 7, 10, 'DC2626', 'ready_made', true, true, 5
from public.subjects s where s.slug = 'math'
on conflict (slug) do nothing;


-- ============================================================
-- BOOK 1: The Big Baseball Dream (baseball-dream)
-- ============================================================

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 0, 'cover', 'The Big Baseball Dream', 'A story about practice, teamwork, and never giving up.',
  'https://placehold.co/800x520/16A34A/FFFFFF?text=The+Big+Baseball+Dream', 'cover_full'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 1, 'story', 'Game Day Morning',
'Corey jumped out of bed early on a Tuesday morning. Today was baseball practice, and he had been waiting all week. He put on his jersey, grabbed his glove, and ran out the door with a huge smile on his face.',
'https://placehold.co/800x520/22C55E/FFFFFF?text=Corey+gets+ready', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 2, 'story', 'At the Field',
'The baseball field was bright and green in the morning sun. Corey''s team was already stretching and throwing. "You made it!" called his friend Maya. Corey waved and jogged over, feeling excited and ready.',
'https://placehold.co/800x520/4ADE80/1A2F1A?text=The+baseball+field', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 3, 'story', 'The First Pitch',
'Corey stepped up to bat for the first time. The ball came flying toward him. He swung as hard as he could — and missed. He swung again. Another miss. His heart sank a little inside his chest.',
'https://placehold.co/800x520/16A34A/FFFFFF?text=Corey+swings', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 4, 'story', 'Coach''s Words',
'Corey sat on the bench and stared at his glove. "I''m no good at this," he said quietly. His coach sat down beside him. "Every great player missed at first," she said with a smile. "The key is to keep going."',
'https://placehold.co/800x520/15803D/FFFFFF?text=Coach+talks+to+Corey', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 5, 'story', 'Learning to Focus',
'Corey went back to practice with new focus. He watched the ball carefully this time. He breathed slowly. He waited for just the right moment — and CRACK! He hit it! The ball flew across the green field!',
'https://placehold.co/800x520/22C55E/FFFFFF?text=Corey+hits+the+ball', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 6, 'story', 'A Good Friend',
'After practice, Corey saw his teammate Sam sitting alone, looking sad. Sam had dropped every ball that day. "Want to practice together?" Corey asked. Sam smiled. They stayed on the field an extra hour, helping each other.',
'https://placehold.co/800x520/4ADE80/1A2F1A?text=Corey+helps+Sam', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 7, 'story', 'The Big Game',
'Game day arrived. Corey''s team was down by one run in the last inning. It was Corey''s turn to bat. His hands shook. He took a deep breath and thought of everything he had practiced.',
'https://placehold.co/800x520/16A34A/FFFFFF?text=Big+game+day', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 8, 'story', 'The Big Hit',
'The pitch came fast. Corey watched it all the way in. Then — CRACK! He hit a line drive! He sprinted to first, then second, then slid safely into third as the whole team roared with cheers!',
'https://placehold.co/800x520/22C55E/FFFFFF?text=Home+run', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 9, 'story', 'Together We Win',
'Sam came up next and hit the ball perfectly. Corey ran home. They won! Everyone jumped and cheered. Corey felt a warm glow in his chest. He had kept trying — and it had changed everything.',
'https://placehold.co/800x520/15803D/FFFFFF?text=Team+celebration', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 10, 'story', 'What Really Matters',
'On the way home, Corey''s dad put a hand on his shoulder. "I''m so proud of you," he said. Corey smiled. It wasn''t the hit that made him proud. It was the day he chose — not to give up.',
'https://placehold.co/800x520/4ADE80/1A2F1A?text=Walking+home', 'image_top_text_bottom'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 11, 'certificate', 'Baseball Dream Certificate',
'Awarded to a true team player who never gave up. Keep practicing, keep believing, and keep swinging for the stars!',
null, 'certificate'
from public.library_books b where b.slug = 'baseball-dream' on conflict (book_id, page_number) do nothing;


-- ============================================================
-- BOOK 2: The Magical Forest Path (magical-forest-path)
-- ============================================================

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 0, 'cover', 'The Magical Forest Path', 'A journey of kindness through an enchanted forest.',
'https://placehold.co/800x520/7C3AED/FFFFFF?text=The+Magical+Forest+Path', 'cover_full'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 1, 'story', 'The Glowing Leaf',
'One afternoon, a girl named Lily found a leaf in her backyard that glowed like a tiny star. She knelt down and picked it up carefully. It felt warm in her hand. She looked up and saw a path she had never noticed before.',
'https://placehold.co/800x520/8B5CF6/FFFFFF?text=Lily+finds+the+leaf', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 2, 'story', 'Into the Forest',
'The path led into the forest. Lily followed it step by step. The trees were tall and sparkled with tiny lights. Every flower she passed opened slowly, as if it was waking up just for her.',
'https://placehold.co/800x520/6D28D9/FFFFFF?text=The+enchanted+forest', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 3, 'story', 'The Owl Who Could Not See',
'Lily heard a soft hooting sound. A small owl was bumping into its branch over and over. "I lost my glasses," it said sadly. Lily looked around, found them in the grass, and gently handed them back.',
'https://placehold.co/800x520/7C3AED/FFFFFF?text=Lily+helps+the+owl', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 4, 'story', 'The Fox With a Thorn',
'Further down the path, a little fox was limping. "There is a thorn in my paw," it said. Lily knelt down carefully and pulled it out. The fox wagged its tail. "Thank you," it said. "No one ever helps me."',
'https://placehold.co/800x520/5B21B6/FFFFFF?text=Lily+helps+the+fox', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 5, 'story', 'The Riddle Tree',
'At the center of the forest stood a great old tree. Its branches moved slowly. "To reach the heart of the forest," said the tree, "you must answer one question: What opens every door without a key?"',
'https://placehold.co/800x520/8B5CF6/FFFFFF?text=The+Riddle+Tree', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 6, 'story', 'The Answer',
'Lily thought of the owl and the fox. She thought of the glowing leaf. "Kindness," she said clearly. The tree was quiet. Then its branches opened wide — and golden light poured through every gap.',
'https://placehold.co/800x520/7C3AED/FFFFFF?text=The+tree+answers', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 7, 'story', 'The Hidden Garden',
'Behind the tree was a secret garden. Blue roses. Golden daisies. A little waterfall that sparkled like diamonds. Lily gasped. It was the most beautiful place she had ever seen in her whole life.',
'https://placehold.co/800x520/6D28D9/FFFFFF?text=The+secret+garden', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 8, 'story', 'The Gift',
'The garden gave Lily one small glowing seed to take home. "Plant this," whispered the wind, "and it will grow into whatever you need most." Lily held the seed tight and promised she would care for it.',
'https://placehold.co/800x520/5B21B6/FFFFFF?text=Lily+gets+a+seed', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 9, 'story', 'The Walk Home',
'As Lily walked home, the forest lights slowly dimmed behind her. But the path stayed warm beneath her feet. The owl and the fox waved from the trees. Lily waved back, her heart completely full.',
'https://placehold.co/800x520/7C3AED/FFFFFF?text=Lily+walks+home', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 10, 'story', 'The Glowing Tree',
'Lily planted the seed in her garden that evening. By morning, a small tree had grown — and its leaves glowed softly, just like the leaf that had started it all. She smiled and whispered, "I''ll come back tomorrow."',
'https://placehold.co/800x520/6D28D9/FFFFFF?text=The+glowing+tree', 'image_top_text_bottom'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 11, 'certificate', 'Forest Friend Award',
'For showing kindness to every creature on the path. The magical forest will always be open to a kind and gentle heart.',
null, 'certificate'
from public.library_books b where b.slug = 'magical-forest-path' on conflict (book_id, page_number) do nothing;


-- ============================================================
-- BOOK 3: The Little Space Explorer (little-space-explorer)
-- ============================================================

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 0, 'cover', 'The Little Space Explorer', 'A rocket, a moon, and a new friend among the stars.',
'https://placehold.co/800x520/1D4ED8/FFFFFF?text=The+Little+Space+Explorer', 'cover_full'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 1, 'story', 'The Rocket in the Garden',
'One morning, Zoe found a small silver rocket tucked behind the oak tree in her backyard. It was just big enough for one child. A note was taped to the door: "Ready for an adventure?" Zoe read it twice, then climbed in.',
'https://placehold.co/800x520/3B82F6/FFFFFF?text=Zoe+finds+the+rocket', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 2, 'story', 'Blast Off!',
'The rocket shook gently. Then it hummed. Then — WHOOOOSH! — it shot through the clouds, past the birds, and into the big blue. Stars appeared all around her. Zoe pressed her face against the window and laughed.',
'https://placehold.co/800x520/1D4ED8/FFFFFF?text=Blast+off', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 3, 'story', 'The Moon',
'The rocket landed softly on the moon. The ground was white and powdery, like flour. Zoe stepped out carefully. She looked back at Earth — a big blue and green marble floating in all that beautiful darkness.',
'https://placehold.co/800x520/1E40AF/FFFFFF?text=Landing+on+the+moon', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 4, 'story', 'A New Friend',
'A small glowing creature appeared from behind a moon rock. It had six tiny legs and two enormous blinking eyes. It tilted its head at Zoe. "Hello," she said. The creature blinked, then held out one little leg to shake.',
'https://placehold.co/800x520/2563EB/FFFFFF?text=Moon+creature', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 5, 'story', 'The Broken Star Map',
'The creature needed help. Its star map — a glowing chart of every star in the sky — had cracked right in two. Without it, it could not find its way home. Zoe looked at both pieces carefully. "We can fix this," she said.',
'https://placehold.co/800x520/1D4ED8/FFFFFF?text=The+broken+map', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 6, 'story', 'Thinking It Through',
'Zoe sat down and studied both pieces. She counted the stars on each half. She lined them up by size. She matched the patterns. Slowly, slowly, the two pieces began to fit together. "I think I''ve got it," she whispered.',
'https://placehold.co/800x520/1E40AF/FFFFFF?text=Zoe+solves+it', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 7, 'story', 'The Map is Fixed',
'The two pieces clicked together with a soft golden glow. The creature jumped and spun with joy. It pointed to three bright stars in the distance — that cluster was home. Zoe smiled. "Go on," she said. "They''re waiting."',
'https://placehold.co/800x520/2563EB/FFFFFF?text=Map+repaired', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 8, 'story', 'Goodbye',
'Zoe watched as the creature''s tiny rocket lifted off and became a bright dot moving between the stars. It waved all six legs until she could no longer see it. She waved back until the very last moment.',
'https://placehold.co/800x520/1D4ED8/FFFFFF?text=Saying+goodbye', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 9, 'story', 'The Ride Home',
'Zoe''s rocket flew smoothly back through the dark sky — past planets, past comets, past swirls of colour that had no name. She thought about what she had seen. The universe was enormous, but kindness, she thought, fit everywhere.',
'https://placehold.co/800x520/1E40AF/FFFFFF?text=Flying+home', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 10, 'story', 'Back in the Garden',
'The rocket landed gently behind the oak tree. Zoe stepped out into warm morning sunshine. The garden looked the same. But Zoe felt different. She looked up at the sky and whispered, "I wonder what''s up there today."',
'https://placehold.co/800x520/3B82F6/FFFFFF?text=Back+home', 'image_top_text_bottom'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 11, 'certificate', 'Junior Space Explorer Certificate',
'For curiosity, clever thinking, and making a new friend among the stars. The universe is yours to discover.',
null, 'certificate'
from public.library_books b where b.slug = 'little-space-explorer' on conflict (book_id, page_number) do nothing;


-- ============================================================
-- BOOK 4: The Day I Shared My Toy (day-i-shared)
-- ============================================================

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 0, 'cover', 'The Day I Shared My Toy', 'A brave little story about friendship and letting go.',
'https://placehold.co/800x520/D97706/FFFFFF?text=The+Day+I+Shared+My+Toy', 'cover_full'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 1, 'story', 'My Favourite Toy',
'I had one toy I loved more than anything. It was a small red car with yellow wheels. I kept it on my shelf. I never let anyone else touch it. It was mine — and that made me feel safe.',
'https://placehold.co/800x520/F59E0B/FFFFFF?text=The+red+car', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 2, 'story', 'A New Neighbour',
'One day, a new boy moved in next door. His name was Theo. He did not have many toys yet. He sat by the fence and watched me play. I pretended I did not see him. But I did.',
'https://placehold.co/800x520/D97706/FFFFFF?text=Theo+at+the+fence', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 3, 'story', 'A Funny Feeling',
'I kept playing, but the fun did not feel as fun. I kept thinking about Theo sitting alone by the fence. My red car felt heavy in my hands. I could not stop thinking about his face.',
'https://placehold.co/800x520/B45309/FFFFFF?text=Something+felt+wrong', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 4, 'story', 'A Hard Decision',
'I walked over slowly. "Hi," I said. Theo looked up. "Hi," he said quietly. I looked at my car. I looked at him. "Do you want to play?" I asked. The words were hard to say. But I said them.',
'https://placehold.co/800x520/D97706/FFFFFF?text=Saying+hello', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 5, 'story', 'Playing Together',
'Theo''s eyes went wide when I showed him the red car. We sent it rolling down the path again and again. We made car sounds. We laughed. The afternoon went faster than any afternoon I could remember.',
'https://placehold.co/800x520/F59E0B/FFFFFF?text=Playing+together', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 6, 'story', 'The Warm Feeling',
'When Theo''s mum called him home for dinner, he handed the car back very carefully. "Thanks," he said softly. I watched him go. Inside my chest was a warm, bubbly feeling. Sharing had felt really, truly good.',
'https://placehold.co/800x520/D97706/FFFFFF?text=Feeling+happy', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 7, 'story', 'Still Mine',
'That night I put the red car back on my shelf. It was still mine. Nothing had changed. But I had changed. I looked at it differently now — not as something to protect, but as something to share.',
'https://placehold.co/800x520/B45309/FFFFFF?text=Car+on+the+shelf', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 8, 'story', 'The Next Morning',
'The next day I knocked on Theo''s door before breakfast. He opened it with a huge grin. "I was hoping you''d come," he said. We played all morning. I brought the red car — because sharing is better than keeping.',
'https://placehold.co/800x520/F59E0B/FFFFFF?text=Playing+again', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 9, 'story', 'What I Learned',
'I used to think sharing meant giving something away. But it does not. Sharing means letting someone in. When you share a toy, you do not lose it. You make a friend. And friends are the best thing you can have.',
'https://placehold.co/800x520/D97706/FFFFFF?text=What+I+learned', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 10, 'story', 'Us',
'Now Theo and I play every day. Sometimes I bring my red car. Sometimes he brings his blue truck. We race them down the path and go on great adventures together. Together is always, always better.',
'https://placehold.co/800x520/F59E0B/FFFFFF?text=Best+friends', 'image_top_text_bottom'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 11, 'certificate', 'Kindness and Sharing Award',
'For being brave enough to share and kind enough to care. Friends are the greatest treasure of all.',
null, 'certificate'
from public.library_books b where b.slug = 'day-i-shared' on conflict (book_id, page_number) do nothing;


-- ============================================================
-- BOOK 5: The Number Treasure Hunt (number-treasure-hunt)
-- ============================================================

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 0, 'cover', 'The Number Treasure Hunt', 'Count, add, and solve your way to the treasure!',
'https://placehold.co/800x520/DC2626/FFFFFF?text=The+Number+Treasure+Hunt', 'cover_full'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 1, 'story', 'The Treasure Map',
'One morning, Pip found an old rolled-up map under the kitchen table. She unrolled it carefully. It was a treasure map — with numbers on it! The first clue said: "Start at the door. Take 3 big steps forward."',
'https://placehold.co/800x520/EF4444/FFFFFF?text=The+treasure+map', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 2, 'story', 'Step One — Count to 3',
'Pip stood at the front door. "One," she said, stepping forward. "Two." Another step. "Three!" She stopped. There was a small star sticker on the floor. Under it was the next clue. She was already smiling.',
'https://placehold.co/800x520/DC2626/FFFFFF?text=Count+to+3', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 3, 'story', 'How Many Windows?',
'The next clue said: "Count the windows in the room." Pip looked carefully, pointing to each one. "1... 2... 3... 4 windows!" she said out loud. The number 4 led her to the very next clue.',
'https://placehold.co/800x520/B91C1C/FFFFFF?text=Counting+windows', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 4, 'story', 'Counting Stairs',
'The clue said: "Go up the stairs and count every step." Pip climbed carefully. "1, 2, 3, 4, 5, 6, 7!" she counted. Seven stairs! "The number 7 is lucky," she said to herself, and smiled a big smile.',
'https://placehold.co/800x520/EF4444/FFFFFF?text=Climbing+7+stairs', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 5, 'story', 'Two Plus Two',
'At the top of the stairs was a picture clue: 2 apples + 2 apples. "How many?" it asked. Pip held up her fingers and counted carefully. "Two... and two more... that makes FOUR!" She circled the answer.',
'https://placehold.co/800x520/DC2626/FFFFFF?text=2+plus+2', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 6, 'story', 'The Pattern Puzzle',
'The next clue showed shapes: circle, square, circle, square, circle, blank. "What comes next?" it asked. Pip looked carefully. Circle, square, circle, square... "Square!" she said, and drew it in with her pencil.',
'https://placehold.co/800x520/B91C1C/FFFFFF?text=Shape+patterns', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 7, 'story', 'The Big Adding Problem',
'The last clue had a number problem: 1 + 2 + 3 = ? Pip counted on her fingers. "One... plus two is three... plus three more is... SIX!" She circled 6 and ran down the hall as fast as her feet could go.',
'https://placehold.co/800x520/EF4444/FFFFFF?text=1+plus+2+plus+3', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 8, 'story', 'The Treasure!',
'At the end of the hall was a small box with a gold ribbon. Pip untied it slowly. Inside were six gold star stickers — one for every number she had found. A card said: "Numbers are everywhere. You just have to look!"',
'https://placehold.co/800x520/DC2626/FFFFFF?text=The+treasure', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 9, 'story', 'Numbers Everywhere',
'After that, Pip saw numbers everywhere. There were 4 chairs at the table. Eight crayons in her box. Twelve books on her shelf. The world was completely full of numbers, just waiting to be counted by her.',
'https://placehold.co/800x520/B91C1C/FFFFFF?text=Numbers+everywhere', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 10, 'story', 'Her Own Map',
'That afternoon Pip made her own treasure map for her little brother. She filled it with number clues only she understood. Making the map was even more fun than solving it. Numbers were her new favourite thing.',
'https://placehold.co/800x520/EF4444/FFFFFF?text=Making+a+new+map', 'image_top_text_bottom'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;

insert into public.library_book_pages (book_id, page_number, page_type, title, text_content, image_url, layout_type)
select b.id, 11, 'certificate', 'Number Treasure Hunter Badge',
'For counting carefully, thinking cleverly, and never giving up on a good puzzle. You are a true number explorer!',
null, 'certificate'
from public.library_books b where b.slug = 'number-treasure-hunt' on conflict (book_id, page_number) do nothing;
