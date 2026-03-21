# OG Image Generation for Roast Results

## Overview

Add OpenGraph (OG) image generation for roast result pages (`/result/[id]`). When users copy the shareable link, social platforms will display a preview image with the roast score, verdict, and quote.

## Design

### Image Specifications

- **Dimensions:** 1200x630 pixels
- **Format:** PNG
- **Background:** `#0C0C0C` (bg-page dark)
- **Border:** 1px stroke `#2A2A2A`

### Layout (Top to Bottom, Centered)

1. **Logo Row** (y: 123)
   - `>` in `#22C55E` (accent-green), JetBrains Mono 24px bold
   - `devroast` in `#FAFAFA` (text-primary), JetBrains Mono 20px

2. **Score Row** (y: 183)
   - `3.5` in `#F59E0B` (accent-amber), JetBrains Mono 160px bold
   - `/10` in `#4B5563` (text-tertiary), JetBrains Mono 56px
   - Both share same baseline (align-items: end)

3. **Verdict Row** (y: 371)
   - Dot: 12px circle in `#EF4444` (accent-red)
   - Gap: 8px
   - Text: verdict string in `#EF4444`, JetBrains Mono 20px

4. **Lang Info** (y: 425)
   - Format: `lang: {language} · {lines} lines`
   - Color: `#4B5563`, JetBrains Mono 16px
   - Centered

5. **Roast Quote** (y: 474)
   - Surrounded by curly quotes
   - Color: `#FAFAFA`, IBM Plex Mono 22px
   - Centered

## Implementation

### 1. Install Takumi

```bash
npm i @takumi-rs/image-response
```

### 2. Configure Next.js

In `next.config.ts`:

```ts
export const config = {
  serverExternalPackages: ["@takumi-rs/core"],
};
```

### 3. Create API Route

File: `src/app/api/og/[id]/route.ts`

- Method: `GET`
- Fetches roast data by ID from database
- Returns `ImageResponse` with 1200x630 dimensions
- Content-Type: `image/png`

### 4. Add Metadata

File: `src/app/result/[id]/page.tsx`

Add `generateMetadata` function with:

```ts
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    openGraph: {
      images: [{ url: `/api/og/${id}`, width: 1200, height: 630 }],
    },
  };
}
```

## Files to Create

- `src/app/api/og/[id]/route.ts` - OG image API endpoint

## Files to Modify

- `next.config.ts` - Add serverExternalPackages
- `package.json` - Add @takumi-rs/image-response
- `src/app/result/[id]/page.tsx` - Add generateMetadata

## Dependencies

- `@takumi-rs/image-response` - Image generation

## Notes

- Image is generated dynamically on each request
- No caching layer (Next.js handles via default headers)
- Keep implementation simple (no query params for theming)
