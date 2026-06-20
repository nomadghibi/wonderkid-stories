"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "🏠", exact: true },
  { href: "/dashboard/books", label: "My Books", icon: "📚", exact: false },
  { href: "/dashboard/children", label: "Children", icon: "👦", exact: false },
  { href: "/dashboard/orders", label: "Orders", icon: "🧾", exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️", exact: false },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-100 hidden md:flex flex-col py-6 px-3">
      <Link href="/" className="flex items-center gap-2 px-3 mb-8">
        <span className="text-xl">📖</span>
        <span className="font-bold text-purple-700 text-sm">WonderKid Stories</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 pt-4 mt-4 px-3">
        <Link
          href="/dashboard/books/new"
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <span>✨</span>
          New Book
        </Link>
      </div>
    </aside>
  );
}
