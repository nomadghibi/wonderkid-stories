"use client";

import type { FontSize, ReaderMode } from "@/types/reader";
import FontSizeControls from "./FontSizeControls";

interface ReaderToolbarProps {
  title: string;
  childName?: string;
  mode: ReaderMode;
  fontSize: FontSize;
  onFontSize: (s: FontSize) => void;
  onClose?: () => void;
  backLabel?: string;
  backHref?: string;
}

const MODE_BADGE: Record<ReaderMode, { label: string; color: string }> = {
  sample: { label: "Preview", color: "bg-[#FFD166]/30 text-yellow-700" },
  review: { label: "Review", color: "bg-purple-100 text-[#6C63FF]" },
  final: { label: "Approved", color: "bg-green-100 text-green-700" },
};

export default function ReaderToolbar({
  title,
  childName,
  mode,
  fontSize,
  onFontSize,
  onClose,
  backLabel,
  backHref,
}: ReaderToolbarProps) {
  const badge = MODE_BADGE[mode];

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 gap-3">
      {/* Left: back / title */}
      <div className="flex items-center gap-3 min-w-0">
        {backHref ? (
          <a
            href={backHref}
            className="text-sm text-gray-400 hover:text-[#6C63FF] font-medium whitespace-nowrap transition-colors"
          >
            ← {backLabel ?? "Back"}
          </a>
        ) : onClose ? (
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-[#6C63FF] font-medium whitespace-nowrap transition-colors"
          >
            ← Back
          </button>
        ) : null}

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-extrabold text-[#24304A] text-sm truncate max-w-[160px] md:max-w-xs">
            {title}
          </span>
          {childName && (
            <span className="text-gray-400 text-xs hidden sm:inline">
              · {childName}
            </span>
          )}
        </div>
      </div>

      {/* Right: badge + font controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full hidden sm:inline-block ${badge.color}`}>
          {badge.label}
        </span>
        <FontSizeControls fontSize={fontSize} onChange={onFontSize} />
      </div>
    </div>
  );
}
