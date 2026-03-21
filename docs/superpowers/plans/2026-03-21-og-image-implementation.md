# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add OpenGraph image generation for roast result pages using Takumi library.

**Architecture:** API route at `/api/og/[id]` generates PNG images dynamically using Takumi's ImageResponse. Metadata is added via Next.js `generateMetadata` in the result page.

**Tech Stack:** Next.js 16, Takumi (@takumi-rs/image-response), TypeScript

---

## File Structure

```
src/app/
├── api/og/[id]/route.ts   (NEW - OG image API endpoint)
├── result/[id]/page.tsx   (MODIFY - add generateMetadata)
next.config.ts              (MODIFY - add serverExternalPackages)
package.json                 (MODIFY - add @takumi-rs/image-response)
```

---

## Tasks

### Task 1: Install Takumi dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @takumi-rs/image-response**

Run: `npm install @takumi-rs/image-response`

---

### Task 2: Configure Next.js for Takumi

**Files:**
- Modify: `next.config.ts:3-4`

- [ ] **Step 1: Add @takumi-rs/core to serverExternalPackages**

```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres", "drizzle-orm", "@prisma/client", "@takumi-rs/core"],
  // ...
};
```

---

### Task 3: Create OG Image API Route

**Files:**
- Create: `src/app/api/og/[id]/route.ts`

- [ ] **Step 1: Create the API route with Takumi ImageResponse**

```typescript
import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roasts, snippets } from "@/db/schema";
import type { RoastAnalysis } from "@/lib/gemini";

interface OgImageProps {
  params: Promise<{ id: string }>;
}

function OgImage({ score, verdict, language, lines, roast }: { score: number; verdict: string; language: string; lines: number; roast: string }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#0C0C0C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 64,
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      {/* Logo Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#22C55E", fontSize: 24, fontWeight: 700 }}>&gt;</span>
        <span style={{ color: "#FAFAFA", fontSize: 20 }}>devroast</span>
      </div>

      {/* Score Row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <span style={{ color: "#F59E0B", fontSize: 160, fontWeight: 900, lineHeight: 1 }}>{score}</span>
        <span style={{ color: "#4B5563", fontSize: 56, lineHeight: 1 }}>/10</span>
      </div>

      {/* Verdict Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
        <span style={{ color: "#EF4444", fontSize: 20 }}>{verdict}</span>
      </div>

      {/* Lang Info */}
      <span style={{ color: "#4B5563", fontSize: 16 }}>lang: {language} · {lines} lines</span>

      {/* Roast Quote */}
      <span style={{ color: "#FAFAFA", fontSize: 22, fontFamily: "IBM Plex Mono, monospace" }}>
        "{roast}"
      </span>

      {/* Border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, border: "1px solid #2A2A2A", pointerEvents: "none" }} />
    </div>
  );
}

export async function GET(request: Request, { params }: OgImageProps) {
  const { id } = await params;
  const roastId = parseInt(id);

  const roastData = await db
    .select({
      id: roasts.id,
      content: roasts.content,
      analysisJson: roasts.analysisJson,
      code: snippets.content,
      language: snippets.language,
    })
    .from(roasts)
    .innerJoin(snippets, eq(roasts.snippetId, snippets.id))
    .where(eq(roasts.id, roastId));

  if (!roastData[0]) {
    return new Response("Roast not found", { status: 404 });
  }

  const data = roastData[0];

  let analysis: RoastAnalysis = {
    score: 5,
    verdict: "solid_work",
    roast: "",
    issues: [],
    diff: [],
  };

  try {
    const parsed = JSON.parse(data.analysisJson || "{}");
    if (parsed.score !== undefined) {
      analysis = parsed as RoastAnalysis;
    }
  } catch {
    // Use defaults
  }

  const lines = data.code.split("\n").length;
  const roastText = analysis.roast || data.content || "No roast available";

  return new ImageResponse(
    <OgImage
      score={analysis.score}
      verdict={analysis.verdict}
      language={data.language}
      lines={lines}
      roast={roastText}
    />,
    {
      width: 1200,
      height: 630,
    }
  );
}
```

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: No errors

---

### Task 4: Add generateMetadata to Result Page

**Files:**
- Modify: `src/app/result/[id]/page.tsx`

- [ ] **Step 1: Add generateMetadata function after imports**

Add at the top of the file, after the imports:

```typescript
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    openGraph: {
      images: [{ url: `/api/og/${id}`, width: 1200, height: 630 }],
    },
  };
}
```

---

### Task 5: Test the implementation

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Test the OG image endpoint**

Visit: `http://localhost:3000/api/og/1`
Expected: PNG image with roast data

- [ ] **Step 3: Verify metadata in result page**

Visit: `http://localhost:3000/result/1`
Expected: Page loads with og:image meta tag pointing to /api/og/1

- [ ] **Step 4: Commit changes**

```bash
git add -A && git commit -m "feat: add OG image generation for roast results"
```

---

## Verification Checklist

- [ ] `/api/og/[id]` returns PNG image
- [ ] Image displays score, verdict, language, lines, and roast quote
- [ ] `/result/[id]` has correct og:image meta tag
- [ ] Lint passes without errors
