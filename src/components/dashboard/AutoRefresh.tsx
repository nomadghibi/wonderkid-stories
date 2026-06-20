"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const GENERATING_STATUSES = ["queued", "story_generating", "images_generating", "pdf_generating"];

export default function AutoRefresh({ status }: { status: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!GENERATING_STATUSES.includes(status)) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [status, router]);

  return null;
}
