import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateFlashcardDTO, FlashcardDTO, FlashcardInsert } from "../../types";

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
}
