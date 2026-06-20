import type { Metadata } from "next";
import { Nunito, Lexend, ABeeZee, Andika, Fredoka } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

// Research-backed reading fonts for children
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
  display: "swap",
});

const abeezee = ABeeZee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abeezee",
  display: "swap",
});

const andika = Andika({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-andika",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
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
    <html lang="en" className={`${nunito.variable} ${lexend.variable} ${abeezee.variable} ${andika.variable} ${fredoka.variable}`}>
      <body className="font-[family-name:var(--font-nunito)] antialiased">{children}</body>
    </html>
  );
}
