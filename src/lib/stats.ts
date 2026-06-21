export interface StatsData {
  totalSessions: number;
  totalPagesRead: number;
  totalSecondsRead: number;
  booksFinished: number;
}

const LS_STATS = "wk_stats";

function base(): StatsData {
  return { totalSessions: 0, totalPagesRead: 0, totalSecondsRead: 0, booksFinished: 0 };
}

export function getStats(): StatsData {
  try {
    const raw = localStorage.getItem(LS_STATS);
    const parsed = raw ? (JSON.parse(raw) as Partial<StatsData>) : {};
    return { ...base(), ...parsed };
  } catch {
    return base();
  }
}

function save(data: StatsData): void {
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
  save(next);
  return next;
}

export function finishBook(): StatsData {
  const s = getStats();
  const next: StatsData = { ...s, booksFinished: s.booksFinished + 1 };
  save(next);
  return next;
}
