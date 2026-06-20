import { createClient } from "@/lib/supabase/server";

const BUCKETS = {
  childPhotos: process.env.STORAGE_BUCKET_CHILD_PHOTOS ?? "child-photos",
  bookAssets: process.env.STORAGE_BUCKET_BOOK_ASSETS ?? "book-assets",
  pdfs: process.env.STORAGE_BUCKET_PDFS ?? "pdfs",
} as const;

export function getChildPhotoPath(userId: string, childId: string, filename: string): string {
  return `users/${userId}/children/${childId}/photos/original/${filename}`;
}

export function getBookPagePath(userId: string, bookId: string, filename: string): string {
  return `users/${userId}/books/${bookId}/pages/${filename}`;
}

export function getBookPDFPath(userId: string, bookId: string): string {
  return `users/${userId}/books/${bookId}/pdf/book.pdf`;
}

export async function getSignedUploadUrl(path: string, bucket: string = BUCKETS.childPhotos) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);
  if (error) throw error;
  return data;
}

export async function getSignedDownloadUrl(
  path: string,
  bucket: string = BUCKETS.pdfs,
  expiresIn = 3600
) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function uploadBuffer(
  buffer: Buffer,
  path: string,
  bucket: string = BUCKETS.pdfs,
  contentType = "application/pdf"
) {
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;
}

export { BUCKETS };
