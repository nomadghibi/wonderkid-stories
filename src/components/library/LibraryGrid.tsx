"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { LibraryBook, Subject } from "@/types/library";

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  early_reader: "Early Reader",
  reader: "Reader",
};

const AGE_RANGES = [
  { label: "All ages", min: 0, max: 99 },
  { label: "2–4", min: 2, max: 4 },
  { label: "4–6", min: 4, max: 6 },
  { label: "6–8", min: 6, max: 8 },
  { label: "8+",  min: 8, max: 99 },
];

const LEVELS = ["all", "beginner", "early_reader", "reader"] as const;

interface LibraryGridProps {
  books: LibraryBook[];
}

export default function LibraryGrid({ books }: LibraryGridProps) {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [query, setQuery]     = useState("");
  const [ageIdx, setAgeIdx]   = useState(0);
  const [level, setLevel]     = useState<typeof LEVELS[number]>("all");

  useEffect(() => {
    const map: Record<string, number> = {};
    books.forEach(book => {
      try {
        const saved = localStorage.getItem(`wk_progress_${book.id}`);
        if (saved) {
          const idx = parseInt(saved, 10);
          if (!isNaN(idx) && idx > 0) map[book.id] = idx;
        }
      } catch { /* private mode */ }
    });
    setProgressMap(map);
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const { min, max } = AGE_RANGES[ageIdx];
    return books.filter(b => {
      if (q && !b.title.toLowerCase().includes(q) && !(b.description ?? "").toLowerCase().includes(q)) return false;
      if (b.age_max < min || b.age_min > max) return false;
      if (level !== "all" && b.reading_level !== level) return false;
      return true;
    });
  }, [books, query, ageIdx, level]);

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          placeholder="Search books…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] bg-white"
        />
        <div className="flex gap-1.5 flex-wrap">
          {AGE_RANGES.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setAgeIdx(i)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-colors"
              style={{
                background: ageIdx === i ? "#6C63FF" : "white",
                color: ageIdx === i ? "white" : "#6b7280",
                border: `1.5px solid ${ageIdx === i ? "#6C63FF" : "#e5e7eb"}`,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-colors"
              style={{
                background: level === l ? "#06D6A0" : "white",
                color: level === l ? "white" : "#6b7280",
                border: `1.5px solid ${level === l ? "#06D6A0" : "#e5e7eb"}`,
              }}
            >
              {l === "all" ? "All levels" : LEVEL_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-semibold">No books match your filters.</p>
          <button
            onClick={() => { setQuery(""); setAgeIdx(0); setLevel("all"); }}
            className="text-[#6C63FF] text-sm font-bold hover:underline mt-2 block mx-auto"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(book => {
            const subject = book.subjects as Subject | null;
            const coverBg = `#${book.cover_color}`;
            const savedIdx = progressMap[book.id];
            const pct = savedIdx && book.page_count > 1
              ? Math.round((savedIdx / (book.page_count - 1)) * 100)
              : 0;

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
              >
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${coverBg}dd, ${coverBg}99)`,
                    aspectRatio: book.cover_image_url ? "3/4" : "5/3",
                  }}
                >
                  {book.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-white px-4">
                      <div className="text-4xl mb-2">{subject?.emoji ?? "📖"}</div>
                      <p className="font-extrabold text-sm leading-tight">{book.title}</p>
                    </div>
                  )}
                  {book.is_free && (
                    <div className="absolute top-3 right-3 bg-[#06D6A0] text-white text-xs font-extrabold px-2.5 py-1 rounded-full">FREE</div>
                  )}
                  {subject && (
                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {subject.emoji} {subject.name}
                    </div>
                  )}
                  {pct > 0 && pct < 100 && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#6C63FF] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-[#6C63FF] whitespace-nowrap">{pct}%</span>
                      </div>
                    </div>
                  )}
                  {pct >= 100 && (
                    <div className="absolute bottom-3 right-3 bg-[#06D6A0] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">✓ Read</div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-[#24304A] text-base mb-1 leading-snug">{book.title}</h3>
                  {book.subtitle && <p className="text-xs text-[#6C63FF] font-semibold mb-2">{book.subtitle}</p>}
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">{book.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>Ages {book.age_min}–{book.age_max}</span>
                    <span>{LEVEL_LABEL[book.reading_level] ?? book.reading_level}</span>
                    <span>{book.page_count} pages</span>
                  </div>
                  <Link
                    href={`/library/${book.slug}`}
                    className="block text-center font-bold py-2.5 rounded-xl text-sm transition-colors text-white"
                    style={{ background: "#6C63FF" }}
                  >
                    {pct >= 100 ? "📖 Read Again" : pct > 0 ? "▶ Continue Reading" : "📖 Read Now — Free"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
