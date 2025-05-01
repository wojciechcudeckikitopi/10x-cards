import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerationErrorDTO, PaginatedResponse } from "../../types";

export async function getGenerationErrors(
  supabase: SupabaseClient,
  userId: string,
  page: number,
  limit: number
): Promise<PaginatedResponse<GenerationErrorDTO>> {
  // Calculate offset based on page and limit
  const offset = page * limit;

  // Get total count of records for pagination
  const { count } = await supabase
    .from("generation_errors")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get paginated records
  const { data: errors, error } = await supabase
    .from("generation_errors")
    .select(
      `
      id,
      source_text_hash,
      source_text_length,
      error_message,
      llm_model,
      created_at
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching generation errors:", error);
    throw new Error("Failed to fetch generation errors");
  }

  if (!errors) {
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  }

  return {
    data: errors,
    pagination: {
      page,
      limit,
      total: count || 0,
    },
  };
}
