-- ============================================================
-- WonderKid Stories — Seed Data
-- Run AFTER 001_schema.sql and 002_rls.sql
-- ============================================================

-- ============================================================
-- STORY THEMES
-- ============================================================
insert into public.story_themes (slug, title, description, category, age_min, age_max, page_count, is_active)
values
  (
    'baseball-hero',
    'Baseball Hero Adventure',
    'Your child leads their team to victory in an inspiring baseball adventure full of teamwork, courage, and sportsmanship.',
    'sports', 4, 9, 10, true
  ),
  (
    'magical-forest',
    'Magical Forest Adventure',
    'Journey through an enchanted forest filled with friendly creatures, hidden magic, and wonder around every tree.',
    'fantasy', 3, 8, 10, true
  ),
  (
    'space-explorer',
    'Space Explorer Adventure',
    'Blast off on an intergalactic mission to discover new worlds, make alien friends, and save the galaxy.',
    'adventure', 5, 10, 10, true
  )
on conflict (slug) do nothing;

-- ============================================================
-- STORY TEMPLATES
-- ============================================================
insert into public.story_templates (theme_id, title, prompt_template, illustration_style, default_reading_level, page_structure)
select
  t.id,
  'Baseball Hero — Standard',
  'You are creating a personalized children''s storybook about a baseball adventure.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Skin tone: {{skin_tone}}
Hair description: {{hair_note}}

Theme: Baseball Hero Adventure
Setting: A sunny baseball diamond with a championship game on the line.

Requirements:
- The child is the star player and team captain.
- Include themes of teamwork, practice, courage, and sportsmanship.
- Create exactly 10 story pages.
- Each page has 2-3 short sentences.
- Age-appropriate vocabulary for a {{age}}-year-old.
- End with a celebration and lesson learned.
- No scary content. Warm, encouraging tone.
- Return valid JSON only.

Return JSON:
{
  "title": "",
  "summary": "",
  "pages": [{"page_number": 1, "title": "", "text": "", "visual_description": ""}]
}',
  'Warm watercolor children''s book style, sports theme, bright colors, friendly characters',
  'early_reader',
  '[
    {"page_number": 0, "page_type": "cover", "description": "Book cover with child in baseball uniform"},
    {"page_number": 1, "page_type": "story", "description": "Introduction — child gets ready for the big game"},
    {"page_number": 2, "page_type": "story", "description": "Warm-up and team huddle"},
    {"page_number": 3, "page_type": "story", "description": "First inning — making a great play"},
    {"page_number": 4, "page_type": "story", "description": "Helping a teammate who is struggling"},
    {"page_number": 5, "page_type": "story", "description": "Middle of the game — team faces a challenge"},
    {"page_number": 6, "page_type": "story", "description": "Child stays calm and encourages the team"},
    {"page_number": 7, "page_type": "story", "description": "The big moment — crucial play"},
    {"page_number": 8, "page_type": "story", "description": "Team works together to pull ahead"},
    {"page_number": 9, "page_type": "story", "description": "The final inning and victory"},
    {"page_number": 10, "page_type": "ending", "description": "Celebration and lesson about sportsmanship"}
  ]'::jsonb
from public.story_themes t where t.slug = 'baseball-hero'
on conflict do nothing;

insert into public.story_templates (theme_id, title, prompt_template, illustration_style, default_reading_level, page_structure)
select
  t.id,
  'Magical Forest — Standard',
  'You are creating a personalized children''s storybook about a magical forest adventure.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Skin tone: {{skin_tone}}
Hair description: {{hair_note}}

Theme: Magical Forest Adventure
Setting: An enchanted forest full of friendly talking animals, glowing mushrooms, and hidden wonders.

Requirements:
- The child discovers they have a special gift that helps the forest.
- Include themes of kindness, curiosity, bravery, and friendship.
- Create exactly 10 story pages.
- Each page has 2-3 short sentences.
- Age-appropriate vocabulary.
- Favorite animal plays a role in the story.
- No scary creatures. Everything is warm and friendly.
- Return valid JSON only.

