import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WonderKid Stories — Personalized Storybooks for Children",
  description:
    "Turn your child into the hero of a personalized illustrated storybook. Upload a photo, choose an adventure, and get a beautiful custom book.",
  keywords: ["personalized storybook", "children's book", "AI storybook", "custom kids book"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-[family-name:var(--font-nunito)] antialiased">{children}</body>
    </html>
  );
}
