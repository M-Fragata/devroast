"use client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { RaySoCodeEditor } from "@/app/components/CodeEditor/RaySoCodeEditor";
import FooterMetrics from "@/app/components/FooterMetrics";
import { MetricsContainer } from "@/app/components/MetricsContainer";
import ShameLeaderboard from "@/app/components/ShameLeaderboard";
import ShameLeaderboardSkeleton from "@/app/components/ShameLeaderboardSkeleton";
import { trpc } from "@/lib/trpc-client";

export default function HomePage() {
	const router = useRouter();

	const createRoast = trpc.roast.create.useMutation({
		onSuccess: (data) => {
			router.push(`/result/${data.roastId}`);
		},
		onError: (error) => {
			alert(`Failed to create roast: ${error.message}`);
		},
	});

	const handleSubmit = (code: string, language: string, roastMode: boolean) => {
		createRoast.mutate({
			code,
			language,
			mood: roastMode ? "roast" : "serious",
		});
	};

	return (
		<div className="min-h-screen bg-bg-page text-foreground font-mono">
			{/* Main Content */}
			<main className="flex flex-col items-center py-6 md:py-10 px-4 md:px-10 space-y-6 md:space-y-10">
				{/* Hero Section */}
				<div className="flex flex-col items-center gap-2 md:gap-3 text-center max-w-2xl w-full">
					<div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
						<span className="text-accent-green text-2xl md:text-4xl font-bold">
							$
						</span>
						<h1 className="text-foreground text-xl md:text-4xl font-bold">
							paste your code. get roasted.
						</h1>
					</div>
					<p className="text-text-secondary text-sm md:text-base font-normal">
						{"//"} drop your code below and we{"'"}ll rate it — brutally honest
						or full roast mode
					</p>
				</div>

				{/* Code Editor Window - RESPONSIVE */}
				<RaySoCodeEditor onSubmit={handleSubmit} />

				{/* Footer Stats */}
				<div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-text-tertiary text-xs md:text-sm">
					<Suspense
						fallback={
							<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
						}
					>
						<FooterMetrics />
					</Suspense>
				</div>

				{/* Spacer */}
				<div className="h-8 md:h-[60px]" />

				{/* Shame Leaderboard Section - RESPONSIVE with Suspense */}
				<Suspense fallback={<ShameLeaderboardSkeleton />}>
					<ShameLeaderboard />
				</Suspense>
			</main>
		</div>
	);
}
