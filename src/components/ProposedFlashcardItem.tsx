import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import type { ProposedFlashcardViewModel } from "./GenerateFlashcardsForm";

interface ProposedFlashcardItemProps {
  card: ProposedFlashcardViewModel;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (card: ProposedFlashcardViewModel) => void;
}

export function ProposedFlashcardItem({ card, onAccept, onReject, onEdit }: ProposedFlashcardItemProps) {
  const statusColors = {
    pending: "bg-white",
    accepted: "bg-green-50 border-green-200",
    rejected: "bg-gray-50 border-gray-200 opacity-50",
  } as const;

  return (
    <Card className={`${statusColors[card.reviewStatus]} transition-colors`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="font-medium">{card.front}</div>
          {card.reviewStatus === "pending" && (
            <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 text-center">
              Pending Review
            </div>
          )}
          {card.reviewStatus === "accepted" && (
            <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Accepted</div>
          )}
          {card.reviewStatus === "rejected" && (
            <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Rejected</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-gray-600">{card.back}</p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        {card.reviewStatus === "pending" && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="border-green-200 hover:bg-green-50 hover:text-green-900"
              onClick={() => onAccept(card.tempId)}
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="border-red-200 hover:bg-red-50 hover:text-red-900"
              onClick={() => onReject(card.tempId)}
            >
              Reject
            </Button>
          </>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(card)}
          className={card.reviewStatus === "rejected" ? "opacity-50 cursor-not-allowed" : ""}
          disabled={card.reviewStatus === "rejected"}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
