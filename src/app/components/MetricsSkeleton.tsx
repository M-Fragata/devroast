export function MetricsSkeleton() {
  return (
    <div className="flex gap-8">
      <div className="text-center">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Roasted Codes</p>
      </div>
      <div className="text-center">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Avg Score</p>
      </div>
    </div>
  );
}
