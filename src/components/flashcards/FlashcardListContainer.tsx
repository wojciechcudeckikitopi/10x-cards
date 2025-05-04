import { useEffect, useState } from "react";
import type { FlashcardDTO, PaginatedResponse, Pagination, UpdateFlashcardDTO } from "../../types";
import { EditFlashcardModal } from "../EditFlashcardModal";
import type { ProposedFlashcardViewModel } from "../GenerateFlashcardsForm";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { FlashcardTable } from "./FlashcardTable";
import { PaginationControls } from "./PaginationControls";

interface FlashcardListContainerState {
  flashcards: FlashcardDTO[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  editingFlashcardId: string | null;
  deletingFlashcardId: string | null;
  isDeleting: boolean;
}

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
};

export function FlashcardListContainer() {
  const [state, setState] = useState<FlashcardListContainerState>({
    flashcards: [],
    pagination: DEFAULT_PAGINATION,
    isLoading: true,
    error: null,
    editingFlashcardId: null,
    deletingFlashcardId: null,
    isDeleting: false,
  });

  const fetchFlashcards = async (page = 1) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch(`/api/flashcards?page=${page}&limit=${DEFAULT_PAGINATION.limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }

      const data: PaginatedResponse<FlashcardDTO> = await response.json();
      setState((prev) => ({
        ...prev,
        flashcards: data.data,
        pagination: data.pagination,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred while fetching flashcards",
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleEdit = (id: string) => {
    setState((prev) => ({ ...prev, editingFlashcardId: id }));
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({ ...prev, deletingFlashcardId: id }));
  };

  const handlePageChange = (page: number) => {
    fetchFlashcards(page);
  };

  const handleSaveEdit = async (updatedCardData: { front: string; back: string }) => {
    if (!state.editingFlashcardId) return;

    try {
      const response = await fetch(`/api/flashcards/${state.editingFlashcardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedCardData, status: "accepted" } as UpdateFlashcardDTO),
      });

      if (!response.ok) {
        throw new Error("Failed to update flashcard");
      }

      const updatedFlashcard: FlashcardDTO = await response.json();
      setState((prev) => ({
        ...prev,
        flashcards: prev.flashcards.map((card) => (card.id === updatedFlashcard.id ? updatedFlashcard : card)),
        editingFlashcardId: null,
      }));
    } catch (error) {
      console.error("Error updating flashcard:", error);
      // You might want to show an error toast here
    }
  };

  const handleConfirmDelete = async () => {
    if (!state.deletingFlashcardId) return;

    try {
      setState((prev) => ({ ...prev, isDeleting: true }));
      const response = await fetch(`/api/flashcards/${state.deletingFlashcardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flashcard");
      }

      setState((prev) => ({
        ...prev,
        flashcards: prev.flashcards.filter((card) => card.id !== state.deletingFlashcardId),
        deletingFlashcardId: null,
        isDeleting: false,
      }));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      setState((prev) => ({ ...prev, isDeleting: false }));
      // You might want to show an error toast here
    }
  };

  const editingCard = state.editingFlashcardId
    ? state.flashcards.find((card) => card.id === state.editingFlashcardId)
    : null;

  const mappedEditingCard: ProposedFlashcardViewModel | null = editingCard
    ? {
        tempId: editingCard.id,
        front: editingCard.front,
        back: editingCard.back,
        reviewStatus: "pending",
        generation_id: editingCard.generation_id || editingCard.id, // Fallback to id if no generation_id
        source: editingCard.source,
      }
    : null;

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">{state.error}</p>
        <button
          onClick={() => fetchFlashcards()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FlashcardTable flashcards={state.flashcards} onEdit={handleEdit} onDelete={handleDelete} />
      {state.flashcards.length > 0 && (
        <PaginationControls pagination={state.pagination} onPageChange={handlePageChange} />
      )}
      <EditFlashcardModal
        isOpen={!!state.editingFlashcardId}
        onClose={() => setState((prev) => ({ ...prev, editingFlashcardId: null }))}
        card={mappedEditingCard}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmationDialog
        isOpen={!!state.deletingFlashcardId}
        onClose={() => setState((prev) => ({ ...prev, deletingFlashcardId: null }))}
        onConfirm={handleConfirmDelete}
        isDeleting={state.isDeleting}
      />
    </div>
  );
}
