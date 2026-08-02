# RxDev Man — Roadmap

This roadmap describes what RxDev Man is, from reading its own code — and where it should end up. It follows the conventions in [contributing.md](contributing.md), the security posture in [security.md](security.md), and the design system documented in [design.md](design.md) and implemented in `src/styles/global.css`.

> **What RxDev Man is.** A _quiet, personal_ developer knowledge base — one
> pharmacist-turned-developer's public notebook. You write MDX articles, organize
> them by category and tag, showcase tools you've built, and let readers find
> what matters through instant search. Every article is yours: the content lives
> in your repo, the data lives in Supabase, and the deploy is a git push. No
> walled garden, no platform lock-in, no algorithm deciding who sees what.
>
> **What RxDev Man is not.** Not a social platform, not a Medium, not a
> collaborative wiki. There are no comments, no follows, no claps, no algorithmic
> feed. The single-author, calm, fast, content-first shape is the product. A
> developer's knowledge base that respects both the author's time and the
> reader's attention. Features that break that shape are listed under "Out of
> Scope" so the line is drawn on purpose.

Nothing here is called "done" on intent alone. The repo already has a real
CI pipeline (`.github/workflows/ci.yml`: lint, type check, build); every phase's
acceptance is checked against it.

---

## Current State (verified against the repo, not assumed)

- **Stack**: Astro 7.x (CSR + SSG hybrid), TypeScript 6.x, MDX, Supabase
  (PostgreSQL + GoTrue), Vercel Edge Network. Version `1.22.6`. No server of
  our own — the browser talks to Supabase's PostgREST for read-only counts,
  and the API route uses the service role key server-side for writes.
- **Security model**: CSP headers in `vercel.json`, RLS on all Supabase tables
  (page_views blocked from anon, view_counts read-only for anon), service role
  key server-side only. `unsafe-inline` and `unsafe-eval` present in CSP —
  needs tightening.
- **Schema** (`supabase-schema.sql`, idempotent): `rxdevman_page_views` (raw
  hits with hashed IP), `rxdevman_view_counts` (pre-aggregated), `increment_view_count`
  RPC, `pg_cron` auto-cleanup after 90 days.
- **Content**: 23 MDX blog posts (Thai + English), covering Rust, Git, Vue,
  Haskell, accessibility, healthcare tools, book notes, and more.
- **Components**: blog (BlogPostCard, Toc, ViewCounter, ShareButtons, RelatedPosts),
  content (CodeExplainer, InfoBox, GitCommand, ProsCons, PullQuote, SideNote,
  NarrativeSection, Image, YouTube, Table), layout (Navbar), tools (ToolCard),
  ui (FeatureCard, FeatureGrid, ProgressBar).
- **Design system** (`global.css`, 1334 lines): CSS Layers (reset → base →
  components → utilities), primitive/semantic/component token hierarchy, fluid
  type scale, 4px spacing scale, elevation tokens, keyframe animations.
- **CI**: GitHub Actions — ESLint, Astro type check, production build.
  CodeQL security analysis. Husky + commitlint for commit hygiene.
- **Search**: Pagefind (static, client-side, typo-tolerant).

### Gaps found while reading the repo (these shape the phases below)

1. **No DESIGN.md.** The design tokens exist in CSS but have no documentation
   explaining _why_ these choices serve a developer knowledge base. Without a
   design document, future contributors make aesthetic decisions by feel, not
   by system. (Phase 1.)
2. **Zero tests.** No test framework, no test files, no test command in CI. The
   two things that must never silently break — the **view-counting pipeline**
   (hash correctness, RPC atomicity) and the **content schema validation**
   (Zod frontmatter) — have zero coverage. (Phase 2.)
3. **No CONTRIBUTING.md, no AGENTS.md, no SECURITY.md.** The README has a
   short contributing section, but no formal guidelines for code style, commit
   conventions (beyond commitlint), review process, or security disclosure.
   (Phase 1.)
4. **Dark mode is listed in the README roadmap but the design system is
   light-only.** The token architecture supports it (semantic tokens exist),
   but no `[data-theme]` or `prefers-color-scheme` media query remaps colors.
   (Phase 3.)
5. **No RSS feed.** A developer blog without RSS is invisible to readers who
   use feed readers — the exact audience that values open, non-algorithmic
   content delivery. (Phase 4.)
6. **No series/collections.** 23 posts with natural groupings (Rust series,
   Git series, HOSxP tools) but no way to link them as a learning path.
   (Phase 4.)
7. **CSP has `unsafe-inline` and `unsafe-eval`.** The Astro/Vercel bootstrap
   likely needs `unsafe-inline` for styles, but this should be audited and
   tightened. (Phase 6.)
8. **No offline story.** A developer blog should be readable on trains, planes,
   and bad cafe wifi. Astro's SSG output is already static — a service worker
   is a natural fit. (Phase 5.)
