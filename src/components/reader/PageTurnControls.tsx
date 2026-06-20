"use client";

interface PageTurnControlsProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function PageTurnControls({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PageTurnControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-[#6C63FF] hover:text-[#6C63FF] disabled:opacity-25 disabled:cursor-not-allowed font-bold text-sm transition-all active:scale-95"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-[#6C63FF] hover:text-[#6C63FF] disabled:opacity-25 disabled:cursor-not-allowed font-bold text-sm transition-all active:scale-95"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
}
