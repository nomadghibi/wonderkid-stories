"use client";

import Image from "next/image";
import type { BookReaderPage, FontSize, FontFamily } from "@/types/reader";
import { FONT_SIZE_PX, FONT_FAMILY_CSS } from "@/types/reader";

interface BookPageProps {
  page: BookReaderPage;
  fontSize: FontSize;
  fontFamily?: FontFamily;
  bookId?: string;
  side?: "left" | "right" | "single";
  pageLabel?: string;
}

const PAGE_BG = "#FFFEF9";

function resolveImageUrl(page: BookReaderPage, bookId?: string): string {
  if (!page.imageUrl) {
    const label = encodeURIComponent(page.title || "WonderKid Stories");
    const palettes: Record<string, string> = {
      cover: "6C63FF/FFFFFF",
      dedication: "FFD166/24304A",
      certificate: "06D6A0/FFFFFF",
    };
    const p = palettes[page.pageType] ?? "A594FF/FFFFFF";
    return `https://placehold.co/800x520/${p}?text=${label}`;
  }
  if (page.imageUrl.startsWith("http")) return page.imageUrl;
  if (bookId && page.pageId) return `/api/books/${bookId}/page-image/${page.pageId}`;
  return page.imageUrl;
}

function CertificatePage({ page, fontSize, fontFamily }: {
  page: BookReaderPage; fontSize: FontSize; fontFamily?: FontFamily;
}) {
  const ff = fontFamily ? FONT_FAMILY_CSS[fontFamily] : "var(--font-nunito)";
  const fs = FONT_SIZE_PX[fontSize];
  return (
    <div
      className="h-full flex flex-col items-center justify-center p-6 text-center"
      style={{ fontFamily: ff, background: PAGE_BG }}
    >
      <div className="text-5xl mb-4">🏅</div>
      <div
        className="border-4 border-[#FFD166] rounded-2xl p-6 w-full max-w-xs"
        style={{ background: "white", boxShadow: "0 0 0 6px #FFF8ED, 0 0 0 8px #FFD166" }}
      >
        <p className="text-xs font-extrabold text-[#6C63FF] uppercase tracking-widest mb-3">
          Certificate of Achievement
        </p>
        <h2
          className="font-extrabold text-[#24304A] leading-tight mb-3"
          style={{ fontSize: fs + 2 }}
        >
          {page.title ?? "Adventure Complete!"}
        </h2>
        {page.text && (
          <p
            className="text-[#24304A] leading-relaxed"
            style={{ fontSize: fs - 2, overflow: "hidden" }}
          >
            {page.text}
          </p>
        )}
        <div className="mt-5 flex justify-center gap-1.5 text-xl">⭐⭐⭐</div>
      </div>
    </div>
  );
}

function DedicationPage({ page, fontSize, fontFamily }: {
  page: BookReaderPage; fontSize: FontSize; fontFamily?: FontFamily;
}) {
  const ff = fontFamily ? FONT_FAMILY_CSS[fontFamily] : "var(--font-nunito)";
  const fs = FONT_SIZE_PX[fontSize];
  return (
    <div
      className="h-full flex flex-col items-center justify-center p-8 text-center"
      style={{ fontFamily: ff, background: "linear-gradient(135deg, #f9f0ff 0%, #FFF8ED 100%)" }}
    >
      <div className="text-4xl mb-5">💜</div>
      <p className="text-xs font-extrabold text-[#6C63FF] uppercase tracking-widest mb-4">
        A Special Message
      </p>
      <p
        className="text-[#24304A] italic max-w-[240px] leading-relaxed"
        style={{ fontSize: fs - 2, lineHeight: 1.7, overflow: "hidden" }}
      >
        {page.text}
      </p>
    </div>
  );
}

