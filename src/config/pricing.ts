export const PRICING = {
  singleBook: {
    label: "Single Book",
    description: "One personalized PDF storybook",
    amountCents: 1499,
    display: "$14.99",
  },
  bundleThree: {
    label: "3-Book Bundle",
    description: "Three personalized storybooks — best value",
    amountCents: 2999,
    display: "$29.99",
  },
} as const;

export type PricingProduct = keyof typeof PRICING;

export const MOCK_PAYMENT_MODE = process.env.MOCK_PAYMENT_MODE === "true";
