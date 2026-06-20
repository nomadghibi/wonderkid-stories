import type { BookPage } from "@/types/book";

export interface PDFResult {
  pdfBuffer: Buffer;
}

export async function generateBookPDF(
  title: string,
  pages: BookPage[],
  dedication?: string
): Promise<PDFResult> {
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 792;
  const H = 612;

  // Cover page
  const coverPage = doc.addPage([W, H]);
  coverPage.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.424, 0.388, 1.0) });
  const titleLines = wrapText(title, 40);
  let y = H / 2 + (titleLines.length * 36) / 2;
  for (const line of titleLines) {
    const w = boldFont.widthOfTextAtSize(line, 36);
    coverPage.drawText(line, { x: (W - w) / 2, y, font: boldFont, size: 36, color: rgb(1, 1, 1) });
    y -= 44;
  }
  coverPage.drawText("WonderKid Stories", {
    x: W / 2 - boldFont.widthOfTextAtSize("WonderKid Stories", 14) / 2,
    y: 40,
    font: boldFont,
    size: 14,
    color: rgb(0.9, 0.9, 1.0),
  });

  // Dedication page
  if (dedication) {
    const dedPage = doc.addPage([W, H]);
    dedPage.drawText("A Special Message", { x: 60, y: H - 80, font: boldFont, size: 22, color: rgb(0.1, 0.19, 0.29) });
    dedPage.drawText(dedication, { x: 60, y: H - 130, font, size: 16, color: rgb(0.1, 0.19, 0.29), maxWidth: W - 120 });
  }

  // Story pages
  const storyPages = pages.filter((p) => p.page_type !== "cover" && p.page_type !== "dedication");

  for (let i = 0; i < storyPages.length; i++) {
    const page = storyPages[i];
    const p = doc.addPage([W, H]);

    // Image placeholder area (top 60%)
    const imgH = H * 0.58;
    p.drawRectangle({ x: 0, y: H - imgH, width: W, height: imgH, color: rgb(0.95, 0.97, 1.0) });
    p.drawText("[Illustration]", {
      x: W / 2 - font.widthOfTextAtSize("[Illustration]", 14) / 2,
      y: H - imgH / 2,
      font,
      size: 14,
      color: rgb(0.7, 0.7, 0.8),
    });

    // Text area
    const textY = H - imgH - 30;
    if (page.title) {
      p.drawText(page.title, { x: 40, y: textY, font: boldFont, size: 16, color: rgb(0.1, 0.19, 0.29) });
    }
    const text = page.text_content ?? "";
    const lines = wrapText(text, 85);
    let ly = textY - 30;
    for (const line of lines.slice(0, 6)) {
      p.drawText(line, { x: 40, y: ly, font, size: 14, color: rgb(0.14, 0.19, 0.29) });
      ly -= 22;
    }

    // Page number
    const pn = String(i + 1);
    p.drawText(pn, {
      x: W / 2 - font.widthOfTextAtSize(pn, 11) / 2,
      y: 18,
      font,
      size: 11,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  const pdfBytes = await doc.save();
  return { pdfBuffer: Buffer.from(pdfBytes) };
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
