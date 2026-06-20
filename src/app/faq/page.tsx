import Link from "next/link";

const FAQS = [
  { q: "How is my child's photo used?", a: "Your child's photo is used only to inform the AI illustration style — the character's hair, skin tone, and appearance in the illustrations. Photos are stored privately and never shown publicly or used for AI training." },
  { q: "How long does it take to generate a book?", a: "In mock/development mode, generation is instant. In production with real AI, it typically takes 2–5 minutes to write the story and generate all illustrations." },
  { q: "Can I edit the story after it's generated?", a: "In the current MVP, you can review the story and request changes with feedback. Individual page editing and regeneration is coming in Phase 2." },
  { q: "What format is the download?", a: "You receive a high-quality PDF optimized for home printing or professional print services. Each page is formatted at standard book proportions." },
  { q: "Is this suitable for all ages?", a: "Yes! You can specify your child's age and reading level. The AI tailors vocabulary and sentence length accordingly. Themes are rated for ages 3–10." },
  { q: "Can I create books for multiple children?", a: "Absolutely. You can create separate child profiles for each child and generate unique personalized books for each one." },
  { q: "Are the stories safe for children?", a: "Every generated story goes through an automated safety check to ensure age-appropriate language and content. We also have admin review for any flagged content." },
  { q: "Do you offer refunds?", a: "Yes. If you're not happy with your book and we can't fix the issue, contact us within 7 days for a full refund." },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
        <Link href="/register" className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          Get Started
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#24304A] mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-500">Can&apos;t find what you&apos;re looking for? <a href="mailto:support@wonderkidstories.com" className="text-[#6C63FF]">Contact us</a></p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="px-6 py-4 font-bold text-[#24304A] cursor-pointer select-none flex items-center justify-between">
                {faq.q}
                <span className="text-[#6C63FF] group-open:rotate-180 transition-transform text-sm">▼</span>
              </summary>
              <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
