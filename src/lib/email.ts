import { Resend } from "resend";
import { siteConfig } from "@/config/site";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.EMAIL_FROM ?? `WonderKid Stories <noreply@wonderkidstories.com>`;

// ─── Book draft ready ───────────────────────────────────────────
export async function sendDraftReadyEmail(opts: {
  to: string;
  childName: string;
  bookTitle: string;
  bookId: string;
  parentName?: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const url = `${siteConfig.url}/dashboard/books/${opts.bookId}/reader`;

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `📖 ${opts.childName}'s storybook is ready to review!`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FFF8ED;font-family:Nunito,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #E5E7EB;">
    <div style="background:#6C63FF;padding:32px 40px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">📖</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">WonderKid Stories</h1>
    </div>
    <div style="padding:32px 40px;">
      <h2 style="color:#24304A;font-size:20px;font-weight:800;margin:0 0 12px;">Your book is ready! 🎉</h2>
      <p style="color:#6B7280;line-height:1.6;margin:0 0 16px;">
        Hi ${opts.parentName ?? "there"},<br><br>
        <strong>${opts.childName}'s</strong> personalized storybook <em>"${opts.bookTitle}"</em> has been created and is ready for you to review online.
      </p>
      <p style="color:#6B7280;line-height:1.6;margin:0 0 24px;">
        Read through the story, check the illustrations, and approve it to unlock your PDF download.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${url}" style="background:#6C63FF;color:#fff;font-weight:800;padding:14px 32px;border-radius:12px;text-decoration:none;display:inline-block;font-size:16px;">
          Read the Book Online →
        </a>
      </div>
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:24px;">
        WonderKid Stories · <a href="${siteConfig.url}/privacy" style="color:#6C63FF;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

// ─── PDF ready ──────────────────────────────────────────────────
export async function sendPDFReadyEmail(opts: {
  to: string;
  childName: string;
  bookTitle: string;
  bookId: string;
  parentName?: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const url = `${siteConfig.url}/dashboard/books/${opts.bookId}`;

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `🎉 Your PDF storybook is ready to download!`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FFF8ED;font-family:Nunito,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #E5E7EB;">
    <div style="background:#6C63FF;padding:32px 40px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">🎉</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">WonderKid Stories</h1>
    </div>
    <div style="padding:32px 40px;">
      <h2 style="color:#24304A;font-size:20px;font-weight:800;margin:0 0 12px;">Your PDF is ready!</h2>
      <p style="color:#6B7280;line-height:1.6;margin:0 0 16px;">
        Hi ${opts.parentName ?? "there"},<br><br>
        <strong>${opts.childName}'s</strong> storybook <em>"${opts.bookTitle}"</em> has been approved and your high-quality PDF is ready to download!
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${url}" style="background:#06D6A0;color:#fff;font-weight:800;padding:14px 32px;border-radius:12px;text-decoration:none;display:inline-block;font-size:16px;">
          📥 Download PDF
        </a>
      </div>
      <p style="color:#6B7280;font-size:14px;line-height:1.6;">
        Print it out, read it at bedtime, or share it with family — the story belongs to ${opts.childName} forever! 💜
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

// ─── Admin failure alert ─────────────────────────────────────────
export async function sendAdminFailureAlert(opts: {
  bookId: string;
  jobId?: string;
  errorMessage: string;
  childName?: string;
}) {
  const resend = getResend();
  if (!resend || !process.env.ADMIN_EMAIL) return;

  await resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ Book generation failed — ${opts.bookId}`,
    html: `
<div style="font-family:monospace;padding:20px;background:#1a1a1a;color:#e5e5e5;border-radius:8px;max-width:560px;">
  <h2 style="color:#EF476F;margin:0 0 16px;">⚠️ Generation Failure</h2>
  <p><strong>Book ID:</strong> ${opts.bookId}</p>
  ${opts.jobId ? `<p><strong>Job ID:</strong> ${opts.jobId}</p>` : ""}
  ${opts.childName ? `<p><strong>Child:</strong> ${opts.childName}</p>` : ""}
  <p><strong>Error:</strong></p>
  <pre style="background:#2a2a2a;padding:12px;border-radius:4px;color:#ff6b6b;white-space:pre-wrap;">${opts.errorMessage}</pre>
  <p><a href="${siteConfig.url}/admin/jobs" style="color:#6C63FF;">View in Admin →</a></p>
</div>`,
  });
}
