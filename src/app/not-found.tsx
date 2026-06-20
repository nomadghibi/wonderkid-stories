import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-3xl font-extrabold text-[#24304A] mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">This page doesn&apos;t exist. The story must have taken a wrong turn.</p>
        <Link href="/" className="inline-block bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold px-6 py-3 rounded-xl transition-colors">
          Go Home →
        </Link>
      </div>
    </div>
  );
}
