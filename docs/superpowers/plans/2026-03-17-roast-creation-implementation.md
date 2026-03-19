# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement roast creation feature allowing users to submit code and receive AI-generated analysis using Gemini API.

**Architecture:** tRPC router with create/getById procedures + Gemini API integration + Result page with dynamic ID

**Tech Stack:** Next.js 16, tRPC, Drizzle ORM, Google Gemini API

---

### Task 1: Add analysisJson Column to roasts Table

**Files:**
- Modify: `src/db/schema/roasts.ts`
- Modify: `.env.local`

- [ ] **Step 1: Add analysisJson column to roasts schema**

```typescript
// src/db/schema/roasts.ts - Add text column
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';
import { roastMoodEnum } from './enums';

export const roasts = pgTable('roasts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  mood: roastMoodEnum('mood').notNull(),
  snippetId: integer('snippet_id').references(() => snippets.id).notNull(),
  analysisJson: text('analysis_json'),  // NEW: Store full analysis
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

- [ ] **Step 2: Add Gemini API key to .env.local**

```
GEMINI_API_KEY=your-api-key-here
```

- [ ] **Step 3: Generate and run migration**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

- [ ] **Step 4: Commit**

```bash
git add src/db/schema/roasts.ts
git commit -m "feat: add analysisJson column to roasts table"
```

**Note:** Do NOT commit .env.local - add it to .gitignore if not already there.

---

### Task 2: Install Gemini SDK

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @google/generative-ai**

```bash
npm install @google/generative-ai
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @google/generative-ai"
```

---

### Task 3: Create Gemini Integration Library

**Files:**
- Create: `src/lib/gemini.ts`

- [ ] **Step 1: Create Gemini lib**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface RoastAnalysis {
  score: number;
  verdict: string;
  roast: string;
  issues: Array<{
    title: string;
    description: string;
    status: string;
  }>;
  diff: Array<{
    type: "add" | "remove" | "context";
    content: string;
  }>;
}

export async function generateRoast(
  code: string,
  language: string,
  mood: "serious" | "roast"
): Promise<RoastAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemPrompt =
    mood === "roast"
      ? `You are a sarcastic code reviewer called "DevRoast". 
         Roast the code brutally but accurately.
         Always respond with valid JSON.`
      : `You are a professional code reviewer.
         Provide constructive feedback.
         Always respond with valid JSON.`;

  const userPrompt = `
${systemPrompt}

Analyze this ${language} code and return ONLY valid JSON (no markdown, no explanation):

{
  "score": 0-10,
  "verdict": "exceptional" | "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work",
  "roast": "your commentary",
  "issues": [
    {"title": "issue name", "description": "details", "status": "critical" | "warning" | "good"}
  ],
  "diff": [
    {"type": "add" | "remove" | "context", "content": "code line"}
  ]
}

Code:
${code}
`;

  const result = await model.generateContent(userPrompt);
  const response = result.response.text();

  // Clean JSON response (remove markdown if present)
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response from Gemini");
  }

  return JSON.parse(jsonMatch[0]) as RoastAnalysis;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/gemini.ts
git commit -m "feat: create Gemini integration library"
```

---

### Task 4: Add Roast Router to tRPC

**Files:**
- Modify: `src/server/routers/_app.ts`

- [ ] **Step 1: Add imports**

```typescript
import { generateRoast } from "@/lib/gemini";
```

- [ ] **Step 2: Add roast router**

Add after the existing routers:

```typescript
roast: router({
  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(5000),
        language: z.string(),
        mood: z.enum(["serious", "roast"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Call Gemini API to get analysis
        const analysis = await generateRoast(
          input.code,
          input.language,
          input.mood
        );

        // 2. Save snippet
        const [snippet] = await db
          .insert(snippets)
          .values({
            title: input.code.split("\n")[0].slice(0, 100) || "Untitled",
            content: input.code,
            language: input.language,
            status:
              analysis.verdict === "needs_serious_help"
                ? "critical"
                : analysis.verdict === "rough_around_edges"
                  ? "warning"
                  : "good",
            evaluation: analysis.verdict,
          })
          .returning();

        // 3. Save roast with full analysis
        const [roast] = await db
          .insert(roasts)
          .values({
            content: analysis.roast,
            mood: input.mood,
            snippetId: snippet.id,
            analysisJson: JSON.stringify(analysis),
          })
          .returning();

        // 4. Save to leaderboard
        const currentPeriod = new Date().toISOString().slice(0, 7);
        await db.insert(leaderboardEntries).values({
          snippetId: snippet.id,
          score: analysis.score,
          period: currentPeriod,
          rank: 0,
        });

        return { roastId: roast.id, snippetId: snippet.id };
      } catch (error) {
        console.error("Failed to create roast:", error);
        throw new Error("Failed to generate roast");
      }
    }),

  getById: publicProcedure
    .input(z.number().int())
    .query(async ({ input }) => {
      const roastData = await db
        .select({
          id: roasts.id,
          content: roasts.content,
          mood: roasts.mood,
          snippetId: roasts.snippetId,
          createdAt: roasts.createdAt,
          analysisJson: roasts.analysisJson,
          code: snippets.content,
          language: snippets.language,
          title: snippets.title,
        })
        .from(roasts)
        .innerJoin(snippets, eq(roasts.snippetId, snippets.id))
        .where(eq(roasts.id, input));

      if (!roastData[0]) return null;

      const analysis = JSON.parse(roastData[0].analysisJson || "{}");

      return {
        id: roastData[0].id,
        content: roastData[0].content,
        mood: roastData[0].mood,
        code: roastData[0].code,
        language: roastData[0].language,
        title: roastData[0].title,
        createdAt: roastData[0].createdAt,
        lines: roastData[0].code.split("\n").length,
        ...analysis,
      };
    }),
}),
```

- [ ] **Step 3: Commit**

```bash
git add src/server/routers/_app.ts
git commit -m "feat: add roast router with create and getById"
```

---

### Task 5: Update RaySoCodeEditor with onSubmit

**Files:**
- Modify: `src/app/components/CodeEditor/RaySoCodeEditor.tsx`

- [ ] **Step 1: Add onSubmit prop and handle submission**

Add to interface:
```typescript
interface RaySoCodeEditorProps {
  initialCode?: string;
  initialLanguage?: Language;
  onChange?: (code: string, language: Language) => void;
  onSubmit?: (code: string, language: Language, mood: boolean) => void;  // ADD
}
```

Add in component:
```typescript
// Handle submit
const handleSubmit = () => {
  if (onSubmit && code.trim()) {
    onSubmit(code, language, roastMode);
  }
};
```

- [ ] **Step 2: Update button to use handleSubmit**

Replace the button with:
```tsx
<button
  onClick={handleSubmit}
  disabled={charCount > MAX_CODE_LENGTH || !code.trim()}
  className="bg-[#10B981] text-[#0A0A0A] text-xs font-medium px-4 py-2 rounded cursor-pointer hover:bg-[#0D9668] transition-colors disabled:bg-[#4B5563] disabled:cursor-not-allowed disabled:text-[#6B7280]"
>
  $ roast_my_code
</button>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/components/CodeEditor/RaySoCodeEditor.tsx
git commit -m "feat: add onSubmit to RaySoCodeEditor"
```

---

### Task 6: Update Homepage to Handle Submit

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add trpc and router handling**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { RaySoCodeEditor } from "@/app/components/CodeEditor/RaySoCodeEditor";
import { trpc } from "@/lib/trpc-client";
// ... existing imports

