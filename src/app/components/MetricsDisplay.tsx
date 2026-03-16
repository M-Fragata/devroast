"use client";

import NumberFlow from "@number-flow/react";

interface MetricsDisplayProps {
  roastedCodesCount: number;
  avgScore: number;
}

export function MetricsDisplay({
  roastedCodesCount,
  avgScore,
}: MetricsDisplayProps) {
  return (
    <div className="flex gap-8">
      <div className="text-center">
        <NumberFlow
          value={roastedCodesCount}
          className="text-4xl font-bold"
          spinTiming={{ duration: 1000 }}
        />
        <p className="text-sm text-muted-foreground">Roasted Codes</p>
      </div>
      <div className="text-center">
        <NumberFlow
          value={avgScore}
          className="text-4xl font-bold"
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          spinTiming={{ duration: 1000 }}
        />
        <p className="text-sm text-muted-foreground">Avg Score</p>
      </div>
    </div>
  );
}
