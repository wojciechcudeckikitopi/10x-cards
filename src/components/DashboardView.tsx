import { useEffect, useState } from "react";
import type { DashboardStatsViewModel } from "../types";
import { ActionButtons } from "./ActionButtons";
import { StatsCards } from "./StatsCards";

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStatsViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all stats concurrently
        const responses = await Promise.all([
          fetch("/api/flashcards?limit=1"),
          fetch("/api/flashcards?status=pending&limit=1"),
          fetch("/api/flashcards?status=accepted&limit=1"),
          fetch("/api/flashcards?status=rejected&limit=1"),
        ]);

        // Check if any response failed
        const failedResponse = responses.find((r) => !r.ok);
        if (failedResponse) {
          throw new Error(`Failed to fetch stats: ${failedResponse.statusText}`);
        }

        // Parse all responses
        const [total, pending, accepted, rejected] = await Promise.all(responses.map((r) => r.json()));

        setStats({
          totalFlashcards: total.pagination.total,
          pendingCount: pending.pagination.total,
          acceptedCount: accepted.pagination.total,
          rejectedCount: rejected.pagination.total,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">{error}</div>
      ) : (
        <>
          <StatsCards stats={stats} isLoading={isLoading} />
          <ActionButtons />
        </>
      )}
    </div>
  );
}
