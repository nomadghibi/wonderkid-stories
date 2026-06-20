import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createServiceClient();

  const [
    { count: userCount },
    { count: bookCount },
    { count: failedJobCount },
    { count: pendingReviewCount },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("generation_jobs").select("*", { count: "exact", head: true }).eq("status", "failed"),
    supabase.from("books").select("*", { count: "exact", head: true }).eq("review_status", "not_ready").eq("status", "reader_ready"),
  ]);

  const stats = [
    { label: "Total Users", value: userCount ?? 0, icon: "👥", color: "bg-blue-50 text-blue-700" },
    { label: "Total Books", value: bookCount ?? 0, icon: "📚", color: "bg-purple-50 text-purple-700" },
    { label: "Failed Jobs", value: failedJobCount ?? 0, icon: "⚠️", color: "bg-red-50 text-red-700" },
    { label: "Pending Reviews", value: pendingReviewCount ?? 0, icon: "🔍", color: "bg-yellow-50 text-yellow-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 mt-1">Platform health at a glance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/jobs", label: "View Failed Jobs", icon: "⚠️" },
              { href: "/admin/books", label: "Review Pending Books", icon: "📖" },
              { href: "/admin/users", label: "Manage Users", icon: "👥" },
              { href: "/admin/themes", label: "Manage Themes", icon: "🎭" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors"
              >
                <span>{action.icon}</span>
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            {[
              { label: "AI Story Generation", status: "Operational" },
              { label: "AI Image Generation", status: "Operational" },
              { label: "PDF Service", status: "Operational" },
              { label: "Email Service", status: "Operational" },
              { label: "Payment Processing", status: "Operational" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
