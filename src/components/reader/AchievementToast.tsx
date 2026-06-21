"use client";

import { useEffect, useState } from "react";
import type { Achievement } from "@/lib/achievements";

interface AchievementToastProps {
  achievements: Achievement[];
  onDone: () => void;
}

export default function AchievementToast({ achievements, onDone }: AchievementToastProps) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (idx < achievements.length - 1) {
        setIdx(i => i + 1);
      } else {
        setVisible(false);
        onDone();
      }
    }, 2800);
    return () => clearTimeout(t);
  }, [idx, visible, achievements.length, onDone]);

  if (!visible || achievements.length === 0) return null;
  const a = achievements[idx];

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 pointer-events-none"
      style={{ animation: "toastIn 0.35s cubic-bezier(.34,1.56,.64,1)" }}
    >
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);   opacity: 1; }
        }
      `}</style>
      <div className="bg-[#24304A] text-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl whitespace-nowrap">
        <span className="text-3xl">{a.emoji}</span>
        <div>
          <p className="text-[10px] font-extrabold text-[#FFD166] uppercase tracking-widest">Achievement Unlocked!</p>
          <p className="font-extrabold text-sm">{a.name}</p>
          <p className="text-xs text-white/60">{a.description}</p>
        </div>
      </div>
    </div>
  );
}