9. **No performance budgets.** The CI builds but doesn't measure. No bundle
   size ceiling, no Lighthouse budget, no regression guard. (Phase 7.)
10. **`.env` exists on disk with live Supabase credentials.** The `.gitignore`
    lists `.env` but the file is present. Need to verify it's not tracked in
    git history. (Phase 6.)

---

## Phase 1: Foundation — Documentation & Design System ✅

The project needs its identity on paper before it builds on top of it.

- [x] **Write `DESIGN.md`** — document the design system that already exists
      in `global.css`: why IBM Plex Sans + Source Code Pro, why the warm gray
      palette (not cold), why 4px spacing, why fluid type scales, the layer
      architecture (reset → base → components → utilities), and the token
      hierarchy (primitive → semantic → component → legacy aliases). This is the
      _rationale_, not the code — the code is the source of truth.
- [x] **Write `SECURITY.md`** — document the security posture: CSP headers,
      Supabase RLS model, service role key usage, IP hashing strategy, the
      `pg_cron` cleanup, and how to report vulnerabilities. Note what `unsafe-inline`
      in the CSP means and the plan to tighten it.
- [x] **Write `CONTRIBUTING.md`** — formalize what the README has: branch
      naming, conventional commits (commitlint is already enforced), code style
      (ESLint config), how to add a blog post (frontmatter schema, MDX
      components available), and the PR review process.
- [x] **Write `AGENTS.md`** — conventions for AI agents working in this repo:
      file structure, component patterns, token usage, no inline hex colors
      (route through tokens), how to add new pages, the Supabase access pattern.
- [x] **Clean up legacy token aliases** in `global.css` — the `/* Legacy
Aliases */` section (lines 153–168) exists for backward compatibility. Audit
      usage across all components and migrate to semantic tokens, then remove the
      aliases.
- [x] **Verify `.env` is not in git history** — check `git log --all --full-history -- .env` and
      remove if tracked. Add `.env` to `.gitignore` explicitly if not already.

**Acceptance:** DESIGN.md describes rxdevman, not generic best practices;
SECURITY.md exists; CONTRIBUTING.md exists; AGENTS.md exists; legacy aliases
removed or justified; `.env` not in git history.

---

## Phase 2: Trust the Things That Must Never Break

The view-counting pipeline and the content schema are the two places a silent
regression does real harm. They get tests before anything is built on top of
them.

- [ ] **Set up Vitest** — add `vitest` as a dev dependency, create `vitest.config.ts`,
      add `bun run test` script, add test step to CI.
- [ ] **View-count pipeline tests** — test the `increment_view_count` RPC logic:
      first hit creates a row, subsequent hits increment total_views, unique_visitors
      counts distinct ip_hash, the daily hash rotation produces different hashes on
      different days. These are SQL-level tests (can use `vitest` with a Supabase
      local instance or mock the RPC contract).
- [ ] **IP hash tests** — test the SHA-256(ip + date + salt) function in
      `src/lib/hash.ts`: same input produces same hash, different salt produces
      different hash, different date produces different hash, the hash is
      consistently formatted.
- [ ] **Zod frontmatter schema tests** — validate that the schema in
      `src/content/config.ts` (or wherever the Zod schema lives) rejects missing
      required fields, rejects invalid dates, rejects invalid category values, and
      accepts valid frontmatter.
- [ ] **RelatedPosts scoring tests** — the tag/category scoring algorithm in
      `RelatedPosts.astro` (or its extracted logic) should be tested: same tags
      score higher, category match scores higher than tag match, fallback to most
      recent works.
- [ ] **Slug generation tests** — `slugify` utility in `src/utils/`: handles
      Thai characters, handles special characters, handles collisions.
- [ ] **Reading time calculation tests** — `src/utils/reading-time.ts`: edge
      cases (empty content, very short content, code blocks not counted as words).

**Acceptance:** `bun run test` passes in CI; the view-counting logic and
Zod schema are covered; no silent regression can slip through.

---

## Phase 3: Dark Mode & Theme System

The design tokens are already structured for this — it's a matter of wiring
them up.

- [ ] **Add `[data-theme="dark"]` remap** in `global.css` — override semantic
      tokens (surfaces, text, borders, brand) under a dark palette. Keep the same
      token _names_ so no component changes. The gray scale shifts from warm light
      to warm dark (not AMOLED black — a reading-app dark, not a terminal dark).
- [ ] **Add `[data-theme="sepia"]` remap** — a warm, low-contrast reading mode
      for long articles. Sepia background, slightly muted text, reduced blue light.
      This serves the "developer reading book notes at 11pm" use case.
- [ ] **Respect `prefers-color-scheme`** — default to the OS preference when
      no explicit theme is set. Store user preference in `localStorage`.
