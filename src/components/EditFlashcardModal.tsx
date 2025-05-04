import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useEffect, useState } from "react";
import type { ProposedFlashcardViewModel } from "./GenerateFlashcardsForm";

interface EditFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: ProposedFlashcardViewModel | null;
  onSave: (updatedCardData: { front: string; back: string }) => void;
}

export function EditFlashcardModal({ isOpen, onClose, card, onSave }: EditFlashcardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
      setFrontError(null);
      setBackError(null);
    }
  }, [card]);

  const validateFields = () => {
    let isValid = true;

    if (front.length === 0) {
      setFrontError("Front side cannot be empty");
      isValid = false;
    } else if (front.length > 200) {
      setFrontError("Front side cannot exceed 200 characters");
      isValid = false;
    } else {
      setFrontError(null);
    }

    if (back.length === 0) {
      setBackError("Back side cannot be empty");
      isValid = false;
    } else if (back.length > 500) {
      setBackError("Back side cannot exceed 500 characters");
      isValid = false;
    } else {
      setBackError(null);
    }

    return isValid;
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave({ front, back });
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      <DialogHeader>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogDescription>Make changes to your flashcard here. Click save when you&apos;re done.</DialogDescription>
      </DialogHeader>

      <DialogContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front Side</Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter the front side text (max 200 characters)"
              className={frontError ? "border-red-500" : ""}
              aria-invalid={!!frontError}
              aria-describedby={frontError ? "front-error" : undefined}
            />
            {frontError && (
              <p id="front-error" className="text-sm text-red-500" role="alert">
                {frontError}
              </p>
            )}
            <p className="text-sm text-gray-500">{front.length}/200 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Back Side</Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter the back side text (max 500 characters)"
              className={backError ? "border-red-500" : ""}
              aria-invalid={!!backError}
              aria-describedby={backError ? "back-error" : undefined}
            />
            {backError && (
              <p id="back-error" className="text-sm text-red-500" role="alert">
                {backError}
              </p>
            )}
            <p className="text-sm text-gray-500">{back.length}/500 characters</p>
          </div>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
