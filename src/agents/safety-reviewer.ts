import type { StoryPlan } from "./story-planner";

export interface SafetyResult {
  passed: boolean;
  issues: string[];
  cleanedPlan?: StoryPlan;
}

const UNSAFE_PATTERNS = [
  /\b(kill|death|dead|die|murder|blood|weapon|gun|knife|scary|monster|demon|devil|hell)\b/i,
  /\b(alcohol|drug|cigarette|smoke|beer|wine|naked|sex|adult)\b/i,
];

export async function reviewSafety(plan: StoryPlan): Promise<SafetyResult> {
  const issues: string[] = [];

  for (const page of plan.pages) {
    const text = `${page.title} ${page.text} ${page.visual_description}`;
    for (const pattern of UNSAFE_PATTERNS) {
      if (pattern.test(text)) {
        issues.push(`Page ${page.page_number}: matched unsafe pattern ${pattern.source}`);
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    cleanedPlan: issues.length === 0 ? plan : undefined,
  };
}
