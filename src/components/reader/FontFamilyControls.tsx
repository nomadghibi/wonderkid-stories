"use client";

import { useState } from "react";
import type { FontFamily } from "@/types/reader";
import {
  FONT_FAMILIES,
  FONT_FAMILY_LABEL,
  FONT_FAMILY_CSS,
  FONT_FAMILY_DESC,
} from "@/types/reader";

interface FontFamilyControlsProps {
  value: FontFamily;
  onChange: (f: FontFamily) => void;
}

export default function FontFamilyControls({ value, onChange }: FontFamilyControlsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-600 transition-colors"
        title="Change reading font"
        style={{ fontFamily: FONT_FAMILY_CSS[value] }}
      >
        <span style={{ fontFamily: FONT_FAMILY_CSS[value] }}>Aa</span>
        <span className="hidden sm:inline text-gray-400">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 min-w-[220px]">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 px-1">
              Reading Font
            </p>
            <div className="flex flex-col gap-1">
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font}
                  onClick={() => { onChange(font); setOpen(false); }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                    value === font
                      ? "bg-[#6C63FF]/10 text-[#6C63FF]"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div>
                    <span
                      className="block font-semibold text-base leading-tight"
                      style={{ fontFamily: FONT_FAMILY_CSS[font] }}
                    >
                      {FONT_FAMILY_LABEL[font]}
                    </span>
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {FONT_FAMILY_DESC[font]}
                    </span>
                  </div>
                  <span
                    className="text-lg ml-3 text-gray-500 flex-shrink-0"
                    style={{ fontFamily: FONT_FAMILY_CSS[font] }}
                  >
                    Aa
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
