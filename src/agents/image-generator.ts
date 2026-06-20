import { getOpenAI } from "@/lib/openai";

export interface ImageResult {
  imageUrl: string;
  provider: string;
  providerJobId?: string;
  buffer?: Buffer;
}

export async function generateImage(prompt: string): Promise<ImageResult> {
  if (process.env.MOCK_AI_MODE === "true") {
    return {
      imageUrl: `https://placehold.co/800x600/6C63FF/FFFFFF?text=Story+Illustration`,
      provider: "mock",
    };
  }
  return generateDalleImage(prompt);
}

async function generateDalleImage(prompt: string): Promise<ImageResult> {
  const openai = getOpenAI();

  // Prepend safety prefix to ensure child-safe output
  const safePrompt = `Children's storybook illustration, age-appropriate, warm and friendly, no scary content, no text in image. ${prompt}`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: safePrompt,
    n: 1,
    size: "1792x1024",
    quality: "standard",
    style: "vivid",
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) throw new Error("DALL-E 3 returned no image URL");

  // Download image bytes for persistent Supabase storage
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to download DALL-E image: ${imgRes.status}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  return { imageUrl, provider: "dall-e-3", buffer };
}
