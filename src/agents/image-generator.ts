export interface ImageResult {
  imageUrl: string;
  provider: string;
  providerJobId?: string;
}

export async function generateImage(prompt: string): Promise<ImageResult> {
  if (process.env.MOCK_AI_MODE === "true") {
    return {
      imageUrl: `https://placehold.co/800x600/6C63FF/FFFFFF?text=Story+Illustration`,
      provider: "mock",
    };
  }
  throw new Error("Real image provider not configured. Set MOCK_AI_MODE=true or implement a provider.");
}