- [ ] **Theme toggle component** — a small, accessible toggle in the navbar
      (or footer) that cycles light → dark → sepia. Keyboard-accessible, announces
      current theme to screen readers via `aria-label`.
- [ ] **Verify all components render correctly in all three themes** — check
      blog post cards, code blocks (Andromeeda theme needs its own dark variant),
      InfoBox, GitCommand, ToolCard, navbar, mobile overlay.
- [ ] **Code block theme switching** — the `astro-expressive-code` integration
      uses `andromeeda` theme. Add a dark-appropriate theme (e.g., `github-dark`)
      and switch based on the active theme. This may require configuring
      `expressiveCode` to accept multiple themes.

**Acceptance:** all three themes render from tokens alone; `prefers-color-scheme`
works; user preference persists; code blocks look correct in all themes.

---

## Phase 4: Content Discovery & Organization

Deepen exactly the content loop RxDev Man already has — write, organize,
discover — without adding a second product.

- [ ] **RSS feed** — Astro has `@astrojs/rss` integration. Generate `/rss.xml`
      from all published blog posts. Include full content or summary, categories,
      tags, publication date. Auto-discoverable via `<link rel="alternate">` in
      the `<head>`.
- [ ] **Series/Collections** — a frontmatter field `series` (string) that
      groups related posts. A `/blog/series/[series]` page that lists posts in
      order. The series name appears on the blog post card and at the top of the
      post with navigation (previous/next in series). Natural groupings: "Rust
      from Scratch", "HOSxP Development", "Git Mastery".
- [ ] **Reading time on blog cards** — already calculated in `src/utils/reading-time.ts`,
      but verify it's displayed on BlogPostCard. If not, add it.
- [ ] **"Recently Published" section on homepage** — the homepage already has
      a hero. Add a section below showing the 3 most recent posts with
      BlogPostCard, giving returning visitors an immediate entry point.
- [ ] **Category page improvements** — the `/blog/categories/[category]` page
      exists but may need a better layout: category description, post count, sorted
      by date.
- [ ] **Tag cloud / tag index** — a `/blog/tags` page that lists all tags with
      post counts, linking to `/blog/tags/[tag]`. Helps readers discover content
      breadth.

**Acceptance:** RSS validates in a feed reader; series pages render correctly;
homepage shows recent posts; no new sharing, social, or multi-user features.

---

## Phase 5: Offline-First (the natural end-state for a static blog)

Astro outputs static HTML + CSS + JS. A service worker can cache the shell
and let readers access content offline — the same content they'd get online.

- [ ] **PWA manifest** — the `site.webmanifest` already exists. Verify it has
      proper name, description, icons, theme colors, and `display: standalone`.
- [ ] **Service worker** — cache the app shell (HTML, CSS, JS, fonts, images)
      on install. Serve from cache when offline, update in background. Use
      `workbox` or a lightweight custom SW.
- [ ] **Offline indicator** — a calm, non-intrusive banner when the network is
      unavailable: "You're offline — reading cached content." Not a toast storm.
- [ ] **Search works offline** — Pagefind builds a static index. Cache the
      index files so search works without network.
- [ ] **View counter degrades gracefully** — when offline, the POST to
      `/api/track` will fail silently (no error shown to reader). On reconnect,
      the next page load will track normally.

**Acceptance:** reading, searching, and navigating all work with the network
fully off; the service worker caches and serves correctly; the offline
indicator appears and disappears cleanly.

---

## Phase 6: Security & Supply-Chain Hardening

- [ ] **Audit CSP in `vercel.json`** — the current CSP has `unsafe-inline` for
      styles and `unsafe-inline` + `unsafe-eval` for scripts. Audit whether
      `unsafe-eval` is actually needed (Astro 7 may not require it). Remove if
      possible; document why if not. Add `upgrade-insecure-requests` if the site
      should be HTTPS-only.
- [ ] **Add `SECURITY.md`** (if not done in Phase 1) — document the security
      model: CSP, Supabase RLS, IP hashing, service role key usage, how to report
      vulnerabilities.
- [ ] **CodeQL + dependency audit** — CodeQL is already in CI. Add
      `bun audit` (or equivalent) to CI to catch known vulnerabilities in
      dependencies. Renovate is already handling automated updates.
- [ ] **Verify `.env` not in git history** (if not done in Phase 1).
- [ ] **Add `permissions` to CI workflow** — the `ci.yml` already has
      `permissions: contents: read`. Verify `codeql.yml` has minimal permissions
      too.
- [ ] **Pin GitHub Actions to commit SHAs** — already done (checkout pinned
      to `3d3c42e...`, setup-node to `8207627...`, setup-bun to `c05077e...`).
      Verify CodeQL action is also pinned.

**Acceptance:** CSP has no unnecessary `unsafe-*`; `bun audit` passes in CI;
all GitHub Actions pinned to SHAs; SECURITY.md exists.

