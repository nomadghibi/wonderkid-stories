import { createServiceClient } from "@/lib/supabase/server";
import { getOpenAI } from "@/lib/openai";
import { fillPrompt } from "@/config/prompts";
import type { ChildProfile } from "@/types/child";
import type { BookTemplateWithPages, TemplatePage } from "@/types/template";

export interface PersonalizedPage {
  template_page_id: string;
  page_number: number;
  page_type: string;
  title: string;
  text_content: string;
  image_prompt: string;
  layout_type: string;
}

export interface PersonalizationResult {
  title: string;
  pages: PersonalizedPage[];
}

const MOCK_AI = process.env.MOCK_AI_MODE === "true";

function childVars(child: ChildProfile): Record<string, string> {
  return {
    child_name: child.name,
    age: String(child.age ?? 7),
    favorite_color: child.favorite_color ?? "blue",
    favorite_animal: child.favorite_animal ?? "dog",
    favorite_sport: child.favorite_sport ?? "sports",
    hair_note: child.hair_note ?? "neat hair",
    skin_tone: child.skin_tone ?? "medium",
    reading_level: child.reading_level ?? "early_reader",
  };
}

function mockPage(page: TemplatePage, vars: Record<string, string>): PersonalizedPage {
  const text = fillPrompt(page.placeholder_text ?? page.story_beat, vars);
  const title = fillPrompt(page.title_template ?? `Page ${page.page_number}`, vars);
  const imagePrompt = fillPrompt(page.visual_prompt_template ?? "", vars);
  return {
    template_page_id: page.id,
    page_number: page.page_number,
    page_type: page.page_type,
    title,
    text_content: text,
    image_prompt: imagePrompt,
    layout_type: page.layout_type,
  };
}

async function realPage(
  page: TemplatePage,
  vars: Record<string, string>
): Promise<PersonalizedPage> {
  // Certificate and cover: no AI text call — just fill vars
  if (page.page_type === "certificate" || page.page_type === "cover") {
    return mockPage(page, vars);
  }

  if (!page.text_prompt_template) {
    return mockPage(page, vars);
  }

  const prompt = fillPrompt(page.text_prompt_template, vars);

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a children's book author. Write warm, simple, age-appropriate text that follows the story beat exactly. Always return valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.75,
    max_tokens: 300,
  });

  const raw = response.choices[0].message.content;
  if (!raw) throw new Error(`OpenAI empty response for page ${page.page_number}`);

  const parsed = JSON.parse(raw) as {
    title?: string;
    text?: string;
    visual_description?: string;
  };

  const finalVisualPrompt = fillPrompt(page.visual_prompt_template ?? "", {
    ...vars,
    visual_description: parsed.visual_description ?? page.story_beat,
  });

  return {
    template_page_id: page.id,
    page_number: page.page_number,
    page_type: page.page_type,
    title:
      parsed.title ||
      fillPrompt(page.title_template ?? `Page ${page.page_number}`, vars),
    text_content:
      parsed.text ||
      fillPrompt(page.placeholder_text ?? page.story_beat, vars),
    image_prompt: finalVisualPrompt,
    layout_type: page.layout_type,
  };
}

export async function personalizeTemplate(opts: {
  templateId: string;
  child: ChildProfile;
  dedication?: string;
  supabase?: Awaited<ReturnType<typeof createServiceClient>>;
}): Promise<PersonalizationResult> {
  const supabase = opts.supabase ?? (await createServiceClient());

  const { data: template } = (await supabase
    .from("book_templates")
    .select("*, template_pages(*)")
    .eq("id", opts.templateId)
    .single()) as { data: BookTemplateWithPages | null };

  if (!template) throw new Error(`Template ${opts.templateId} not found`);

  const sortedPages = (template.template_pages ?? []).sort(
    (a, b) => a.page_number - b.page_number
  );

  const vars = childVars(opts.child);
  const personalizedPages: PersonalizedPage[] = [];

  for (const page of sortedPages) {
    const result = MOCK_AI
      ? mockPage(page, vars)
      : await realPage(page, vars);
    personalizedPages.push(result);
  }

  return {
    title: `${opts.child.name}'s ${template.title}`,
    pages: personalizedPages,
  };
}
