"use client";

import { trpc } from "@/lib/trpc-client";
import { MetricsDisplay } from "./MetricsDisplay";

export function MetricsContainer() {
  const { data, isLoading, error } = trpc.metrics.useQuery();

  // Use 0 as initial value for NumberFlow animation
  const roastedCodesCount = data?.roastedCodesCount ?? 0;
  const avgScore = data?.avgScore ?? 0;

  if (error) return <div>Error loading metrics</div>;

  return <MetricsDisplay roastedCodesCount={roastedCodesCount} avgScore={avgScore} />;
}
