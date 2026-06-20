"use client";

import type { BookReaderPage, FontSize } from "@/types/reader";
import BookPage from "./BookPage";

interface BookSpreadProps {
  leftPage: BookReaderPage | null;
  rightPage: BookReaderPage | null;
  fontSize: FontSize;
  bookId?: string;
  displayNumbers: [number | undefined, number | undefined];
  totalStoryPages: number;
  animKey: number;
  animDirection: "next" | "prev" | null;
}

export default function BookSpread({
  leftPage,
  rightPage,
  fontSize,
  bookId,
  displayNumbers,
  totalStoryPages,
  animKey,
  animDirection,
}: BookSpreadProps) {
  const animClass =
    animDirection === "next"
      ? "spread-enter-next"
      : animDirection === "prev"
      ? "spread-enter-prev"
      : "";

  return (
    <>
      <style>{`
        @keyframes spreadFromRight {
          from { transform: translateX(22px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes spreadFromLeft {
          from { transform: translateX(-22px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .spread-enter-next { animation: spreadFromRight 0.28s ease-out; }
        .spread-enter-prev { animation: spreadFromLeft  0.28s ease-out; }
      `}</style>

      <div
        key={animKey}
        className={`relative flex rounded-lg overflow-hidden ${animClass}`}
        style={{
          width: "min(92vw, 1060px)",
          height: "min(66vh, 620px)",
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        {/* Left page */}
        <div className="w-1/2 h-full border-r border-gray-200 relative">
          {leftPage ? (
            <BookPage
              page={leftPage}
              fontSize={fontSize}
              bookId={bookId}
              side="left"
              displayNumber={displayNumbers[0]}
              totalPages={totalStoryPages}
            />
          ) : (
            <div className="h-full bg-white flex items-center justify-center">
              <span className="text-gray-100 text-6xl">📖</span>
            </div>
          )}
        </div>

        {/* Center gutter */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.03) 30%, rgba(0,0,0,0.03) 70%, rgba(0,0,0,0.07) 100%)",
          }}
        />

        {/* Right page */}
        <div className="w-1/2 h-full relative">
          {rightPage ? (
            <BookPage
              page={rightPage}
              fontSize={fontSize}
              bookId={bookId}
              side="right"
              displayNumber={displayNumbers[1]}
              totalPages={totalStoryPages}
            />
          ) : (
            <div className="h-full bg-white" />
          )}
        </div>

        {/* Outer page shadow (bottom) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.08), transparent)",
          }}
        />
      </div>
    </>
  );
}
