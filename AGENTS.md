# AGENTS.md

## Projeto: DevRoast
Aplicação Next.js para compartilhar e "roastar" snippets de código da comunidade.

## Stack Tecnológica
- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **UI Components**: Base UI, Tailwind Variants
- **Banco de Dados**: PostgreSQL (Docker), Drizzle ORM
- **Linting**: Biome, ESLint

## Padrões Globais
- **Caminhos**: Usar alias `@/*` para imports de `src/`.
- **Components**: Utilizar `tailwind-variants` para variantes de estilo.
- **Git**: Usar commits convencionais (feat, fix, chore, etc.).
- **Code Style**: Seguir regras do Biome/ESLint.

## Comandos Úteis

### Banco de Dados
- **Iniciar serviços**: `docker-compose up -d`
- **Gerar migrations**: `npx drizzle-kit generate`
- **Push schema**: `npx drizzle-kit push`
- **Studio (GUI)**: `npx drizzle-kit studio`
- **Seed de dados**: `npm run db:seed`
- **Verificar dados**: `npx tsx src/db/check.ts` (arquivo temporário)

#### Seed de Dados
O arquivo `src/db/seed.ts` cria dados fictícios usando `@faker-js/faker`:
- **20 snippets** com títulos, conteúdo, linguagens, status e avaliações aleatórios
- **100 roasts** com comentários e estilos variados (`serious` ou `roast`)
- **10 entradas de leaderboard** com períodos mensais

O comando `npm run db:seed` limpa as tabelas existentes e insere os novos dados.

#### Exemplo de Query (sem relações nativas)
```typescript
import { db } from '@/db';
import { snippets, roasts } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Buscar snippet por ID
const snippet = await db.select().from(snippets).where(eq(snippets.id, 1));

// Buscar roasts de um snippet
const snippetRoasts = await db.select().from(roasts).where(eq(roasts.snippetId, 1));

// Inserir novo snippet
await db.insert(snippets).values({
  title: 'Exemplo de Código',
  content: 'console.log("Hello World")',
  language: 'javascript',
  status: 'good',
  evaluation: 'solid_work'
});
```
