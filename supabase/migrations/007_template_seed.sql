-- ============================================================
-- WonderKid Stories — Book Template Seed Data (Step 2)
-- Run AFTER 006_template_first.sql
-- ============================================================

-- ============================================================
-- INSERT BOOK TEMPLATES
-- ============================================================
insert into public.book_templates (
  slug, title, subtitle, description, category,
  age_min, age_max, reading_level, page_count, price_cents,
  sample_child_profile, illustration_style,
  pdf_layout_type, reader_layout_type, is_active
)
values
  (
    'baseball-hero',
    'Baseball Hero Adventure',
    'Be the star of the big game!',
    'A personalized baseball adventure where your child becomes the star player, learning confidence, teamwork, and sportsmanship along the way.',
    'Sports',
    5, 8, 'early_reader', 10, 1499,
    '{"name":"Alex","age":7,"favorite_color":"blue","favorite_animal":"dog","hair_note":"short brown hair","skin_tone":"medium","favorite_sport":"baseball"}'::jsonb,
    'Warm watercolor children''s book style, bright sunny outdoor colors, expressive friendly characters, sports theme',
    'standard_storybook', 'standard_reader', true
  ),
  (
    'magical-forest',
    'Magical Forest Adventure',
    'Follow the glow into the enchanted woods!',
    'A gentle magical forest adventure where your child follows a glowing path, meets friendly woodland creatures, and discovers the power of kindness.',
    'Fantasy',
    4, 8, 'early_reader', 10, 1499,
    '{"name":"Alex","age":6,"favorite_color":"purple","favorite_animal":"rabbit","hair_note":"long curly red hair","skin_tone":"fair","favorite_sport":"running"}'::jsonb,
    'Enchanted watercolor illustration, soft greens and purples, magical glowing light effects, friendly woodland creatures, sense of wonder',
    'standard_storybook', 'standard_reader', true
  ),
  (
    'space-explorer',
    'Space Explorer Adventure',
    'Blast off on a journey through the stars!',
    'A personalized space adventure where your child becomes captain of their own rocket, visits friendly planets, and learns that curiosity leads to discovery.',
    'Adventure',
    5, 9, 'reader', 10, 1499,
    '{"name":"Alex","age":8,"favorite_color":"red","favorite_animal":"cat","hair_note":"short black hair","skin_tone":"warm brown","favorite_sport":"soccer"}'::jsonb,
    'Vibrant space watercolor illustration, rich starfields and colorful planets, friendly alien creatures, sense of discovery and wonder',
    'standard_storybook', 'standard_reader', true
  )
on conflict (slug) do nothing;


-- ============================================================
-- BASEBALL HERO — TEMPLATE PAGES
-- ============================================================

insert into public.template_pages (
  template_id, page_number, page_type, title_template,
  story_beat, placeholder_text, text_prompt_template, visual_prompt_template, layout_type
)
select
  bt.id,
  vals.page_number,
  vals.page_type,
  vals.title_template,
  vals.story_beat,
  vals.placeholder_text,
  vals.text_prompt_template,
  vals.visual_prompt_template,
  vals.layout_type
