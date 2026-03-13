import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";

export default function Home() {
	// Static data from API (simulated)
	const leaderboardData = [
		{
			rank: 1,
			score: 1250,
			code: "def quick_sort(arr): ...",
			language: "python",
		},
		{
			rank: 2,
			score: 1180,
			code: "const sum = (a,b) => a+b",
			language: "typescript",
		},
		{
			rank: 3,
			score: 1100,
			code: "fn main() { println!(); }",
			language: "rust",
		},
		{
			rank: 4,
			score: 1050,
			code: "SELECT COUNT(*) FROM users",
			language: "sql",
		},
		{
			rank: 5,
			score: 980,
			code: "public static void main(...)",
			language: "java",
		},
		{ rank: 6, score: 920, code: "#include <iostream>", language: "cpp" },
		{ rank: 7, score: 850, code: "package main", language: "go" },
		{ rank: 8, score: 790, code: "let x = 5", language: "javascript" },
	];

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
			{/* Hero Section */}
			<section className="text-center space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">
					DevRoast - Compartilhe seu código
				</h1>
				<p className="text-lg text-text-secondary">
					Compartilhe seus códigos e ganhe feedback da comunidade.
				</p>
				<div className="flex justify-center">
					<ScoreRing score={75} size={200} />
				</div>
			</section>

			{/* Submit Code Form Section */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">
					PASTE YOUR CODE. GET ROASTED.
				</h2>
				<Card variant="analysis">
					<CardHeader>
						<CardTitle>Share a snippet</CardTitle>
						<CardDescription>
							Paste your code and get feedback from the community.
						</CardDescription>
					</CardHeader>
					<div className="p-4 space-y-4">
						<textarea
							className="w-full h-32 p-3 border border-border-primary rounded-md bg-background text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-ring"
							placeholder="Paste your code here..."
						/>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<label
									htmlFor="poast-mode"
									className="text-sm text-text-secondary"
								>
									Poast mode:
								</label>
								<Input
									type="text"
									id="poast-mode"
									className="w-40"
									placeholder="normal, roast..."
								/>
							</div>
							<Button variant="submit" size="submit">
								Submit
							</Button>
						</div>
					</div>
				</Card>
			</section>

			{/* Shame Leaderboard Section (worst evaluations) */}
			<section id="leaderboard" className="space-y-4">
				<h2 className="text-2xl font-semibold">Shame Leaderboard</h2>
				<Card>
					<CardHeader>
						<CardTitle>Worst Code Snippets</CardTitle>
						<CardDescription>
							Most roasted code snippets this month.
						</CardDescription>
					</CardHeader>
					<div className="divide-y divide-border-primary">
						{/* Reverse order to show worst first */}
						{[...leaderboardData].reverse().map((row, index) => (
							<LeaderboardRow
								key={row.rank}
								rank={leaderboardData.length - index}
								score={row.score}
								code={row.code}
								language={row.language}
							/>
						))}
					</div>
				</Card>
			</section>
		</div>
	);
}
