import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getChildPhotoPath, getSignedUploadUrl, BUCKETS } from "@/lib/storage";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const uploadRequestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().min(1).max(MAX_SIZE_BYTES),
});

export async function POST(request: Request, { params }: Params) {
  const { id: childId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify child belongs to user
  const { data: child } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .single();

  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  const body = await request.json();
  const parsed = uploadRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (!ALLOWED_TYPES.includes(parsed.data.contentType)) {
    return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WebP allowed." }, { status: 400 });
  }

  const ext = parsed.data.filename.split(".").pop() ?? "jpg";
  const storagePath = getChildPhotoPath(user.id, childId, `${Date.now()}.${ext}`);

  const uploadData = await getSignedUploadUrl(storagePath, BUCKETS.childPhotos);

  // Create photo record
  const { data: photo } = await supabase
    .from("child_photos")
    .insert({
      child_id: childId,
      user_id: user.id,
      file_url: storagePath,
      storage_path: storagePath,
      is_primary: false,
      status: "uploaded",
    })
    .select()
    .single();

  return NextResponse.json({ signedUrl: uploadData.signedUrl, token: uploadData.token, photo });
}
