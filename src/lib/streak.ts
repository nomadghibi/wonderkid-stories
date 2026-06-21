export interface StreakData {
  count: number;
  lastReadDate: string; // "YYYY-MM-DD"
  longestStreak: number;
}

const LS_STREAK = "wk_streak";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000
  );
}

export function getStreak(): StreakData | null {
  try {
    const raw = localStorage.getItem(LS_STREAK);
    return raw ? (JSON.parse(raw) as StreakData) : null;
  } catch {
    return null;
  }
}

// Call when a reading session starts. Returns the updated streak data.
export function updateStreak(): StreakData {
  const today = todayStr();
  let existing: StreakData | null = null;
  try {
    const raw = localStorage.getItem(LS_STREAK);
    if (raw) existing = JSON.parse(raw) as StreakData;
  } catch { /* ignore */ }

  if (!existing) {
    const data: StreakData = { count: 1, lastReadDate: today, longestStreak: 1 };
    try { localStorage.setItem(LS_STREAK, JSON.stringify(data)); } catch { /* ignore */ }
    return data;
  }

  if (existing.lastReadDate === today) return existing;

  const diff = daysBetween(existing.lastReadDate, today);
  const newCount = diff === 1 ? existing.count + 1 : 1;
  const data: StreakData = {
    count: newCount,
    lastReadDate: today,
    longestStreak: Math.max(newCount, existing.longestStreak ?? newCount),
  };
  try { localStorage.setItem(LS_STREAK, JSON.stringify(data)); } catch { /* ignore */ }
  return data;
}
