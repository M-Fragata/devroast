import { avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leaderboardEntries, roasts, snippets } from "@/db/schema";
import { generateRoast } from "@/lib/gemini";
import { publicProcedure, router } from "@/server/trpc";

export const appRouter = router({
	metrics: publicProcedure.query(async () => {
		// Contar o número total de roasts (avaliações da IA)
		// em vez de snippets (códigos enviados)
		const totalCountResult = await db.select({ count: count() }).from(roasts);
		const totalCount = totalCountResult[0]?.count ?? 0;

		// Calcular a média de score do leaderboard
		// Usando o campo 'score' da tabela leaderboard_entries
		const avgScoreResult = await db
			.select({ avg: avg(leaderboardEntries.score) })
			.from(leaderboardEntries);
		const avgScoreRaw = avgScoreResult[0]?.avg;
		// Drizzle's avg returns null when there are no rows, so we need to handle that
		// Also handle potential string return from PostgreSQL
		let avgScore = 0;
		if (avgScoreRaw !== null && avgScoreRaw !== undefined) {
			avgScore =
				typeof avgScoreRaw === "string"
					? parseFloat(avgScoreRaw)
					: Number(avgScoreRaw);
		}

		return {
			roastedCodesCount: totalCount,
			// Format to 1 decimal place for display
			avgScore: Math.round(avgScore * 10) / 10,
		};
	}),
	leaderboard: publicProcedure.query(async () => {
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
	}),
	roast: router({
		create: publicProcedure
			.input(
				z.object({
					code: z.string().min(1).max(5000),
					language: z.string(),
					mood: z.enum(["serious", "roast"]),
				}),
			)
			.mutation(async ({ input }) => {
				try {
					const analysis = await generateRoast(
						input.code,
						input.language,
						input.mood,
					);

					const [snippet] = await db
						.insert(snippets)
						.values({
							title: input.code.split("\n")[0].slice(0, 100) || "Untitled",
							content: input.code,
							language: input.language,
							status:
								analysis.verdict === "needs_serious_help"
									? "critical"
									: analysis.verdict === "rough_around_edges"
										? "warning"
										: "good",
							evaluation: analysis.verdict,
						})
						.returning();

					const [roast] = await db
						.insert(roasts)
						.values({
							content: analysis.roast,
							mood: input.mood,
							snippetId: snippet.id,
							analysisJson: JSON.stringify(analysis),
						})
						.returning();

					const currentPeriod = new Date().toISOString().slice(0, 7);
					await db.insert(leaderboardEntries).values({
						snippetId: snippet.id,
						score: analysis.score,
						period: currentPeriod,
						rank: 0,
					});

					return { roastId: roast.id, snippetId: snippet.id };
				} catch (error) {
					console.error("Failed to create roast:", error);
					throw new Error("Failed to generate roast");
				}
			}),

		getById: publicProcedure
			.input(z.number().int())
			.query(async ({ input }) => {
				const roastData = await db
					.select({
						id: roasts.id,
						content: roasts.content,
						mood: roasts.mood,
						snippetId: roasts.snippetId,
						createdAt: roasts.createdAt,
						analysisJson: roasts.analysisJson,
						code: snippets.content,
						language: snippets.language,
						title: snippets.title,
					})
					.from(roasts)
					.innerJoin(snippets, eq(roasts.snippetId, snippets.id))
					.where(eq(roasts.id, input));

				if (!roastData[0]) return null;

				const analysis = JSON.parse(roastData[0].analysisJson || "{}");

				return {
					id: roastData[0].id,
					content: roastData[0].content,
					mood: roastData[0].mood,
					code: roastData[0].code,
					language: roastData[0].language,
					title: roastData[0].title,
					createdAt: roastData[0].createdAt,
					lines: roastData[0].code.split("\n").length,
					...analysis,
				};
			}),
	}),
});

export type AppRouter = typeof appRouter;
