import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, ClockIcon, FileTextIcon, XIcon } from "lucide-react";
import type { DashboardStatsViewModel } from "../types";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function SkeletonStatCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px]" />
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  stats: DashboardStatsViewModel | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Flashcards",
      value: stats.totalFlashcards,
      icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Pending Review",
      value: stats.pendingCount,
      icon: <ClockIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Accepted",
      value: stats.acceptedCount,
      icon: <CheckIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Rejected",
      value: stats.rejectedCount,
      icon: <XIcon className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
