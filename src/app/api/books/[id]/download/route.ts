import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSignedDownloadUrl, BUCKETS } from "@/lib/storage";
import { logAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id: bookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: book } = await supabase
    .from("books")
    .select("id, status, pdf_url, user_id")
    .eq("id", bookId)
    .eq("user_id", user.id)
    .single();

  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (book.status !== "completed" || !book.pdf_url) {
    return NextResponse.json({ error: "PDF not yet available" }, { status: 400 });
  }

  const signedUrl = await getSignedDownloadUrl(book.pdf_url, BUCKETS.pdfs, 3600);

  // Update download count
  await supabase.rpc("increment_download_count", { book_id_arg: bookId }).maybeSingle();

  await logAudit(user.id, "book_downloaded", "books", bookId);

  return NextResponse.json({ url: signedUrl, expiresIn: 3600 });
}
