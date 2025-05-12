import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, isDeleting }: DeleteConfirmationDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Delete Flashcard</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this flashcard? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-gray-500">
          Once you delete this flashcard, it will be permanently removed from your collection.
        </p>
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isDeleting}
          isLoading={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
