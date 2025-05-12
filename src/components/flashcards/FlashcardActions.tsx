import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

interface FlashcardActionsProps {
  flashcardId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FlashcardActions({ flashcardId, onEdit, onDelete }: FlashcardActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="tertiary" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(flashcardId)} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onDelete(flashcardId)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 focus:text-red-700"
        >
          <Trash className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
