import { avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leaderboardEntries, roasts, snippets } from "@/db/schema";
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
});

export type AppRouter = typeof appRouter;
