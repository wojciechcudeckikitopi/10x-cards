import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { type FlashcardDTO } from "../../types";
import { FlashcardActions } from "./FlashcardActions";

interface FlashcardTableProps {
  flashcards: FlashcardDTO[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FlashcardTable({ flashcards, onEdit, onDelete }: FlashcardTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div className="rounded-md border" data-testid="flashcard-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Front</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flashcards.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center h-24 text-muted-foreground"
                data-testid="no-flashcards-message"
              >
                No flashcards found
              </TableCell>
            </TableRow>
          ) : (
            flashcards.map((flashcard) => (
              <TableRow key={flashcard.id} data-testid={`flashcard-row-${flashcard.id}`}>
                <TableCell>{truncateText(flashcard.front)}</TableCell>
                <TableCell>
                  <span
                    className={`capitalize ${
                      flashcard.status === "accepted"
                        ? "text-success"
                        : flashcard.status === "rejected"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                    data-testid={`flashcard-status-${flashcard.id}`}
                  >
                    {flashcard.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(flashcard.created_at)}</TableCell>
                <TableCell>
                  <FlashcardActions flashcardId={flashcard.id} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
