import Link from "next/link";
import { SEED_THEMES, THEME_EMOJIS } from "@/config/themes";

export default function ThemesPage() {
  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-[#6C63FF] font-medium">Log in</Link>
          <Link href="/register" className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-[#24304A] mb-4">Story Adventures</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Every child has a different dream. Choose the adventure that fits yours.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {SEED_THEMES.map((theme) => (
            <div key={theme.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 h-32 flex items-center justify-center text-6xl">
                {THEME_EMOJIS[theme.slug] ?? "📖"}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-extrabold text-[#24304A]">{theme.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{theme.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                  <span>Ages {theme.age_min}–{theme.age_max}</span>
                  <span>{theme.page_count} illustrated pages</span>
                </div>
                <Link
                  href="/register"
                  className="block text-center bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Create This Book →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FFD166]/20 border border-[#FFD166] rounded-2xl p-8 text-center">
          <h3 className="font-extrabold text-[#24304A] text-xl mb-2">More Adventures Coming Soon</h3>
          <p className="text-gray-500 text-sm mb-4">Dinosaur Adventure, Princess Adventure, Superhero Adventure, First Day of School, Birthday Adventure, and more are in development.</p>
          <Link href="/register" className="inline-block text-sm font-bold text-[#6C63FF] hover:opacity-80">
            Create an account to be notified →
          </Link>
        </div>
      </section>
    </main>
  );
}
