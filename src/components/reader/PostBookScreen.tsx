"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Achievement } from "@/lib/achievements";

interface PostBookScreenProps {
  title: string;
  newAchievements: Achievement[];
  mode: string;
  templateSlug?: string;
  backHref?: string;
  onReadAgain: () => void;
  onDismiss: () => void;
}

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.8,
      duration: 2.2 + Math.random() * 1.8,
      color: ["#6C63FF","#FFD166","#06D6A0","#FF6B6B","#4ECDC4","#A594FF"][i % 6],
      size: 7 + Math.random() * 7,
      drift: (Math.random() - 0.5) * 80,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[75]">
      <style>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(-10px) rotate(0deg) translateX(0); }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg) translateX(var(--drift)); }
        }
      `}</style>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.55,
            background: p.color,
            borderRadius: 2,
            // @ts-expect-error custom css var
            "--drift": `${p.drift}px`,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function PostBookScreen({
  title, newAchievements, mode, templateSlug, backHref, onReadAgain, onDismiss,
}: PostBookScreenProps) {
  return (
    <>
      <Confetti />
      <div
        className="fixed inset-0 z-[76] flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-[#24304A] mb-1">You finished it!</h2>
          <p className="text-sm text-gray-400 mb-6 line-clamp-2">{title}</p>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="mb-6 flex flex-col gap-2">
              {newAchievements.map(a => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 bg-[#FFF8ED] border border-[#FFD166]/40 rounded-xl px-4 py-2.5 text-left"
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <div>
                    <p className="text-[10px] font-extrabold text-[#FFD166] uppercase tracking-widest leading-none mb-0.5">Unlocked!</p>
                    <p className="text-sm font-extrabold text-[#24304A]">{a.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onReadAgain}
              className="w-full py-3 rounded-xl border-2 border-[#6C63FF] text-[#6C63FF] font-bold text-sm hover:bg-[#6C63FF]/5 transition-colors"
            >
              📖 Read Again
            </button>

            {(mode === "library" || mode === "sample") && (
              <a
                href={templateSlug ? `/register?template=${templateSlug}` : "/themes"}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-colors block"
                style={{ background: "#06D6A0" }}
              >
                ✨ Get a Personalized Book
              </a>
            )}

            <Link
              href={backHref ?? "/library"}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors block"
            >
              📚 Back to Library
            </Link>
          </div>

          <button
            onClick={onDismiss}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Keep reading
          </button>
        </div>
      </div>
    </>
  );
}
