"use client";
import { trpc } from "@/lib/trpc-client";
import { ShameCodeRow } from "./ui/shame-code-row";

export default function ShameLeaderboard() {
	const { data: worstSnippets, isLoading } = trpc.leaderboard.useQuery();

	if (isLoading) {
		return (
			<div className="w-full max-w-[960px] space-y-4 px-0 md:px-0">
				<div className="h-10 bg-gray-200 animate-pulse" />
				<div className="h-4 w-64 bg-gray-200 animate-pulse" />
			</div>
		);
	}

	const snippets = worstSnippets?.slice(0, 3) ?? [];

	return (
		<div className="w-full max-w-[960px] space-y-4 px-0 md:px-0">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 md:px-0">
				<div className="flex items-center gap-2">
					<span className="text-accent-green font-bold">{"//"}</span>
					<span className="text-foreground font-bold">shame_leaderboard</span>
				</div>
				<div className="flex items-center gap-1 px-3 py-1 border border-border-primary">
					<span className="text-text-secondary text-xs">$ view_all &gt;</span>
				</div>
			</div>
			<p className="text-text-tertiary text-xs md:text-sm px-4 md:px-0">
				{"//"} the worst code on the internet, ranked by shame
			</p>

			<div className="flex flex-col gap-4">
				{snippets.map((entry) => (
					<ShameCodeRow
						key={entry.snippetId}
						rank={entry.rank}
						score={entry.score}
						code={entry.code}
						language={entry.language}
						lines={entry.lines}
					/>
				))}
			</div>

			<div className="text-center py-3 text-text-tertiary text-xs px-4">
				showing top 3 of {snippets.length} · view full leaderboard &gt;
			</div>
		</div>
	);
}
