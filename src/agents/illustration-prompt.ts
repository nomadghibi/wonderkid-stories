import { fillPrompt, ILLUSTRATION_PROMPT_TEMPLATE } from "@/config/prompts";
import type { ChildProfile } from "@/types/child";
import type { StoryPagePlan } from "./story-planner";

export function buildIllustrationPrompt(page: StoryPagePlan, child: ChildProfile): string {
  return fillPrompt(ILLUSTRATION_PROMPT_TEMPLATE, {
    visual_description: page.visual_description,
    child_name: child.name,
    age: String(child.age ?? 6),
    hair_note: child.hair_note ?? "neat hair",
    skin_tone: child.skin_tone ?? "warm",
  });
}
