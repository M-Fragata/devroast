import { db } from "@/db";
import { leaderboardEntries, snippets } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ShameLeaderboard() {
  // Fetch 3 worst code snippets (lowest scores)
  const worstSnippets = await db
    .select({
      rank: leaderboardEntries.rank,
      score: leaderboardEntries.score,
      code: snippets.content,
      language: snippets.language,
      snippetId: leaderboardEntries.snippetId,
    })
    .from(leaderboardEntries)
    .innerJoin(snippets, eq(leaderboardEntries.snippetId, snippets.id))
    .orderBy(leaderboardEntries.score) // Ascending order (lowest scores first)
    .limit(3);

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

      {/* Table Container with border */}
      <div className="border border-border-primary">
        {/* Table Header */}
        <div className="h-10 flex items-center px-5 bg-bg-surface border-b border-border-primary">
          <div className="w-[50px] text-text-tertiary text-xs font-medium">#</div>
          <div className="w-[70px] text-text-tertiary text-xs font-medium">score</div>
          <div className="flex-1 text-text-tertiary text-xs font-medium">code</div>
          <div className="w-[100px] text-text-tertiary text-xs font-medium">lang</div>
        </div>

        {/* Table Rows */}
        {worstSnippets.map((entry, index) => (
          <div
            key={entry.snippetId}
            className={`flex items-center px-5 py-4 ${
              index < worstSnippets.length - 1 ? 'border-b border-border-primary' : ''
            }`}
          >
            {/* Rank Column */}
            <div className="w-[50px]">
              <span
                className={`font-mono text-xs ${
                  entry.rank === 1 ? 'text-accent-amber' : 'text-text-secondary'
                }`}
              >
                {entry.rank}
              </span>
            </div>

            {/* Score Column */}
            <div className="w-[70px]">
              <span className="font-mono text-xs font-bold text-accent-red">
                {entry.score.toFixed(1)}
              </span>
            </div>

            {/* Code Column */}
            <div className="flex-1 flex flex-col gap-1">
              {entry.code.split('\n').slice(0, 3).map((line, lineIndex) => (
                <span
                  key={lineIndex}
                  className="font-mono text-xs text-text-primary whitespace-pre-wrap"
                >
                  {line}
                </span>
              ))}
              {entry.code.split('\n').length > 3 && (
                <span className="font-mono text-xs text-text-secondary">
                  // ... more lines
                </span>
              )}
            </div>

            {/* Language Column */}
            <div className="w-[100px]">
              <span className="font-mono text-xs text-text-secondary">
                {entry.language}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-text-tertiary text-xs px-4">
        showing top 3 of {worstSnippets.length} · view full leaderboard &gt;
      </div>
    </div>
  );
}
