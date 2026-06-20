import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateBookPDF } from "@/agents/pdf-agent";
import { getBookPDFPath, uploadBuffer, getSignedDownloadUrl, BUCKETS } from "@/lib/storage";
import { logAudit } from "@/lib/audit";
import { sendPDFReadyEmail } from "@/lib/email";
import type { BookPage } from "@/types/book";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id: bookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: book } = await supabase
    .from("books")
    .select("*, child_profiles(name)")
    .eq("id", bookId)
    .eq("user_id", user.id)
    .single();

  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (book.status !== "reader_ready" && book.status !== "review_pending") {
    return NextResponse.json({ error: "Book is not ready for approval" }, { status: 400 });
  }

  const serviceClient = await createServiceClient();

  // Update statuses
  await serviceClient
    .from("books")
    .update({ status: "approved", review_status: "approved", approved_at: new Date().toISOString() })
    .eq("id", bookId);

  await serviceClient.from("book_reviews").insert({
    book_id: bookId,
    user_id: user.id,
    status: "approved",
    feedback: null,
  });

  // Generate PDF
  await serviceClient.from("books").update({ status: "pdf_generating" }).eq("id", bookId);

  try {
    const { data: pages } = await serviceClient
      .from("book_pages")
      .select("*")
      .eq("book_id", bookId)
      .order("page_number");

    const { pdfBuffer } = await generateBookPDF(
      book.title ?? "My Storybook",
      (pages ?? []) as BookPage[],
      book.dedication ?? undefined
    );

    const pdfPath = getBookPDFPath(user.id, bookId);
    await uploadBuffer(pdfBuffer, pdfPath, BUCKETS.pdfs);

    const signedUrl = await getSignedDownloadUrl(pdfPath, BUCKETS.pdfs, 3600);

    await serviceClient
      .from("books")
      .update({ status: "completed", pdf_url: pdfPath })
      .eq("id", bookId);

    // Create download record
    await serviceClient.from("downloads").insert({
      book_id: bookId,
      user_id: user.id,
      download_url: pdfPath,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    });

    await logAudit(user.id, "book_approved_and_pdf_generated", "books", bookId);

    // Send PDF ready email (non-fatal)
    try {
      const { data: profile } = await serviceClient.from("users").select("email, full_name").eq("id", user.id).single();
      if (profile?.email) {
        await sendPDFReadyEmail({
          to: profile.email,
          childName: (book.child_profiles as { name: string } | null)?.name ?? "your child",
          bookTitle: book.title ?? "Your Storybook",
          bookId,
          parentName: profile.full_name ?? undefined,
        });
      }
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true, downloadUrl: signedUrl });
  } catch (err) {
    await serviceClient.from("books").update({ status: "approved" }).eq("id", bookId);
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
