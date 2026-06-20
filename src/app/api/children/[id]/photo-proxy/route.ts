import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BUCKETS } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id: childId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: photo } = await supabase
    .from("child_photos")
    .select("storage_path, is_primary")
    .eq("child_id", childId)
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .single();

  if (!photo) {
    // Fall back to any photo
    const { data: anyPhoto } = await supabase
      .from("child_photos")
      .select("storage_path")
      .eq("child_id", childId)
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!anyPhoto) return NextResponse.json({ error: "No photo" }, { status: 404 });

    const { data: signed } = await supabase.storage
      .from(BUCKETS.childPhotos)
      .createSignedUrl(anyPhoto.storage_path, 300);

    if (!signed) return NextResponse.json({ error: "Could not sign URL" }, { status: 500 });
    return NextResponse.redirect(signed.signedUrl);
  }

  const { data: signed } = await supabase.storage
    .from(BUCKETS.childPhotos)
    .createSignedUrl(photo.storage_path, 300);

  if (!signed) return NextResponse.json({ error: "Could not sign URL" }, { status: 500 });
  return NextResponse.redirect(signed.signedUrl);
}
