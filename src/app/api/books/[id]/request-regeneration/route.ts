import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { bookReviewSchema } from "@/lib/validation/book";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id: bookId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = bookReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: book } = await supabase
    .from("books")
    .select("id, status")
    .eq("id", bookId)
    .eq("user_id", user.id)
    .single();
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const serviceClient = await createServiceClient();

  await serviceClient
    .from("books")
    .update({ review_status: parsed.data.status, status: "review_pending" })
    .eq("id", bookId);

  await serviceClient.from("book_reviews").insert({
    book_id: bookId,
    user_id: user.id,
    status: parsed.data.status,
    feedback: parsed.data.feedback ?? null,
  });

  return NextResponse.json({ success: true });
}