Return JSON:
{
  "title": "",
  "summary": "",
  "pages": [{"page_number": 1, "title": "", "text": "", "visual_description": ""}]
}',
  'Enchanted watercolor illustration style, soft greens and purples, magical lighting, whimsical characters',
  'early_reader',
  '[
    {"page_number": 0, "page_type": "cover", "description": "Child standing at the entrance to a glowing magical forest"},
    {"page_number": 1, "page_type": "story", "description": "Child discovers a hidden path into the forest"},
    {"page_number": 2, "page_type": "story", "description": "Meeting the first magical creature"},
    {"page_number": 3, "page_type": "story", "description": "Discovering something is wrong in the forest"},
    {"page_number": 4, "page_type": "story", "description": "Finding the favorite animal as a magical friend"},
    {"page_number": 5, "page_type": "story", "description": "Working together to solve the mystery"},
    {"page_number": 6, "page_type": "story", "description": "A moment of doubt and courage"},
    {"page_number": 7, "page_type": "story", "description": "Using kindness to win over a shy creature"},
    {"page_number": 8, "page_type": "story", "description": "The magical solution is revealed"},
    {"page_number": 9, "page_type": "story", "description": "The forest is saved and celebration begins"},
    {"page_number": 10, "page_type": "ending", "description": "Child returns home knowing they are special"}
  ]'::jsonb
from public.story_themes t where t.slug = 'magical-forest'
on conflict do nothing;

insert into public.story_templates (theme_id, title, prompt_template, illustration_style, default_reading_level, page_structure)
select
  t.id,
  'Space Explorer — Standard',
  'You are creating a personalized children''s storybook about a space adventure.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Skin tone: {{skin_tone}}
Hair description: {{hair_note}}

Theme: Space Explorer Adventure
Setting: A spacecraft exploring the galaxy, visiting colorful planets and meeting friendly alien creatures.

Requirements:
- The child is the captain of the spaceship.
- Include themes of exploration, problem-solving, friendship, and bravery.
- Create exactly 10 story pages.
- Each page has 2-3 short sentences.
- Age-appropriate vocabulary.
- The favorite animal is the child''s co-pilot or pet aboard the ship.
- No scary aliens. All creatures are curious and friendly.
- Return valid JSON only.

Return JSON:
{
  "title": "",
  "summary": "",
  "pages": [{"page_number": 1, "title": "", "text": "", "visual_description": ""}]
}',
  'Space-themed children''s illustration, bright nebula colors, friendly cartoon planets and aliens, warm starfield backgrounds',
  'reader',
  '[
    {"page_number": 0, "page_type": "cover", "description": "Child in a spacesuit floating near a colorful planet"},
    {"page_number": 1, "page_type": "story", "description": "Launch day — child prepares the spacecraft"},
    {"page_number": 2, "page_type": "story", "description": "Blasting off into space with the animal co-pilot"},
    {"page_number": 3, "page_type": "story", "description": "First planet visit — discovering something amazing"},
    {"page_number": 4, "page_type": "story", "description": "Meeting a friendly alien who needs help"},
    {"page_number": 5, "page_type": "story", "description": "A small problem with the spacecraft"},
    {"page_number": 6, "page_type": "story", "description": "Solving the problem through clever thinking"},
    {"page_number": 7, "page_type": "story", "description": "Discovering a hidden galaxy treasure"},
    {"page_number": 8, "page_type": "story", "description": "Helping the alien return home"},
    {"page_number": 9, "page_type": "story", "description": "Celebrating the mission success"},
    {"page_number": 10, "page_type": "ending", "description": "Returning home as a true space explorer"}
  ]'::jsonb
from public.story_themes t where t.slug = 'space-explorer'
on conflict do nothing;
