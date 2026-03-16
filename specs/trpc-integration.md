# Feature: Integração tRPC com Next.js Server Components
Data: 2025-03-15
Status: draft

## Objetivo
Implementar tRPC como camada de API/backend no projeto Next.js, suportando SSR e Server Components com integração TanStack Query (React Query).

## Requisitos
- [ ] Configurar servidor tRPC (App Router)
- [ ] Configurar cliente tRPC com SSR
- [ ] Integrar com TanStack Query para Server Components
- [ ] Suportar headers/cokies durante SSR
- [ ] Configurar cache/staleTime adequado

## Implementação

### Estrutura de Pastas
```
src/
├── app/
│   └── api/
│       └── trpc/
│           └── route.ts
├── server/
│   ├── routers/
│   │   └── _app.ts
│   └── trpc.ts
└── lib/
    └── trpc.ts
```

### Servidor tRPC (App Router)
Arquivo: `src/app/api/trpc/route.ts`
- Handler para rotas `/api/trpc/*`
- Integração com `fetchRequestHandler` do `@trpc/server`
- Configuração de headers para SSR

Arquivo: `src/server/trpc.ts`
- Criação do contexto tRPC
- Middlewares de autenticação
- Definição do router base

### Cliente tRPC com SSR
Arquivo: `src/lib/trpc.ts`
- Configuração do cliente com `createTRPCNext`
- Links `httpBatchLink` para client e server
- Suporte a headers/cokies durante SSR
- `ssr: true` para habilitar SSR

### Integração TanStack Query
Arquivo: `src/lib/providers.tsx`
- `QueryClientProvider` com `QueryClient`
- Configuração de `staleTime` (60s)
- `ReactQueryStreamedHydration` para streaming

Arquivo: `src/lib/query-client.ts`
- `getQueryClient()` para singleton pattern
- Configuração de `dehydrate` para pending queries

### Server Components
Padrão para páginas Server Components:
```tsx
// Exemplo: src/app/posts/page.tsx
export default async function PostsPage() {
  const queryClient = getQueryClient()
  
  // Prefetch sem await para streaming
  queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => trpc.post.list.query(),
  })
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

## Testes
- [ ] Testar API routes
- [ ] Testar SSR com headers/cokies
- [ ] Testar streaming com Server Components
- [ ] Testar integração TanStack Query
- [ ] Testar typesafe calls end-to-end

## Referências
- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup
