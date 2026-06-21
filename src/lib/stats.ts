export interface StatsData {
  totalSessions: number;
  totalPagesRead: number;
  totalSecondsRead: number;
  booksFinished: number;
}

export interface DailyEntry { seconds: number; pages: number }
export type DailyLog = Record<string, DailyEntry>;

const LS_STATS = "wk_stats";
const LS_DAILY = "wk_daily";

function base(): StatsData {
  return { totalSessions: 0, totalPagesRead: 0, totalSecondsRead: 0, booksFinished: 0 };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getStats(): StatsData {
  try {
    const raw = localStorage.getItem(LS_STATS);
    return { ...base(), ...(raw ? JSON.parse(raw) : {}) };
  } catch { return base(); }
}

export function getDailyLog(): DailyLog {
  try {
    const raw = localStorage.getItem(LS_DAILY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveStats(data: StatsData): void {
  try { localStorage.setItem(LS_STATS, JSON.stringify(data)); } catch { /* ignore */ }
}

export function addSession(pagesRead: number, seconds: number): StatsData {
  const s = getStats();
  const next: StatsData = {
    ...s,
    totalSessions: s.totalSessions + 1,
    totalPagesRead: s.totalPagesRead + pagesRead,
    totalSecondsRead: s.totalSecondsRead + seconds,
  };
  saveStats(next);
  try {
    const log = getDailyLog();
    const d = today();
    log[d] = { seconds: (log[d]?.seconds ?? 0) + seconds, pages: (log[d]?.pages ?? 0) + pagesRead };
    localStorage.setItem(LS_DAILY, JSON.stringify(log));
  } catch { /* ignore */ }
  return next;
}

export function finishBook(): StatsData {
  const s = getStats();
  const next: StatsData = { ...s, booksFinished: s.booksFinished + 1 };
  saveStats(next);
  return next;
}
