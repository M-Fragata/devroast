import { faker } from "@faker-js/faker";
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { leaderboardEntries, roasts, snippets } from "./schema";

async function seed() {
	console.log("🌱 Iniciando seed do banco de dados...");

	// Limpar tabelas na ordem correta (devido às foreign keys)
	console.log("🧹 Limpando tabelas existentes...");
	await db.execute(sql`TRUNCATE TABLE ${leaderboardEntries} CASCADE`);
	await db.execute(sql`TRUNCATE TABLE ${roasts} CASCADE`);
	await db.execute(sql`TRUNCATE TABLE ${snippets} CASCADE`);

	// 1. Criar snippets fictícios com código funcional
	const codeExamples = {
		javascript: [
			`function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}`,
			`const fetchUserData = async (userId) => {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
};`,
			`function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
		],
		typescript: [
			`interface User {
  id: number;
  name: string;
  email: string;
}

function getUserById(id: number): User | null {
  // Implementation here
  return null;
}`,
			`const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network error');
  return response.json() as T;
};`,
		],
		python: [
			`def calculate_average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)`,
			`class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    def process(self):
        return [item * 2 for item in self.data]`,
		],
	};

	const mockSnippets = Array.from({ length: 20 }, (_, i) => {
		const language = faker.helpers.arrayElement([
			"typescript",
			"javascript",
			"python",
		]);
		const examples = codeExamples[language as keyof typeof codeExamples];
		const content = examples
			? faker.helpers.arrayElement(examples)
			: 'console.log("Hello World");';

		return {
			id: i + 1,
			title: faker.lorem.sentence(),
			content: content,
			language: language,
			status: faker.helpers.arrayElement(["critical", "warning", "good"]),
			evaluation: faker.helpers.arrayElement([
				"exceptional",
				"needs_serious_help",
				"rough_around_edges",
				"decent_code",
				"solid_work",
			]),
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
		};
	});

	console.log(`📋 Inserindo ${mockSnippets.length} snippets...`);
	await db.insert(snippets).values(mockSnippets);

	// 2. Criar roasts fictícios (100 roasts)
	const mockRoasts = Array.from({ length: 100 }, (_, i) => ({
		id: i + 1,
		content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
		mood: faker.helpers.arrayElement(["serious", "roast"]),
		snippetId: faker.number.int({ min: 1, max: 20 }),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
	}));

	console.log(`🔥 Inserindo ${mockRoasts.length} roasts...`);
	await db.insert(roasts).values(mockRoasts);

	// 3. Criar entradas de leaderboard fictícias com scores 0-10
	const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0");
	const period = `2024-${month}`;

	const mockLeaderboard = Array.from({ length: 10 }, () => ({
		snippetId: faker.number.int({ min: 1, max: 20 }),
		score: faker.number.int({ min: 0, max: 10 }),
		period: period,
		rank: 0,
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
	}));

	console.log(
		`🏆 Inserindo ${mockLeaderboard.length} entradas de leaderboard...`,
	);
	await db.insert(leaderboardEntries).values(mockLeaderboard);

	const orderedEntries = await db
		.select({ id: leaderboardEntries.id })
		.from(leaderboardEntries)
		.where(eq(leaderboardEntries.period, period))
		.orderBy(leaderboardEntries.score);

	for (let i = 0; i < orderedEntries.length; i++) {
		await db
			.update(leaderboardEntries)
			.set({ rank: i + 1 })
			.where(eq(leaderboardEntries.id, orderedEntries[i].id));
	}

	console.log("✅ Seed concluído com sucesso!");
}

seed()
	.catch((error) => {
		console.error("❌ Erro ao executar seed:", error);
		process.exit(1);
	})
	.finally(async () => {
		// Fechar conexões se necessário
		process.exit(0);
	});
