import { Button } from "@/components/ui/button";
import type { ProposedFlashcardViewModel } from "./GenerateFlashcardsForm";
import { ProposedFlashcardItem } from "./ProposedFlashcardItem";

interface ProposedFlashcardListProps {
  flashcards: ProposedFlashcardViewModel[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (card: ProposedFlashcardViewModel) => void;
  onSaveAll: () => void;
  onSaveAccepted: () => void;
  isSaving?: boolean;
}

export function ProposedFlashcardList({
  flashcards,
  onAccept,
  onReject,
  onEdit,
  onSaveAll,
  onSaveAccepted,
  isSaving = false,
}: ProposedFlashcardListProps) {
  const hasCards = flashcards.length > 0;
  const hasPendingCards = flashcards.some((card) => card.reviewStatus === "pending");
  const hasAcceptedCards = flashcards.some((card) => card.reviewStatus === "accepted");

  return (
    <div className="space-y-6">
      {hasCards && (
        <div className="flex gap-4 flex-wrap">
          <Button
            variant="primary"
            onClick={onSaveAll}
            disabled={!hasPendingCards || isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save All"}
          </Button>
          <Button
            variant="secondary"
            onClick={onSaveAccepted}
            disabled={!hasAcceptedCards || isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save Accepted"}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flashcards.map((card) => (
          <ProposedFlashcardItem
            key={card.tempId}
            card={card}
            onAccept={onAccept}
            onReject={onReject}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
