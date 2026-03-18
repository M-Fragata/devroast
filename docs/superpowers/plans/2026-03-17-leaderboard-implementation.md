# Leaderboard Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the leaderboard page at /leaderboard with tRPC backend, displaying 20 worst code snippets with syntax highlighting and expand/collapse functionality.

**Architecture:** tRPC procedure for data fetching + HydrationBoundary for server prefetch + Client components with expand/collapse state

**Tech Stack:** Next.js 16, tRPC, Drizzle ORM, highlight.js, Tailwind CSS

---

### Task 1: Add tRPC Leaderboard Procedure

**Files:**
- Modify: `src/server/routers/_app.ts`

- [ ] **Step 1: Add eq import**

Update line 4 to include `eq`:
```typescript
// Before: import { count, avg } from "drizzle-orm";
import { count, avg, eq } from "drizzle-orm";
```

- [ ] **Step 2: Add leaderboard procedure to router**

```typescript
// In src/server/routers/_app.ts, add after metrics procedure:
leaderboard: publicProcedure.query(async () => {
  try {
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
      .orderBy(leaderboardEntries.score) // Ascending - lowest first (worst)
      .limit(20);

    return data.map((entry) => ({
      ...entry,
      lines: entry.code.split("\n").length,
    }));
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}),
```

- [ ] **Step 2: Commit**

```bash
git add src/server/routers/_app.ts
git commit -m "feat: add leaderboard tRPC procedure"
```

---

### Task 2: Create LeaderboardContainer Client Component

**Files:**
- Create: `src/app/components/LeaderboardContainer.tsx`

- [ ] **Step 1: Create the container component**

```tsx
"use client";

import { trpc } from "@/lib/trpc-client";
import { LeaderboardRow } from "@/app/components/ui/leaderboard-row";

export function LeaderboardContainer() {
  const { data, isLoading, error } = trpc.leaderboard.useQuery();

  if (isLoading) {
    return (
      <div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
        <div className="text-center py-10 text-text-secondary">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
        <div className="text-center py-10 text-text-secondary">
          Error loading leaderboard: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
      {data && data.length > 0 ? (
        data.map((entry) => (
          <LeaderboardRow
            key={entry.snippetId}
            rank={entry.rank}
            score={entry.score}
            code={entry.code}
            language={entry.language}
            lines={entry.lines}
          />
        ))
      ) : (
        <div className="text-center py-10 text-text-secondary">
          No leaderboard entries found.
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-3 md:py-4 text-text-tertiary text-xs md:text-sm px-4">
        showing top {data?.length ?? 0} · view full leaderboard &gt;
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/LeaderboardContainer.tsx
git commit -m "feat: create LeaderboardContainer client component"
```

---

### Task 3: Update LeaderboardRow with Expand/Collapse

**Files:**
- Modify: `src/app/components/ui/leaderboard-row.tsx`

- [ ] **Step 1: Add isExpanded state and toggle function**

Add after the existing state declarations (around line 40):
```typescript
const [isExpanded, setIsExpanded] = useState(false);
```

- [ ] **Step 2: Modify code area to handle expand/collapse**

Replace the fixed height code area (line 135) with conditional height:
```tsx
// Before: className="flex bg-[#282c34] border-x border-[#2A2A2A] h-[180px] overflow-hidden"
// After:
className={`flex bg-[#282c34] border-x border-[#2A2A2A] ${isExpanded ? 'h-auto' : 'h-[180px]'} overflow-hidden`
```

- [ ] **Step 3: Add expand/collapse button**

After the code area div (after line 179), add:
```tsx
{/* Expand/Collapse Button */}
{lineCount > 3 && (
  <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full py-2 text-xs text-accent-green hover:text-accent-green-hover cursor-pointer border-t border-[#2A2A2A] bg-[#111111]"
  >
    {isExpanded ? "ver menos ↑" : "ver mais ↓"}
  </button>
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/leaderboard-row.tsx
git commit -m "feat: add expand/collapse to LeaderboardRow"
```

---

### Task 4: Update Leaderboard Page to Use tRPC Pattern

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Replace the page content**

Replace the entire file to use tRPC with HydrationBoundary:

```tsx
import type { Metadata } from "next";
import { LeaderboardContainer } from "@/app/components/LeaderboardContainer";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard - DevRoast",
  description: "The worst code on the internet, ranked by shame",
};

export default async function LeaderboardPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["leaderboard"],
    queryFn: () => trpc.leaderboard.query(),
  });

  return (
    <div className="min-h-screen bg-bg-page text-foreground font-mono">
      {/* Main Content */}
      <main className="flex flex-col items-center py-6 md:py-10 px-4 md:px-10 space-y-6 md:space-y-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-2 md:gap-3 text-center max-w-2xl w-full">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
            <span className="text-accent-amber text-2xl md:text-4xl font-bold">$</span>
            <h1 className="text-foreground text-xl md:text-4xl font-bold">
              shame_leaderboard
            </h1>
          </div>
          <p className="text-text-secondary text-sm md:text-base font-normal">
            {"//"} the worst code on the internet, ranked by shame
          </p>
        </div>

        {/* Leaderboard Entries */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LeaderboardContainer />
        </HydrationBoundary>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: integrate tRPC with HydrationBoundary in leaderboard page"
```

---

### Task 5: Test the Implementation

**Verification:**

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Navigate to /leaderboard**

Open browser to http://localhost:3000/leaderboard

- [ ] **Step 3: Verify:**
- Page loads without errors
- 20 entries displayed (or fewer if no data)
- Syntax highlighting works
- "ver mais" button appears for entries with more than 3 lines
- Clicking "ver mais" expands the code
- Clicking "ver menos" collapses back to 180px

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

---

### Summary

| Task | Description |
|------|-------------|
| 1 | Add tRPC leaderboard procedure |
| 2 | Create LeaderboardContainer component |
| 3 | Update LeaderboardRow with expand/collapse |
| 4 | Update page to use tRPC pattern |
| 5 | Test and verify |
