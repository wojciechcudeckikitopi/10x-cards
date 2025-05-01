import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { createFlashcardsSchema } from "../../lib/schemas/flashcard.schema";
import { FlashcardsService } from "../../lib/services/flashcards.service";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createFlashcardsSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create flashcards using service
    const flashcardsService = new FlashcardsService(locals.supabase);
    const createdFlashcards = await flashcardsService.createFlashcards(
      DEFAULT_USER_ID,
      validationResult.data.flashcards
    );

    return new Response(JSON.stringify(createdFlashcards), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating flashcards:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
