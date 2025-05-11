import type { APIRoute } from "astro";
import { AuthenticationError, getCurrentUser } from "../../lib/auth";
import { generateFlashcardsSchema, generationQuerySchema } from "../../lib/schemas/generation.schema";
import { GenerationsService } from "../../lib/services/generations.service";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // eslint-disable-next-line
    const user = await getCurrentUser({ locals } as any);
    const { supabase } = locals;

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validationResult = generationQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid parameters",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch generations using service
    const generationsService = new GenerationsService(supabase);
    const response = await generationsService.getGenerations(user.id, validationResult.data);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /generations:", error);

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

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // eslint-disable-next-line
    const user = await getCurrentUser({ locals } as any);
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
    const response = await generationsService.createGeneration(user.id, result.data.source_text);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);

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
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
