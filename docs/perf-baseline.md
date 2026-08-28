# Performance Baseline

Measured on 2026-08-03 after Phase 7 changes.

## Build Output

| Category | Size | Notes |
|----------|------|-------|
| Total `dist/` | 51 MB | Includes server functions + static assets |
| `dist/client/_astro/` | 33 MB | CSS + JS + processed hero images (PNG via Vercel image service) |
| `dist/client/images/` | 1.8 MB | Public images (WebP, down from 12 MB) |
| `dist/client/pagefind/` | 1.1 MB | Search index |

## JavaScript

| File | Size | Purpose |
|------|------|---------|
| `ec.0vx5m.js` | 2.5 KB | Expressive Code (only app JS) |
| `sw.js` | 2.6 KB | Service worker |

**Total app JS: ~5 KB** (excluding Pagefind UI which loads on search)

## CSS

| File | Size | Purpose |
|------|------|---------|
| `BaseLayout.*.css` | 34 KB × 2 | Main stylesheet (light + dark variants) |
| `ec.*.css` | 17 KB | Expressive Code / code blocks |
| `FeatureGrid.*.css` | 17 KB | Feature grid component |
| `Toc.*.css` | 5.6 KB | Table of contents |
| `index.*.css` | 5.5 KB | Home page |
| `_..*.css` | 6.1 KB | Blog layout |

**Total CSS: ~120 KB** (before gzip, ~25 KB gzipped)

## Images

### Public images (WebP)
- `confident-typing-at-work.webp`: 557 KB (was 3.9 MB PNG)
- `confident-typing-at-work-2.webp`: 739 KB (was 4.2 MB PNG)
- `herbs-app.webp`: 116 KB (was 919 KB PNG)
- `tb-plus.webp`: 143 KB (was 626 KB PNG)
- `hero.webp`: 18 KB (was 419 KB PNG)
- Total: 1.8 MB (was 12 MB)

### Hero images (processed by Vercel at request time)
- Stored as PNG in build output (~1.5-1.8 MB each)
- Served as WebP/AVIF by Vercel's edge image optimization

## Fonts
- IBM Plex Sans (Google Fonts) - `font-display: swap`
- Source Code Pro (Google Fonts) - `font-display: swap`
- Noto Sans Thai (Google Fonts) - `font-display: swap`
- Non-render-blocking via `media="print" onload` pattern

## CLS Risk Assessment
- **ViewCounter**: Server-rendered, no client-side DOM mutation. Safe.
- **ProgressBar**: `position: fixed`, removed from flow. Safe.
- **OfflineIndicator**: `position: fixed` with `hidden` attribute. Safe.
- **Image.astro**: Now requires `width`/`height` props. Safe.

## Cache Strategy (Service Worker)
- HTML: NetworkFirst (fallback to cache offline)
- Static assets: CacheFirst
- Pagefind index: CacheFirst (search works offline)
- Fonts: CacheFirst (1 year TTL)
- API: NetworkFirst (5s timeout)
