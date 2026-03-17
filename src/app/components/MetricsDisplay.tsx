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
        <div className="text-4xl font-bold flex items-center justify-center gap-1">
          <NumberFlow
            value={avgScore}
            format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            spinTiming={{ duration: 1000 }}
          />
          <span className="text-xl text-muted-foreground">/10</span>
        </div>
        <p className="text-sm text-muted-foreground">Avg Score</p>
      </div>
    </div>
  );
}
