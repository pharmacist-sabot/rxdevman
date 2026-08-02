# Contributing to RxDev Man

Thanks for your interest in contributing. This document explains how to work in this codebase.

---

## Setup

```bash
git clone https://github.com/suradet-ps/rxdevman.git
cd rxdevman
bun install
cp .env.example .env  # fill in your Supabase credentials
bun run dev
```

Visit `http://localhost:4321`.

---

## Branch Naming

| Pattern           | Use                                     |
| ----------------- | --------------------------------------- |
| `feat/<name>`     | New feature                             |
| `fix/<name>`      | Bug fix                                 |
| `docs/<name>`     | Documentation only                      |
| `refactor/<name>` | Code restructuring, no behavior change  |
| `chore/<name>`    | Maintenance, config, dependency updates |

---

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Commitlint enforces this — your commit will be rejected if the format is wrong.

**Format:** `type(scope): subject`

**Types:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

**Examples:**

```
feat(blog): add Rust ownership article
fix(view-counter): handle missing Supabase env vars
docs: update README with setup instructions
refactor(css): migrate legacy token aliases to semantic tokens
```

**Rules:**

- Type must be lowercase
- No trailing period in subject
- Subject should be imperative mood ("add feature", not "added feature")

---

## Code Style

ESLint is configured with `@antfu/eslint-config`. The pre-commit hook runs `eslint --fix` automatically.

**Key rules:**

- 2-space indentation
- Single quotes
- Semicolons required
- `type` keyword for type definitions (not `interface`)
- `import.meta.env` for environment variables (never `process.env`)
- `@/*` path alias for imports (never relative paths like `../../`)
- Filenames: `PascalCase.astro` for components, `kebab-case.ts` for utilities

Run manually: `bun run lint`

---

## Adding a Blog Post

1. Create a directory: `src/content/blog/<slug>/`
2. Add `index.mdx` with frontmatter:

```yaml
---
title: Your Article Title
description: A short description for SEO and social cards.
pubDate: 2026-01-15
heroImage: ./hero-image.png
category: Programming Languages
tags: [Rust, Beginner, Tutorial]
featured: true
---
```

3. Place the hero image in the same directory.
4. Run `bun run build` to verify.

**Frontmatter rules:**

- `pubDate`: YYYY-MM-DD format (auto-coerced to Date by Zod)
- `category`: single string (used for `/blog/categories/[category]`)
- `tags`: array of strings (used for `/blog/tags/[tag]`)
- `heroImage`: relative path to image in the same directory
- `featured`: optional boolean

**Available MDX components** (auto-imported, no import needed):

- `<InfoBox title="..." type="info|success|warning|danger">` — callout boxes
- `<CodeExplainer>` — line-by-line code breakdown
- `<GitCommand>` — copy-paste terminal snippets
- `<ProsCons>` — comparison tables
- `<PullQuote>` — styled quotes
- `<SideNote>` — marginal notes
- `<NarrativeSection>` — narrative formatting
- `<YouTube>` — YouTube embeds
- `<Table>` — styled tables
- `<FeatureGrid>` / `<FeatureCard>` — feature showcases

---

## Adding a Tool Page

Tool pages live in `src/pages/tools/`. Each tool is an `.astro` file with its own scoped styles. Use the existing `ToolCard.astro` component for consistent presentation.

---

## Project Structure

```
src/
├── components/
│   ├── blog/          # Blog-specific components
│   ├── content/       # MDX content components
│   ├── layout/        # Navbar
│   ├── tools/         # ToolCard
│   └── ui/            # Generic UI (FeatureCard, ProgressBar)
├── content/blog/      # MDX blog posts
├── layouts/           # BaseLayout, BlogPostLayout
├── lib/               # Supabase, hashing, blog utils
├── pages/             # File-based routing
├── styles/global.css  # Design system (tokens + layers)
└── utils/             # Reading time, slugify, post utils
```

---

## Pull Requests

1. Fork the repo.
2. Create a feature branch from `main`.
3. Make your changes.
4. Run `bun run lint` and `bun run build` to verify.
5. Open a PR with a clear description of what changed and why.

**What we review for:**

- Does it build and lint without errors?
- Does it follow the existing code patterns?
- Are there any new inline hex colors? (Use tokens instead.)
- Does it respect `prefers-reduced-motion`?
- Is it accessible (keyboard navigation, screen reader)?

---

## Design Tokens

All colors, spacing, typography, and elevation values come from CSS custom properties defined in `src/styles/global.css`. See [design.md](design.md) for the rationale.

**Rule:** Never use raw hex/rgb values in component styles. Always reference a token. If a token doesn't exist, define it in the appropriate layer (primitive → semantic → component).

---

## Reporting Issues

Open a GitHub issue with:

- Clear title describing the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

For security issues, see [security.md](security.md).
