import type { APIRoute } from "astro";
import { flashcardIdSchema } from "../../../lib/schemas/flashcard.schema";
import type { FlashcardDTO } from "../../../types";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

// Disable prerendering for dynamic API route
export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
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

    // Query the flashcard using DEFAULT_USER_ID
    const { data: flashcard, error: dbError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", id.toString())
      .eq("user_id", DEFAULT_USER_ID)
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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
