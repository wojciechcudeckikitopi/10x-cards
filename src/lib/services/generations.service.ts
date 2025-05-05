import type { SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import type {
  FlashcardDTO,
  GenerationCreateResponseDTO,
  GenerationDetailsDTO,
  GenerationDTO,
  GenerationInsert,
  GenerationRow,
  PaginatedResponse,
} from "../../types";
import { OpenRouterService } from "../openrouter.service";
import type { JSONSchema } from "../openrouter.types";
import type { GenerationQueryParams } from "../schemas/generation.schema";

const FLASHCARDS_SCHEMA: JSONSchema = {
  name: "flashcardsSchema",
  strict: true,
  schema: {
    type: "object",
    properties: {
      flashcards: {
        type: "array",
        items: {
          type: "object",
          properties: {
            front: {
              type: "string",
            },
            back: {
              type: "string",
            },
          },
          required: ["front", "back"],
          additionalProperties: false,
        },
      },
    },
    required: ["flashcards"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPT = `You are an expert educational assistant specializing in creating high-quality flashcards.
Your task is to analyze the provided text and create concise, effective flashcards following these rules:
1. Each flashcard should focus on a single concept
2. Front side should be a clear, specific question
3. Back side should provide a concise but complete answer
4. Avoid overly complex or compound questions
5. Ensure answers are accurate and directly related to the question
6. Use clear, simple language
7. Maintain consistency in formatting
8. Avoid yes/no questions
9. Front side maximum length: 200 characters
10. Back side maximum length: 500 characters

Return the flashcards in JSON format matching this schema:
{
  "flashcards": [
    {
      "front": "question text",
      "back": "answer text"
    }
  ]
}`;

export class GenerationsService {
  private readonly openRouter: OpenRouterService;

  constructor(private readonly supabase: SupabaseClient) {
    this.openRouter = new OpenRouterService({
      apiKey: import.meta.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  private generateTextHash(text: string): string {
    return createHash("sha256").update(text).digest("hex");
  }

  async createGeneration(userId: string, sourceText: string): Promise<GenerationCreateResponseDTO> {
    const startTime = Date.now();

    try {
      // Call OpenRouter API to generate flashcards
      const response = await this.openRouter.sendMessage<{ flashcards: { front: string; back: string }[] }>({
        systemMessage: SYSTEM_PROMPT,
        userMessage: sourceText,
        modelName: "openai/gpt-4o-mini",
        responseFormat: {
          type: "json_schema",
          json_schema: FLASHCARDS_SCHEMA,
        },
        modelParams: {
          temperature: 0.7,
          max_tokens: 2000,
        },
      });

      const generationDuration = Date.now() - startTime;
      const sourceTextHash = this.generateTextHash(sourceText);
      const sourceTextLength = sourceText.length;

      const flashcardProposals = response.data.flashcards.map((card) => ({
        ...card,
        source: "ai" as const,
      }));

      // Create generation record
      const { data: generation, error } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          source_text_hash: sourceTextHash,
          source_text_length: sourceTextLength,
          generated_count: flashcardProposals.length,
          llm_model: "gpt-4o-mini",
          generation_duration: generationDuration,
        } as GenerationInsert)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create generation: ${error.message}`);
      }

      return {
        generation_id: generation.id,
        flashcards: flashcardProposals,
        generated_count: flashcardProposals.length,
      };
    } catch (error) {
      // Store error information if generation fails
      const sourceTextHash = this.generateTextHash(sourceText);
      const sourceTextLength = sourceText.length;
      const generationDuration = Date.now() - startTime;

      const { data: generation } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          source_text_hash: sourceTextHash,
          source_text_length: sourceTextLength,
          generated_count: 0,
          llm_model: "gpt-4o-mini",
          generation_duration: generationDuration,
          status: "error",
        } as GenerationInsert)
        .select()
        .single();

      if (generation) {
        await this.supabase.from("generation_errors").insert({
          generation_id: generation.id,
          user_id: userId,
          error_message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }

      throw error;
    }
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
