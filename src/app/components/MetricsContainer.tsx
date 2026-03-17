"use client";

import { trpc } from "@/lib/trpc-client";
import { MetricsDisplay } from "./MetricsDisplay";

export function MetricsContainer() {
  const { data, isLoading, error } = trpc.metrics.useQuery();

  // Use 0 as initial value for NumberFlow animation
  const roastedCodesCount = data?.roastedCodesCount ?? 0;
  const avgScore = data?.avgScore ?? 0;

  if (error) {
    return (
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500">!</div>
          <p className="text-sm text-muted-foreground">Error loading metrics</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-400">...</div>
          <p className="text-sm text-muted-foreground">Roasted Codes</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-400">...</div>
          <p className="text-sm text-muted-foreground">Avg Score</p>
        </div>
      </div>
    );
  }

  return <MetricsDisplay roastedCodesCount={roastedCodesCount} avgScore={avgScore} />;
}
