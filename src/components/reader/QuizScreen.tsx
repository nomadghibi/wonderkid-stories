"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/bookQuizzes";

interface QuizScreenProps {
  questions: QuizQuestion[];
  bookTitle: string;
  bookId: string;
  onDone: (score: number, total: number) => void;
  onSkip: () => void;
  nightMode?: boolean;
}

const STARS = (score: number, total: number) => {
  const pct = score / total;
  if (pct === 1)   return "⭐⭐⭐";
  if (pct >= 0.66) return "⭐⭐";
  return "⭐";
};

export default function QuizScreen({ questions, bookId, onDone, onSkip, nightMode }: QuizScreenProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const finalScore = score;

  const bg = nightMode ? "#1e1a14" : "white";
  const text = nightMode ? "#e8d5b0" : "#24304A";
  const subtext = nightMode ? "#a89070" : "#6b7280";
  const border = nightMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";

  function pick(optIdx: number) {
    if (selected !== null) return;
    const q = questions[idx];
    const correct = optIdx === q.correct;
    if (correct) setScore(s => s + 1);
    setSelected(optIdx);

    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(i => i + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 1100);
  }

  function optionStyle(i: number): React.CSSProperties {
    const base: React.CSSProperties = {
      display: "block", width: "100%", textAlign: "left",
      padding: "10px 16px", borderRadius: 12,
      fontSize: 14, fontWeight: 600,
      border: `2px solid ${border}`,
      background: bg, color: text,
      transition: "all 0.15s",
      cursor: selected !== null ? "default" : "pointer",
      marginBottom: 8,
    };
    if (selected === null) return base;
    const q = questions[idx];
    if (i === q.correct) return { ...base, borderColor: "#06D6A0", background: nightMode ? "rgba(6,214,160,0.15)" : "#f0fdf9", color: "#059669" };
    if (i === selected) return { ...base, borderColor: "#ef4444", background: nightMode ? "rgba(239,68,68,0.1)" : "#fef2f2", color: "#dc2626" };
    return { ...base, opacity: 0.4 };
  }

  if (done) {
    const total = questions.length;
    const pct = Math.round((finalScore / total) * 100);
    return (
      <div className="fixed inset-0 z-[77] flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}>
        <div className="rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center" style={{ background: bg }}>
          <div className="text-5xl mb-3">{STARS(finalScore, total)}</div>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: text }}>
            {pct === 100 ? "Perfect score!" : pct >= 66 ? "Great job!" : "Nice try!"}
          </h2>
          <p className="text-4xl font-extrabold my-4" style={{ color: "#6C63FF" }}>
            {finalScore}/{total}
          </p>
          <p className="text-sm mb-8" style={{ color: subtext }}>
            {pct === 100 ? "You remembered every detail!" : "Keep reading to get even better!"}
          </p>
          <button
            onClick={() => onDone(finalScore, total)}
            className="w-full py-3 rounded-xl text-white font-extrabold text-sm"
            style={{ background: "#6C63FF" }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const progress = ((idx) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[77] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}>
      <div className="rounded-3xl shadow-2xl max-w-sm w-full p-6" style={{ background: bg }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold" style={{ color: "#6C63FF" }}>
            Question {idx + 1} of {questions.length}
          </span>
          <button onClick={onSkip} className="text-xs underline" style={{ color: subtext }}>Skip</button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: border }}>
          <div className="h-full rounded-full bg-[#6C63FF] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <p className="font-extrabold text-base mb-5 leading-snug" style={{ color: text }}>
          {q.question}
        </p>

        {/* Options */}
        <div>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)} style={optionStyle(i)}>
              <span className="font-bold mr-2 opacity-50">{["A", "B", "C", "D"][i]}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
