"use client";

import { useState, useEffect } from "react";
import { getGoal, setGoal, clearGoal } from "@/lib/goals";
import { getDailyLog } from "@/lib/stats";

const PRESETS = [5, 10, 15, 20, 30];
const R = 34;
const CIRC = 2 * Math.PI * R;

function Ring({ pct, done }: { pct: number; done: boolean }) {
  const dash = Math.min(pct, 1) * CIRC;
  return (
    <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={40} cy={40} r={R} fill="none" stroke="#e5e7eb" strokeWidth={7} />
      <circle
        cx={40} cy={40} r={R} fill="none"
        stroke={done ? "#06D6A0" : "#6C63FF"}
        strokeWidth={7}
        strokeDasharray={`${dash} ${CIRC}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

export default function GoalWidget() {
  const [target, setTarget] = useState<number | null>(null);
  const [todayMin, setTodayMin] = useState(0);
  const [setting, setSetting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const goal = getGoal();
    if (goal) setTarget(goal.dailyMinutes);
    const today = new Date().toISOString().slice(0, 10);
    const log = getDailyLog();
    setTodayMin(Math.round((log[today]?.seconds ?? 0) / 60));
  }, []);

  if (!mounted) return null;

  if (!target) {
    return (
      <div className="inline-flex flex-col items-center gap-2">
        {!setting ? (
          <button
            onClick={() => setSetting(true)}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#6C63FF] border border-dashed border-gray-300 hover:border-[#6C63FF] px-4 py-2 rounded-xl transition-all"
          >
            🎯 Set a daily reading goal
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-gray-500">How many minutes per day?</p>
            <div className="flex gap-2">
              {PRESETS.map(m => (
                <button
                  key={m}
                  onClick={() => { setGoal({ dailyMinutes: m }); setTarget(m); setSetting(false); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-colors"
                >
                  {m}m
                </button>
              ))}
            </div>
            <button onClick={() => setSetting(false)} className="text-xs text-gray-400 underline">Cancel</button>
          </div>
        )}
      </div>
    );
  }

  const pct = todayMin / target;
  const done = pct >= 1;

  return (
    <div className="inline-flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
      <div className="relative">
        <Ring pct={pct} done={done} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-extrabold" style={{ color: done ? "#06D6A0" : "#6C63FF" }}>
            {todayMin}
          </span>
          <span className="text-[9px] text-gray-400 font-semibold leading-none">min</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-extrabold text-[#24304A] leading-snug">
          {done ? "Goal reached! 🎉" : `${target - todayMin} min to go`}
        </p>
        <p className="text-xs text-gray-400">
          Daily goal: {target} min
        </p>
        <button
          onClick={() => { clearGoal(); setTarget(null); }}
          className="text-[10px] text-gray-300 hover:text-gray-500 underline mt-0.5"
        >
          Remove goal
        </button>
      </div>
    </div>
  );
}
