import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { GenerationsService } from "../../lib/services/generations.service";
import { generateFlashcardsSchema } from "../../lib/validations/generations";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { supabase } = locals;

    // Parse and validate request body
    const body = await request.json();
    const result = generateFlashcardsSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: result.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Process the generation request
    const generationsService = new GenerationsService(supabase);
    const response = await generationsService.createGeneration(DEFAULT_USER_ID, result.data.source_text);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
