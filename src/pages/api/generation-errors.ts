import type { APIRoute } from "astro";
import { AuthenticationError, getCurrentUser } from "../../lib/auth";
import { getGenerationErrors } from "../../lib/services/generation-errors.service";
import { QueryParamsSchema } from "../../schemas/generation-error.schema";

// Disable prerendering for dynamic API route
export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const user = await getCurrentUser({ locals } as any);

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
    const response = await getGenerationErrors(locals.supabase, user.id, page, limit);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generation-errors endpoint:", error);

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
