-- ============================================================
-- WonderKid Stories — Additional Story Themes
-- ============================================================

insert into public.story_themes (slug, title, description, category, age_min, age_max, page_count, is_active)
values
  (
    'underwater-explorer',
    'Underwater Explorer',
    'Dive deep into a magical ocean world, meet colorful sea creatures, and discover hidden treasures beneath the waves.',
    'adventure', 3, 8, 10, true
  ),
  (
    'superhero-academy',
    'Superhero Academy',
    'Your child discovers their superpower and joins the Superhero Academy to learn how to be a true hero.',
    'adventure', 4, 10, 10, true
  ),
  (
    'dinosaur-discovery',
    'Dinosaur Discovery',
    'Travel back in time to befriend friendly dinosaurs, explore prehistoric jungles, and make an amazing discovery.',
    'fantasy', 4, 9, 10, true
  )
on conflict (slug) do nothing;

-- Underwater Explorer template
insert into public.story_templates (theme_id, title, prompt_template, illustration_style, default_reading_level, page_structure)
select
  t.id,
  'Underwater Explorer — Standard',
  'You are creating a personalized children''s storybook about an underwater ocean adventure.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Skin tone: {{skin_tone}}
Hair description: {{hair_note}}

Theme: Underwater Explorer Adventure
Setting: A magical ocean world with coral reefs, glowing jellyfish, sunken treasure ships, and friendly sea creatures.

Requirements:
- The child is a brave young explorer with a special underwater suit.
- The favorite animal is their ocean companion (as an aquatic version if needed).
- Include themes of curiosity, environmental care, friendship, and courage.
- Create exactly 10 story pages.
- Each page has 2-3 short sentences.
- Age-appropriate vocabulary for a {{age}}-year-old.
- No scary sea creatures — everything is friendly and wondrous.
- End with the child discovering something beautiful and protecting the ocean.
- Return valid JSON only.

Return JSON:
{
  "title": "",
  "summary": "",
  "pages": [{"page_number": 1, "title": "", "text": "", "visual_description": ""}]
}',
  'Vibrant underwater watercolor illustration, rich blues and teals, bioluminescent glow effects, friendly sea creatures, treasure and coral details',
  'early_reader',
  '[
    {"page_number": 0, "page_type": "cover", "description": "Child in underwater suit surrounded by colorful fish and coral"},
    {"page_number": 1, "page_type": "story", "description": "Child suits up and dives into the sparkling ocean"},
    {"page_number": 2, "page_type": "story", "description": "Discovering a dazzling coral reef city"},
    {"page_number": 3, "page_type": "story", "description": "Meeting the animal companion as a sea creature friend"},
    {"page_number": 4, "page_type": "story", "description": "Finding a mysterious glowing map"},
    {"page_number": 5, "page_type": "story", "description": "Swimming deeper to follow the map"},
    {"page_number": 6, "page_type": "story", "description": "Helping sea creatures with a small problem"},
    {"page_number": 7, "page_type": "story", "description": "Discovering a hidden sunken treasure chamber"},
    {"page_number": 8, "page_type": "story", "description": "Realizing the greatest treasure is the ocean itself"},
    {"page_number": 9, "page_type": "story", "description": "Celebrating with all the ocean friends"},
    {"page_number": 10, "page_type": "ending", "description": "Child returns to the surface, promising to protect the sea"}
  ]'::jsonb
from public.story_themes t where t.slug = 'underwater-explorer'
on conflict do nothing;

-- Superhero Academy template
insert into public.story_templates (theme_id, title, prompt_template, illustration_style, default_reading_level, page_structure)
select
  t.id,
  'Superhero Academy — Standard',
  'You are creating a personalized children''s storybook about a superhero adventure.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Skin tone: {{skin_tone}}
Hair description: {{hair_note}}

Theme: Superhero Academy Adventure
Setting: A colorful superhero academy city where kids discover and train their superpowers.

Requirements:
- The child discovers a unique superpower related to their personality or a kindness-based power.
- The favorite animal is their superhero animal sidekick.
- Their superhero costume reflects their favorite color.
- Include themes of responsibility, kindness, courage, and using talents to help others.
- Create exactly 10 story pages.
- Each page has 2-3 short sentences.
- Age-appropriate vocabulary for a {{age}}-year-old.
- No violent conflict — hero helps people and solves problems through kindness and cleverness.
- End with the child completing their first heroic mission.
- Return valid JSON only.

