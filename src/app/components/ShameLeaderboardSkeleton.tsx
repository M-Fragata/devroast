export default function ShameLeaderboardSkeleton() {
  return (
    <div className="w-full max-w-[960px] space-y-4 px-0 md:px-0">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 md:px-0">
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-bold">{'//'}</span>
          <span className="text-foreground font-bold">shame_leaderboard</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 border border-border-primary">
          <span className="text-text-secondary text-xs">$ view_all &gt;</span>
        </div>
      </div>
      <p className="text-text-tertiary text-xs md:text-sm px-4 md:px-0">
        {'//'} the worst code on the internet, ranked by shame
      </p>

      {/* Table - Scrollable on mobile */}
      <div className="border border-border-primary overflow-x-auto">
        {/* Table Header */}
        <div className="h-10 flex items-center px-4 md:px-5 bg-bg-surface border-b border-border-primary min-w-[500px]">
          <div className="w-10 md:w-[50px] text-text-tertiary text-xs font-medium">#</div>
          <div className="w-12 md:w-[70px] text-text-tertiary text-xs font-medium">score</div>
          <div className="flex-1 text-text-tertiary text-xs font-medium">code</div>
          <div className="w-16 md:w-[100px] text-text-tertiary text-xs font-medium">lang</div>
        </div>

        {/* Skeleton Rows */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center px-4 md:px-5 py-3 md:py-4 border-b border-border-primary min-w-[500px]"
          >
            {/* Rank Skeleton */}
            <div className="w-10 md:w-[50px]">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </div>
            {/* Score Skeleton */}
            <div className="w-12 md:w-[70px]">
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
            {/* Code Skeleton */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
            {/* Language Skeleton */}
            <div className="w-16 md:w-[100px]">
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="text-center py-3 md:py-4 text-text-tertiary text-xs md:text-sm px-4">
        <div className="h-4 w-48 mx-auto bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
