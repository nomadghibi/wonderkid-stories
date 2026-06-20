import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8ED]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-extrabold text-xl text-[#6C63FF]">WonderKid Stories</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16 prose prose-gray">
        <h1 className="text-3xl font-extrabold text-[#24304A] mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: June 2026 · Consult legal counsel before launch for compliance requirements.</p>

        <section className="space-y-6 text-gray-600 text-sm leading-relaxed">
          <div>
            <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Child Privacy — Our Top Priority</h2>
            <p>WonderKid Stories handles photos of children. We take this responsibility seriously.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Child photos are stored in private, encrypted storage.</li>
              <li>Child photos are never publicly accessible.</li>
              <li>Child photos are used <strong>only</strong> to generate personalized storybook illustrations.</li>
              <li>We do not use uploaded child photos to train AI models.</li>
              <li>We do not share child photos with third parties except our AI illustration provider, under strict data processing agreements.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account email and name (for account management)</li>
              <li>Child profiles (name, age, appearance details for personalization)</li>
              <li>Child photos (for illustration generation only)</li>
              <li>Payment details (processed by Stripe; we never store card numbers)</li>
              <li>Usage data (for platform improvements)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Parental Consent</h2>
            <p>By creating an account and uploading a child&apos;s photo, you confirm you are the parent or legal guardian of that child and consent to the photo being used for storybook generation only.</p>
          </div>

          <div>
            <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Data Deletion</h2>
            <p>You may request deletion of all your account data, including child profiles and photos, at any time. Email us at the address below. We will complete deletion within 30 days.</p>
          </div>

          <div>
            <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Security</h2>
            <p>All data is encrypted in transit and at rest. Access to child photos requires authentication and is limited to the account owner and authorized platform administrators.</p>
          </div>

          <div>
            <h2 className="font-extrabold text-[#24304A] text-lg mb-2">Contact</h2>
            <p>Privacy questions or data deletion requests: <a href="mailto:privacy@wonderkidstories.com" className="text-[#6C63FF]">privacy@wonderkidstories.com</a></p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-xs">
            <strong>Note:</strong> This is a template privacy policy. Before launching a platform that handles children&apos;s data, consult legal counsel regarding COPPA, GDPR-K, PIPEDA, and applicable regional child data protection laws.
          </div>
        </section>
      </div>
    </main>
  );
}
