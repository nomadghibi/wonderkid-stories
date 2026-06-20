"use client";

interface ReaderProgressProps {
  current: number;  // 0-based
  total: number;
  onChange: (index: number) => void;
}

const MAX_DOTS = 12;

export default function ReaderProgress({ current, total, onChange }: ReaderProgressProps) {
  const showDots = total <= MAX_DOTS;

  return (
    <div className="flex items-center gap-3">
      {showDots ? (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? "w-3 h-3 bg-[#6C63FF]"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6C63FF] rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      )}
      <span className="text-xs text-gray-400 font-medium tabular-nums whitespace-nowrap">
        {current + 1} / {total}
      </span>
    </div>
  );
}
