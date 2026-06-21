export interface GoalData {
  dailyMinutes: number;
}

const LS_GOAL = "wk_goal";

export function getGoal(): GoalData | null {
  try {
    const raw = localStorage.getItem(LS_GOAL);
    return raw ? (JSON.parse(raw) as GoalData) : null;
  } catch { return null; }
}

export function setGoal(data: GoalData): void {
  try { localStorage.setItem(LS_GOAL, JSON.stringify(data)); } catch { /* ignore */ }
}

export function clearGoal(): void {
  try { localStorage.removeItem(LS_GOAL); } catch { /* ignore */ }
}
