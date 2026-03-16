import type { Metadata } from "next";
import Link from "next/link";
import { LeaderboardRow } from "@/app/components/ui/leaderboard-row";

export const metadata: Metadata = {
	title: "Leaderboard - DevRoast",
	description: "The worst code on the internet, ranked by shame",
};

// Static data for SSR
const leaderboardData = [
	{
		rank: 1,
		score: 1.2,
		code: 'eval(prompt("enter code"))\ndocument.write(response)',
		language: "javascript",
	},
	{
		rank: 2,
		score: 1.8,
		code: "if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }",
		language: "typescript",
	},
	{
		rank: 3,
		score: 2.1,
		code: "SELECT * FROM users WHERE 1=1\n-- TODO: add authentication",
		language: "sql",
	},
	{
		rank: 4,
		score: 2.4,
		code: "const multiply = (a, b) => {\n  return a * b;\n}",
		language: "javascript",
	},
	{
		rank: 5,
		score: 2.7,
		code: "def calculate_sum(a, b):\n    return a + b",
		language: "python",
	},
];

export default function LeaderboardPage() {
	return (
		<div className="min-h-screen bg-bg-page text-foreground font-mono">
			{/* Navbar */}
			<nav className="flex items-center justify-between h-14 px-6 border-b border-border-primary bg-bg-page">
				<div className="flex items-center gap-2">
					<span className="text-accent-green font-mono font-bold">DevRoast</span>
				</div>
				<div className="flex-1" />
				<Link
					href="/leaderboard"
					className="text-sm text-text-secondary hover:text-foreground transition-colors"
				>
					Leaderboard
				</Link>
			</nav>

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

				{/* Leaderboard Table */}
				<div className="w-full max-w-[960px] space-y-4 px-0 md:px-0">
					{/* Table Header */}
					<div className="h-10 flex items-center px-4 md:px-5 bg-bg-surface border border-border-primary min-w-[500px]">
						<div className="w-10 md:w-[50px] text-text-tertiary text-xs font-medium">#</div>
						<div className="w-12 md:w-[70px] text-text-tertiary text-xs font-medium">score</div>
						<div className="flex-1 text-text-tertiary text-xs font-medium">code</div>
						<div className="w-16 md:w-[100px] text-text-tertiary text-xs font-medium">lang</div>
					</div>

					{/* Leaderboard Rows */}
					<div className="border border-border-primary">
						{leaderboardData.map((entry) => (
							<LeaderboardRow
								key={entry.rank}
								rank={entry.rank}
								score={entry.score}
								code={entry.code}
								language={entry.language}
							/>
						))}
					</div>

					{/* Footer */}
					<div className="text-center py-3 md:py-4 text-text-tertiary text-xs md:text-sm px-4">
						showing top {leaderboardData.length} of 2,847 · view full leaderboard &gt;
					</div>
				</div>
			</main>
		</div>
	);
}
