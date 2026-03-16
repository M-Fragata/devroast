import type { Metadata } from "next";
import { LeaderboardRow } from "@/app/components/ui/leaderboard-row";
import { db } from "@/db";
import { leaderboardEntries, snippets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Leaderboard - DevRoast",
	description: "The worst code on the internet, ranked by shame",
};

async function getLeaderboardData() {
	// Fetch leaderboard entries with their associated snippets
	const data = await db
		.select({
			rank: leaderboardEntries.rank,
			score: leaderboardEntries.score,
			code: snippets.content,
			language: snippets.language,
			snippetId: leaderboardEntries.snippetId,
		})
		.from(leaderboardEntries)
		.innerJoin(snippets, eq(leaderboardEntries.snippetId, snippets.id))
		.orderBy(leaderboardEntries.rank)
		.limit(10);

	return data;
}

export default async function LeaderboardPage() {
	const leaderboardData = await getLeaderboardData();

	return (
		<div className="min-h-screen bg-bg-page text-foreground font-mono">

			{/* Main Content */}
			<main className="flex flex-col items-center py-6 md:py-10 px-4 md:px-10 space-y-6 md:space-y-10">
				{/* Hero Section */}
				<div className="flex flex-col items-center gap-2 md:gap-3 text-center max-w-2xl w-full">
					<div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
						<span className="text-accent-amber text-2xl md:text-4xl font-bold">$</span>
						<h1 className="text-foreground text-xl md:text-4xl font-bold">
							shame_leaderboard
						</h1>
					</div>
					<p className="text-text-secondary text-sm md:text-base font-normal">
						{'//'} the worst code on the internet, ranked by shame
					</p>
				</div>

				{/* Leaderboard Entries */}
				<div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
					{leaderboardData.length > 0 ? (
						leaderboardData.map((entry) => (
							<LeaderboardRow
								key={entry.snippetId}
								rank={entry.rank}
								score={entry.score}
								code={entry.code}
								language={entry.language}
								lines={entry.code.split("\n").length}
							/>
						))
					) : (
						<div className="text-center py-10 text-text-secondary">
							No leaderboard entries found.
						</div>
					)}

					{/* Footer */}
					<div className="text-center py-3 md:py-4 text-text-tertiary text-xs md:text-sm px-4">
						showing top {leaderboardData.length} of 2,847 · view full leaderboard &gt;
					</div>
				</div>
			</main>
		</div>
	);
}
