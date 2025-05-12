import { Skeleton } from "@/components/ui/skeleton";

export function LoadingIndicator() {
  return (
    <div className="space-y-4" data-testid="loading">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
