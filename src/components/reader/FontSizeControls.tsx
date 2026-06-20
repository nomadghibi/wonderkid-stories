"use client";

import type { FontSize } from "@/types/reader";
import { FONT_SIZES, FONT_SIZE_PX } from "@/types/reader";

interface FontSizeControlsProps {
  fontSize: FontSize;
  onChange: (size: FontSize) => void;
}

export default function FontSizeControls({ fontSize, onChange }: FontSizeControlsProps) {
  const currentIdx = FONT_SIZES.indexOf(fontSize);

  function decrease() {
    if (currentIdx > 0) onChange(FONT_SIZES[currentIdx - 1]);
  }
  function increase() {
    if (currentIdx < FONT_SIZES.length - 1) onChange(FONT_SIZES[currentIdx + 1]);
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-1 py-1">
      <button
        onClick={decrease}
        disabled={currentIdx === 0}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
        title="Decrease font size"
        style={{ fontSize: 13 }}
      >
        A−
      </button>
      <div className="w-px h-4 bg-gray-300" />
      <button
        onClick={increase}
        disabled={currentIdx === FONT_SIZES.length - 1}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
        title="Increase font size"
        style={{ fontSize: 16 }}
      >
        A+
      </button>
      <div className="w-px h-4 bg-gray-300" />
      <span className="px-1 text-xs text-gray-400 tabular-nums">
        {FONT_SIZE_PX[fontSize]}px
      </span>
    </div>
  );
}
