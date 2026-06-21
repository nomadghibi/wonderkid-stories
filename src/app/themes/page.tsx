import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { BookTemplate } from "@/types/template";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const SLUG_EMOJI: Record<string, string> = {
  "baseball-hero":      "⚾",
  "magical-forest":     "🌲",
  "space-explorer":     "🚀",
  "underwater-explorer":"🐠",
  "superhero-academy":  "🦸",
  "dinosaur-discovery": "🦕",
};

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  Sports:    { bg: "#DCFCE7", color: "#166534" },
  Fantasy:   { bg: "#EDE9FE", color: "#5B21B6" },
  Adventure: { bg: "#DBEAFE", color: "#1E40AF" },
  Science:   { bg: "#FEF9C3", color: "#854D0E" },
  Animals:   { bg: "#FFE4E6", color: "#9F1239" },
};

const CARD_GRADIENT: Record<string, string> = {
  Sports:    "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)",
  Fantasy:   "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)",
  Adventure: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
  Science:   "linear-gradient(135deg, #fef9c3 0%, #fde047 100%)",
  Animals:   "linear-gradient(135deg, #ffe4e6 0%, #fda4af 100%)",
  default:   "linear-gradient(135deg, #ede9fe 0%, #a5b4fc 100%)",
};

const STEPS = [
  { n: "1", icon: "🎭", title: "Pick an adventure",  desc: "Choose the theme that fits your child's personality." },
  { n: "2", icon: "👧", title: "Add your child",     desc: "Name, age, photo, favorites — takes 2 minutes." },
  { n: "3", icon: "✨", title: "AI builds the book", desc: "Custom story and illustrations created just for them." },
  { n: "4", icon: "📥", title: "Read & download",    desc: "Read online instantly, approve, then download your PDF." },
];

function BookStack() {
  return (
    <div className="relative w-80 h-96 flex items-center justify-center select-none">
      {/* Back book */}
      <div
        className="absolute rounded-2xl shadow-2xl"
        style={{
          width: 200, height: 260,
          background: "linear-gradient(135deg, #A594FF 0%, #6C63FF 100%)",
          transform: "rotate(-8deg) translateX(-20px) translateY(10px)",
        }}
      />
      {/* Middle book */}
      <div
        className="absolute rounded-2xl shadow-2xl flex items-center justify-center"
        style={{
          width: 200, height: 260,
          background: "linear-gradient(135deg, #FFD166 0%, #F59E0B 100%)",
          transform: "rotate(4deg) translateX(15px)",
        }}
      >
        <span className="text-6xl">🌲</span>
      </div>
      {/* Front book */}
      <div
        className="absolute rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3"
        style={{
          width: 200, height: 260,
          background: "linear-gradient(135deg, #06D6A0 0%, #059669 100%)",
          transform: "rotate(-2deg) translateX(-5px) translateY(-8px)",
        }}
      >
        <span className="text-6xl">🚀</span>
        <div className="text-white text-center px-4">
          <p className="font-extrabold text-sm leading-tight">Zoe&#39;s Space Adventure</p>
          <p className="text-xs text-white/70 mt-1">A story just for her</p>
        </div>
      </div>
      {/* Sparkles */}
      <span className="absolute -top-4 -right-2 text-3xl">✨</span>
      <span className="absolute -bottom-2 -left-4 text-2xl">⭐</span>
    </div>
  );
}

