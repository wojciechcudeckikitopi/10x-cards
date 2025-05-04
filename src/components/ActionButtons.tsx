import { BrainIcon, ListIcon, Wand2Icon } from "lucide-react";
import { Button } from "./ui/Button";

export function ActionButtons() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button className="flex-1" onClick={() => (window.location.href = "/generate")}>
        <Wand2Icon className="mr-2 h-4 w-4" />
        Generate AI Flashcards
      </Button>
      <Button className="flex-1" variant="tertiary" onClick={() => (window.location.href = "/flashcards")}>
        <ListIcon className="mr-2 h-4 w-4" />
        View All Flashcards
      </Button>
      <Button className="flex-1" variant="secondary" onClick={() => (window.location.href = "/study")}>
        <BrainIcon className="mr-2 h-4 w-4" />
        Start Study Session
      </Button>
    </div>
  );
}
