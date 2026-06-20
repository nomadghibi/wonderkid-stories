"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function DashboardHeader({ user }: { user: User }) {
  const router = useRouter();
  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="hidden md:flex bg-white border-b border-gray-100 px-6 py-3 items-center justify-between">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
