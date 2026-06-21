import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WonderKid Stories",
    short_name: "WonderKid",
    description: "Free interactive children's books — read anywhere",
    start_url: "/library",
    display: "standalone",
    background_color: "#FFF8ED",
    theme_color: "#6C63FF",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg",     sizes: "any",     type: "image/svg+xml", purpose: "maskable" },
    ],
    screenshots: [],
    categories: ["education", "kids"],
  };
}
