import { z } from "zod";

export const generateFlashcardsSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text cannot exceed 10000 characters")
    .trim(),
});

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>;