from public.book_templates bt
cross join (values
  (
    0, 'cover',
    '{{child_name}}''s Baseball Hero Adventure',
    'The cover shows the child as a confident baseball hero on the diamond.',
    'Alex''s Baseball Hero Adventure',
    null,
    'A children''s book cover illustration of a child named {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, wearing a {{favorite_color}} baseball jersey and cap, holding a baseball glove, standing on a sunny baseball diamond, heroic confident pose, big smile. Warm watercolor style, bright colors, no text in image.',
    'cover_full'
  ),
  (
    1, 'story',
    'Game Day!',
    'The child wakes up excited on the morning of the big championship game and gets ready to play.',
    'Alex woke up early and jumped out of bed with a huge smile. Today was the day of the big baseball championship! Alex pulled on the favorite blue jersey and grabbed the trusty glove. "I''m ready," Alex whispered happily.',
    'Write one short storybook paragraph (30–60 words) for a personalized children''s book. {{child_name}}, age {{age}}, wakes up excited on game day. They put on their {{favorite_color}} jersey and grab their baseball glove. Use the child''s name naturally. Warm, encouraging tone. Simple words. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Bright cheerful children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in their bedroom wearing a {{favorite_color}} baseball jersey, holding a glove, smiling with excitement. Morning sunlight through the window. Warm watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    2, 'story',
    'The Big Field',
    'The child arrives at the baseball field and sees their whole team gathered and cheering.',
    'The baseball diamond sparkled in the golden sunshine. Alex''s teammates cheered and waved. "You made it!" shouted a friend with a huge grin. Alex smiled back at every face. Together, they could do anything.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} arrives at the baseball field and their teammates cheer when they see them. Warm, energetic team spirit. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'A sunny baseball field with {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, waving to cheerful teammates wearing matching {{favorite_color}} jerseys. Green grass, bright blue sky, baseball diamond. Warm watercolor children''s book style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    3, 'story',
    'Practice Time',
    'The child focuses during warm-up practice before the game, showing determination and great effort.',
    'Before the game started, Alex warmed up with total focus. Swing after swing, step after step. Alex practiced hard and listened to every tip from the coach. "You''ve got this!" the coach cheered from the sideline.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} warms up and practices hard before the big baseball game. They focus and show determination. Their coach encourages them. Confident, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a {{favorite_color}} jersey, mid-swing with a baseball bat on a sunny practice field, focused expression. Coach cheering nearby. Warm watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    4, 'story',
    'Helping a Friend',
    'A teammate feels nervous and the child stops to offer kind words and encouragement.',
    'A teammate sat alone near the dugout, looking worried. "I don''t think I can do it," they said quietly. Alex walked right over and sat down next to them. "Of course you can. We believe in you." The teammate looked up and smiled.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} notices a nervous teammate and sits with them, offering kind words. Themes of empathy and care. Gentle, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, sitting beside a worried younger teammate on a bench near a baseball dugout, offering a kind encouraging smile. Soft warm lighting. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    5, 'story',
    'A Tricky Moment',
    'The team falls behind in the game and faces a challenge that tests their spirit and belief.',
    'In the third inning, the other team scored two extra runs. Alex''s teammates looked worried and tired. The game wasn''t going their way at all. But Alex stood tall and looked around at every friend. "We''re not done yet," Alex said quietly. "Let''s keep going."',
    'Write one short storybook paragraph (30–60 words). {{child_name}}''s team is falling behind in the baseball game. The team looks worried but {{child_name}} encourages everyone not to give up. Resilient, positive tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, standing tall on a baseball field with worried teammates around, giving an encouraging expression. Game scoreboard visible in background showing a tough score. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    6, 'story',
    'Staying Calm',
    'The child steps up to bat and takes a deep breath to stay calm and focused under pressure.',
    'Alex stepped up to home plate and took one long, slow breath. The crowd was watching. The pitcher wound up. Alex cleared their mind and thought about all the practice. One slow breath. Then — focus. Everything else fell quiet.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} steps up to bat and calms themselves with a deep breath. They focus on their training and block out the noise. Quiet, powerful, focused tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'A focused children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, standing at home plate holding a baseball bat, calm determined expression, eyes fixed forward. Crowd blurred in background. Sunset lighting. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    7, 'story',
    'The Big Play!',
    'The child makes a key play that turns the game around for the team.',
    'CRACK! Alex hit the ball with everything and watched it soar high over the field. "Run, run, RUN!" the crowd roared. Alex sprinted hard, heart pounding, feet flying. The whole team erupted in cheers. Something had changed. Everything had changed.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} makes a key hit at the baseball game — the turning point of the match. Exciting, high-energy tone. The crowd goes wild. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Exciting dynamic children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, mid-swing hitting a baseball that flies high into the air, huge open smile, teammates and crowd cheering in background. Action shot. Warm watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    8, 'story',
    'Together We Win',
    'The whole team works together in the final innings, each player doing their part with heart.',
    'Everyone gave everything they had. A teammate caught a tricky fly ball. Another threw perfectly to second base. Alex cheered them all on with every step. This was real teamwork — every player, every moment, every heart. "This is what we''ve been working for!" Alex said.',
    'Write one short storybook paragraph (30–60 words). The whole team works together in the final innings. Every player does their part. {{child_name}} cheers teammates on. Theme of teamwork. Warm, energetic tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm dynamic children''s book illustration of a baseball team in matching {{favorite_color}} jerseys working together on the field during the final innings. {{child_name}} visible at center cheering teammates. Everyone in action and smiling. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    9, 'story',
    'Good Sports',
    'After the final play, the child shakes hands with the other team and shows true sportsmanship.',
    'When the last out was called, both teams lined up to shake hands. "Good game," Alex said to each player, looking them right in the eye. One player from the other team looked sad. Alex gave them a gentle fist bump. "You played really well." Win or lose — that was what mattered most.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} shakes hands with the other team''s players after the game, showing true sportsmanship. Respectful and kind whether winning or losing. Warm, thoughtful tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, shaking hands with players from the opposing team on a baseball field after the game. Respectful expressions on both sides. Golden late-afternoon light. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    10, 'story',
    'Celebration!',
    'The team celebrates together and the child reflects on what they truly learned today.',
    'The team jumped and cheered and hugged. Coach held up the championship trophy and every player touched it together at once. Alex looked around at every smiling face and felt something warm fill their whole chest. Today was about more than winning — it was about showing up, trying hard, and caring for your team.',
    'Write one short storybook paragraph (30–60 words). {{child_name}}''s team celebrates together. {{child_name}} reflects that the day was about effort, friendship, and heart — not just winning. Joyful, reflective ending. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Joyful children''s book celebration illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, surrounded by teammates in {{favorite_color}} jerseys all cheering and hugging. Coach holds a trophy. Confetti falling. Bright sunny baseball field. Warm watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    11, 'certificate',
    'Baseball Hero Certificate',
    'A celebratory certificate page for completing the baseball hero adventure.',
    'This certifies that Alex is a true Baseball Hero! Thank you for showing courage, kindness, and sportsmanship. Keep swinging for the stars!',
    null,
    null,
    'certificate'
  )
) as vals(page_number, page_type, title_template, story_beat, placeholder_text, text_prompt_template, visual_prompt_template, layout_type)
where bt.slug = 'baseball-hero'
on conflict (template_id, page_number) do nothing;


-- ============================================================
-- MAGICAL FOREST — TEMPLATE PAGES
-- ============================================================

insert into public.template_pages (
  template_id, page_number, page_type, title_template,
  story_beat, placeholder_text, text_prompt_template, visual_prompt_template, layout_type
)
select
  bt.id,
  vals.page_number,
  vals.page_type,
  vals.title_template,
  vals.story_beat,
  vals.placeholder_text,
  vals.text_prompt_template,
  vals.visual_prompt_template,
  vals.layout_type
from public.book_templates bt
cross join (values
  (
    0, 'cover',
    '{{child_name}}''s Magical Forest Adventure',
    'The cover shows the child at the entrance of a glowing enchanted forest.',
    'Alex''s Magical Forest Adventure',
    null,
    'A children''s book cover illustration of a child named {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, wearing a {{favorite_color}} outfit, standing at the entrance of a magical glowing forest. Trees glow softly in purples and greens. Sense of wonder and excitement. Enchanted watercolor style, no text in image.',
    'cover_full'
  ),
  (
    1, 'story',
    'The Sparkling Leaf',
    'The child is playing outside when they discover a glowing sparkling leaf that seems to invite them into the forest.',
    'Alex was exploring the garden one golden afternoon when something shimmered in the grass. It was a leaf — but not an ordinary one. It glowed softly in purple and green, pulsing like a tiny heartbeat. Alex picked it up gently. "Where did you come from?" Alex whispered.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} is playing outside and discovers a magical glowing leaf. They are filled with curiosity and wonder. Gentle, enchanted tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a garden kneeling down to pick up a glowing leaf that shimmers with soft purple and green light. Sense of wonder on their face. Golden afternoon light. Enchanted watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    2, 'story',
    'A Friendly Guide',
    'A friendly animal appears from the trees and invites the child to follow the glowing path into the forest.',
    'Out of the trees stepped a small rabbit with bright curious eyes and a coat of soft silver. "Hello," said the rabbit in a voice like windchimes. "I''ve been waiting for you. There''s something wonderful inside, and you are just the right person to find it."',
    'Write one short storybook paragraph (30–60 words). A friendly magical animal appears and invites {{child_name}} to follow them into the enchanted forest. The animal is kind and welcoming. Magical, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Enchanted children''s book illustration of a small friendly magical animal (a glowing silver rabbit with bright eyes) stepping out of glowing forest trees toward {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone. Both are looking at each other with warmth. Soft magical lighting. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    3, 'story',
    'The Glowing Path',
    'The child follows a winding glowing path deeper into the magical forest, full of wonder at every turn.',
    'Alex followed the rabbit along a path that glowed softly beneath every step. The trees grew tall and sparkled with tiny silver lights. Flowers opened as they passed. "This place is amazing," Alex whispered. Around every turn was something more beautiful than the last.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} follows their animal guide along a glowing magical path deeper into the enchanted forest. Everything is beautiful and wondrous. Sense of discovery and awe. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, walking along a winding glowing path through a tall enchanted forest. Flowers open as they pass, trees glow with soft light, tiny sparkles in the air. Wide-eyed with wonder. Enchanted watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    4, 'story',
    'A Little One Lost',
    'The child finds a small creature who is lost and frightened, and stops to help without hesitation.',
    'Under a big curling root sat a tiny creature — a small hedgehog with golden spines, trembling and lost. "I can''t find my family," it said with huge watery eyes. Without a moment''s hesitation, Alex sat right down beside it. "Don''t worry. We''ll help you find them together."',
    'Write one short storybook paragraph (30–60 words). {{child_name}} finds a small lost magical creature and immediately stops to help without hesitation. Themes of kindness and empathy. Gentle, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, sitting down gently beside a tiny lost magical hedgehog with golden spines under a glowing forest root. Kind expression, reaching out gently. Soft magical light. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    5, 'story',
    'The Forest Riddle',
    'The path splits and the forest itself poses a riddle that the child must answer with their heart.',
    'The path split into three directions and the trees grew very still. Then a deep, gentle voice filled the air. "Before you may pass, answer this: What is the gift that costs nothing and means everything?" Alex thought carefully. The rabbit waited. The hedgehog watched with wide eyes.',
    'Write one short storybook paragraph (30–60 words). The forest poses a riddle to {{child_name}}: what is the gift that costs nothing but means everything? {{child_name}} thinks carefully. Thoughtful, magical tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, standing at a fork in a glowing forest path, looking thoughtful. Three glowing paths ahead. The rabbit and tiny hedgehog wait beside them. Ancient trees seem to listen. Enchanted watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    6, 'story',
    'The Answer',
    'The child answers the riddle with kindness and the forest opens up with magic.',
    'Alex looked at the rabbit, then at the tiny hedgehog, and then smiled. "Kindness," Alex said clearly. "The gift that costs nothing and means everything is kindness." The trees shivered. Then — all at once — the whole forest lit up with swirling golden light. The path ahead was clear.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} answers the forest riddle with the word "kindness." The forest responds with magic and light. Triumphant, joyful tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical triumphant children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, standing in the glowing forest with arms slightly raised as golden light swirls up around the trees after correctly answering the riddle. Smile of joy and surprise. Enchanted watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    7, 'story',
    'The Forest Glows',
    'With the riddle solved, the entire magical forest comes alive and celebrates.',
    'Every tree lit up from root to leaf. Tiny stars floated upward from the moss. The creatures of the forest appeared one by one — owls, foxes, deer, and butterflies — all gathering in a circle of light. The rabbit turned to Alex. "The forest has been waiting a long time for someone like you."',
    'Write one short storybook paragraph (30–60 words). After {{child_name}} solves the riddle, the whole magical forest comes alive and its creatures emerge to celebrate. Joyful, magical, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical joyful children''s book illustration of an enchanted forest fully lit up with golden and purple light, forest creatures — owls, foxes, deer, butterflies — gathering in a glowing circle around {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone. Sense of celebration and belonging. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    8, 'story',
    'The Hidden Garden',
    'The child discovers a breathtaking secret garden at the heart of the forest that only kind hearts can find.',
    'Through the trees, Alex found it — a secret garden hidden deep in the heart of the forest. Flowers of every color grew tall. A waterfall sparkled like diamonds. The rabbit said softly, "Only those who are kind of heart can find this place. You found it, Alex. It was always meant for you."',
    'Write one short storybook paragraph (30–60 words). {{child_name}} discovers a breathtaking secret garden at the heart of the forest. Only kind-hearted people can find it. Sense of wonder and reward. Warm, magical tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Breathtaking children''s book illustration of a hidden magical garden deep in a forest, flowers of every color blooming tall, a sparkling waterfall, soft golden light. {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, stands at the entrance wide-eyed with wonder, the silver rabbit beside them. Enchanted watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    9, 'story',
    'What Kindness Does',
    'The child reflects quietly on what they have learned — that kindness opens doors nothing else can.',
    'Alex sat in the garden and thought about everything that had happened. The glowing leaf had led here. Helping the little hedgehog had led here. Answering with kindness had led here. "Every good thing started with caring," Alex said quietly. The rabbit nodded. "Yes. It always does."',
    'Write one short storybook paragraph (30–60 words). {{child_name}} quietly reflects that every magical thing that happened started with kindness — helping the lost creature, answering with love. Theme: kindness opens doors. Thoughtful, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Peaceful children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, sitting quietly in the magical hidden garden surrounded by colorful flowers, the silver rabbit beside them. Thoughtful, content expression. Soft glowing light. Enchanted watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    10, 'story',
    'Home Again',
    'The child returns home before dark, carrying the glow of the magical forest in their heart.',
    'As the sky turned to pink and gold, Alex followed the glowing path back home. At the edge of the garden, the rabbit bowed its small silver head. "You''re always welcome here," it said. Alex smiled, stepped back through the gate, and ran home — heart full and glowing, just like the forest.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} returns home from the magical forest as the sun sets, carrying the warmth of the experience in their heart. Gentle, beautiful ending. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm magical children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, walking home along a glowing path as the sky turns pink and gold at sunset. The silver rabbit waves goodbye from the edge of the enchanted forest. Soft, peaceful. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    11, 'certificate',
    'Forest Friend Certificate',
    'A celebratory certificate page for completing the magical forest adventure.',
    'This certifies that Alex is a true Forest Friend! You showed kindness, curiosity, and a brave heart. The magical forest will always be waiting for you.',
    null,
    null,
    'certificate'
  )
) as vals(page_number, page_type, title_template, story_beat, placeholder_text, text_prompt_template, visual_prompt_template, layout_type)
where bt.slug = 'magical-forest'
on conflict (template_id, page_number) do nothing;


-- ============================================================
-- SPACE EXPLORER — TEMPLATE PAGES
-- ============================================================

insert into public.template_pages (
  template_id, page_number, page_type, title_template,
  story_beat, placeholder_text, text_prompt_template, visual_prompt_template, layout_type
)
select
  bt.id,
  vals.page_number,
  vals.page_type,
  vals.title_template,
  vals.story_beat,
  vals.placeholder_text,
  vals.text_prompt_template,
  vals.visual_prompt_template,
  vals.layout_type
from public.book_templates bt
cross join (values
  (
    0, 'cover',
    '{{child_name}}''s Space Explorer Adventure',
    'The cover shows the child in a spacesuit floating near a colorful planet.',
    'Alex''s Space Explorer Adventure',
    null,
    'A children''s book cover illustration of a child named {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, wearing a {{favorite_color}} spacesuit with a clear helmet visor, floating near a large colorful planet with stars and nebula in the background. Heroic, wondrous pose. Vibrant space watercolor style, no text in image.',
    'cover_full'
  ),
  (
    1, 'story',
    'The Glowing Rocket',
    'The child is playing in the backyard when they discover a small glowing rocket hidden under a bush.',
    'Alex was kicking a soccer ball in the backyard when something unusual caught the light. Tucked under the big oak bush was a small rocket, no taller than a lamppost, glowing softly in red and silver. Alex walked closer, heart beating fast. A small door swung open. It was waiting.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} is playing outside and discovers a small glowing rocket in the backyard. They are amazed and feel it was waiting just for them. Sense of discovery and wonder. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a sunny backyard discovering a small glowing {{favorite_color}} rocket tucked under a bush. Eyes wide with amazement, leaning forward in curiosity. Warm afternoon light. Vibrant watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    2, 'story',
    'Blast Off!',
    'The child climbs into the rocket with their animal companion and blasts off into the stars.',
    'Alex climbed inside. The seat was just the right size. A small control panel lit up with colorful buttons. And there — curled on the co-pilot seat — was a small red cat with bright green eyes. "Mrow," said the cat. WHOOOOSH. The rocket blasted through the sky and into the stars.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} climbs into the rocket with their {{favorite_animal}} companion and blasts off into space. Exciting, joyful tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Exciting children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, inside a colorful rocket cockpit wearing a {{favorite_color}} spacesuit, a small {{favorite_animal}} in the co-pilot seat, both looking thrilled as the rocket blasts through clouds into a starry sky. Vibrant watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    3, 'story',
    'The Friendly Moon',
    'The rocket lands on a small glowing moon where friendly moon creatures come out to greet them.',
    'The rocket settled softly on a moon that glowed pale blue. The dust puffed up like powder. Alex stepped out carefully and looked around. Then — pop! pop! pop! — tiny round creatures with soft white fur and big curious eyes bounced out from behind the moon rocks, chirping happily.',
    'Write one short storybook paragraph (30–60 words). {{child_name}}''s rocket lands on a friendly glowing moon. Tiny friendly moon creatures come out and greet them. Magical, joyful, wondrous tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a {{favorite_color}} spacesuit stepping out onto a pale glowing moon, small round fluffy moon creatures bouncing toward them curiously. Starfield background. {{favorite_animal}} companion watching from the rocket door. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    4, 'story',
    'The Little Robot',
    'A tiny helpful robot appears and offers to be the child''s guide through the galaxy.',
    'From behind a moon rock rolled a tiny round robot, no bigger than a football, with bright blinking eyes and little spinning arms. "Beep boop — hello, Explorer! I am Zip. I know every star in the sky. Will you let me be your guide?" Alex grinned. "Absolutely, Zip. Let''s go."',
    'Write one short storybook paragraph (30–60 words). A tiny friendly robot called Zip appears and offers to guide {{child_name}} through the galaxy. Warm, playful tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Charming children''s book illustration of a tiny friendly round robot with bright blinking eyes and spinning arms meeting {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a {{favorite_color}} spacesuit on a glowing moon. Both looking at each other with delight. Starfield background. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    5, 'story',
    'The Missing Star Map',
    'The star map needed to navigate home goes missing and the child must figure out what happened.',
    'Back on the rocket, Zip beeped with alarm. The star map — the glowing chart that showed the way through the galaxy — was gone. The {{favorite_animal}} sniffed around the cockpit. Alex looked everywhere. "We can''t get home without it," Alex said. "But we can figure this out together."',
    'Write one short storybook paragraph (30–60 words). The star map disappears from {{child_name}}''s rocket and they can''t find their way without it. {{child_name}} stays calm and decides to think it through. Problem-solving, calm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Children''s book illustration inside a small colorful rocket cockpit. {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, and tiny robot Zip looking around the cockpit with concerned but calm expressions. {{favorite_animal}} sniffing around. Empty holographic map display. Vibrant watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    6, 'story',
    'Solving the Puzzle',
    'The child thinks cleverly and remembers something important that helps them find the map.',
    'Alex sat very still and thought. Then — a flash! "Zip, when we were on the moon, one of the moon creatures was playing with something shiny!" They flew back fast. And there it was: the moon creature had the map, thinking it was a toy. It handed it back happily with a cheerful chirp.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} remembers a clue and figures out where the star map went. They go back and retrieve it kindly. Clever problem-solving, warm tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a {{favorite_color}} spacesuit gently receiving the glowing star map back from a cheerful tiny moon creature on the blue glowing moon. Zip the robot floating nearby. Relief and happiness on their faces. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    7, 'story',
    'Through the Stars',
    'With the map recovered, the child pilots the rocket through a stunning starfield on the way home.',
    'Star map in hand, Alex set the course. Zip called out the directions. The {{favorite_animal}} curled up contentedly in the co-pilot seat. Through clouds of pink and blue stardust the rocket flew, past rings of orange planets and shoals of shining meteors. Alex had never felt so alive.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} pilots the rocket home through a beautiful starfield. They feel confident and alive. Sense of wonder and accomplishment. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Breathtaking children''s book illustration view from inside a rocket cockpit looking out at a stunning galaxy — pink and blue nebulas, orange ringed planets, shining meteors. {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, at the controls in a {{favorite_color}} spacesuit, eyes wide with wonder. Vibrant watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    8, 'story',
    'Stars Celebrate',
    'The stars themselves seem to celebrate as the child nears home, lighting up the sky.',
    'As the rocket crossed the last stretch of the galaxy, something extraordinary happened. The stars began to twinkle in patterns — patterns that looked almost like clapping. Zip beeped with joy. "They''re cheering for you, Explorer," the little robot said. Alex laughed. Even the universe was smiling.',
    'Write one short storybook paragraph (30–60 words). The stars seem to celebrate and cheer for {{child_name}} as they fly home. The universe itself is smiling. Joyful, magical tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Magical children''s book illustration of a rocket flying through space as the stars around it twinkle in celebratory patterns. {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, visible through the cockpit window laughing with delight. Tiny robot Zip floats happily nearby. Vibrant starfield. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    9, 'story',
    'What You Discover',
    'The child reflects that the greatest discovery of the journey was believing in their own curiosity.',
    'As the rocket began its descent home, Alex looked out at the vast sparkling universe. "I was scared at first," Alex said to Zip. "But I kept going." Zip''s eyes blinked softly. "That is what explorers do. They ask questions. They try. They find things no one else finds — because they believe they can."',
    'Write one short storybook paragraph (30–60 words). {{child_name}} reflects on the journey and learns that the greatest discovery was believing in their own curiosity and courage. Thoughtful, inspiring tone. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Peaceful children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, in a {{favorite_color}} spacesuit inside the rocket, looking out the window at the beautiful starfield with a thoughtful, content expression. Zip the robot beside them. Warm soft lighting. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    10, 'story',
    'Home with a Star Badge',
    'The rocket lands back home and the child is given a star badge, certified as a true space explorer.',
    'The rocket landed right back where it started — under the oak bush in the garden. Zip pressed a little button and out popped a golden badge in the shape of a shooting star. "For you, Explorer Alex — officially certified." Alex pinned it on, looked up at the now-dark sky full of stars, and smiled. Tomorrow: another adventure.',
    'Write one short storybook paragraph (30–60 words). {{child_name}} lands back home and is awarded a golden star badge by Zip, certified as a true explorer. They look up at the stars with excitement for tomorrow. Warm, triumphant ending. Return valid JSON: {"title": "", "text": "", "visual_description": ""}',
    'Warm children''s book illustration of {{child_name}}, age {{age}}, {{hair_note}}, {{skin_tone}} skin tone, standing in a dark garden under a sky full of stars, pinning a glowing golden star badge to their {{favorite_color}} spacesuit. Tiny robot Zip presenting it proudly. The rocket sits behind them under a bush. Joyful. Watercolor style, no text in image.',
    'image_top_text_bottom'
  ),
  (
    11, 'certificate',
    'Junior Space Explorer Certificate',
    'A celebratory certificate page for completing the space explorer adventure.',
    'This certifies that Alex is an official Junior Space Explorer! You showed curiosity, courage, and clever thinking. The stars are waiting for you.',
    null,
    null,
    'certificate'
  )
) as vals(page_number, page_type, title_template, story_beat, placeholder_text, text_prompt_template, visual_prompt_template, layout_type)
where bt.slug = 'space-explorer'
on conflict (template_id, page_number) do nothing;
