"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "🏠", exact: true },
  { href: "/dashboard/books", label: "My Books", icon: "📚", exact: false },
  { href: "/dashboard/children", label: "Children", icon: "👦", exact: false },
  { href: "/dashboard/orders", label: "Orders", icon: "🧾", exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️", exact: false },
];

export default function MobileNav({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = user.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Top bar — mobile only */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="font-extrabold text-[#6C63FF] text-sm">WonderKid Stories</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/books/new"
            className="bg-[#6C63FF] text-white text-xs font-bold px-3 py-1.5 rounded-lg"
          >
            ✨ New
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <span className="w-5 h-0.5 bg-gray-600 rounded-full" />
            <span className="w-5 h-0.5 bg-gray-600 rounded-full" />
            <span className="w-5 h-0.5 bg-gray-600 rounded-full" />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#6C63FF] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[#24304A] text-sm leading-tight">
                {user.user_metadata?.full_name ?? "My Account"}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#E8E6FF] text-[#6C63FF]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-6 pt-3 border-t border-gray-100 space-y-2">
          <Link
            href="/dashboard/books/new"
            className="flex items-center justify-center gap-2 bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            ✨ Create New Book
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-sm text-gray-500 hover:text-red-500 py-2 transition-colors font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
