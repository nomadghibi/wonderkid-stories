import { z } from "zod";

export const childProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  age: z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : Number(v)), z.number().int().min(1).max(18).optional()),
  gender: z.string().optional(),
  skin_tone: z.string().optional(),
  hair_note: z.string().max(200).optional(),
  favorite_color: z.string().max(50).optional(),
  favorite_animal: z.string().max(50).optional(),
  favorite_sport: z.string().max(50).optional(),
  reading_level: z.enum(["beginner", "early_reader", "reader"]).default("early_reader"),
  notes: z.string().max(500).optional(),
});

export type ChildProfileInput = z.infer<typeof childProfileSchema>;
