"use client";

import { trpc } from "@/lib/trpc-client";
import { MetricsDisplay } from "./MetricsDisplay";
import { MetricsSkeleton } from "./MetricsSkeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

function MetricsContent() {
  const { data, isLoading, error } = trpc.metrics.useQuery();

  if (isLoading) return <MetricsSkeleton />;
  if (error) return <div>Error loading metrics</div>;
  if (!data) return <MetricsSkeleton />;

  return <MetricsDisplay roastedCodesCount={data.roastedCodesCount} avgScore={data.avgScore} />;
}

export function MetricsContainer() {
  return (
    <ErrorBoundary fallback={<div>Error loading metrics</div>}>
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
