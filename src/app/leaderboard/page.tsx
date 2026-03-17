import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { LeaderboardContainer } from "@/app/components/LeaderboardContainer";
import { db } from "@/db";
import { leaderboardEntries, snippets } from "@/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Leaderboard - DevRoast",
	description: "The worst code on the internet, ranked by shame",
};

async function getLeaderboardData() {
	try {
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
			.orderBy(leaderboardEntries.score)
			.limit(20);

		return data.map((entry) => ({
			...entry,
			lines: entry.code.split("\n").length,
		}));
	} catch (error) {
		console.error("Failed to fetch leaderboard:", error);
		return [];
	}
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
						<span className="text-accent-amber text-2xl md:text-4xl font-bold">
							$
						</span>
						<h1 className="text-foreground text-xl md:text-4xl font-bold">
							shame_leaderboard
						</h1>
					</div>
					<p className="text-text-secondary text-sm md:text-base font-normal">
						{"//"} the worst code on the internet, ranked by shame
					</p>
				</div>

				{/* Leaderboard Entries */}
				<LeaderboardContainer initialData={leaderboardData} />
			</main>
		</div>
	);
}
