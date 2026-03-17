# Leaderboard Screen Design Specification
**Date**: 2026-03-17  
**Project**: DevRoast  
**Author**: opencode

## Overview
Implement the leaderboard screen (`/leaderboard`) with tRPC backend integration and frontend components following the existing shame leaderboard pattern from the homepage.

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
  // Fetch 20 leaderboard entries with associated snippets
  // Ordered by rank (ascending)
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
}
```

### Frontend
**Location**: `src/app/leaderboard/page.tsx`

The page will:
1. Use `trpc.leaderboard.useQuery()` to fetch data
2. Display 20 `LeaderboardRow` components
3. Include hero section and footer similar to current implementation

**Update LeaderboardRow** (`src/app/components/ui/leaderboard-row.tsx`):
- **Keep existing line numbers and scroll sync** - The current implementation has these features which should be preserved
- **Add expand/collapse functionality similar to CodeDisplay** - Implement the truncation logic and "ver mais/ver menos" buttons directly in LeaderboardRow
- **Modify the code area height** - Change from fixed 180px to conditional (truncated vs expanded) similar to CodeDisplay's approach
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
  lines?: number;
}
```

#### CodeDisplay Pattern
The `CodeDisplay` component provides a reference pattern for:
- Expand/collapse "ver mais/ver menos" functionality
- Truncation logic based on line count
- Conditional maxHeight styling

**Note**: LeaderboardRow will implement similar functionality but maintain its own:
- Line numbers column
- Scroll synchronization between line numbers and code
- Custom syntax highlighting with hljs

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
  .orderBy(leaderboardEntries.rank)
  .limit(20);
```

### Frontend Data Flow
```
LeaderboardPage (Server Component)
  → trpc.leaderboard.useQuery() (Client Component)
  → LeaderboardRow (Client Component)
  → Syntax Highlighting + Expand/Collapse (built into LeaderboardRow)
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
