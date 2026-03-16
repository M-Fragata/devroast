import { db } from './index';
import { snippets, roasts, leaderboardEntries } from './schema';
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar tabelas na ordem correta (devido às foreign keys)
  console.log('🧹 Limpando tabelas existentes...');
  await db.execute(sql`TRUNCATE TABLE ${leaderboardEntries} CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${roasts} CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${snippets} CASCADE`);

  // 1. Criar snippets fictícios
  const mockSnippets = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    language: faker.helpers.arrayElement(['typescript', 'javascript', 'python', 'rust', 'go']),
    status: faker.helpers.arrayElement(['critical', 'warning', 'good']),
    evaluation: faker.helpers.arrayElement(['exceptional', 'needs_serious_help', 'rough_around_edges', 'decent_code', 'solid_work']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  console.log(`📋 Inserindo ${mockSnippets.length} snippets...`);
  await db.insert(snippets).values(mockSnippets);

  // 2. Criar roasts fictícios (100 roasts)
  const mockRoasts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
    mood: faker.helpers.arrayElement(['serious', 'roast']),
    snippetId: faker.number.int({ min: 1, max: 20 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  console.log(`🔥 Inserindo ${mockRoasts.length} roasts...`);
  await db.insert(roasts).values(mockRoasts);

  // 3. Criar entradas de leaderboard fictícias
  const mockLeaderboard = Array.from({ length: 10 }, (_, i) => {
    const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0');
    return {
      id: i + 1,
      snippetId: faker.number.int({ min: 1, max: 20 }),
      score: faker.number.int({ min: 1, max: 100 }),
      period: `2024-${month}`,
      rank: i + 1,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  });

  console.log(`🏆 Inserindo ${mockLeaderboard.length} entradas de leaderboard...`);
  await db.insert(leaderboardEntries).values(mockLeaderboard);

  console.log('✅ Seed concluído com sucesso!');
}

seed()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    // Fechar conexões se necessário
    process.exit(0);
  });
