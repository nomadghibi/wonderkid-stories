import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16 text-sm text-gray-600 leading-relaxed space-y-6">
        <h1 className="text-3xl font-extrabold text-[#24304A] mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-4">Last updated: June 2026</p>

        <p>By using WonderKid Stories, you agree to these terms.</p>

        <div>
          <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be 18 or older to create an account.</li>
            <li>You may only upload photos of children for whom you are a parent or legal guardian.</li>
            <li>You may not upload photos of other people&apos;s children without their consent.</li>
            <li>You may not use the platform to generate content that is harmful, illegal, or offensive.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Content Ownership</h2>
          <p>Generated storybooks are for personal, non-commercial use. You may print and share generated PDFs for personal use. Commercial redistribution requires written permission.</p>
        </div>

        <div>
          <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Refunds</h2>
          <p>We offer a satisfaction guarantee. If your generated book has quality issues we cannot resolve, contact support within 7 days of purchase for a full refund.</p>
        </div>

        <div>
          <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Limitation of Liability</h2>
          <p>WonderKid Stories is provided as-is. We are not liable for any indirect, incidental, or consequential damages arising from use of the service.</p>
        </div>

        <div>
          <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Contact</h2>
          <p>Questions: <a href="mailto:support@wonderkidstories.com" className="text-[#6C63FF]">support@wonderkidstories.com</a></p>
        </div>
      </div>
    </main>
  );
}
