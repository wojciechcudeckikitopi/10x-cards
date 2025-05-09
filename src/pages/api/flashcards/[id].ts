import type { APIRoute } from "astro";
import { AuthenticationError, getCurrentUser } from "../../../lib/auth";
import { flashcardIdSchema, updateFlashcardSchema } from "../../../lib/schemas/flashcard.schema";
import { FlashcardsService } from "../../../lib/services/flashcards.service";
import type { FlashcardDTO } from "../../../types";

// Disable prerendering for dynamic API route
export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const user = await getCurrentUser({ locals } as any);

    // Step 1: Validate the id parameter
    const result = flashcardIdSchema.safeParse(params);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID format",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { id } = result.data;
    const { supabase } = locals;

    const { data: flashcard, error: dbError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", id.toString())
      .eq("user_id", user.id)
      .single();

    if (dbError || !flashcard) {
      return new Response(JSON.stringify({ error: "Flashcard not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the flashcard data
    const flashcardDTO: FlashcardDTO = {
      id: flashcard.id,
      front: flashcard.front,
      back: flashcard.back,
      status: flashcard.status,
      source: flashcard.source,
      generation_id: flashcard.generation_id,
      created_at: flashcard.created_at,
      updated_at: flashcard.updated_at,
    };

    return new Response(JSON.stringify(flashcardDTO), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching flashcard:", error);

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

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const user = await getCurrentUser({ locals } as any);

    // Step 1: Validate the id parameter
    const idResult = flashcardIdSchema.safeParse(params);
    if (!idResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID format",
          details: idResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { id } = idResult.data;
    const { supabase } = locals;

    // Step 2: Parse and validate request body
    const body = await request.json();
    const updateResult = updateFlashcardSchema.safeParse(body);

    if (!updateResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: updateResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Step 3: Verify flashcard exists and belongs to user
    const { data: existingFlashcard, error: fetchError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingFlashcard) {
      return new Response(JSON.stringify({ error: "Flashcard not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 4: Update the flashcard
    const { data: updatedFlashcard, error: updateError } = await supabase
      .from("flashcards")
      .update(updateResult.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating flashcard:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update flashcard" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 5: Format and return response
    const flashcardDTO: FlashcardDTO = {
      id: updatedFlashcard.id,
      front: updatedFlashcard.front,
      back: updatedFlashcard.back,
      status: updatedFlashcard.status,
      source: updatedFlashcard.source,
      generation_id: updatedFlashcard.generation_id,
      created_at: updatedFlashcard.created_at,
      updated_at: updatedFlashcard.updated_at,
    };

    return new Response(JSON.stringify(flashcardDTO), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating flashcard:", error);

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

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const user = await getCurrentUser({ locals } as any);

    // Step 1: Validate the id parameter
    const result = flashcardIdSchema.safeParse(params);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID format",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { id } = result.data;
    const { supabase } = locals;

    // Step 2: Verify flashcard exists and belongs to user
    const { data: existingFlashcard, error: fetchError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingFlashcard) {
      return new Response(JSON.stringify({ error: "Flashcard not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 3: Delete the flashcard
    const flashcardsService = new FlashcardsService(supabase);
    await flashcardsService.deleteFlashcard(user.id, id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting flashcard:", error);

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
