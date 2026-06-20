import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: "👦",
      title: "Create a Child Profile",
      desc: "Add your child's name, age, and a few fun details — their favorite color, animal, and sport. This is what makes the story truly theirs.",
    },
    {
      number: "02",
      icon: "📸",
      title: "Upload a Photo",
      desc: "Upload a clear photo of your child. AI uses this to describe your child's appearance in the illustrations so the hero looks just like them.",
    },
    {
      number: "03",
      icon: "🎭",
      title: "Choose an Adventure",
      desc: "Pick a story theme — Baseball Hero, Space Explorer, or Magical Forest. Each generates a 10-page personalized story.",
    },
    {
      number: "04",
      icon: "✨",
      title: "AI Creates the Book",
      desc: "Our AI writes a unique story where your child is the hero, then generates custom illustrations for every page.",
    },
    {
      number: "05",
      icon: "📖",
      title: "Review Online",
      desc: "Read the full book in our interactive reader. Your child's name, personality, and details appear throughout.",
    },
    {
      number: "06",
      icon: "✅",
      title: "Approve & Download",
      desc: "Love it? Approve the book and download a beautiful print-quality PDF to keep forever.",
    },
  ];

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

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-[#24304A] mb-4">How WonderKid Stories Works</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Six simple steps to create a personalized storybook your child will treasure forever.</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-[#E8E6FF] flex items-center justify-center text-2xl">{step.icon}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider mb-1">Step {step.number}</div>
                <h3 className="font-extrabold text-[#24304A] text-lg mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/register" className="inline-block bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-extrabold px-10 py-4 rounded-2xl text-lg transition-colors shadow-lg">
            Create Your Child&apos;s Storybook →
          </Link>
          <p className="text-gray-400 text-sm mt-3">Starting at $14.99 · Ready in minutes</p>
        </div>
      </section>
    </main>
  );
}
