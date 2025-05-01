import type { SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import type {
  FlashcardDTO,
  FlashcardProposalDTO,
  GenerationCreateResponseDTO,
  GenerationDetailsDTO,
  GenerationDTO,
  GenerationInsert,
  GenerationRow,
  PaginatedResponse,
} from "../../types";
import type { GenerationQueryParams } from "../schemas/generation.schema";

export class GenerationsService {
  constructor(private readonly supabase: SupabaseClient) {}

  private generateTextHash(text: string): string {
    return createHash("sha256").update(text).digest("hex");
  }

  private generateMockFlashcards(): FlashcardProposalDTO[] {
    return [
      {
        front: "What is TypeScript?",
        back: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
        source: "ai",
      },
      {
        front: "What are the benefits of using TypeScript?",
        back: "TypeScript offers static typing, better IDE support, early error detection, and improved code maintainability through type annotations.",
        source: "ai",
      },
      {
        front: "How does TypeScript relate to JavaScript?",
        back: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output, meaning any valid JavaScript code is also valid TypeScript code.",
        source: "ai",
      },
    ];
  }

  async createGeneration(userId: string, sourceText: string): Promise<GenerationCreateResponseDTO> {
    const sourceTextHash = this.generateTextHash(sourceText);
    const sourceTextLength = sourceText.length;
    const mockFlashcards = this.generateMockFlashcards();

    const { data: generation, error } = await this.supabase
      .from("generations")
      .insert({
        user_id: userId,
        source_text_hash: sourceTextHash,
        source_text_length: sourceTextLength,
        generated_count: mockFlashcards.length,
        llm_model: "gpt-4o-mini",
        generation_duration: 1000,
      } as GenerationInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create generation: ${error.message}`);
    }

    return {
      generation_id: generation.id,
      flashcards: mockFlashcards,
      generated_count: mockFlashcards.length,
    };
  }

  /**
   * Fetches a paginated list of generations for a given user
   */
  async getGenerations(
    userId: string,
    { page, limit, date, llm_model }: GenerationQueryParams
  ): Promise<PaginatedResponse<GenerationDTO>> {
    let query = this.supabase
      .from("generations")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("generated_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (date) {
      // Assuming date is in ISO format for now
      query = query.gte("generated_at", date);
    }

    if (llm_model) {
      query = query.eq("llm_model", llm_model);
    }

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch generations: ${error.message}`);
    }

    return {
      data: (data as GenerationRow[]).map(this.mapToDTO),
      pagination: {
        page,
        limit,
        total: count ?? 0,
      },
    };
  }

  /**
   * Maps a database row to a DTO
   */
  private mapToDTO(row: GenerationRow): GenerationDTO {
    const { ...dto } = row;
    return dto;
  }

  /**
   * Fetches detailed information about a specific generation including associated flashcards
   */
  async getGenerationDetails(generationId: string, userId: string): Promise<GenerationDetailsDTO | null> {
    // Fetch the generation record
    const { data: generation, error: generationError } = await this.supabase
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .eq("user_id", userId)
      .single();

    if (generationError) {
      console.error("Error fetching generation:", generationError);
      throw new Error("Failed to fetch generation details");
    }

    if (!generation) {
      return null;
    }

    // Fetch associated flashcards
    const { data: flashcards, error: flashcardsError } = await this.supabase
      .from("flashcards")
      .select("*")
      .eq("generation_id", generationId)
      .eq("user_id", userId);

    if (flashcardsError) {
      console.error("Error fetching flashcards:", flashcardsError);
      throw new Error("Failed to fetch associated flashcards");
    }

    // Transform the data to match GenerationDetailsDTO
    const generationDTO: Omit<GenerationDTO, "user_id"> = generation;

    const flashcardsDTO: FlashcardDTO[] = flashcards.map((flashcard) => ({
      id: flashcard.id,
      created_at: flashcard.created_at,
      updated_at: flashcard.updated_at,
      front: flashcard.front,
      back: flashcard.back,
      status: flashcard.status,
      source: flashcard.source,
      generation_id: flashcard.generation_id,
    }));

    // Fetch error if exists
    const { data: error } = await this.supabase
      .from("generation_errors")
      .select("error_message")
      .eq("generation_id", generationId)
      .single();

    return {
      ...generationDTO,
      flashcards: flashcardsDTO,
      error: error?.error_message || null,
    };
  }
}