export default function HomePage() {
  const router = useRouter();
  
  const createRoast = trpc.roast.create.useMutation({
    onSuccess: (data) => {
      router.push(`/result/${data.roastId}`);
    },
    onError: (error) => {
      alert(`Failed to create roast: ${error.message}`);
    },
  });

  const handleSubmit = (code: string, language: string, roastMode: boolean) => {
    createRoast.mutate({
      code,
      language,
      mood: roastMode ? "roast" : "serious",
    });
  };

  return (
    // ... existing JSX
    <RaySoCodeEditor onSubmit={handleSubmit} />
    // ... rest
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: connect RaySoCodeEditor to tRPC roast.create"
```

---

### Task 7: Update Result Page to Use Dynamic ID

**Files:**
- Create: `src/app/result/[id]/page.tsx`

- [ ] **Step 1: Create dynamic result page**

```tsx
"use client";

import { trpc } from "@/lib/trpc-client";
import { CodeBlock } from "@/app/components/ui/code-block";
import { use } from "react";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { id } = use(params);
  const roastId = parseInt(id);
  
  return <ResultContent roastId={roastId} />;
}

function ResultContent({ roastId }: { roastId: number }) {
  const { data, isLoading, error } = trpc.roast.getById.useQuery(roastId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-page text-foreground font-mono flex items-center justify-center">
        <div className="text-text-secondary">Loading roast...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-page text-foreground font-mono flex items-center justify-center">
        <div className="text-red-accent">Roast not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return { dot: "bg-[#EF4444]", text: "text-[#EF4444]", label: "critical" };
      case "warning":
        return { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]", label: "warning" };
      case "good":
        return { dot: "bg-[#22C55E]", text: "text-[#22C55E]", label: "good" };
      default:
        return { dot: "bg-gray-accent", text: "text-gray-accent", label: status };
    }
  };

  return (
    <div className="min-h-screen bg-bg-page text-foreground font-mono">
      <main className="flex flex-col items-center py-6 md:py-10 px-4 md:px-10">
        <div className="w-full max-w-[960px] space-y-10 px-0 md:px-0">
          {/* Score Hero */}
          <div className="flex items-center gap-12">
            <div className="relative w-[180px] h-[180px] flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="35%" stopColor="#F59E0B" />
                    <stop offset="65%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="80" fill="transparent" stroke="#1F1F1F" strokeWidth="4" />
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="transparent"
                  stroke="url(#scoreGradient)"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - (data.score || 5) / 10)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-accent-amber">{data.score || 5}</span>
                <span className="text-sm text-text-tertiary">/10</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-accent" />
                <span className="text-red-accent font-mono text-sm">
                  verdict: {data.verdict || "solid_work"}
                </span>
              </div>

              <h2 className="text-text-primary font-mono text-xl leading-relaxed">
                {data.roast || data.content || "No roast available"}
              </h2>

              <div className="flex items-center gap-4">
                <span className="text-text-tertiary font-mono text-xs">lang: {data.language}</span>
                <span className="text-text-tertiary">·</span>
                <span className="text-text-tertiary font-mono text-xs">{data.lines} lines</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-border-primary" />

          {/* Submitted Code */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-mono text-sm font-bold">//</span>
              <span className="text-text-primary font-mono text-sm font-bold">your_submission</span>
            </div>
            <CodeBlock code={data.code} language={data.language} className="w-full" />
          </div>

          <div className="w-full h-px bg-border-primary" />

          {/* Analysis */}
          {data.issues && data.issues.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-accent-green font-mono text-sm font-bold">//</span>
                <span className="text-text-primary font-mono text-sm font-bold">detailed_analysis</span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {data.issues.map((issue: any, index: number) => {
                  const status = getStatusColor(issue.status);
                  return (
                    <div key={index} className="p-5 border border-border-primary rounded space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                        <span className={`${status.text} font-mono text-xs font-medium`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-text-primary font-mono text-sm font-medium">{issue.title}</p>
                      <p className="text-text-secondary font-mono text-xs">{issue.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data.diff && data.diff.length > 0 && (
            <>
              <div className="w-full h-px bg-border-primary" />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-accent-green font-mono text-sm font-bold">//</span>
                  <span className="text-text-primary font-mono text-sm font-bold">suggested_fix</span>
                </div>

                <div className="bg-bg-input border border-border-primary rounded">
                  <div className="h-10 flex items-center px-4 border-b border-border-primary">
                    <span className="text-text-secondary font-mono text-xs">
                      original → improved
                    </span>
                  </div>
                  <div className="py-1">
                    {data.diff.map((line: any, index: number) => {
                      const bgColor =
                        line.type === "remove"
                          ? "bg-[#EF444415]"
                          : line.type === "add"
                            ? "bg-[#10B98115]"
                            : "";
                      const prefixColor =
                        line.type === "remove"
                          ? "text-red-accent"
                          : line.type === "add"
                            ? "text-green-accent"
                            : "text-text-tertiary";
                      const prefixContent = line.type === "remove" ? "-" : line.type === "add" ? "+" : " ";

                      return (
                        <div key={index} className={`h-7 flex items-center ${bgColor}`}>
                          <span className={`w-5 text-center ${prefixColor} font-mono text-xs`}>
                            {prefixContent}
                          </span>
                          <span className="text-xs text-text-primary font-mono">{line.content}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/result/\[id\]/page.tsx
git commit -m "feat: create dynamic result page with roast details"
```

---

### Task 8: Test the Implementation

**Verification:**

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the flow**

1. Go to homepage
2. Enter some code
3. Toggle roast mode on/off
4. Click "roast_my_code"
5. Wait for analysis
6. Should redirect to /result/{id}
7. Verify all data displays correctly

- [ ] **Step 3: Run build**

```bash
npm run build
```

---

### Summary

| Task | Description |
|------|-------------|
| 1 | Add analysisJson column to roasts table |
| 2 | Install Gemini SDK |
| 3 | Create Gemini integration lib |
| 4 | Add roast router to tRPC |
| 5 | Update RaySoCodeEditor with onSubmit |
| 6 | Update homepage to handle submit |
| 7 | Create dynamic result page |
| 8 | Test implementation |
