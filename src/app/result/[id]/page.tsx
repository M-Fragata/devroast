import { eq } from "drizzle-orm";
import { ShareButton } from "@/app/components/share-button";
import { CodeBlock } from "@/app/components/ui/code-block";
import { db } from "@/db";
import { roasts, snippets } from "@/db/schema";
import type { RoastAnalysis } from "@/lib/gemini";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return {
		openGraph: {
			images: [{ url: `/api/og/${id}`, width: 1200, height: 630 }],
		},
	};
}

interface ResultPageProps {
	params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
	const { id } = await params;
	const roastId = parseInt(id);

	const roastData = await db
		.select({
			id: roasts.id,
			content: roasts.content,
			mood: roasts.mood,
			createdAt: roasts.createdAt,
			analysisJson: roasts.analysisJson,
			code: snippets.content,
			language: snippets.language,
			title: snippets.title,
		})
		.from(roasts)
		.innerJoin(snippets, eq(roasts.snippetId, snippets.id))
		.where(eq(roasts.id, roastId));

	if (!roastData[0]) {
		return (
			<div className="min-h-screen bg-bg-page text-foreground font-mono flex items-center justify-center">
				<div className="text-red-accent">Roast not found</div>
			</div>
		);
	}

	const data = roastData[0];

	let analysis: RoastAnalysis = {
		score: 5,
		verdict: "solid_work",
		roast: "",
		issues: [],
		diff: [],
	};
	try {
		const parsed = JSON.parse(data.analysisJson || "{}");
		if (parsed.score !== undefined) {
			analysis = parsed as RoastAnalysis;
		}
	} catch {
		console.warn("Failed to parse analysisJson for roast:", roastId);
	}

	const fullData = {
		id: data.id,
		content: data.content,
		mood: data.mood,
		code: data.code,
		language: data.language,
		title: data.title,
		createdAt: data.createdAt,
		lines: data.code.split("\n").length,
		...analysis,
	};

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
				return { dot: "bg-[#22C55E]", text: "text-[#22C55E]", label: "good" };
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
				<div className="w-full max-w-[960px] space-y-10 px-0 md:px-0">
					<div className="flex justify-end">
						<ShareButton url={id} />
					</div>

					<div className="flex items-center gap-12">
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
									strokeDashoffset={`${2 * Math.PI * 80 * (1 - (fullData.score || 5) / 10)}`}
								/>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-4xl font-bold text-accent-amber">
									{fullData.score || 5}
								</span>
								<span className="text-sm text-text-tertiary">/10</span>
							</div>
						</div>

						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-red-accent" />
								<span className="text-red-accent font-mono text-sm">
									verdict: {fullData.verdict || "solid_work"}
								</span>
							</div>

							<h2 className="text-text-primary font-mono text-xl leading-relaxed">
								{fullData.roast || fullData.content || "No roast available"}
							</h2>

							<div className="flex items-center gap-4">
								<span className="text-text-tertiary font-mono text-xs">
									lang: {fullData.language}
								</span>
								<span className="text-text-tertiary">·</span>
								<span className="text-text-tertiary font-mono text-xs">
									{fullData.lines} lines
								</span>
							</div>
						</div>
					</div>

					<div className="w-full h-px bg-border-primary" />

					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<span className="text-accent-green font-mono text-sm font-bold">
								{`//`}
							</span>
							<span className="text-text-primary font-mono text-sm font-bold">
								your_submission
							</span>
						</div>
						<CodeBlock
							code={fullData.code}
							language={fullData.language}
							className="w-full"
						/>
					</div>

					<div className="w-full h-px bg-border-primary" />

					{fullData.issues && fullData.issues.length > 0 && (
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<span className="text-accent-green font-mono text-sm font-bold">
									{`//`}
								</span>
								<span className="text-text-primary font-mono text-sm font-bold">
									detailed_analysis
								</span>
							</div>

							<div className="grid grid-cols-2 gap-5">
								{fullData.issues.map(
									(issue: RoastAnalysis["issues"][number], index: number) => {
										const status = getStatusColor(issue.status);
										return (
											<div
												key={index}
												className="p-5 border border-border-primary rounded space-y-2"
											>
												<div className="flex items-center gap-2">
													<div
														className={`w-2 h-2 rounded-full ${status.dot}`}
													/>
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
									},
								)}
							</div>
						</div>
					)}

					{fullData.diff && fullData.diff.length > 0 && (
						<>
							<div className="w-full h-px bg-border-primary" />

							<div className="space-y-6">
								<div className="flex items-center gap-2">
									<span className="text-accent-green font-mono text-sm font-bold">
										{`//`}
									</span>
									<span className="text-text-primary font-mono text-sm font-bold">
										suggested_fix
									</span>
								</div>

								<div className="bg-bg-input border border-border-primary rounded">
									<div className="h-10 flex items-center px-4 border-b border-border-primary">
										<span className="text-text-secondary font-mono text-xs">
											original → improved
										</span>
									</div>
									<div className="py-1">
										{fullData.diff.map(
											(line: RoastAnalysis["diff"][number], index: number) => {
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
											},
										)}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</main>
		</div>
	);
}
