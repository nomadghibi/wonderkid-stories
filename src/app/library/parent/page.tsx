"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStats, getDailyLog, type StatsData, type DailyLog } from "@/lib/stats";
import { getStreak, type StreakData } from "@/lib/streak";
import { getUnlocked, ACHIEVEMENTS } from "@/lib/achievements";

function fmtTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function dayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
}

export default function ParentPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [daily, setDaily] = useState<DailyLog>({});
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    setStats(getStats());
    setStreak(getStreak());
    setDaily(getDailyLog());
    setUnlockedIds(getUnlocked());
  }, []);

  const days = last7Days();
  const maxSeconds = Math.max(...days.map(d => daily[d]?.seconds ?? 0), 1);
  const todaySeconds = daily[new Date().toISOString().slice(0, 10)]?.seconds ?? 0;
  const weekSeconds = days.reduce((sum, d) => sum + (daily[d]?.seconds ?? 0), 0);
  const earned = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));

  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-[#FFD166]/30">
        <Link href="/library" className="text-sm font-semibold text-[#6C63FF] hover:opacity-75 transition-opacity">
          ← Library
        </Link>
        <div className="flex items-center gap-1.5 text-[#6C63FF]">
          <span className="text-lg">📖</span>
          <span className="font-extrabold text-sm hidden sm:inline">WonderKid Stories</span>
        </div>
        <Link href="/library/stats" className="text-xs text-gray-400 hover:text-[#6C63FF] font-semibold">
          Full Stats →
        </Link>
      </nav>

      <section className="max-w-lg mx-auto px-6 py-10 space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-2">👨‍👩‍👧</div>
          <h1 className="text-2xl font-extrabold text-[#24304A]">Parent Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Reading activity on this device</p>
        </div>

        {/* Today + week summary */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Today", value: fmtTime(todaySeconds), emoji: "☀️" },
            { label: "This Week", value: fmtTime(weekSeconds), emoji: "📅" },
            { label: "Day Streak", value: `${streak?.count ?? 0} days`, emoji: "🔥" },
            { label: "Books Finished", value: String(stats?.booksFinished ?? 0), emoji: "🏁" },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{c.emoji}</div>
              <div className="text-xl font-extrabold text-[#24304A]">{c.value}</div>
              <div className="text-xs text-gray-400 font-semibold">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-extrabold text-[#24304A] mb-4">Reading Time — Last 7 Days</h2>
          <div className="flex items-end gap-2 h-28">
            {days.map(d => {
              const secs = daily[d]?.seconds ?? 0;
              const pct = (secs / maxSeconds) * 100;
              const isToday = d === new Date().toISOString().slice(0, 10);
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: secs > 0 ? `${Math.max(pct, 6)}%` : "4px",
                        background: isToday ? "#6C63FF" : secs > 0 ? "#A594FF" : "#F3F4F6",
                        minHeight: 4,
                      }}
                      title={secs > 0 ? fmtTime(secs) : "No reading"}
                    />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: isToday ? "#6C63FF" : "#9ca3af" }}>
                    {dayLabel(d)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        {earned.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-extrabold text-[#24304A] mb-3">
              Achievements Earned <span className="text-gray-400 font-semibold">{earned.length}/{ACHIEVEMENTS.length}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {earned.map(a => (
                <div key={a.id} className="flex items-center gap-1.5 bg-[#FFF8ED] border border-[#FFD166]/40 rounded-full px-3 py-1.5">
                  <span className="text-base">{a.emoji}</span>
                  <span className="text-xs font-bold text-[#24304A]">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          All data is stored locally on this device.
        </p>
      </section>
    </main>
  );
}
