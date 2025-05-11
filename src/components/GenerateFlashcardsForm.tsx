import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Feedback";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { Textarea } from "@/components/ui/Textarea";
import type {
  CreateFlashcardsCommand,
  FlashcardProposalDTO,
  GenerateFlashcardsCommand,
  GenerationCreateResponseDTO,
} from "@/types";
import { useState } from "react";
import { EditFlashcardModal } from "./EditFlashcardModal";
import { ProposedFlashcardList } from "./ProposedFlashcardList";

// Move this interface to a separate types file later if it grows
export interface ProposedFlashcardViewModel extends FlashcardProposalDTO {
  tempId: string;
  reviewStatus: "pending" | "accepted" | "rejected";
  generation_id: string;
}

export function GenerateFlashcardsForm() {
  const [sourceText, setSourceText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposedFlashcards, setProposedFlashcards] = useState<ProposedFlashcardViewModel[]>([]);
  const [editingCard, setEditingCard] = useState<ProposedFlashcardViewModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; message: string } | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSourceText(text);
    setCharCount(text.length);
  };

  const isValidTextLength = charCount >= 1000 && charCount <= 10000;

  const handleGenerate = async () => {
    if (!isValidTextLength) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_text: sourceText } as GenerateFlashcardsCommand),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards. Please try again.");
      }

      const data: GenerationCreateResponseDTO = await response.json();

      const proposedCards: ProposedFlashcardViewModel[] = data.flashcards.map((card, index) => ({
        ...card,
        tempId: `${data.generation_id}-${index}`,
        reviewStatus: "pending",
        generation_id: data.generation_id,
      }));

      setProposedFlashcards(proposedCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = (id: string) => {
    setProposedFlashcards((cards) =>
      cards.map((card) => (card.tempId === id ? { ...card, reviewStatus: "accepted" } : card))
    );
  };

  const handleReject = (id: string) => {
    setProposedFlashcards((cards) =>
      cards.map((card) => (card.tempId === id ? { ...card, reviewStatus: "rejected" } : card))
    );
  };

  const handleEdit = (card: ProposedFlashcardViewModel) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCard(null);
    setIsModalOpen(false);
  };

  const handleSaveEdit = ({ front, back }: { front: string; back: string }) => {
    if (!editingCard) return;

    setProposedFlashcards((cards) =>
      cards.map((card) =>
        card.tempId === editingCard.tempId
          ? {
              ...card,
              front,
              back,
              source: "ai-edited",
              reviewStatus: "accepted",
            }
          : card
      )
    );
  };

  const saveFlashcards = async (flashcardsToSave: ProposedFlashcardViewModel[]) => {
    setIsSaving(true);
    setError(null);

    try {
      const createFlashcardsCommand: CreateFlashcardsCommand = {
        flashcards: flashcardsToSave.map((card) => ({
          front: card.front,
          back: card.back,
          source: card.source,
          generation_id: card.generation_id,
          status: card.reviewStatus,
        })),
      };

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createFlashcardsCommand),
      });

      if (!response.ok) {
        throw new Error("Failed to save flashcards. Please try again.");
      }

      // Remove saved cards from the list
      setProposedFlashcards((cards) =>
        cards.filter((card) => !flashcardsToSave.some((saved) => saved.tempId === card.tempId))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = () => {
    const cardsToSave = proposedFlashcards.filter(
      (card) => card.reviewStatus === "pending" || card.reviewStatus === "accepted" || card.reviewStatus === "rejected"
    );
    saveFlashcards(cardsToSave);
    setFeedback({
      show: true,
      message: `Successfully saved ${cardsToSave.length} flashcard${cardsToSave.length === 1 ? "" : "s"}`,
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveAccepted = () => {
    const acceptedCards = proposedFlashcards.filter((card) => card.reviewStatus === "accepted");
    saveFlashcards(acceptedCards);
    setFeedback({
      show: true,
      message: `Successfully saved ${acceptedCards.length} accepted flashcard${acceptedCards.length === 1 ? "" : "s"}`,
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Textarea
          placeholder="Enter your text here (1,000 - 10,000 characters)..."
          value={sourceText}
          onChange={handleTextChange}
          className="min-h-[200px] max-h-[400px]"
          disabled={isGenerating}
        />
        <div className="flex justify-between items-center text-sm">
          <span className={`${!isValidTextLength && charCount > 0 ? "text-red-500" : "text-gray-500"}`}>
            {charCount} characters
          </span>
          {charCount > 0 && !isValidTextLength && (
            <span className="text-red-500">Text must be between 1,000 and 10,000 characters</span>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError("")}>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isGenerating && <LoadingIndicator />}

      <Button onClick={handleGenerate} disabled={!isValidTextLength || isGenerating} className="w-full sm:w-auto">
        {isGenerating ? "Generating..." : "Generate Flashcards"}
      </Button>

      {proposedFlashcards.length > 0 && (
        <ProposedFlashcardList
          flashcards={proposedFlashcards}
          onAccept={handleAccept}
          onReject={handleReject}
          onEdit={handleEdit}
          onSaveAll={handleSaveAll}
          onSaveAccepted={handleSaveAccepted}
          isSaving={isSaving}
        />
      )}

      <EditFlashcardModal isOpen={isModalOpen} onClose={handleCloseModal} card={editingCard} onSave={handleSaveEdit} />

      {feedback?.show && (
        <Toast
          variant="success"
          title={feedback.message}
          className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5"
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
}
