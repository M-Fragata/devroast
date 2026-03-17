# Leaderboard Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the leaderboard screen with tRPC backend integration and expand/collapse functionality following the spec.

**Architecture:** 
- Add tRPC `leaderboard` procedure to fetch 20 entries with associated snippets
- Update `LeaderboardRow` component to support expand/collapse functionality
- Convert `LeaderboardPage` to use tRPC client instead of direct DB queries
- Maintain existing line numbers and scroll sync functionality

**Tech Stack:** Next.js 16, TypeScript, tRPC, Drizzle ORM, highlight.js, tailwind-variants

---

### Task 1: Add tRPC leaderboard procedure

**Files:**
- Modify: `src/server/routers/_app.ts`
- Test: `src/server/routers/_app.test.ts` (create if needed)

- [ ] **Step 1: Write the failing test**

Create a test file `src/server/routers/_app.test.ts` to verify the leaderboard procedure exists and returns correct data:

```typescript
import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./_app";
import { db } from "@/db";

// Mock the database
vi.mock("@/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([
      { rank: 1, score: 10.0, code: "console.log('test')", language: "javascript", snippetId: 1 },
      { rank: 2, score: 9.5, code: "print('hello')", language: "python", snippetId: 2 },
    ]),
  },
}));

describe("appRouter.leaderboard", () => {
  it("should return 20 leaderboard entries", async () => {
    const caller = appRouter.createCaller({});
    const result = await caller.leaderboard();

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("rank");
    expect(result[0]).toHaveProperty("score");
    expect(result[0]).toHaveProperty("code");
    expect(result[0]).toHaveProperty("language");
    expect(result[0]).toHaveProperty("snippetId");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/server/routers/_app.test.ts`
Expected: FAIL with "appRouter.leaderboard is not a function"

- [ ] **Step 3: Write minimal implementation**

Add the leaderboard procedure to `src/server/routers/_app.ts`:

```typescript
import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/db";
import { snippets, leaderboardEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  metrics: publicProcedure.query(async () => {
    // ... existing code ...
  }),

  leaderboard: publicProcedure.query(async () => {
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

    return data;
  }),
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/server/routers/_app.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server/routers/_app.ts src/server/routers/_app.test.ts
git commit -m "feat: add tRPC leaderboard procedure"
```

---

### Task 2: Update LeaderboardRow component with expand/collapse

**Files:**
- Modify: `src/app/components/ui/leaderboard-row.tsx`
- Modify: `src/app/components/ui/leaderboard-row.tsx:135-179` (code area section)
- Test: `src/app/components/ui/leaderboard-row.test.tsx` (create if needed)

- [ ] **Step 1: Write the failing test**

Create a test file `src/app/components/ui/leaderboard-row.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LeaderboardRow } from "./leaderboard-row";

describe("LeaderboardRow", () => {
  const mockProps = {
    rank: 1,
    score: 10.0,
    code: "line1\nline2\nline3\nline4\nline5",
    language: "javascript",
    lines: 5,
  };

  it("should render with line numbers", () => {
    render(<LeaderboardRow {...mockProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should have expand/collapse button", () => {
    render(<LeaderboardRow {...mockProps} />);
    expect(screen.getByText(/ver mais|ver menos/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/components/ui/leaderboard-row.test.tsx`
Expected: FAIL with "expand/collapse button not found"

- [ ] **Step 3: Write minimal implementation**

Update `src/app/components/ui/leaderboard-row.tsx` to add expand/collapse functionality:

```typescript
"use client";

import hljs from "highlight.js";
import parse from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import { tv } from "tailwind-variants";
import { detectLanguage } from "../CodeEditor/language-detection";

// Import highlight.js theme (Atom One Dark)
import "highlight.js/styles/atom-one-dark.css";

const entryVariants = tv({
  base: "border border-border-primary bg-bg-surface",
});

export interface LeaderboardRowProps {
  rank: number;
  score: number;
  code: string;
  language: string;
  lines?: number;
}

export function LeaderboardRow({
  rank,
  score,
  code,
  language,
  lines,
}: LeaderboardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [maxLines, setMaxLines] = useState(5); // Default max lines for truncation

  // ... existing getScoreColor function ...

  // ... existing useEffect for highlighting ...

  // Parse code to get lines for enumeration
  const codeLines = code.split("\n");
  const lineCount = lines || codeLines.length;

  // ... existing refs and scroll sync logic ...

  return (
    <div className={entryVariants()}>
      {/* Header Bar - unchanged */}
      <div className="h-10 flex items-center justify-between px-4 bg-[#111111] border-b border-[#2A2A2A]">
        {/* ... existing header content ... */}
      </div>

      {/* Code Area with line numbers - MODIFIED for expand/collapse */}
      <div 
        className="flex bg-[#282c34] border-x border-[#2A2A2A] overflow-hidden"
        style={{ maxHeight: isExpanded ? "none" : `${maxLines * 1.5}em` }}
      >
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-10 bg-[#21252b] border-r border-[#2A2A2A] flex flex-col py-3 px-2 overflow-y-auto"
          onScroll={() => handleScroll("lines")}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <span
              key={i}
              className="text-[#4B5563] font-mono text-xs leading-[1.625rem] text-right"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Content */}
        <div
          ref={codeContentRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-3 -mt-[13px]"
          onScroll={() => handleScroll("code")}
        >
          <pre className="m-0 p-0 bg-[#282c34] whitespace-pre-wrap word-break-break-all">
            <code
              className="hljs text-xs leading-[1.625rem]"
              style={{
                color: "#abb2bf",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {parse(highlightedCode)}
            </code>
          </pre>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      {lineCount > maxLines && (
        <div className="px-4 py-2 bg-[#111111] border-x border-[#2A2A2A] border-b">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-accent-green hover:text-accent-green-hover cursor-pointer"
          >
            {isExpanded ? "ver menos ↑" : "ver mais ↓"}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/components/ui/leaderboard-row.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ui/leaderboard-row.tsx src/app/components/ui/leaderboard-row.test.tsx
git commit -m "feat: add expand/collapse functionality to LeaderboardRow"
```

