"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/books", label: "Books", icon: "📚" },
  { href: "/admin/jobs", label: "Jobs", icon: "⚙️" },
  { href: "/admin/themes", label: "Themes", icon: "🎭" },
  { href: "/admin/templates", label: "Templates", icon: "📝" },
  { href: "/admin/orders", label: "Orders", icon: "💰" },
  { href: "/admin/settings", label: "Settings", icon: "🔧" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 text-gray-300 hidden md:flex flex-col py-6 px-3">
      <Link href="/admin" className="flex items-center gap-2 px-3 mb-8">
        <span className="text-xl">📖</span>
        <div>
          <div className="text-white font-bold text-sm">WonderKid</div>
          <div className="text-gray-500 text-xs">Admin Panel</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 pt-4 mt-4 px-3">
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
