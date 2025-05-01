import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { getGenerationErrors } from "../../lib/services/generation-errors.service";
import { QueryParamsSchema } from "../../schemas/generation-error.schema";

// Disable prerendering for dynamic API route
export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Extract and validate query parameters
    const url = new URL(request.url);
    const queryResult = QueryParamsSchema.safeParse({
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    if (!queryResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { page, limit } = queryResult.data;

    // Fetch generation errors using the service
    const response = await getGenerationErrors(locals.supabase, DEFAULT_USER_ID, page, limit);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generation-errors endpoint:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
