export const STORY_GENERATION_PROMPT = `You are creating a personalized children's storybook.

Child details:
Name: {{child_name}}
Age: {{age}}
Reading level: {{reading_level}}
Favorite color: {{favorite_color}}
Favorite animal: {{favorite_animal}}
Favorite sport: {{favorite_sport}}
Hair description: {{hair_note}}
Skin tone: {{skin_tone}}

Theme:
{{theme_title}}

Requirements:
- Create a warm, positive, age-appropriate story.
- The child must be the hero.
- Use simple language suitable for the reading level.
- Create exactly {{page_count}} pages.
- Each page should contain one short paragraph (2-4 sentences).
- Avoid scary, violent, unsafe, or adult content.
- Keep the tone magical, encouraging, and family-friendly.
- Target age range: 5–8 years old.
- Use clear simple vocabulary.
- Return valid JSON only.

Return JSON in this exact structure:
{
  "title": "",
  "summary": "",
  "pages": [
    {
      "page_number": 1,
      "title": "",
      "text": "",
      "visual_description": ""
    }
  ]
}`;

export const ILLUSTRATION_PROMPT_TEMPLATE = `Create a children's storybook illustration.

Scene:
{{visual_description}}

Main character:
A child named {{child_name}}, age {{age}}, with {{hair_note}}, {{skin_tone}} skin tone, wearing story-appropriate clothing.

Style:
Warm, colorful, friendly children's book illustration. Soft lighting. Wholesome. No scary elements. No text in the image.

Composition:
Landscape storybook page, clear central character, expressive scene, high-quality illustration.`;

export function fillPrompt(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (str, [key, val]) => str.replaceAll(`{{${key}}}`, val ?? ""),
    template
  );
}
