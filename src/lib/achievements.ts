export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_read",   emoji: "📖", name: "First Chapter",     description: "Opened your first book" },
  { id: "finished_1",   emoji: "🏆", name: "Finisher",          description: "Finished a complete book" },
  { id: "finished_5",   emoji: "🎯", name: "Completionist",     description: "Finished 5 books" },
  { id: "sessions_10",  emoji: "🐛", name: "Bookworm",          description: "10 reading sessions" },
  { id: "pages_50",     emoji: "📄", name: "Page Turner",       description: "Read 50 pages" },
  { id: "pages_100",    emoji: "⚡", name: "Speed Reader",      description: "Read 100 pages" },
  { id: "streak_3",     emoji: "🔥", name: "On Fire",           description: "3-day reading streak" },
  { id: "streak_7",     emoji: "⭐", name: "Dedicated Reader",  description: "7-day reading streak" },
  { id: "night_owl",    emoji: "🦉", name: "Night Owl",         description: "Read in night mode" },
  { id: "bookmarker",   emoji: "🔖", name: "Bookmarker",        description: "Saved your first bookmark" },
];

const LS_KEY = "wk_achievements";

export function getUnlocked(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

interface AchievementContext {
  sessions: number;
  pagesRead: number;
  booksFinished: number;
  streakCount: number;
  nightMode: boolean;
  hasBookmark: boolean;
}

export function checkAndUnlock(ctx: AchievementContext): Achievement[] {
  const unlocked = getUnlocked();
  const newIds: string[] = [];

  const checks: { id: string; condition: boolean }[] = [
    { id: "first_read",  condition: ctx.sessions >= 1 },
    { id: "finished_1",  condition: ctx.booksFinished >= 1 },
    { id: "finished_5",  condition: ctx.booksFinished >= 5 },
    { id: "sessions_10", condition: ctx.sessions >= 10 },
    { id: "pages_50",    condition: ctx.pagesRead >= 50 },
    { id: "pages_100",   condition: ctx.pagesRead >= 100 },
    { id: "streak_3",    condition: ctx.streakCount >= 3 },
    { id: "streak_7",    condition: ctx.streakCount >= 7 },
    { id: "night_owl",   condition: ctx.nightMode },
    { id: "bookmarker",  condition: ctx.hasBookmark },
  ];

  for (const { id, condition } of checks) {
    if (condition && !unlocked.includes(id)) {
      unlocked.push(id);
      newIds.push(id);
    }
  }

  if (newIds.length > 0) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(unlocked)); } catch { /* ignore */ }
  }

  return newIds.map(id => ACHIEVEMENTS.find(a => a.id === id)!).filter(Boolean);
}
