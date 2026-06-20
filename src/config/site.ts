export const siteConfig = {
  name: "WonderKid Stories",
  tagline: "Turn your child into the hero of their own story",
  description:
    "AI-powered personalized children's storybooks. Upload a photo, choose an adventure, and get a beautiful illustrated book where your child is the hero.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@wonderkidstories.com",
  colors: {
    brand: "#6C63FF",
    brandDark: "#5A52E0",
    accent: "#FFD166",
    accentGreen: "#06D6A0",
    bg: "#FFF8ED",
    text: "#24304A",
  },
} as const;
