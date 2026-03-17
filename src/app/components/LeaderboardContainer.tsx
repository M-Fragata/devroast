"use client";

import { LeaderboardRow } from "@/app/components/ui/leaderboard-row";
import { trpc } from "@/lib/trpc-client";

interface LeaderboardEntry {
	rank: number;
	score: number;
	code: string;
	language: string;
	snippetId: number;
	lines: number;
}

interface LeaderboardContainerProps {
	initialData?: LeaderboardEntry[];
}

export function LeaderboardContainer({
	initialData,
}: LeaderboardContainerProps) {
	const { data, isLoading, error } = trpc.leaderboard.useQuery(undefined, {
		enabled: !initialData,
	});

	const entries = initialData ?? data;

	if (!initialData && isLoading) {
		return (
			<div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
				<div className="text-center py-10 text-text-secondary">
					Loading leaderboard...
				</div>
			</div>
		);
	}

	if (!initialData && error) {
		return (
			<div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
				<div className="text-center py-10 text-text-secondary">
					Error loading leaderboard: {error.message}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
			{entries && entries.length > 0 ? (
				entries.map((entry) => (
					<LeaderboardRow
						key={entry.snippetId}
						rank={entry.rank}
						score={entry.score}
						code={entry.code}
						language={entry.language}
						lines={entry.lines}
					/>
				))
			) : (
				<div className="text-center py-10 text-text-secondary">
					No leaderboard entries found.
				</div>
			)}

			{/* Footer */}
			<div className="text-center py-3 md:py-4 text-text-tertiary text-xs md:text-sm px-4">
				showing top {entries?.length ?? 0} · view full leaderboard &gt;
			</div>
		</div>
	);
}
