export const SEED_THEMES = [
  {
    slug: "baseball-hero",
    title: "Baseball Hero Adventure",
    description:
      "Your child leads their team to victory in an inspiring baseball adventure full of teamwork, courage, and sportsmanship.",
    category: "sports",
    age_min: 4,
    age_max: 9,
    page_count: 10,
    is_active: true,
  },
  {
    slug: "magical-forest",
    title: "Magical Forest Adventure",
    description:
      "Journey through an enchanted forest filled with friendly creatures, hidden magic, and wonder around every tree.",
    category: "fantasy",
    age_min: 3,
    age_max: 8,
    page_count: 10,
    is_active: true,
  },
  {
    slug: "space-explorer",
    title: "Space Explorer Adventure",
    description:
      "Blast off on an intergalactic mission to discover new worlds, make alien friends, and save the galaxy.",
    category: "adventure",
    age_min: 5,
    age_max: 10,
    page_count: 10,
    is_active: true,
  },
] as const;

export type ThemeSlug = (typeof SEED_THEMES)[number]["slug"];

export const THEME_EMOJIS: Record<string, string> = {
  "baseball-hero": "⚾",
  "magical-forest": "🌲",
  "space-explorer": "🚀",
};
