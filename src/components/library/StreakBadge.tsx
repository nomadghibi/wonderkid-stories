"use client";

import { useState, useEffect } from "react";
import { getStreak } from "@/lib/streak";

export default function StreakBadge() {
  const [count, setCount] = useState<number | null>(null);
  const [longest, setLongest] = useState<number>(0);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const data = getStreak();
    if (!data) return;

    // Check if streak was updated today (reader sets this before we load)
    const today = new Date().toISOString().slice(0, 10);
    const fresh = data.lastReadDate === today;

    setCount(data.count);
    setLongest(data.longestStreak);
    setIsNew(fresh && data.count > 1);
  }, []);

  if (!count) return null;

  return (
    <div className="inline-flex items-center gap-3 bg-white border border-orange-100 rounded-2xl px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-1.5">
        <span
          className={`text-2xl ${isNew ? "animate-bounce" : ""}`}
          style={{ animationDuration: "0.6s", animationIterationCount: 3 }}
        >
          🔥
        </span>
        <div>
          <p className="text-base font-extrabold text-[#24304A] leading-none">
            {count}-day streak
          </p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            {count === 1
              ? "Read again tomorrow to grow your streak!"
              : `Best: ${longest} day${longest !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
    </div>
  );
}
