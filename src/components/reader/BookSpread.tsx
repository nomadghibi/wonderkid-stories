"use client";

import type { BookReaderPage, FontSize, FontFamily } from "@/types/reader";
import BookPage from "./BookPage";

type HighlightProps = { textHighlight?: { charStart: number; charEnd: number }; titleHighlight?: { charStart: number; charEnd: number } };

interface BookSpreadProps {
  leftPage: BookReaderPage | null;
  rightPage: BookReaderPage | null;
  fontSize: FontSize;
  fontFamily?: FontFamily;
  bookId?: string;
  leftLabel?: string;
  rightLabel?: string;
  animKey: number;
  animDirection: "next" | "prev" | null;
  nightMode?: boolean;
  leftHighlight?: HighlightProps;
  rightHighlight?: HighlightProps;
}

export default function BookSpread({
  leftPage,
  rightPage,
  fontSize,
  fontFamily,
  bookId,
  leftLabel,
  rightLabel,
  animKey,
  animDirection,
  nightMode,
  leftHighlight,
  rightHighlight,
}: BookSpreadProps) {
  const cls =
    animDirection === "next"
      ? "spread-next"
      : animDirection === "prev"
      ? "spread-prev"
      : "";

  return (
    <>
      <style>{`
        @keyframes sNext { from { transform: translateX(18px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes sPrev { from { transform: translateX(-18px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .spread-next { animation: sNext 0.25s cubic-bezier(0.22,1,0.36,1); }
        .spread-prev { animation: sPrev 0.25s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {/* Outer book shadow */}
      <div
        key={animKey}
        className={cls}
        style={{
          width: "min(94vw, 1080px)",
          height: "min(72vh, 640px)",
          minHeight: 380,
          display: "flex",
          borderRadius: 4,
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.18), 0 28px 56px rgba(0,0,0,0.12)",
          position: "relative",
        }}
      >
        {/* Left page */}
        <div
          style={{
            width: "50%",
            height: "100%",
            borderRadius: "4px 0 0 4px",
            overflow: "hidden",
            boxShadow: "inset -1px 0 0 rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          {leftPage ? (
            <BookPage
              page={leftPage}
              fontSize={fontSize}
              fontFamily={fontFamily}
              bookId={bookId}
              side="left"
              pageLabel={leftLabel}
              nightMode={nightMode}
              {...leftHighlight}
            />
          ) : (
            <div
              style={{
                height: "100%",
                background: nightMode ? "#1e1a14" : "#FFFEF9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 40, opacity: 0.08 }}>📖</span>
            </div>
          )}
        </div>

        {/* Center gutter */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            bottom: 0,
            width: 10,
            pointerEvents: "none",
            zIndex: 2,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/* Right page */}
        <div
          style={{
            width: "50%",
            height: "100%",
            borderRadius: "0 4px 4px 0",
            overflow: "hidden",
            boxShadow: "inset 1px 0 0 rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          {rightPage ? (
            <BookPage
              page={rightPage}
              fontSize={fontSize}
              fontFamily={fontFamily}
              bookId={bookId}
              side="right"
              pageLabel={rightLabel}
              nightMode={nightMode}
              {...rightHighlight}
            />
          ) : (
            <div style={{ height: "100%", background: nightMode ? "#1e1a14" : "#FFFEF9" }} />
          )}
        </div>

        {/* Bottom page-edge shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            borderRadius: "0 0 4px 4px",
            pointerEvents: "none",
            background: "linear-gradient(to top, rgba(0,0,0,0.1), transparent)",
          }}
        />
      </div>
    </>
  );
}
