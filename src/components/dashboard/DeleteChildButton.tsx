"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DeleteChildButton({ childId, childName }: { childId: string; childName: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/children/${childId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/children");
    } else {
      toast({ title: "Delete failed", description: "Please try again.", variant: "error" });
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-red-600 font-medium">Delete &quot;{childName}&quot;?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          {deleting ? "Deleting..." : "Yes, delete"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 px-4 py-2 rounded-lg transition-colors"
    >
      Delete Child Profile
    </button>
  );
}