export default function BookPage({
  page,
  fontSize,
  fontFamily,
  bookId,
  side = "single",
  pageLabel,
}: BookPageProps) {
  if (page.pageType === "certificate") {
    return <CertificatePage page={page} fontSize={fontSize} fontFamily={fontFamily} />;
  }
  if (page.pageType === "dedication") {
    return <DedicationPage page={page} fontSize={fontSize} fontFamily={fontFamily} />;
  }

  const imageUrl = resolveImageUrl(page, bookId);
  const isCover = page.pageType === "cover";
  const fs = FONT_SIZE_PX[fontSize];
  const ff = fontFamily ? FONT_FAMILY_CSS[fontFamily] : "var(--font-nunito)";

  // Image-only / full-page: image fills entire page, no text panel (text embedded in image)
  if (page.layoutType === "full_page" || page.layoutType === "image_only" || page.hasEmbeddedText) {
    return (
      <div
        className="relative overflow-hidden select-none"
        style={{ height: "100%", width: "100%", background: "#000" }}
      >
        <Image
          src={imageUrl}
          alt={page.title ?? `Page ${page.pageNumber}`}
          fill
          className="object-contain"
          unoptimized
          priority={isCover}
        />
        {/* Page label */}
        {pageLabel && (
          <div
            className={`absolute bottom-1.5 text-[10px] text-white/60 font-medium tabular-nums backdrop-blur-sm px-1 rounded ${
              side === "left" ? "left-2.5" : "right-2.5"
            }`}
          >
            {pageLabel}
          </div>
        )}
      </div>
    );
  }

  // Image takes exactly 62% (cover 67%), text takes rest — no overflow
  const imagePercent = isCover ? 67 : 62;
  const textPercent = 100 - imagePercent;

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        height: "100%",
        width: "100%",
        background: PAGE_BG,
        fontFamily: ff,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Illustration — fixed height */}
      <div
        className="relative flex-shrink-0 bg-gray-100 overflow-hidden"
        style={{ height: `${imagePercent}%` }}
      >
        <Image
          src={imageUrl}
          alt={page.title ?? `Page ${page.pageNumber}`}
          fill
          className="object-cover"
          unoptimized
          priority={isCover}
        />
        {isCover && (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)" }}
          />
        )}
        {isCover && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h1
              className="font-extrabold text-white leading-tight drop-shadow-lg"
              style={{ fontSize: fs + 4 }}
            >
              {page.title}
            </h1>
          </div>
        )}
      </div>

      {/* Text — fixed height, NO overflow scroll */}
      <div
        className="flex-shrink-0 relative"
        style={{
          height: `${textPercent}%`,
          padding: side === "single" ? "14px 18px 10px" : "10px 14px 8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!isCover && page.title && (
          <h2
            className="font-extrabold text-[#24304A] leading-snug mb-1.5 flex-shrink-0"
            style={{
              fontSize: Math.min(fs, 20),
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {page.title}
          </h2>
        )}
        {page.text && !isCover && (
          <p
            className="text-[#24304A] flex-1"
            style={{
              fontSize: fs,
              lineHeight: 1.6,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: Math.floor((textPercent / 100) * 520 / (fs * 1.6)) - (page.title ? 2 : 0),
            } as React.CSSProperties}
          >
            {page.text}
          </p>
        )}
      </div>

      {/* Page label (bottom corner) */}
      {pageLabel && !isCover && (
        <div
          className={`absolute bottom-1.5 text-[10px] text-gray-300 font-medium tabular-nums ${
            side === "left" ? "left-2.5" : "right-2.5"
          }`}
        >
          {pageLabel}
        </div>
      )}

      {/* Gutter shadow */}
      {side === "left" && (
        <div
          className="absolute right-0 top-0 bottom-0 w-5 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(0,0,0,0.08), transparent)" }}
        />
      )}
      {side === "right" && (
        <div
          className="absolute left-0 top-0 bottom-0 w-5 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.08), transparent)" }}
        />
      )}
    </div>
  );
}
