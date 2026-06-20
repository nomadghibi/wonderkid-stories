import Link from "next/link";

export default function PricingPage() {
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

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-[#24304A] mb-4">Simple, Honest Pricing</h1>
        <p className="text-gray-500 text-lg mb-12 max-w-lg mx-auto">No subscriptions required to get started. Pay once, keep your book forever.</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {/* Single book */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 text-left">
            <div className="text-3xl mb-3">📖</div>
            <h2 className="font-extrabold text-[#24304A] text-xl mb-1">Single Book</h2>
            <div className="text-4xl font-extrabold text-[#24304A] my-4">$14.99</div>
            <p className="text-gray-500 text-sm mb-6">One complete personalized storybook</p>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
              {[
                "10–12 page illustrated story",
                "Child as the hero",
                "3 story themes to choose from",
                "Online reader access",
                "High-quality PDF download",
                "Private family share link",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-[#06D6A0] font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center bg-[#24304A] hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors">
              Get Started
            </Link>
          </div>

          {/* Bundle */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#6C63FF] text-left relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6C63FF] text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
            <div className="text-3xl mb-3">📚</div>
            <h2 className="font-extrabold text-[#24304A] text-xl mb-1">3-Book Bundle</h2>
            <div className="text-4xl font-extrabold text-[#24304A] my-4">$29.99</div>
            <p className="text-gray-500 text-sm mb-6">Three personalized storybooks — save $14.98</p>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
              {[
                "Everything in Single Book",
                "3 complete adventures",
                "Save over 33%",
                "Perfect for gifts",
                "Use for multiple children",
                "Priority generation",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-[#6C63FF] font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-3 rounded-xl transition-colors">
              Get the Bundle
            </Link>
          </div>
        </div>

        {/* Coming soon */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto text-left">
          <h3 className="font-extrabold text-[#24304A] text-lg mb-4">Coming Soon</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-500">
            {[
              { name: "Monthly Story Club", price: "$9.99/mo", desc: "A new personalized story every month" },
              { name: "Audio Narration Add-on", price: "$4.99", desc: "Professional read-aloud narration" },
              { name: "Printed Book", price: "$29–$49", desc: "Premium hardcover print edition" },
            ].map((p) => (
              <div key={p.name} className="p-4 bg-gray-50 rounded-xl">
                <div className="font-bold text-[#24304A] text-sm mb-1">{p.name}</div>
                <div className="text-[#6C63FF] font-bold text-sm mb-1">{p.price}</div>
                <div className="text-xs text-gray-400">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
