import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-bold text-xl text-purple-700">WonderKid Stories</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/how-it-works" className="hover:text-purple-700 transition-colors">How It Works</Link>
          <Link href="/themes" className="hover:text-purple-700 transition-colors">Themes</Link>
          <Link href="/pricing" className="hover:text-purple-700 transition-colors">Pricing</Link>
          <Link href="/samples" className="hover:text-purple-700 transition-colors">Samples</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-purple-700 transition-colors">Log in</Link>
          <Link
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>✨</span>
          <span>AI-Powered Personalized Storybooks</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Turn Your Child Into<br />
          <span className="text-purple-600">the Hero of Their Story</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Upload a photo, choose an adventure, and watch AI create a beautiful personalized storybook
          where your child is the star. Review online, then download a stunning PDF.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-purple-200"
          >
            Create Your Child&apos;s Storybook →
          </Link>
          <Link
            href="/samples"
            className="text-gray-600 hover:text-purple-700 font-medium px-8 py-4 rounded-xl text-lg border border-gray-200 hover:border-purple-200 transition-colors"
          >
            View Sample Books
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">Starting at $14.99 · Ready in minutes</p>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-500 mb-14">Four simple steps to a magical book</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", icon: "📸", title: "Upload a Photo", desc: "Add your child's photo and a few details about their personality." },
              { step: "2", icon: "🎭", title: "Choose an Adventure", desc: "Pick from Baseball Hero, Space Explorer, Magical Forest, and more." },
              { step: "3", icon: "✨", title: "AI Creates the Book", desc: "Our AI writes a personalized story and generates custom illustrations." },
              { step: "4", icon: "📥", title: "Review & Download", desc: "Read online, approve, and download your beautiful PDF storybook." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-1">Step {item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes preview */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Story Adventures</h2>
          <p className="text-center text-gray-500 mb-14">Every child has a different dream</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "⚾", title: "Baseball Hero", desc: "Your child leads the team to victory in an inspiring sports adventure.", badge: "Popular" },
              { emoji: "🚀", title: "Space Explorer", desc: "Blast off on an intergalactic mission to discover new worlds and make friends.", badge: "New" },
              { emoji: "🌲", title: "Magical Forest", desc: "Journey through an enchanted forest filled with friendly creatures and wonder.", badge: "" },
            ].map((theme) => (
              <div key={theme.title} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{theme.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{theme.title}</h3>
                  {theme.badge && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">{theme.badge}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{theme.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/themes" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              View all themes →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-500 mb-14">No subscription required to get started</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Single Book</h3>
              <div className="text-4xl font-bold text-gray-900 my-4">$14.99</div>
              <p className="text-gray-500 text-sm mb-6">One personalized PDF storybook</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {["10–12 page illustrated story", "Child as the hero", "Online reader access", "High-quality PDF download", "Private share link"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors">
                Create a Book
              </Link>
            </div>
            <div className="border-2 border-purple-500 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">3-Book Bundle</h3>
              <div className="text-4xl font-bold text-gray-900 my-4">$29.99</div>
              <p className="text-gray-500 text-sm mb-6">Three personalized storybooks</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {["Everything in Single Book", "3 different adventures", "Save $14.98", "Perfect for gifts", "Priority generation"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-purple-500">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors">
                Get the Bundle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Safe, Private &amp; Family-Friendly</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "🔒", title: "Private Photos", desc: "Child photos are never public and never used for AI training without consent." },
              { icon: "👨‍👩‍👧", title: "Family Safe", desc: "Every story passes age-appropriate content safety checks before you see it." },
              { icon: "🛡️", title: "Secure Storage", desc: "All files stored with encryption. Only you can access your family's content." },
              { icon: "🗑️", title: "Delete Anytime", desc: "Request full account and data deletion at any time, no questions asked." },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-purple-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Create the Magic?</h2>
          <p className="text-purple-200 mb-8 text-lg">Your child&apos;s adventure is just a few clicks away.</p>
          <Link
            href="/register"
            className="inline-block bg-white text-purple-600 hover:bg-purple-50 font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-xl"
          >
            Create Your Child&apos;s Storybook →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-semibold text-white">WonderKid Stories</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
          <p className="text-sm">© 2026 WonderKid Stories. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
