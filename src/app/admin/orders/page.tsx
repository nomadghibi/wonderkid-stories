import { createServiceClient } from "@/lib/supabase/server";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-500",
  cancelled: "bg-gray-100 text-gray-500",
};

export default async function AdminOrdersPage() {
  const supabase = await createServiceClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, users(email), books(title)")
    .order("created_at", { ascending: false })
    .limit(200);

  const totalRevenue = (orders ?? [])
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          <span className="text-xs text-green-600 font-medium">Total revenue </span>
          <span className="font-bold text-green-700">${(totalRevenue / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 font-semibold">
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Customer</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Book</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(orders ?? []).map((order) => {
              const user = (Array.isArray(order.users) ? order.users[0] : order.users) as { email: string } | null;
              const book = (Array.isArray(order.books) ? order.books[0] : order.books) as { title: string | null } | null;
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell truncate max-w-[160px]">{user?.email ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell truncate max-w-[150px]">{book?.title ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${(order.amount_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && <div className="text-center py-12 text-gray-400">No orders yet</div>}
      </div>
    </div>
  );
}
