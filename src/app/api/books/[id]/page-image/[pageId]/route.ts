import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUCKETS } from "@/lib/storage";

type Params = { params: Promise<{ id: string; pageId: string }> };

// Proxy signed URLs for book page images stored in private Supabase Storage
export async function GET(_req: Request, { params }: Params) {
  const { id: bookId, pageId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: page } = await supabase
    .from("book_pages")
    .select("image_url, book_id")
    .eq("id", pageId)
    .single();

  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Verify book ownership
  const { data: book } = await supabase
    .from("books")
    .select("id")
    .eq("id", page.book_id)
    .eq("user_id", user.id)
    .single();

  if (!book) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const imageUrl = page.image_url;
  if (!imageUrl) return NextResponse.json({ error: "No image" }, { status: 404 });

  // If it's already a full URL (mock placehold.co or DALL-E), redirect directly
  if (imageUrl.startsWith("http")) {
    return NextResponse.redirect(imageUrl);
  }

  // It's a Supabase Storage path — generate signed URL
  const { data: signed } = await supabase.storage
    .from(BUCKETS.bookAssets)
    .createSignedUrl(imageUrl, 3600);

  if (!signed) return NextResponse.json({ error: "Could not sign URL" }, { status: 500 });
  return NextResponse.redirect(signed.signedUrl);
}