Return JSON:
{
  "title": "",
  "summary": "",
  "pages": [{"page_number": 1, "title": "", "text": "", "visual_description": ""}]
}',
  'Bold comic-style children''s illustration, bright hero colors, dynamic poses, city skyline, action and warmth combined',
  'reader',
  '[
    {"page_number": 0, "page_type": "cover", "description": "Child in superhero costume with animal sidekick, city in background"},
    {"page_number": 1, "page_type": "story", "description": "Child wakes up and discovers something has changed"},
    {"page_number": 2, "page_type": "story", "description": "First accidental use of the new superpower"},
    {"page_number": 3, "page_type": "story", "description": "Getting invited to the Superhero Academy"},
    {"page_number": 4, "page_type": "story", "description": "Meeting the animal sidekick at the academy"},
    {"page_number": 5, "page_type": "story", "description": "Training to control the superpower"},
    {"page_number": 6, "page_type": "story", "description": "A tricky training challenge"},
    {"page_number": 7, "page_type": "story", "description": "Learning that kindness is the greatest power"},
    {"page_number": 8, "page_type": "story", "description": "First real mission — helping someone in need"},
    {"page_number": 9, "page_type": "story", "description": "Saving the day through cleverness and heart"},
    {"page_number": 10, "page_type": "ending", "description": "Graduating from the academy as a true hero"}
  ]'::jsonb
from public.story_themes t where t.slug = 'superhero-academy'
on conflict do nothing;

-- Dinosaur Discovery template
insert into public.story_templates (theme_id, title, prompt_template, illustration_style, default_reading_level, page_structure)
select
  t.id,
  'Dinosaur Discovery — Standard',
  'You are creating a personalized children''s storybook about a prehistoric dinosaur adventure.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Skin tone: {{skin_tone}}
Hair description: {{hair_note}}

Theme: Dinosaur Discovery Adventure
Setting: A lush prehistoric world of towering jungle plants, volcanoes in the distance, and friendly gentle dinosaurs.

Requirements:
- The child is a young paleontologist who discovers a time portal in their backyard.
- The favorite animal appears as a small prehistoric version in the dino world.
- All dinosaurs are friendly, gentle, and curious — no scary predator behavior.
- Include themes of discovery, science curiosity, caring for animals, and adventure.
- Create exactly 10 story pages.
- Each page has 2-3 short sentences.
- Age-appropriate vocabulary for a {{age}}-year-old.
- End with the child making a dino friend and leaving a gift before returning home.
- Return valid JSON only.

Return JSON:
{
  "title": "",
  "summary": "",
  "pages": [{"page_number": 1, "title": "", "text": "", "visual_description": ""}]
}',
  'Lush prehistoric watercolor illustration, warm jungle greens and earth tones, cute friendly dinosaurs, sense of wonder and adventure',
  'early_reader',
  '[
    {"page_number": 0, "page_type": "cover", "description": "Child riding a friendly small dinosaur through a prehistoric jungle"},
    {"page_number": 1, "page_type": "story", "description": "Child digging in the backyard and finding something strange"},
    {"page_number": 2, "page_type": "story", "description": "Discovering a glowing time portal and stepping through"},
    {"page_number": 3, "page_type": "story", "description": "Arriving in the prehistoric world — dinosaurs everywhere"},
    {"page_number": 4, "page_type": "story", "description": "Meeting a baby dinosaur who needs help"},
    {"page_number": 5, "page_type": "story", "description": "Finding the animal companion as a tiny prehistoric creature"},
    {"page_number": 6, "page_type": "story", "description": "Helping the baby dino find its herd"},
    {"page_number": 7, "page_type": "story", "description": "Exploring the incredible prehistoric landscape"},
    {"page_number": 8, "page_type": "story", "description": "Making an amazing discovery with the dino friends"},
    {"page_number": 9, "page_type": "story", "description": "Saying goodbye and leaving a special gift"},
    {"page_number": 10, "page_type": "ending", "description": "Returning home with a fossil and memories forever"}
  ]'::jsonb
from public.story_themes t where t.slug = 'dinosaur-discovery'
on conflict do nothing;
