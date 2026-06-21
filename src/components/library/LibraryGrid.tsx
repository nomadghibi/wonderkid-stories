"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LibraryBook, Subject } from "@/types/library";

const READING_LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  early_reader: "Early Reader",
  reader: "Reader",
};

interface LibraryGridProps {
  books: LibraryBook[];
}

export default function LibraryGrid({ books }: LibraryGridProps) {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

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

  if (books.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">📭</div>
        <p className="font-semibold">No books in this category yet.</p>
        <Link href="/library" className="text-[#6C63FF] text-sm font-bold hover:underline mt-2 inline-block">
          View all books →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => {
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
            {/* Cover */}
            <div
              className="relative overflow-hidden flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${coverBg}dd, ${coverBg}99)`,
                aspectRatio: book.cover_image_url ? "3/4" : "5/3",
              }}
            >
              {book.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-white px-4">
                  <div className="text-4xl mb-2">{subject?.emoji ?? "📖"}</div>
                  <p className="font-extrabold text-sm leading-tight">{book.title}</p>
                </div>
              )}

              {/* Free badge */}
              {book.is_free && (
                <div className="absolute top-3 right-3 bg-[#06D6A0] text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                  FREE
                </div>
              )}

              {/* Subject badge */}
              {subject && (
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {subject.emoji} {subject.name}
                </div>
              )}

              {/* In-progress badge */}
              {pct > 0 && pct < 100 && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6C63FF] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#6C63FF] whitespace-nowrap">{pct}%</span>
                  </div>
                </div>
              )}

              {/* Finished badge */}
              {pct >= 100 && (
                <div className="absolute bottom-3 right-3 bg-[#06D6A0] text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                  ✓ Read
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-extrabold text-[#24304A] text-base mb-1 leading-snug">
                {book.title}
              </h3>
              {book.subtitle && (
                <p className="text-xs text-[#6C63FF] font-semibold mb-2">{book.subtitle}</p>
              )}
              <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">
                {book.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Ages {book.age_min}–{book.age_max}</span>
                <span>{READING_LEVEL_LABEL[book.reading_level] ?? book.reading_level}</span>
                <span>{book.page_count} pages</span>
              </div>

              {/* CTA */}
              <Link
                href={`/library/${book.slug}`}
                className="block text-center font-bold py-2.5 rounded-xl text-sm transition-colors text-white"
                style={{ background: pct > 0 && pct < 100 ? "#6C63FF" : "#6C63FF" }}
              >
                {pct >= 100 ? "📖 Read Again" : pct > 0 ? "▶ Continue Reading" : "📖 Read Now — Free"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
