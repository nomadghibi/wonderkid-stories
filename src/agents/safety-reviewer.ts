import type { StoryPlan } from "./story-planner";
import { getOpenAI } from "@/lib/openai";

export interface SafetyResult {
  passed: boolean;
  issues: string[];
  cleanedPlan?: StoryPlan;
}

// Keyword fallback (always runs)
const UNSAFE_PATTERNS = [
  /\b(kill|murder|blood|weapon|gun|knife|demon|devil|hell)\b/i,
  /\b(alcohol|drug|cigarette|naked|sex|adult|violent|gore)\b/i,
];

export async function reviewSafety(plan: StoryPlan): Promise<SafetyResult> {
  const issues: string[] = [];

  // 1. Keyword check (fast, no API call)
  for (const page of plan.pages) {
    const text = `${page.title} ${page.text} ${page.visual_description}`;
    for (const pattern of UNSAFE_PATTERNS) {
      if (pattern.test(text)) {
        issues.push(`Page ${page.page_number}: flagged by keyword filter`);
      }
    }
  }

  // 2. OpenAI moderation API (real mode only)
  if (process.env.MOCK_AI_MODE !== "true" && process.env.OPENAI_API_KEY) {
    try {
      const openai = getOpenAI();
      const fullText = plan.pages.map((p) => p.text).join("\n");

      const modResult = await openai.moderations.create({
        input: fullText,
        model: "omni-moderation-latest",
      });

      const result = modResult.results[0];
      if (result.flagged) {
        const flaggedCategories = Object.entries(result.categories)
          .filter(([, v]) => v)
          .map(([k]) => k);
        issues.push(`OpenAI moderation flagged: ${flaggedCategories.join(", ")}`);
      }
    } catch {
      // Non-fatal — keyword check still runs
      console.warn("[safety] OpenAI moderation check failed, using keyword fallback only");
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    cleanedPlan: issues.length === 0 ? plan : undefined,
  };
}
