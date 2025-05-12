import { Button } from "@/components/ui/button";
import { BrainIcon, ListIcon, Wand2Icon } from "lucide-react";

interface ActionButtonsProps {
  isLoading?: boolean;
}

export function ActionButtons({ isLoading = false }: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row" data-testid="dashboard-actions">
      <Button
        className="flex-1"
        onClick={() => (window.location.href = "/generate")}
        data-testid="generate-flashcards-button"
        disabled={isLoading}
      >
        <Wand2Icon className="mr-2 h-4 w-4" />
        Generate AI Flashcards
      </Button>
      <Button
        className="flex-1"
        variant="tertiary"
        onClick={() => (window.location.href = "/flashcards")}
        data-testid="view-flashcards-button"
        disabled={isLoading}
      >
        <ListIcon className="mr-2 h-4 w-4" />
        View All Flashcards
      </Button>
      <Button
        className="flex-1"
        variant="secondary"
        onClick={() => (window.location.href = "/study")}
        data-testid="start-study-button"
        disabled={isLoading}
      >
        <BrainIcon className="mr-2 h-4 w-4" />
        Start Study Session
      </Button>
    </div>
  );
}
