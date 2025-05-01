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