---

### Task 3: Update LeaderboardPage to use tRPC

**Files:**
- Modify: `src/app/leaderboard/page.tsx`
- Create: `src/app/leaderboard/LeaderboardContainer.tsx` (Client Component wrapper)

- [ ] **Step 1: Create Client Component wrapper**

Create `src/app/leaderboard/LeaderboardContainer.tsx`:

```typescript
"use client";

import { trpc } from "@/lib/trpc-client";
import { LeaderboardRow } from "@/app/components/ui/leaderboard-row";

export function LeaderboardContainer() {
  const { data, error, isLoading } = trpc.leaderboard.useQuery();

  if (isLoading) {
    return (
      <div className="text-center py-10 text-text-secondary">
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-text-secondary">
        Error loading leaderboard: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-text-secondary">
        No leaderboard entries found.
      </div>
    );
  }

  return (
    <>
      {data.map((entry) => (
        <LeaderboardRow
          key={entry.snippetId}
          rank={entry.rank}
          score={entry.score}
          code={entry.code}
          language={entry.language}
          lines={entry.code.split("\n").length}
        />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Update LeaderboardPage to use Client Component**

Modify `src/app/leaderboard/page.tsx`:

```typescript
import type { Metadata } from "next";
import { LeaderboardContainer } from "./LeaderboardContainer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard - DevRoast",
  description: "The worst code on the internet, ranked by shame",
};

export default async function LeaderboardPage() {
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
            {'//'} the worst code on the internet, ranked by shame
          </p>
        </div>

        {/* Leaderboard Entries */}
        <div className="w-full max-w-[960px] space-y-5 px-0 md:px-0">
          <LeaderboardContainer />

          {/* Footer */}
          <div className="text-center py-3 md:py-4 text-text-tertiary text-xs md:text-sm px-4">
            showing top 20 of total · view full leaderboard &gt;
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Test the page**

Run: `npm run dev` and navigate to `/leaderboard`
Verify: Page loads with leaderboard entries, expand/collapse works

- [ ] **Step 4: Commit**

```bash
git add src/app/leaderboard/page.tsx src/app/leaderboard/LeaderboardContainer.tsx
git commit -m "feat: update LeaderboardPage to use tRPC client"
```

---

### Task 4: Integration testing and fixes

**Files:**
- Modify: `src/app/components/ui/leaderboard-row.tsx` (if needed)
- Modify: `src/app/leaderboard/LeaderboardContainer.tsx` (if needed)

- [ ] **Step 1: Test responsive behavior**

Run: `npm run dev` and test on different screen sizes
Verify: Leaderboard entries display correctly on mobile and desktop

- [ ] **Step 2: Test expand/collapse functionality**

Run: `npm run dev` and navigate to `/leaderboard`
Verify: 
- "ver mais" button appears for entries with more than 5 lines
- Clicking "ver mais" expands the code view
- Clicking "ver menos" collapses the code view
- Line numbers sync with code scrolling

- [ ] **Step 3: Test error handling**

Simulate error by temporarily modifying tRPC procedure to throw error
Verify: Error message displays correctly

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete leaderboard screen implementation"
```

---

### Task 5: Run full test suite

**Files:**
- All modified files

- [ ] **Step 1: Run linting**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Run type checking**

Run: `npm run typecheck` or `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 4: Build the project**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: run lint, typecheck, and tests"
```

---

## Plan Review

After writing the plan, I will dispatch a plan-document-reviewer subagent to review the implementation plan before execution.

**Plan saved to:** `docs/superpowers/plans/2026-03-17-leaderboard-screen-implementation.md`
