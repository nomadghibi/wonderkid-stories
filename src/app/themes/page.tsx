import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { BookTemplate } from "@/types/template";

const CATEGORY_EMOJI: Record<string, string> = {
  Sports: "⚾",
  Fantasy: "🌲",
  Adventure: "🚀",
  Science: "🔬",
  Animals: "🐾",
  "Underwater Explorer": "🐠",
  "Superhero Academy": "🦸",
  "Dinosaur Discovery": "🦕",
};

const SLUG_EMOJI: Record<string, string> = {
  "baseball-hero": "⚾",
  "magical-forest": "🌲",
  "space-explorer": "🚀",
  "underwater-explorer": "🐠",
  "superhero-academy": "🦸",
  "dinosaur-discovery": "🦕",
};

const GRADIENT_BY_CATEGORY: Record<string, string> = {
  Sports: "from-green-50 to-emerald-100",
  Fantasy: "from-purple-50 to-violet-100",
  Adventure: "from-blue-50 to-indigo-100",
  default: "from-purple-50 to-blue-50",
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ThemesPage() {
  const supabase = await createServiceClient();
  const { data: templates } = await supabase
    .from("book_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const catalog = (templates ?? []) as BookTemplate[];

  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      {/* Nav */}
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

      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-block bg-[#6C63FF]/10 text-[#6C63FF] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {catalog.length} Adventure{catalog.length !== 1 ? "s" : ""} Available
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#24304A] mb-4 leading-tight">
            Choose Your Child's Adventure
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Each book is fully personalized for your child — their name, their photo, their story. Preview any template for free before buying.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {catalog.map((template) => {
            const emoji = SLUG_EMOJI[template.slug] ?? CATEGORY_EMOJI[template.category ?? ""] ?? "📖";
            const gradient = GRADIENT_BY_CATEGORY[template.category ?? ""] ?? GRADIENT_BY_CATEGORY.default;

            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
              >
                {/* Cover area */}
                <div className={`bg-gradient-to-br ${gradient} h-36 flex items-center justify-center relative`}>
                  {template.sample_cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={template.sample_cover_url}
                      alt={template.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl">{emoji}</span>
                  )}
                  <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-xs font-bold text-gray-600 px-2.5 py-1 rounded-full">
                    {template.category ?? "Adventure"}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#6C63FF] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {formatPrice(template.price_cents)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-extrabold text-[#24304A] text-lg mb-1">{template.title}</h3>
                  {template.subtitle && (
                    <p className="text-[#6C63FF] text-xs font-semibold mb-2">{template.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{template.description}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                    <span>Ages {template.age_min}–{template.age_max}</span>
                    <span>{template.page_count} illustrated pages</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/themes/${template.slug}/preview`}
                      className="flex-1 text-center border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/5 font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      👁 Preview
                    </Link>
                    <Link
                      href={`/register?template=${template.slug}`}
                      className="flex-1 text-center bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      Create Book →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Placeholder "coming soon" card */}
          <div className="bg-white/50 rounded-2xl border border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-400 mb-2">More Coming Soon</h3>
            <p className="text-sm text-gray-400 mb-4">
              Princess Adventure, Dinosaur Quest, Birthday Adventure, and more are on the way.
            </p>
            <Link
              href="/register"
              className="text-sm font-bold text-[#6C63FF] hover:opacity-80"
            >
              Get notified →
            </Link>
          </div>
        </div>

        {/* How it works strip */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8">
          <h2 className="text-center font-extrabold text-[#24304A] text-xl mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "📖", title: "Choose a Template", desc: "Pick the adventure that fits your child best." },
              { step: "2", icon: "👦", title: "Add Your Child", desc: "Enter name, age, preferences and upload a photo." },
              { step: "3", icon: "⚡", title: "AI Personalizes It", desc: "We generate a custom story and illustrations in minutes." },
              { step: "4", icon: "📥", title: "Review & Download", desc: "Read the book online, approve, and download your PDF." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-[#6C63FF] text-white font-extrabold text-sm rounded-full flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-[#24304A] text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#6C63FF] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Ready to create a story?</h2>
          <p className="text-purple-200 mb-6 text-sm">Preview any book free. Create your child's personalized version from $14.99.</p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#6C63FF] font-extrabold px-8 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </main>
  );
}
