import { db } from "@/db";
import { leaderboardEntries, roasts, snippets } from "@/db/schema";
import { count } from "drizzle-orm";

export default async function FooterMetrics() {
  // Fetch total roasts count
  const totalRoastsResult = await db.select({ count: count() }).from(roasts);
  const totalRoasts = totalRoastsResult[0]?.count ?? 0;

  // Fetch total snippets count
  const totalSnippetsResult = await db.select({ count: count() }).from(snippets);
  const totalSnippets = totalSnippetsResult[0]?.count ?? 0;

  // Fetch total leaderboard entries count
  const totalLeaderboardResult = await db.select({ count: count() }).from(leaderboardEntries);
  const totalLeaderboard = totalLeaderboardResult[0]?.count ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-text-tertiary text-xs md:text-sm">
      <span>{totalRoasts.toLocaleString()} codes roasted</span>
      <span className="hidden sm:inline">·</span>
      <span>{totalSnippets.toLocaleString()} snippets submitted</span>
      <span className="hidden sm:inline">·</span>
      <span>{totalLeaderboard.toLocaleString()} ranked entries</span>
    </div>
  );
}
