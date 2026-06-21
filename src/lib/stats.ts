export interface StatsData {
  totalSessions: number;
  totalPagesRead: number;
  totalSecondsRead: number;
}

const LS_STATS = "wk_stats";

function base(): StatsData {
  return { totalSessions: 0, totalPagesRead: 0, totalSecondsRead: 0 };
}

export function getStats(): StatsData {
  try {
    const raw = localStorage.getItem(LS_STATS);
    return raw ? (JSON.parse(raw) as StatsData) : base();
  } catch {
    return base();
  }
}

export function addSession(pagesRead: number, seconds: number): void {
  const s = getStats();
  const next: StatsData = {
    totalSessions: s.totalSessions + 1,
    totalPagesRead: s.totalPagesRead + pagesRead,
    totalSecondsRead: s.totalSecondsRead + seconds,
  };
  try { localStorage.setItem(LS_STATS, JSON.stringify(next)); } catch { /* ignore */ }
}
