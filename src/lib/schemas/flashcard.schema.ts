import { z } from "zod";

// Constants for validation
const MAX_FRONT_LENGTH = 200;
const MAX_BACK_LENGTH = 500;

// Schema for flashcard source enum
const flashcardSourceSchema = z.enum(["manual", "ai", "ai-edited"] as const);

// Schema for a single flashcard in the create request
export const createFlashcardSchema = z.object({
  front: z
    .string()
    .min(1, "Front text is required")
    .max(MAX_FRONT_LENGTH, `Front text cannot exceed ${MAX_FRONT_LENGTH} characters`),
  back: z
    .string()
    .min(1, "Back text is required")
    .max(MAX_BACK_LENGTH, `Back text cannot exceed ${MAX_BACK_LENGTH} characters`),
  source: flashcardSourceSchema,
  generation_id: z.string().uuid().optional(),
});

// Schema for the entire create flashcards request
export const createFlashcardsSchema = z.object({
  flashcards: z
    .array(createFlashcardSchema)
    .min(1, "At least one flashcard is required")
    .max(100, "Maximum 100 flashcards can be created at once"),
});

// Schema for GET /flashcards query parameters
export const GetFlashcardsQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["pending", "accepted", "rejected"] as const)
    .array()
    .default(["pending", "accepted", "rejected"]),
  sort_by: z.enum(["created_at", "updated_at"] as const).default("updated_at"),
});

export type GetFlashcardsQuery = z.infer<typeof GetFlashcardsQuerySchema>;

// Schema for GET /flashcards/:id parameter
export const flashcardIdSchema = z.object({
  id: z.string().uuid(),
});

export type FlashcardIdParam = z.infer<typeof flashcardIdSchema>;
