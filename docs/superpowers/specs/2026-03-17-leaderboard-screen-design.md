# Leaderboard Screen Design Specification
**Date**: 2026-03-17  
**Project**: DevRoast  
**Author**: opencode

## Overview
Implement the leaderboard screen (`/leaderboard`) with tRPC backend integration and frontend components following the existing shame leaderboard pattern from the homepage.

**Note**: This spec introduces tRPC for the leaderboard as requested. The current homepage uses direct DB access with Suspense. This implementation will use tRPC + HydrationBoundary to demonstrate the pattern and enable client-side data fetching capabilities.

## Requirements
- Fetch and display 20 leaderboard entries (no pagination)
- Use tRPC for data fetching
- Follow existing `CodeDisplay` pattern for syntax highlighting and expand/collapse functionality
- Display rank, score, code, language, and lines count
- Support "ver mais/ver menos" functionality for code snippets

## Architecture

### Backend (tRPC)
**Location**: `src/server/routers/_app.ts`

Add a new `leaderboard` procedure to the existing app router:
```typescript
leaderboard: publicProcedure.query(async () => {
  // Fetch 20 worst code entries (lowest scores)
  // Ordered by score ascending (lowest first = worst)
})
```

**Data Structure**:
```typescript
interface LeaderboardEntry {
  rank: number;
  score: number;
  code: string;
  language: string;
  snippetId: number;
  lines: number; // Calculated: code.split('\n').length
}
```

### Frontend
**Location**: `src/app/leaderboard/page.tsx`

The page will:
1. Use server-side prefetch with `queryClient.prefetchQuery()` 
2. Use `HydrationBoundary` + `dehydrate()` pattern
3. Create a `LeaderboardContainer` client component to consume the data via `trpc.leaderboard.useQuery()`
4. Display 20 `LeaderboardRow` components
5. Include hero section and footer similar to current implementation

**Data Flow:**
```
page.tsx (Server Component)
  → getQueryClient()
  → queryClient.prefetchQuery({ queryKey: ['leaderboard'], queryFn: () => trpc.leaderboard.query() })
  → <HydrationBoundary state={dehydrate(queryClient)}>
  → LeaderboardContainer (Client Component)
    → useQuery trpc.leaderboard (from cache)
    → renders LeaderboardRow[]
```
page.tsx (Server Component)
  → getQueryClient()
  → queryClient.prefetchQuery({ queryKey: ['leaderboard'], queryFn: () => trpc.leaderboard.getLeaderboard.query() })
  → <HydrationBoundary state={dehydrate(queryClient)}>
  → LeaderboardContainer (Client Component)
    → useQuery(trpc.leaderboard.getLeaderboard)
    → renders LeaderboardRow[]
```

**Update LeaderboardRow** (`src/app/components/ui/leaderboard-row.tsx`):
- **Keep existing line numbers and scroll sync** - The current implementation has these features which must be preserved
- **Add expand/collapse functionality** - Implement "ver mais ↓" / "ver menos ↑" buttons
- **Hybrid approach**: Keep line numbers column + add expand/collapse button
- **Maintain fixed height (180px) when collapsed**, expand to full when clicked
- **Keep existing header layout** (rank, score, language, lines)

**Implementation approach**:
- Add `isExpanded` state to track expansion state
- Use `maxHeight` style similar to CodeDisplay: `maxHeight: isExpanded ? "none" : "${maxLines * 1.5}em"`
- Add expand/collapse button below the code area
- Keep line numbers column and scroll sync logic intact
- The component will handle its own code highlighting (already using hljs)

### Components

#### LeaderboardRow Props
```typescript
interface LeaderboardRowProps {
  rank: number;
  score: number;
  code: string;
  language: string;
  lines?: number; // Optional - will be calculated as code.split('\n').length if not provided
}
```

#### CodeDisplay Pattern (Reference Only)
The `CodeDisplay` component provides a reference pattern for expand/collapse functionality, but we will NOT use it directly. Instead, LeaderboardRow will implement its own hybrid approach:

- Line numbers column (existing feature - keep)
- Scroll synchronization between line numbers and code (existing - keep)
- Custom syntax highlighting with hljs (existing - keep)
- Expand/collapse "ver mais/ver menos" button (NEW - add)
- Fixed height 180px when collapsed, full height when expanded (NEW)

## Implementation Details

### Database Query
```typescript
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
  .orderBy(leaderboardEntries.score) // Ascending - lowest score first (worst)
  .limit(20);
```

### Frontend Data Flow
```
LeaderboardPage (Server Component)
  → getQueryClient() 
  → prefetchQuery trpc.leaderboard.getLeaderboard
  → HydrationBoundary + dehydrate()
  → LeaderboardContainer (Client Component)
    → useQuery trpc.leaderboard.getLeaderboard (from cache)
    → LeaderboardRow (Client Component) with expand/collapse
    → Line Numbers + Scroll Sync (built into LeaderboardRow)
```

## UI Components

### Leaderboard Row Layout
```
┌─────────────────────────────────────────────┐
│ #1  score 10.0    javascript    25 lines    │
├─────────────────────────────────────────────┤
│ [Code Display Area with expand/collapse]    │
└─────────────────────────────────────────────┘
```

### Page Layout
```
┌─────────────────────────────────────────────┐
│ Hero Section (shame_leaderboard title)      │
├─────────────────────────────────────────────┤
│ Leaderboard Entries (20 items)              │
│ - Rank, Score, Code, Language               │
│ - Expand/Collapse functionality             │
├─────────────────────────────────────────────┤
│ Footer (showing top 20 of total)            │
└─────────────────────────────────────────────┘
```

## Testing Strategy
1. Verify tRPC endpoint returns correct 20 entries
2. Test expand/collapse functionality works
3. Test syntax highlighting for various languages
4. Test responsive layout on different screen sizes
5. Verify data fetching error handling

## Error Handling
- Display "No leaderboard entries found" if empty
- Handle tRPC errors gracefully
- Maintain UI stability during loading states

## Security Considerations
- Use publicProcedure for leaderboard data (public information)
- No user-specific data exposed
- Standard SQL injection prevention via Drizzle ORM
