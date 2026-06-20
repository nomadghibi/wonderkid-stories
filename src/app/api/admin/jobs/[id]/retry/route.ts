import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id: jobId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceClient = await createServiceClient();

  const { data: job } = await serviceClient
    .from("generation_jobs")
    .select("*, books(*)")
    .eq("id", jobId)
    .single();

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "failed") return NextResponse.json({ error: "Only failed jobs can be retried" }, { status: 400 });

  // Reset job and book to allow re-generation
  await serviceClient
    .from("generation_jobs")
    .update({ status: "queued", attempt_count: job.attempt_count + 1, error_message: null })
    .eq("id", jobId);

  await serviceClient
    .from("books")
    .update({ status: "draft" })
    .eq("id", job.book_id);

  // Trigger regeneration
  const genRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/books/${job.book_id}/generate`,
    { method: "POST", headers: { Cookie: "" } }
  );

  if (!genRes.ok) {
    return NextResponse.json({ error: "Failed to trigger regeneration" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
