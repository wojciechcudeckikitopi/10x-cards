import { DEFAULT_USER_ID } from "@/db/supabase.client";
import type { APIRoute } from "astro";
import { generationIdSchema } from "../../../lib/schemas/generation.schema";
import { GenerationsService } from "../../../lib/services/generations.service";

// Disable prerendering for dynamic API routes
export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    // Validate the generation ID
    const result = generationIdSchema.safeParse(params);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid generation ID format",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { supabase } = locals;
    const generationsService = new GenerationsService(supabase);

    // Fetch generation details
    const generationDetails = await generationsService.getGenerationDetails(result.data.id, DEFAULT_USER_ID);

    if (!generationDetails) {
      return new Response(
        JSON.stringify({
          error: "Generation not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(generationDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching generation:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
