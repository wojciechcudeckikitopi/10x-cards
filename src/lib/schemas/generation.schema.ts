import { z } from "zod";

/**
 * Schema for validating generation ID parameter
 */
export const generationIdSchema = z.object({
  id: z.string().uuid("Invalid generation ID format"),
});

export type GenerationIdParams = z.infer<typeof generationIdSchema>;

/**
 * Schema for validating generation query parameters
 */
export const generationQuerySchema = z.object({
  page: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  date: z.string().optional(), // Will be refined for date range validation
  llm_model: z.string().optional(),
});

export type GenerationQueryParams = z.infer<typeof generationQuerySchema>;

/**
 * Schema for validating generation creation payload
 */
export const generateFlashcardsSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text cannot exceed 10000 characters")
    .trim(),
});

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>;
