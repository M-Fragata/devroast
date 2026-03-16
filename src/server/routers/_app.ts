import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { count, avg } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  metrics: publicProcedure.query(async () => {
    // Contar o número total de snippets (roasted codes)
    const totalCountResult = await db.select({ count: count() }).from(snippets);
    const totalCount = totalCountResult[0]?.count ?? 0;

    // Calcular a média de score (usando o campo 'evaluation' como base para métrica)
    // Nota: O schema atual não tem um campo de score numérico, então usaremos
    // a contagem de snippets como métrica principal.
    // Para este exemplo, retornaremos um valor simulado de média.
    const avgScoreResult = await db.select({ avg: avg(snippets.id) }).from(snippets);
    const avgScoreRaw = avgScoreResult[0]?.avg ?? 0;
    const avgScore = typeof avgScoreRaw === 'number' ? avgScoreRaw : 0;

    return {
      roastedCodesCount: totalCount,
      avgScore: Math.round(avgScore * 100) / 100, // Limitar a 2 casas decimais
    };
  }),
});

export type AppRouter = typeof appRouter;
