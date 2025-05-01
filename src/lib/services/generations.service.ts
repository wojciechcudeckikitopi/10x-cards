import { createHash } from "crypto";
import type { SupabaseClient } from "../../db/supabase.client";
import type { FlashcardProposalDTO, GenerationCreateResponseDTO, GenerationInsert } from "../../types";

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
}
