import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/db";
import { snippets, leaderboardEntries, roasts } from "@/db/schema";
import { count, avg } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  metrics: publicProcedure.query(async () => {
    // Contar o número total de roasts (avaliações da IA)
    // em vez de snippets (códigos enviados)
    const totalCountResult = await db.select({ count: count() }).from(roasts);
    const totalCount = totalCountResult[0]?.count ?? 0;

    // Calcular a média de score do leaderboard
    // Usando o campo 'score' da tabela leaderboard_entries
    const avgScoreResult = await db.select({ avg: avg(leaderboardEntries.score) }).from(leaderboardEntries);
    const avgScoreRaw = avgScoreResult[0]?.avg;
    // Drizzle's avg returns null when there are no rows, so we need to handle that
    // Also handle potential string return from PostgreSQL
    let avgScore = 0;
    if (avgScoreRaw !== null && avgScoreRaw !== undefined) {
      avgScore = typeof avgScoreRaw === 'string' ? parseFloat(avgScoreRaw) : Number(avgScoreRaw);
    }

    return {
      roastedCodesCount: totalCount,
      // Format to 1 decimal place for display
      avgScore: Math.round(avgScore * 10) / 10, 
    };
  }),
});

export type AppRouter = typeof appRouter;
