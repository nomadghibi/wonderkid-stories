"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Props {
  childId: string;
  hasPhoto: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 10;

export default function ChildPhotoUpload({ childId, hasPhoto }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleFile(file: File) {
    setValidationError(null);
    setSuccess(false);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError("Only JPEG, PNG, or WebP images allowed.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setValidationError(`Image must be under ${MAX_MB}MB.`);
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      // Step 1: Get signed upload URL
      const metaRes = await fetch(`/api/children/${childId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      if (!metaRes.ok) throw new Error((await metaRes.json()).error ?? "Failed to get upload URL");
      const { signedUrl, photo } = await metaRes.json();

      setProgress(30);

      // Step 2: Upload directly to Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Upload to storage failed");

      setProgress(70);

      // Step 3: Set as primary photo
      await fetch(`/api/children/${childId}/photos/${photo.id}/primary`, { method: "PATCH" });

      setProgress(100);
      setSuccess(true);
      toast({ title: "Photo uploaded!", description: "Your child's photo is saved.", variant: "success" });
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      toast({ title: "Upload failed", description: msg, variant: "error" });
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-purple-200 hover:border-[#6C63FF] rounded-xl p-4 text-center cursor-pointer transition-colors bg-purple-50 hover:bg-purple-50/80"
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="text-sm text-[#6C63FF] font-medium">Uploading...</div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-[#6C63FF] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : success ? (
          <div className="text-[#06D6A0] font-semibold text-sm">✅ Photo uploaded!</div>
        ) : (
          <div>
            <div className="text-2xl mb-1">📷</div>
            <p className="text-sm font-semibold text-[#24304A]">{hasPhoto ? "Replace photo" : "Upload photo"}</p>
            <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP · Max 10MB</p>
          </div>
        )}
      </div>

      {validationError && <p className="text-red-500 text-xs mt-2">{validationError}</p>}

      <p className="text-xs text-gray-400 mt-2">
        🔒 Photos are stored privately and used only for illustration generation.
      </p>
    </div>
  );
}
