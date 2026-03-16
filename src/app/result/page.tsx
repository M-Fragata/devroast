import type { Metadata } from "next";
import { CodeBlock } from "@/app/components/ui/code-block";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Result - DevRoast",
	description: "Your roast result",
};

export default async function ResultPage() {
	// Static data for now - will be replaced with dynamic data later
	const resultData = {
		score: 3.5,
		verdict: "needs_serious_help",
		verdictColor: "accent-red",
		roast:
			'"this code looks like it was written during a power outage... in 2005."',
		language: "javascript",
		lines: 7,
		code: `function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}`,
		issues: [
			{
				title: "Variable Naming",
				description: "Use descriptive variable names instead of single letters",
				status: "warning" as const,
			},
			{
				title: "Error Handling",
				description: "Add try-catch blocks for async operations",
				status: "critical" as const,
			},
			{
				title: "Code Structure",
				description: "Break down complex functions into smaller, focused units",
				status: "warning" as const,
			},
			{
				title: "Documentation",
				description: "Add JSDoc comments to explain function purpose",
				status: "good" as const,
			},
		],
		diff: {
			original: "your_code.ts",
			improved: "improved_code.ts",
			lines: [
				{ type: "context", content: "  function calculateTotal(items) {" },
				{ type: "remove", content: "    var total = 0;" },
				{
					type: "remove",
					content: "    for (var i = 0; i < items.length; i++) {",
				},
				{ type: "remove", content: "      total = total + items[i].price;" },
				{ type: "remove", content: "    }" },
				{ type: "remove", content: "    return total;" },
				{
					type: "add",
					content:
						"    return items.reduce((sum, item) => sum + item.price, 0);",
				},
				{ type: "context", content: "  }" },
			],
		},
	};

	// Helper to get status color
	const getStatusColor = (status: string) => {
		switch (status) {
			case "critical":
				return {
					dot: "bg-[#EF4444]",
					text: "text-[#EF4444]",
					label: "critical",
				};
			case "warning":
				return {
					dot: "bg-[#F59E0B]",
					text: "text-[#F59E0B]",
					label: "warning",
				};
			case "good":
				return {
					dot: "bg-[#22C55E]",
					text: "text-[#22C55E]",
					label: "good",
				};
			default:
				return {
					dot: "bg-gray-accent",
					text: "text-gray-accent",
					label: status,
				};
		}
	};

	return (
		<div className="min-h-screen bg-bg-page text-foreground font-mono">
			<main className="flex flex-col items-center py-6 md:py-10 px-4 md:px-10">
				{/* Results Content */}
				<div className="w-full max-w-[960px] space-y-10 px-0 md:px-0">
					{/* Score Hero */}
					<div className="flex items-center gap-12">
						{/* Score Ring */}
						<div className="relative w-[180px] h-[180px] flex items-center justify-center">
							<svg className="w-full h-full transform -rotate-90">
								<defs>
									<linearGradient
										id="scoreGradient"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="0%"
									>
										<stop offset="0%" stopColor="#EF4444" />
										<stop offset="35%" stopColor="#F59E0B" />
										<stop offset="65%" stopColor="#10B981" />
									</linearGradient>
								</defs>
								<circle
									cx="90"
									cy="90"
									r="80"
									fill="transparent"
									stroke="#1F1F1F"
									strokeWidth="4"
								/>
								<circle
									cx="90"
									cy="90"
									r="80"
									fill="transparent"
									stroke="url(#scoreGradient)"
									strokeWidth="4"
									strokeDasharray={`${2 * Math.PI * 80}`}
									strokeDashoffset={`${2 * Math.PI * 80 * (1 - resultData.score / 10)}`}
								/>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-4xl font-bold text-accent-amber">
									{resultData.score}
								</span>
								<span className="text-sm text-text-tertiary">/10</span>
							</div>
						</div>

						{/* Roast Summary */}
						<div className="flex-1 space-y-4">
							{/* Badge */}
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-red-accent" />
								<span className="text-red-accent font-mono text-sm">
									verdict: {resultData.verdict}
								</span>
							</div>

							{/* Roast Title */}
							<h2 className="text-text-primary font-mono text-xl leading-relaxed">
								{resultData.roast}
							</h2>

							{/* Meta */}
							<div className="flex items-center gap-4">
								<span className="text-text-tertiary font-mono text-xs">
									lang: {resultData.language}
								</span>
								<span className="text-text-tertiary">·</span>
								<span className="text-text-tertiary font-mono text-xs">
									{resultData.lines} lines
								</span>
							</div>

							{/* Share Buttons */}
							<div className="flex items-center gap-3">
								<button className="flex items-center gap-2 px-4 py-2 border border-border-primary rounded hover:bg-bg-surface transition-colors">
									<span className="text-text-secondary font-mono text-xs">
										share
									</span>
								</button>
								<button className="flex items-center gap-2 px-4 py-2 border border-border-primary rounded hover:bg-bg-surface transition-colors">
									<span className="text-text-secondary font-mono text-xs">
										copy
									</span>
								</button>
							</div>
						</div>
					</div>

					{/* Divider */}
					<div className="w-full h-px bg-border-primary" />

					{/* Submitted Code Section */}
					<div className="space-y-4">
						{/* Title */}
						<div className="flex items-center gap-2">
							<span className="text-accent-green font-mono text-sm font-bold">
								{"//"}
							</span>
							<span className="text-text-primary font-mono text-sm font-bold">
								your_submission
							</span>
						</div>

						{/* Code Preview using CodeBlock */}
						<CodeBlock
							code={resultData.code}
							language={resultData.language}
							className="w-full"
						/>
					</div>

					{/* Divider */}
					<div className="w-full h-px bg-border-primary" />

					{/* Analysis Section */}
					<div className="space-y-6">
						{/* Title */}
						<div className="flex items-center gap-2">
							<span className="text-accent-green font-mono text-sm font-bold">
								{"//"}
							</span>
							<span className="text-text-primary font-mono text-sm font-bold">
								detailed_analysis
							</span>
						</div>

						{/* Issues Grid */}
						<div className="grid grid-cols-2 gap-5">
							{resultData.issues.map((issue, index) => {
								const status = getStatusColor(issue.status);
								return (
									<div
										key={index}
										className="p-5 border border-border-primary rounded space-y-2"
									>
										<div className="flex items-center gap-2">
											<div className={`w-2 h-2 rounded-full ${status.dot}`} />
											<span
												className={`${status.text} font-mono text-xs font-medium`}
											>
												{status.label}
											</span>
										</div>
										<p className="text-text-primary font-mono text-sm font-medium">
											{issue.title}
										</p>
										<p className="text-text-secondary font-mono text-xs">
											{issue.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					{/* Divider */}
					<div className="w-full h-px bg-border-primary" />

					{/* Diff Section */}
					<div className="space-y-6">
						{/* Title */}
						<div className="flex items-center gap-2">
							<span className="text-accent-green font-mono text-sm font-bold">
								{"//"}
							</span>
							<span className="text-text-primary font-mono text-sm font-bold">
								suggested_fix
							</span>
						</div>

						{/* Diff Block */}
						<div className="bg-bg-input border border-border-primary rounded">
							{/* Header */}
							<div className="h-10 flex items-center px-4 border-b border-border-primary">
								<span className="text-text-secondary font-mono text-xs">
									{resultData.diff.original} → {resultData.diff.improved}
								</span>
							</div>

							{/* Diff Body */}
							<div className="py-1">
								{resultData.diff.lines.map((line, index) => {
									const bgColor =
										line.type === "remove"
											? "bg-[#EF444415]"
											: line.type === "add"
												? "bg-[#10B98115]"
												: "";
									const prefixColor =
										line.type === "remove"
											? "text-red-accent"
											: line.type === "add"
												? "text-green-accent"
												: "text-text-tertiary";
									const prefixContent =
										line.type === "remove"
											? "-"
											: line.type === "add"
												? "+"
												: " ";
									return (
										<div
											key={index}
											className={`h-7 flex items-center ${bgColor}`}
										>
											<span
												className={`w-5 text-center ${prefixColor} font-mono text-xs`}
											>
												{prefixContent}
											</span>
											<span className="text-xs text-text-primary font-mono">
												{line.content}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