export default async function ThemesPage() {
  const supabase = await createServiceClient();
  const { data: templates } = await supabase
    .from("book_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const catalog = (templates ?? []) as BookTemplate[];
  const heroCovers = catalog.filter(t => t.sample_cover_url).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#FFF8ED] overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-[#FFD166]/30">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
        <div className="flex gap-3 items-center">
          <Link href="/library" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium hidden sm:block">
            📚 Free Books
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FFD166]/30 text-[#856015] text-sm font-extrabold px-4 py-1.5 rounded-full mb-6">
            ⭐ Loved by 500+ families
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#24304A] leading-[1.08] mb-6">
            Your child.<br />
            Their story.<br />
            <span className="text-[#6C63FF]">Their book.</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
            A fully personalized illustrated storybook — your child's name, photo, and adventure. Created by AI in minutes. Loved forever.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="#templates"
              className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-extrabold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-purple-200/60 active:scale-95"
            >
              Choose an Adventure ↓
            </Link>
            <Link
              href="/library"
              className="border-2 border-gray-200 hover:border-[#6C63FF] text-gray-600 hover:text-[#6C63FF] font-bold px-6 py-4 rounded-2xl text-base transition-colors"
            >
              📚 Read Free Books
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400 font-medium">
            <span>⭐⭐⭐⭐⭐ 4.9 / 5</span>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <span>📥 Download in minutes</span>
            <span className="text-gray-200 hidden sm:inline">|</span>
            <span>✅ 100% satisfaction</span>
          </div>
        </div>

        {/* Right: cover collage or decorative book stack */}
        <div className="hidden md:flex items-center justify-center">
          {heroCovers.length >= 2 ? (
            <div className="grid grid-cols-2 gap-4">
              {heroCovers.map((t, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={t.id}
                  src={t.sample_cover_url!}
                  alt={t.title}
                  className="w-full rounded-2xl shadow-xl object-cover"
                  style={{ aspectRatio: "3/4", transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(1.5deg)" }}
                />
              ))}
            </div>
          ) : (
            <BookStack />
          )}
        </div>
      </section>

      {/* ── Template grid ────────────────────────────────────────────────── */}
      <section id="templates" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#24304A] mb-2">
            Choose your adventure
          </h2>
          <p className="text-gray-500">
            Preview any book free — no account needed
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {catalog.map((template) => {
            const emoji = SLUG_EMOJI[template.slug] ?? "📖";
            const badge = CATEGORY_BADGE[template.category ?? ""] ?? { bg: "#EDE9FE", color: "#5B21B6" };

            return (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Cover — portrait book ratio */}
                <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "3/4" }}>
                  {template.sample_cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={template.sample_cover_url}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: CARD_GRADIENT[template.category ?? ""] ?? CARD_GRADIENT.default }}
                    >
                      <span className="text-[96px] leading-none drop-shadow-md">{emoji}</span>
                    </div>
                  )}

                  {/* Category badge */}
                  <span
                    className="absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {template.category ?? "Adventure"}
                  </span>

                  {/* Price badge */}
                  <span className="absolute top-3 right-3 bg-white/95 text-[#6C63FF] text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                    {formatPrice(template.price_cents)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-[#24304A] text-[17px] leading-snug mb-1">
                    {template.title}
                  </h3>
                  {template.subtitle && (
                    <p className="text-xs text-[#6C63FF] font-semibold mb-1.5">{template.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <span>Ages {template.age_min}–{template.age_max}</span>
                    <span>·</span>
                    <span>{template.page_count} illustrated pages</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/themes/${template.slug}/preview`}
                      className="flex-1 text-center border-2 border-[#6C63FF]/25 text-[#6C63FF] hover:border-[#6C63FF] font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Preview free
                    </Link>
                    <Link
                      href={`/register?template=${template.slug}`}
                      className="flex-1 text-center bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Create book →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Coming soon card */}
          <div className="rounded-3xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-3">🎨</div>
            <h3 className="font-extrabold text-gray-400 mb-1">More coming soon</h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Princess, Dinosaur, Birthday and more adventures on the way
            </p>
            <Link
              href="/register"
              className="text-sm font-bold text-[#6C63FF] hover:opacity-75 transition-opacity"
            >
              Get notified →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#24304A] text-center mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.n} className="text-center relative">
                {/* Connecting line */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-5 left-1/2 w-full h-0 border-t-2 border-dashed border-[#6C63FF]/20 pointer-events-none"
                    style={{ marginLeft: "20px" }}
                  />
                )}
                {/* Step number */}
                <div className="w-10 h-10 bg-[#6C63FF] text-white font-extrabold text-sm rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-md shadow-purple-200/50">
                  {s.n}
                </div>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-extrabold text-[#24304A] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: "🎨", title: "Real illustrations", desc: "Every page has a unique AI-generated illustration tailored to your child." },
            { icon: "⚡", title: "Ready in minutes", desc: "From order to finished book in under 5 minutes. Preview before you pay." },
            { icon: "💜", title: "Loved by families", desc: "Over 500 personalized books created. 4.9 ★ average rating from parents." },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-extrabold text-[#24304A] mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div
          className="rounded-3xl p-12 text-center text-white"
          style={{ background: "linear-gradient(135deg, #6C63FF 0%, #5A52E0 100%)" }}
        >
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-3xl font-extrabold mb-3">
            Create their story today
          </h2>
          <p className="text-purple-200 mb-8 max-w-sm mx-auto leading-relaxed">
            Preview any book for free. Personalized versions from {formatPrice(1499)}.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#6C63FF] font-extrabold px-10 py-4 rounded-2xl hover:bg-purple-50 transition-colors shadow-xl text-base"
          >
            Get Started Free →
          </Link>
          <p className="text-purple-300/70 text-xs mt-4">No account needed to preview</p>
        </div>
      </section>
    </main>
  );
}
