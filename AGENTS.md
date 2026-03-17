# AGENTS.md - Global Project Standards

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
- **NÃO adicionar comentários** a menos que solicitado.

## Estrutura de Pastas
```
src/
├── app/
│   ├── api/           # API Routes (ex: tRPC)
│   ├── components/    # Componentes de UI (Server Components por padrão)
│   │   └── ui/        # Componentes genéricos reutilizáveis
│   └── [route]/       # Páginas e rotas
├── lib/               # Utilitários e configurações (Client Components quando necessário)
├── server/            # Lógica de servidor (tRPC, banco de dados)
│   ├── routers/       # Routers tRPC
│   └── trpc.ts        # Configuração tRPC
└── db/                # Configuração e schema do banco de dados
```

## Componentes UI

### Padrões de Criação
- **Named Exports**: Nunca use default exports. Exporte a função do componente e sua interface de props explicitamente.
- **Interface de Props**: A interface deve estender `React.ComponentProps<"element">` e `VariantProps<typeof variantFunction>`.
- **Arquivo**: Nome do arquivo `component-name.tsx` (kebab-case).
- **Função**: Nome da função `ComponentName` (PascalCase).
- **Interface**: Nome da interface `ComponentNameProps`.

### Exemplo de Padrão
```typescript
import { type VariantProps, cva } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

const componentVariants = cva("base-class", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      // ...
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ComponentProps
  extends React.ComponentProps<"element">,
    VariantProps<typeof componentVariants> {}

export function Component({
  className,
  variant,
  ...props
}: ComponentProps) {
  return (
    <element
      className={twMerge(componentVariants({ variant, className }))}
      {...props}
    />
  );
}
```

## tRPC Integration

### Estrutura de Pastas
```
src/
├── app/api/trpc/route.ts    # API Route para tRPC
├── server/
│   ├── routers/_app.ts      # Router principal
│   └── trpc.ts              # Configuração e contexto
└── lib/trpc-client.ts       # Cliente tRPC com TanStack Query
```

### Servidor tRPC
- **API Route**: `src/app/api/trpc/route.ts`
  - Handler para `/api/trpc/*`
  - Usa `fetchRequestHandler` do `@trpc/server`
- **Configuração**: `src/server/trpc.ts`
  - Criação do contexto
  - Definição de `router` e `publicProcedure`
- **Router**: `src/server/routers/_app.ts`
  - Define as procedures (ex: `metrics`)

### Cliente tRPC
- **Arquivo**: `src/lib/trpc-client.ts`
  - Cria cliente com `createTRPCReact`
  - Usa `httpBatchLink` com `superjson` transformer
  - Exporta `trpc` para uso nos componentes

### Integração com TanStack Query
- **Query Client**: `src/lib/query-client.ts`
  - Singleton pattern com `getQueryClient()`
  - `staleTime: 60s` padrão
- **Providers**: `src/lib/providers.tsx`
  - `QueryClientProvider` e `ReactQueryStreamedHydration`
  - Deve ser envolvido no `RootLayout`

### Uso em Server Components
Para usar tRPC em Server Components (ex: página inicial):
1. Importar `getQueryClient` e `dehydrate`
2. Prefetch da query usando `queryClient.prefetchQuery`
3. Envolver o componente filho com `HydrationBoundary`

**Exemplo:**
```tsx
// src/app/page.tsx
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc-client";

export default async function HomePage() {
  const queryClient = getQueryClient();
  
  // Prefetch sem await para streaming
  queryClient.prefetchQuery({
    queryKey: ['metrics'],
    queryFn: () => trpc.metrics.query(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MetricsContainer />
    </HydrationBoundary>
  );
}
```

### Loading States com NumberFlow
Para métricas que devem animar de 0 para o valor real:
1. Use `useQuery` do tRPC no componente Client
2. Defina o valor inicial como `0` (usando `data?.value ?? 0`)
3. O NumberFlow animará a transição quando os dados carregarem
4. **Não use Suspense/Skeleton** para esses componentes específicos

**Exemplo:**
```tsx
// src/app/components/MetricsContainer.tsx
"use client";
import { trpc } from "@/lib/trpc-client";
import { MetricsDisplay } from "./MetricsDisplay";

export function MetricsContainer() {
  const { data, error } = trpc.metrics.useQuery();
  
  // Valor inicial 0 para animação
  const count = data?.roastedCodesCount ?? 0;
  const avgScore = data?.avgScore ?? 0;
  
  if (error) return <div>Error loading metrics</div>;
  
  return <MetricsDisplay roastedCodesCount={count} avgScore={avgScore} />;
}
```

## Comandos Úteis

### Banco de Dados
- **Iniciar serviços**: `docker-compose up -d`
- **Gerar migrations**: `npx drizzle-kit generate`
- **Push schema**: `npx drizzle-kit push`
- **Studio (GUI)**: `npx drizzle-kit studio`
- **Seed de dados**: `npm run db:seed`
- **Verificar dados**: `npx tsx src/db/check.ts` (arquivo temporário)

### Desenvolvimento
- **Iniciar dev server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

### Seed de Dados
O arquivo `src/db/seed.ts` cria dados fictícios usando `@faker-js/faker`:
- **20 snippets** com títulos, conteúdo, linguagens, status e avaliações aleatórios
- **100 roasts** com comentários e estilos variados (`serious` ou `roast`)
- **10 entradas de leaderboard** com períodos mensais

O comando `npm run db:seed` limpa as tabelas existentes e insere os novos dados.

### Exemplo de Query (sem relações nativas)
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
