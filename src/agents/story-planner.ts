import type { ChildProfile } from "@/types/child";
import type { StoryTheme } from "@/types/theme";
import { fillPrompt, STORY_GENERATION_PROMPT } from "@/config/prompts";
import { getOpenAI } from "@/lib/openai";

export interface StoryPlan {
  title: string;
  summary: string;
  pages: StoryPagePlan[];
}

export interface StoryPagePlan {
  page_number: number;
  title: string;
  text: string;
  visual_description: string;
}

export interface StoryPlannerInput {
  child: ChildProfile;
  theme: StoryTheme;
  dedication?: string;
}

export async function planStory(input: StoryPlannerInput): Promise<StoryPlan> {
  if (process.env.MOCK_AI_MODE === "true") {
    return generateMockStoryPlan(input);
  }
  return generateRealStoryPlan(input);
}

async function generateRealStoryPlan(input: StoryPlannerInput): Promise<StoryPlan> {
  const { child, theme } = input;
  const openai = getOpenAI();

  const prompt = fillPrompt(STORY_GENERATION_PROMPT, {
    child_name: child.name,
    age: String(child.age ?? 6),
    reading_level: child.reading_level ?? "early_reader",
    favorite_color: child.favorite_color ?? "blue",
    favorite_animal: child.favorite_animal ?? "a dog",
    favorite_sport: child.favorite_sport ?? "running",
    hair_note: child.hair_note ?? "neat hair",
    skin_tone: child.skin_tone ?? "warm",
    theme_title: theme.title,
    page_count: String(theme.page_count),
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty story response");

  const parsed = JSON.parse(content) as {
    title: string;
    summary: string;
    pages: Array<{
      page_number: number;
      title: string;
      text: string;
      visual_description: string;
    }>;
  };

  if (!parsed.pages || parsed.pages.length === 0) {
    throw new Error("OpenAI returned story with no pages");
  }

  return {
    title: parsed.title ?? `${child.name}'s ${theme.title}`,
    summary: parsed.summary ?? "",
    pages: parsed.pages.map((p) => ({
      page_number: p.page_number,
      title: p.title ?? "",
      text: p.text ?? "",
      visual_description: p.visual_description ?? "",
    })),
  };
}

function generateMockStoryPlan(input: StoryPlannerInput): StoryPlan {
  const { child, theme } = input;
  const name = child.name;
  const themeTitle = theme.title;
  const pageCount = theme.page_count;

  const pages: StoryPagePlan[] = Array.from({ length: pageCount }, (_, i) => ({
    page_number: i + 1,
    title: `${name}'s ${themeTitle} — Page ${i + 1}`,
    text: getMockPageText(name, themeTitle, i + 1, pageCount),
    visual_description: getMockVisualDescription(name, themeTitle, i + 1, child),
  }));

  return {
    title: `${name}'s ${themeTitle}`,
    summary: `${name} goes on an amazing ${themeTitle.toLowerCase()} and discovers what makes them truly special.`,
    pages,
  };
}

function getMockPageText(name: string, theme: string, pageNum: number, total: number): string {
  if (pageNum === 1) {
    return `One bright morning, ${name} woke up with a feeling that today was going to be extraordinary. The sun was shining, and something magical was about to begin. ${name} took a deep breath and stepped outside, ready for the greatest adventure yet.`;
  }
  if (pageNum === total) {
    return `As the day came to a close, ${name} smiled a huge smile. The adventure had been everything they had hoped for and more. ${name} knew that no matter what came next, they were brave, kind, and ready for anything.`;
  }
  return `${name} discovered something truly wonderful on page ${pageNum} of this incredible ${theme.toLowerCase()}. With courage and a kind heart, ${name} pressed on. Every step of the journey made ${name} stronger and wiser.`;
}

function getMockVisualDescription(name: string, theme: string, pageNum: number, child: ChildProfile): string {
  const desc = child.hair_note ? `with ${child.hair_note} hair` : "";
  return `${name} ${desc}, age ${child.age ?? 6}, in a vibrant scene from the ${theme.toLowerCase()}. Page ${pageNum} illustration showing the child as the hero of the story, warm and colorful children's book style.`;
}
