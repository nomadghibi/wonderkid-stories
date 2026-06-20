import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("users").select("*").eq("id", user!.id).single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#24304A]">Account Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account and privacy preferences.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-[#24304A]">Profile</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium text-[#24304A]">{profile?.full_name ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-[#24304A]">{profile?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Account type</dt>
            <dd className="font-medium text-[#24304A] capitalize">{profile?.role ?? "customer"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Member since</dt>
            <dd className="font-medium text-[#24304A]">{new Date(profile?.created_at).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-bold text-[#24304A] mb-3">Privacy & Data</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Your child&apos;s photos are stored privately and are never shared or used for AI training without your explicit consent.</p>
          <p>You may request deletion of all your data at any time by emailing us.</p>
        </div>
        <div className="mt-4 space-y-2">
          <a href="/privacy" className="block text-[#6C63FF] hover:opacity-80 text-sm font-medium">View Privacy Policy →</a>
          <a href={`mailto:${process.env.ADMIN_EMAIL ?? "support@wonderkidstories.com"}?subject=Data Deletion Request`} className="block text-red-500 hover:opacity-80 text-sm font-medium">Request Data Deletion →</a>
        </div>
      </div>
    </div>
  );
}
