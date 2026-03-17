# Roast Creation Feature Specification

**Date:** 2026-03-17  
**Project:** DevRoast  
**Author:** opencode

## Overview

Implement the roast creation feature allowing users to submit code snippets and receive AI-generated analysis using Google Gemini API. The feature includes backend tRPC integration, database storage, and frontend result display.

## Requirements

1. User submits code via RaySoCodeEditor on homepage
2. Code is saved to database (snippets table)
3. Gemini API generates analysis based on mood (serious/roast)
4. Roast is saved to database (roasts table)
5. User is redirected to result page showing the analysis
6. No share functionality for now

## Architecture

### Data Flow

```
RaySoCodeEditor (homepage)
  → Submit button click
  → tRPC.roast.create.mutate({code, language, mood})
  → Server: Save snippet to DB
  → Server: Call Gemini API with code + mood
  → Server: Parse Gemini response
  → Server: Save roast to DB  
  → Server: Return {roastId}
  → Client: Redirect to /result/{roastId}
  → ResultPage: Fetch and display roast data
```

### Database Schema

**snippets table** (existing):
- id, title, content, language, status, evaluation, createdAt, updatedAt

**roasts table** (existing):
- id, content, mood, snippetId, createdAt, updatedAt

**leaderboardEntries table** (existing):
- id, snippetId, score, period, rank, createdAt, updatedAt

**Note:** The existing schema stores only basic data. For the result page to display full analysis (score, verdict, issues, diff), we have two options:
1. Add columns to `roasts` table for full JSON storage
2. Return analysis data directly from the create mutation and store in session/URL

For simplicity, we'll return the full analysis from the create mutation and pass it to the result page via a temporary solution (URL params or fetch by ID with stored analysis).

## Backend Implementation

### tRPC Router

**File:** `src/server/routers/_app.ts`

Add new `roast` router:

```typescript
roast: router({
  create: publicProcedure
    .input(z.object({
      code: z.string().min(1).max(5000),
      language: z.string(),
      mood: z.enum(['serious', 'roast']),
    }))
    .mutation(async ({ input }) => {
      // 1. Call Gemini API to get analysis
      const analysis = await callGeminiAPI(input.code, input.language, input.mood);
      
      // 2. Save snippet with required fields derived from Gemini response
      const [snippet] = await db.insert(snippets).values({
        title: input.code.split('\n')[0].slice(0, 100) || 'Untitled',
        content: input.code,
        language: input.language,
        status: mapVerdictToStatus(analysis.verdict),
        evaluation: analysis.verdict,
      }).returning();
      
      // 3. Save roast with full analysis as JSON
      const [roast] = await db.insert(roasts).values({
        content: analysis.roast,
        mood: input.mood,
        snippetId: snippet.id,
        // Store full analysis - requires adding column or using alternative storage
        analysisJson: JSON.stringify(analysis), 
      }).returning();
      
      // 4. Save to leaderboard
      const currentPeriod = new Date().toISOString().slice(0, 7);
      await db.insert(leaderboardEntries).values({
        snippetId: snippet.id,
        score: analysis.score,
        period: currentPeriod,
        rank: 0,
      });
      
      return { roastId: roast.id, analysis };
    }),
  
  getById: publicProcedure
    .input(z.number().int())
    .query(async ({ input }) => {
      const roastData = await db.select().from(roasts)...
      return JSON.parse(roastData.analysisJson);
    }),
}),
```

### Gemini Integration

**File:** Create `src/lib/gemini.ts` or add to router

- Use Google Generative AI SDK
- API Key from environment: `GEMINI_API_KEY`
- Model: gemini-2.0-flash (or appropriate)

**Prompt Structure:**

```typescript
const systemPrompt = mood === 'roast' 
  ? `You are a sarcastic code reviewer called "DevRoast". 
     Roast the code brutally but accurately.`
  : `You are a professional code reviewer.
     Provide constructive feedback.`;

const userPrompt = `
Analyze this ${language} code and return JSON:

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
```

## Frontend Implementation

### RaySoCodeEditor Updates

**File:** `src/app/components/CodeEditor/RaySoCodeEditor.tsx`

- Add `onSubmit` prop for submit handler
- Pass `{code, language, mood}` to parent
- Handle loading state during submission
- Redirect to result page after success

### Result Page Updates

**File:** `src/app/result/page.tsx` or create `src/app/result/[id]/page.tsx`

- Accept roast ID from URL
- Fetch roast data via tRPC
- Display all result fields
- Handle loading/error states

## UI Components

### Result Page Layout

```
┌─────────────────────────────────────────────┐
│ Score Ring (0-10)                           │
│ Verdict Badge                               │
│ Roast Commentary                            │
│ Language | Lines | Share Buttons            │
├─────────────────────────────────────────────┤
│ your_submission (code block)                │
├─────────────────────────────────────────────┤
│ detailed_analysis (issues grid)             │
├─────────────────────────────────────────────┤
│ suggested_fix (diff view)                   │
└─────────────────────────────────────────────┘
```

## Error Handling

- Invalid input: Return validation error
- Gemini API failure: Return error message, allow retry
- Database error: Log and return user-friendly message
- Empty code: Prevent submission

## Security

- API key stored in environment variable
- Never expose key in client code
- Validate input length (max 5000 chars)
- Sanitize code before sending to Gemini

## Testing Strategy

1. Test tRPC endpoint with mock Gemini
2. Test validation (empty code, invalid mood)
3. Test error handling (API failure)
4. Test frontend redirect after submission
5. Test result page displays all fields

## Environment Variables

Add to `.env.local`:
```
GEMINI_API_KEY=your-api-key-here
```

**Note:** Store your Gemini API key in the environment variable. Never commit keys to version control.
