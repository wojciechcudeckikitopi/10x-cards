import type { APIRoute } from "astro";
import { AuthenticationError, getCurrentUser } from "../../../lib/auth";
import { generationIdSchema } from "../../../lib/schemas/generation.schema";
import { GenerationsService } from "../../../lib/services/generations.service";

// Disable prerendering for dynamic API routes
export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const user = await getCurrentUser({ locals } as any);

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
    const generationDetails = await generationsService.getGenerationDetails(result.data.id, user.id);

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
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
