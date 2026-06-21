"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStats, type StatsData } from "@/lib/stats";
import { getStreak, type StreakData } from "@/lib/streak";
import { ACHIEVEMENTS, getUnlocked } from "@/lib/achievements";

function fmtTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    setStats(getStats());
    setStreak(getStreak());
    setUnlocked(getUnlocked());
  }, []);

  const hasData = stats && stats.totalSessions > 0;

  const cards = [
    { label: "Sessions",          value: String(stats?.totalSessions ?? 0),   emoji: "📚" },
    { label: "Pages Read",        value: String(stats?.totalPagesRead ?? 0),   emoji: "📄" },
    { label: "Books Finished",    value: String(stats?.booksFinished ?? 0),    emoji: "🏁" },
    { label: "Time Reading",      value: stats ? fmtTime(stats.totalSecondsRead) : "—", emoji: "⏱" },
    { label: "Day Streak",        value: String(streak?.count ?? 0),           emoji: "🔥" },
    { label: "Best Streak",       value: String(streak?.longestStreak ?? 0),   emoji: "🏆" },
  ];

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
        <div className="w-16" />
      </nav>

      <section className="max-w-lg mx-auto px-6 py-12 space-y-10">
        {/* Stats header */}
        <div className="text-center">
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-3xl font-extrabold text-[#24304A]">Reading Stats</h1>
          <p className="text-gray-400 text-sm mt-1">Stored on this device</p>
        </div>

        {!hasData ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold mb-4">No reading sessions recorded yet</p>
            <Link
              href="/library"
              className="inline-block bg-[#6C63FF] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#5A52E0] transition-colors"
            >
              Start Reading →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cards.map(card => (
              <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <div className="text-3xl mb-2">{card.emoji}</div>
                <div className="text-2xl font-extrabold text-[#24304A] mb-0.5">{card.value}</div>
                <div className="text-xs text-gray-400 font-semibold">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        <div>
          <h2 className="text-lg font-extrabold text-[#24304A] mb-4">
            Achievements{" "}
            <span className="text-sm font-semibold text-gray-400">
              {unlocked.length}/{ACHIEVEMENTS.length}
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(a => {
              const earned = unlocked.includes(a.id);
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all"
                  style={{
                    background: earned ? "white" : "#f9f9f9",
                    borderColor: earned ? "rgba(108,99,255,0.2)" : "rgba(0,0,0,0.06)",
                    opacity: earned ? 1 : 0.5,
                  }}
                >
                  <span className="text-2xl" style={{ filter: earned ? "none" : "grayscale(1)" }}>
                    {a.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#24304A] leading-snug">{a.name}</p>
                    <p className="text-[10px] text-gray-400 leading-snug truncate">{a.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {hasData && (
          <p className="text-center text-xs text-gray-400">
            Stats reset if you clear browser data.
          </p>
        )}
      </section>
    </main>
  );
}
