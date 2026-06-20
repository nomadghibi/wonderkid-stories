"use client";

import { useEffect, useState } from "react";

const LS_KEY = "wk_hand_hint_v1";

export default function WonderHandHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(LS_KEY)) setVisible(true);
    } catch { /* private mode */ }

    const t = setTimeout(dismiss, 4500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(LS_KEY, "1"); } catch { /* ignore */ }
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes swipeHand {
          0%   { transform: translateX(0)    opacity: 1; }
          40%  { transform: translateX(-28px); opacity: 0.7; }
          70%  { transform: translateX(-28px); opacity: 0.7; }
          100% { transform: translateX(0);    opacity: 1; }
        }
        .wonder-hand { animation: swipeHand 1.4s ease-in-out infinite; }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex items-end justify-center pb-28 bg-black/20 backdrop-blur-[1px]"
        onClick={dismiss}
      >
        <div className="bg-[#24304A]/90 text-white rounded-2xl px-7 py-5 flex flex-col items-center gap-3 shadow-2xl max-w-xs text-center">
          <div className="wonder-hand text-5xl select-none">👉</div>
          <p className="font-bold text-base">Tap or swipe to turn the page</p>
          <button
            onClick={dismiss}
            className="text-xs text-white/60 hover:text-white/90 underline mt-1"
          >
            Got it!
          </button>
        </div>
      </div>
    </>
  );
}
