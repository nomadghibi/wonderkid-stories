import { createClient } from "@/lib/supabase/server";

export async function logAudit(
  userId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata: metadata ?? null,
    });
  } catch {
    // Non-fatal — don't break the request if audit fails
    console.error("[audit] Failed to log:", action);
  }
}
