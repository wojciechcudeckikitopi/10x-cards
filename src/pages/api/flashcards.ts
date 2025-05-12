import type { APIRoute } from "astro";
import { AuthenticationError, getCurrentUser } from "../../lib/auth";
import { createFlashcardsSchema, GetFlashcardsQuerySchema } from "../../lib/schemas/flashcard.schema";
import { FlashcardsService } from "../../lib/services/flashcards.service";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // eslint-disable-next-line
    const user = await getCurrentUser({ locals } as any);

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
    const createdFlashcards = await flashcardsService.createFlashcards(user.id, validationResult.data.flashcards);

    return new Response(JSON.stringify(createdFlashcards), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating flashcards:", error);

    if (error instanceof AuthenticationError) {
      return new Response(
        JSON.stringify({
          error: "Authentication failed",
          message: error.message,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // eslint-disable-next-line
    const user = await getCurrentUser({ locals } as any);

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryResult = GetFlashcardsQuerySchema.safeParse({
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      status: url.searchParams.getAll("status").length > 0 ? url.searchParams.getAll("status") : undefined,
      sort_by: url.searchParams.get("sort_by") ?? undefined,
    });

    if (!queryResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryResult.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get flashcards using service
    const flashcardsService = new FlashcardsService(locals.supabase);
    const result = await flashcardsService.getFlashcards(user.id, queryResult.data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching flashcards:", error);

    if (error instanceof AuthenticationError) {
      return new Response(
        JSON.stringify({
          error: "Authentication failed",
          message: error.message,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
