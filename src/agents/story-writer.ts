import type { StoryPlan } from "./story-planner";

export interface WriterInput {
  plan: StoryPlan;
  childName: string;
  age: number;
  readingLevel: string;
}

export async function writeStory(input: WriterInput): Promise<StoryPlan> {
  if (process.env.MOCK_AI_MODE === "true") {
    return input.plan;
  }
  throw new Error("Real AI writer not configured. Set MOCK_AI_MODE=true or implement a provider.");
}
