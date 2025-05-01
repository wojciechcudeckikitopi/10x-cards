import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateFlashcardDTO, FlashcardDTO, FlashcardInsert, FlashcardRow, PaginatedResponse } from "../../types";
import type { GetFlashcardsQuery } from "../schemas/flashcard.schema";

export class FlashcardsService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createFlashcards(userId: string, flashcards: CreateFlashcardDTO[]): Promise<FlashcardDTO[]> {
    // Prepare flashcards with user_id and ensure generation_id is present
    const flashcardsToInsert: FlashcardInsert[] = flashcards.map((flashcard) => ({
      ...flashcard,
      user_id: userId,
      status: "pending" as const,
      // If generation_id is not provided, we'll use the flashcard's ID as generation_id
      generation_id: flashcard.generation_id ?? crypto.randomUUID(),
    }));

    // Insert flashcards in a batch
    const { data, error } = await this.supabase.from("flashcards").insert(flashcardsToInsert).select();

    if (error) {
      throw new Error(`Failed to create flashcards: ${error.message}`);
    }

    return data as FlashcardDTO[];
  }

  async getFlashcards(userId: string, query: GetFlashcardsQuery): Promise<PaginatedResponse<FlashcardDTO>> {
    const { page, limit, status, sort_by } = query;
    const offset = page * limit;

    // Start building the query
    let dbQuery = this.supabase
      .from("flashcards")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order(sort_by, { ascending: false });

    // Add status filter if not all statuses are selected
    if (status.length < 3) {
      dbQuery = dbQuery.in("status", status);
    }

    // Add pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await dbQuery;

    if (error) {
      throw new Error(`Failed to fetch flashcards: ${error.message}`);
    }

    // Transform to DTOs by removing user_id
    const flashcards = (data as FlashcardRow[]).map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user_id, ...dto } = row;
      return dto as FlashcardDTO;
    });

    return {
      data: flashcards,
      pagination: {
        page,
        limit,
        total: count ?? 0,
      },
    };
  }
}
