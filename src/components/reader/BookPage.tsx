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
  displayNumber?: number;
  totalPages?: number;
}

function resolveImageUrl(page: BookReaderPage, bookId?: string): string {
  if (!page.imageUrl) {
    const label = encodeURIComponent(page.title || "WonderKid Stories");
    const colors: Record<string, string> = {
      cover: "6C63FF/FFFFFF",
      dedication: "FFD166/24304A",
      certificate: "06D6A0/FFFFFF",
    };
    const palette = colors[page.pageType] ?? "6C63FF/FFFFFF";
    return `https://placehold.co/800x500/${palette}?text=${label}`;
  }
  if (page.imageUrl.startsWith("http")) return page.imageUrl;
  if (bookId && page.pageId) {
    return `/api/books/${bookId}/page-image/${page.pageId}`;
  }
  return page.imageUrl;
}

function CertificatePage({ page, fontSize, fontFamily }: { page: BookReaderPage; fontSize: FontSize; fontFamily?: FontFamily }) {
  const ff = fontFamily ? FONT_FAMILY_CSS[fontFamily] : "'Nunito', sans-serif";
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8ED] to-yellow-50 p-8 text-center" style={{ fontFamily: ff }}>
      <div className="text-6xl mb-4">🏅</div>
      <div
        className="border-4 border-[#FFD166] rounded-2xl p-8 max-w-sm w-full bg-white/80"
        style={{ boxShadow: "0 0 0 8px #FFF8ED, 0 0 0 10px #FFD166" }}
      >
        <p className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-3">
          Certificate of Achievement
        </p>
        <h2
          className="font-extrabold text-[#24304A] mb-4 leading-tight"
          style={{ fontSize: FONT_SIZE_PX[fontSize] + 4 }}
        >
          {page.title ?? "Adventure Complete!"}
        </h2>
        {page.text && (
          <p
            className="text-[#24304A] leading-relaxed"
            style={{ fontSize: FONT_SIZE_PX[fontSize] - 2 }}
          >
            {page.text}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2 text-2xl">
          ⭐ ⭐ ⭐
        </div>
      </div>
    </div>
  );
}

function DedicationPage({ page, fontSize, fontFamily }: { page: BookReaderPage; fontSize: FontSize; fontFamily?: FontFamily }) {
  const ff = fontFamily ? FONT_FAMILY_CSS[fontFamily] : "'Nunito', sans-serif";
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-[#FFF8ED] p-10 text-center" style={{ fontFamily: ff }}>
      <div className="text-4xl mb-6">💜</div>
      <p className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-4">
        A Special Message
      </p>
      <p
        className="text-[#24304A] leading-relaxed italic max-w-xs"
        style={{ fontSize: FONT_SIZE_PX[fontSize], lineHeight: 1.7 }}
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
  displayNumber,
  totalPages,
}: BookPageProps) {
  if (page.pageType === "certificate") {
    return <CertificatePage page={page} fontSize={fontSize} fontFamily={fontFamily} />;
  }

  if (page.pageType === "dedication") {
    return <DedicationPage page={page} fontSize={fontSize} fontFamily={fontFamily} />;
  }

  const imageUrl = resolveImageUrl(page, bookId);
  const isCover = page.pageType === "cover";
  const textSize = FONT_SIZE_PX[fontSize];
  const ff = fontFamily ? FONT_FAMILY_CSS[fontFamily] : "'Nunito', sans-serif";

  return (
    <div
      className="h-full flex flex-col bg-white relative overflow-hidden select-none"
      style={{ fontFamily: ff }}
    >
      {/* Illustration */}
      <div
        className="relative flex-shrink-0 bg-gray-50 overflow-hidden"
        style={{ height: isCover ? "65%" : "58%" }}
      >
        <Image
          src={imageUrl}
          alt={page.title ?? `Page ${page.pageNumber}`}
          fill
          className="object-cover"
          unoptimized
          priority={page.pageType === "cover"}
        />
        {isCover && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        )}
        {isCover && (
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1
              className="font-extrabold leading-tight drop-shadow-lg"
              style={{ fontSize: textSize + 6 }}
            >
              {page.title}
            </h1>
          </div>
        )}
      </div>

      {/* Text area */}
      <div className="flex-1 px-5 py-4 overflow-y-auto flex flex-col justify-center">
        {!isCover && page.title && (
          <h2
            className="font-extrabold text-[#24304A] mb-2 leading-snug"
            style={{ fontSize: textSize + 2 }}
          >
            {page.title}
          </h2>
        )}
        {page.text && (
          <p
            className="text-[#24304A]"
            style={{ fontSize: textSize, lineHeight: 1.65 }}
          >
            {page.text}
          </p>
        )}
      </div>

      {/* Page number */}
      {displayNumber !== undefined && totalPages !== undefined && !isCover && (
        <div
          className={`absolute bottom-2 text-xs text-gray-300 font-medium ${
            side === "left" ? "left-3" : "right-3"
          }`}
        >
          {displayNumber} / {totalPages}
        </div>
      )}

      {/* Left/right page edge shadow (gutter side) */}
      {side === "left" && (
        <div className="absolute right-0 top-0 bottom-0 w-4 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(0,0,0,0.06), transparent)" }} />
      )}
      {side === "right" && (
        <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.06), transparent)" }} />
      )}
    </div>
  );
}
