# Especificação do Banco de Dados - DevRoast

Este documento descreve a implementação do banco de dados para a plataforma DevRoast, utilizando Drizzle ORM e PostgreSQL com Docker Compose.

## 1. Tecnologias e Ferramentas

- **ORM**: Drizzle ORM
- **Banco de Dados**: PostgreSQL
- **Orquestração**: Docker Compose
- **Linguagem**: TypeScript

## 2. Modelo de Dados

### 2.1. Enums

```typescript
// src/db/schema/enums.ts

import { pgEnum } from 'drizzle-orm/pg-core';

export const snippetStatusEnum = pgEnum('snippet_status', ['critical', 'warning', 'good']);
export const roastMoodEnum = pgEnum('roast_mood', ['serious', 'roast']);
export const codeEvaluationEnum = pgEnum('code_evaluation', [
  'exceptional',
  'needs_serious_help',
  'rough_around_edges',
  'decent_code',
  'solid_work'
]);
```

### 2.2. Tabelas



#### 2.2.1. Snippets (`snippets`)

Armazena os trechos de código compartilhados (anônimos).
- **status**: Nível de severidade do código (`critical`, `warning`, `good`).
- **evaluation**: Avaliação qualitativa do código (`exceptional`, `needs_serious_help`, `rough_around_edges`, `decent_code`, `solid_work`).

```typescript
// src/db/schema/snippets.ts

import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { snippetStatusEnum } from './enums';

export const snippets = pgTable('snippets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  language: varchar('language', { length: 20 }).notNull(), // Ex: 'typescript', 'python'
  status: snippetStatusEnum('status').notNull(),
  evaluation: codeEvaluationEnum('evaluation').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### 2.2.2. Roasts (`roasts`)

Armazena o feedback dado aos snippets (anônimos).
- **mood**: Estilo do feedback (`serious` para modo sério/normal, `roast` para modo picante).

```typescript
// src/db/schema/roasts.ts

import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';
import { roastMoodEnum } from './enums';

export const roasts = pgTable('roasts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  mood: roastMoodEnum('mood').notNull(),
  snippetId: integer('snippet_id').references(() => snippets.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### 2.2.3. Leaderboard (`leaderboard`)

Tabela derivada ou materializada para o leaderboard mensal.

> **Nota**: O README menciona "Leaderboard: Veja os 'piores' códigos do mês". Isso implica uma agregação de dados baseada em pontuação/métricas. Como Drizzle ORM gerencia tabelas físicas e não views materializadas nativamente no schema, criaremos uma tabela física para armazenar os resultados do leaderboard (atualizada via job agendado ou trigger) ou simplesmente gerar via query SQL.

Para a primeira versão, podemos calcular via query (roast scores aggregation), mas se precisarmos de performance, podemos criar uma tabela física `leaderboard_entries`.

Vamos optar por uma tabela física para simplificar a leitura no frontend:

```typescript
// src/db/schema/leaderboard.ts

import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';

export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: serial('id').primaryKey(),
  snippetId: integer('snippet_id').references(() => snippets.id).notNull(),
  score: integer('score').notNull(), // Exemplo: contagem de roasts negativos
  period: varchar('period', { length: 7 }).notNull(), // YYYY-MM
  rank: integer('rank').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## 3. Configuração do Docker Compose

Crie o arquivo `docker-compose.yml` na raiz do projeto.

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: devroast_db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast_password
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 4. Implementação com Drizzle ORM

### 4.1. Configuração do Cliente

Crie `src/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ?? 'postgres://devroast:devroast_password@localhost:5432/devroast';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

### 4.2. To-Dos para Implementação

1.  **Instalar Dependências**:
    ```bash
    npm install drizzle-orm postgres
    npm install -D drizzle-kit
    ```
2.  **Configurar `drizzle.config.ts`**:
    Criar arquivo de configuração para migrations e studio.
3.  **Criar Migrations**:
    Executar `npx drizzle-kit generate:pg` para gerar SQL de migração.
4.  **Executar Migrations**:
    Executar `npx drizzle-kit push:pg` para aplicar ao banco de dados (ou usar migrations sql).
5.  **Integração com Next.js**:
    Garantir que o cliente do banco de dados seja singleton (verificar `db.ts`).
6.  **Atualizar AGENTS.md**:
    Adicionar comandos de database ao documento de agentes.

## 5. Considerações sobre a Interface Pencil

A especificação de banco de dados deve refletir os dados necessários para renderizar as telas definidas no Pencil. Com base no README:
- **Leaderboard**: Requer tabela de snippets e roasts.
- **Análise de Diffs**: Requer campo de conteúdo de código (text).

A estrutura definida acima suporta:
- Upload/Compartilhamento de snippets (anônimos).
- Sistema de Roast (feedback anônimo).
- Cálculo de leaderboard (através da agregação de `roasts` vinculados a `snippets`).

## 6. Próximos Passos

1.  Criar o arquivo `docker-compose.yml`.
2.  Criar o diretório `src/db/schema` e os arquivos TypeScript.
3.  Gerar e aplicar as migrations.
4.  Verificar a conexão na aplicação Next.js.