---

## Phase 7: Performance Budgets (verified, not claimed)

- [ ] **Measure a baseline first** — on a mid-tier device (throttled CPU +
      network): cold first-paint, LCP, CLS, FID/INP, total bundle size (JS + CSS),
      page weight (HTML + images). Record in `docs/perf-baseline.md`.
- [ ] **Set CI-enforced budgets** — bundle size ceiling that fails the build;
      Lighthouse score thresholds. Calibrated to real numbers, not guesses.
- [ ] **Image audit** — verify all images use Astro `<Image>` for WebP
      conversion and responsive srcsets. Check for any `<img>` tags that bypass
      optimization.
- [ ] **Font loading audit** — the current approach uses `media="print" onload`
      for non-render-blocking. Verify font-display is `swap` and no FOIT occurs.
- [ ] **Verify no layout shift** from async-loaded components (ViewCounter,
      ProgressBar). These should have reserved space or load without shifting.

**Acceptance:** budgets enforced in CI; baseline doc exists; no regression
merges without a noted exception.

---

## Phase 8: First Stable Release (v2.0.0)

The current version is `1.22.6`. The roadmap above adds significant
capability (dark mode, RSS, offline, tests, security hardening). A v2.0.0
marks the point where RxDev Man is a _complete_ developer knowledge base.

- [ ] **Reproducible build documented** — exact toolchain versions (Node,
      Bun, Astro), env inputs → the same `dist/` from a given commit.
- [ ] **Vercel preview on every PR** — already works via Vercel's GitHub
      integration. Verify that CSP + SPA fallback are tested in preview.
- [ ] **Branch protection on `main`** — strict required status checks (lint,
      type check, build, test), no force-push, no deletion.
- [ ] **User-facing getting-started** — a short guide in README: how to add a
      post, how to add a tool page, how to add a category. So the knowledge base
      is easy to extend.
- [ ] **`v2.0.0` tag** once Phases 1–7 acceptance checks pass, CHANGELOG cut
      with git-cliff or similar.

**Acceptance:** a tagged, reproducible release; branch protection live; docs
match the app.

---

## How the phases relate

```
Phase 1 (Foundation: docs + design)  ─┐
Phase 2 (Trust: tests)               ─┤ foundation — do these first
Phase 3 (Dark mode + themes)          ─┘
        │
        ▼
Phase 4 (Content discovery) ──► Phase 5 (Offline-first)
        │
        ▼
Phase 6 (Security hardening)
        │
        ▼
Phase 7 (Performance budgets)
        │
        ▼
Phase 8 (v2.0.0)
```

Phase 1 comes first on purpose: RxDev Man cannot grow sustainably without
its identity on paper. Phase 2 comes with it because the view-counting
pipeline and content schema are the two things a silent regression hurts most.
Everything after is deepening the one loop RxDev Man has — write, read,
discover — never adding a second product.

---

## Out of Scope (drawn on purpose, to stay a personal knowledge base)

Each of these is valuable _for a different product_. RxDev Man stays small and
single-author on purpose:

- **Comment system / community features** — adds moderation, spam, abuse
  surface. A developer's notebook doesn't need strangers talking on it.
  If comments are wanted later, a third-party embed (giscus/GitHub Discussions)
  is a better fit than self-hosted.
- **Multi-author / collaborative editing** — out of scope; the blog is one
  person's public notebook.
- **Analytics dashboard** — view counts are displayed honestly on articles.
  A full analytics dashboard with graphs, geographic breakdowns, and referral
  tracking adds complexity and privacy surface for no reader benefit.
- **AI summarization / chat over content** — deferred indefinitely; adds a
  network dependency and a cost/privacy surface.
- **Telemetry / analytics on reader behavior** — explicitly never. The visitor
  tracking counts views; it doesn't track _readers_.
- **Native mobile apps** — the PWA (Phase 5) is the mobile story.

## Future / Ecosystem (post-v2.0.0, if they keep RxDev Man quiet)

- **Book notes template** — a dedicated MDX layout for book notes (like the
  Ultralearning post) with structured fields: book title, author, rating,
  key takeaways, chapter-by-chapter notes.
- **Interactive code playgrounds** — embed runnable Rust/Vue/TypeScript
  examples using StackBlitz or CodeSandbox iframes.
- **Newsletter integration** — a simple "subscribe to RSS" or Buttondown/
  Substack embed for readers who want email delivery.
- **Multi-language support** — i18n for Thai/English content, since the blog
  already has posts in both languages.
- **API documentation pages** — for tools like CupsaBot and HerbReady, auto-
  generated API docs from code comments or OpenAPI specs.
- **Reading list / bookmarks** — a private page (Supabase + auth) where the
  author saves links to interesting articles, creating a public "things I've
  read" page.
