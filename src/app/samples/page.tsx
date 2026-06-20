import Link from "next/link";

const SAMPLE_PAGES = [
  {
    theme: "Baseball Hero Adventure",
    emoji: "⚾",
    pages: [
      {
        pageNum: 1,
        title: "The Big Game",
        text: "It was the most important day of the season. Alex put on the bright blue jersey and took a deep breath. Today was the championship, and the whole team was counting on their captain.",
        imageColor: "#E8F4FD",
      },
      {
        pageNum: 2,
        title: "Practice Makes Perfect",
        text: "Alex had practiced every single day after school, even when it rained. The sound of the bat hitting the ball always made Alex smile. Hard work always pays off.",
        imageColor: "#FFF8E7",
      },
      {
        pageNum: 3,
        title: "The Winning Moment",
        text: "With two strikes and the bases loaded, Alex took one final swing. CRACK! The ball soared high into the blue sky and cleared the fence. The crowd roared with joy!",
        imageColor: "#E8FFED",
      },
    ],
  },
];

export default function SamplesPage() {
  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
        <Link href="/register" className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          Create Your Book
        </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#24304A] mb-4">Sample Storybooks</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Preview what a WonderKid storybook looks like. Real books replace the hero with your child&apos;s name and appearance.</p>
          <div className="mt-4 inline-block bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium px-4 py-2 rounded-full">
            📌 Samples use fictional characters. Real books are personalized to your child.
          </div>
        </div>

        {SAMPLE_PAGES.map((sample) => (
          <div key={sample.theme} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{sample.emoji}</span>
              <h2 className="font-extrabold text-[#24304A] text-2xl">{sample.theme}</h2>
            </div>

            <div className="space-y-4">
              {sample.pages.map((page) => (
                <div key={page.pageNum} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  {/* Illustration placeholder */}
                  <div
                    className="md:w-[60%] flex items-center justify-center"
                    style={{ background: page.imageColor, minHeight: "220px" }}
                  >
                    <div className="text-center text-gray-300">
                      <div className="text-5xl mb-2">{sample.emoji}</div>
                      <p className="text-sm font-medium">Illustration</p>
                      <p className="text-xs">(personalized in real books)</p>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="md:w-[40%] p-6 md:p-8 flex flex-col justify-center">
                    <div className="text-xs text-[#6C63FF] font-bold uppercase tracking-wider mb-2">Page {page.pageNum}</div>
                    <h3 className="font-extrabold text-[#24304A] text-lg mb-3">{page.title}</h3>
                    <p className="text-[#24304A] leading-relaxed" style={{ fontSize: "18px", lineHeight: "1.65" }}>
                      {page.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <h3 className="font-extrabold text-[#24304A] text-2xl mb-3">Ready to make it real?</h3>
          <p className="text-gray-500 mb-6">Upload your child&apos;s photo and we&apos;ll put them in every page.</p>
          <Link href="/register" className="inline-block bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-extrabold px-10 py-4 rounded-2xl text-lg transition-colors shadow-lg">
            Create Your Child&apos;s Storybook →
          </Link>
          <p className="text-gray-400 text-sm mt-3">Starting at $14.99</p>
        </div>
      </section>
    </main>
  );
}
