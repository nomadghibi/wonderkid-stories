import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-500",
  cancelled: "bg-gray-100 text-gray-500",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, books(id, title)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#24304A]">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Your purchase history</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-gray-500 text-sm">No orders yet.</p>
          <Link href="/dashboard/books/new" className="inline-block mt-4 text-[#6C63FF] font-medium text-sm hover:opacity-80">
            Create your first book →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs text-gray-500 font-semibold">
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Book</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const book = (Array.isArray(order.books) ? order.books[0] : order.books) as { id: string; title: string | null } | null;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}…</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      {book ? (
                        <Link href={`/dashboard/books/${book.id}`} className="text-[#6C63FF] hover:opacity-80 font-medium">
                          {book.title ?? "Untitled"}
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#24304A]">
                      ${(order.amount_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
