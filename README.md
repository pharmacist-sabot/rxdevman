# RxDev Man

> **The Developer's Living Knowledge Base.**
> A high-performance, offline-capable knowledge base for software engineers.

**[Live: rxdevman.com](https://www.rxdevman.com/)**

![Astro](https://img.shields.io/badge/Astro-7.0-FF5D01?style=flat&logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript)
![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?style=flat&logo=vitest)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

**RxDev Man** is a personal developer knowledge base - a blog with MDX content, tool showcases, visitor tracking, dark mode, offline support, and PWA capabilities. Built on **Astro 7** with zero-JS by default.

---

## Features

- **Dark Mode & Sepia** - three themes with FOUC prevention and code block switching
- **Offline Support** - PWA with service worker, works without network
- **MDX Content** - interactive components: `<CodeExplainer>`, `<InfoBox>`, `<ProsCons>`, `<GitCommand>`
- **Search** - client-side typo-tolerant search via Pagefind
- **RSS Feed** - `/rss.xml` for feed readers
- **Series & Tags** - grouped posts with tag/category index pages
- **Visitor Tracking** - Supabase-backed view counts (privacy-first, no cookies)
- **37 Unit Tests** - Vitest coverage for core utilities
- **Security Hardened** - CSP, CodeQL, dependency audits, SHA-pinned actions
- **Performance Budgets** - 1.16 KB gzipped JS, 1.8 MB WebP images

---

## Tech Stack

| Category     | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | [Astro 7](https://astro.build/)    |
| Language     | [TypeScript 6](https://www.typescriptlang.org/) |
| Content      | [MDX](https://mdxjs.com/)          |
| Styling      | CSS custom properties (design tokens) |
| Database     | [Supabase](https://supabase.com/)  |
| Search       | [Pagefind](https://pagefind.app/)  |
| Testing      | [Vitest](https://vitest.dev/)      |
| Deploy       | [Vercel](https://vercel.com/)      |

---

## Quick Start

```bash
git clone https://github.com/suradet-ps/rxdevman.git
cd rxdevman
bun install
cp .env.example .env   # add Supabase credentials (optional for local dev)
bun run dev
```

Open `http://localhost:4321`.

---

## Adding Content

### New Blog Post

Create a directory under `src/content/blog/<slug>/` with an `index.mdx` file:

```yaml
---
title: 'Your Post Title'
description: 'Short description for SEO.'
pubDate: 2026-08-03
heroImage: './hero.png'       # relative to post directory
category: 'Programming Languages'
tags: ['Rust', 'Systems Programming']
featured: false
series: 'Rust Mastery'        # optional - groups posts in a series
---
```

Add a hero image next to the MDX file:

```
src/content/blog/your-post/
├── index.mdx
└── hero.png
```

**Available components** (auto-imported, no import needed):

```mdx
<InfoBox title="Note" type="info">Content here.</InfoBox>
<InfoBox title="Warning" type="warning">Content here.</InfoBox>

<CodeExplainer title="Step by step">
  ```rust
  fn main() { println!("Hello"); }
  ```
</CodeExplainer>

<GitCommand>git commit -m "feat: add feature"</GitCommand>

<ProsCons pros={["Fast", "Safe"]} cons={["Complex", "Steep learning"]} />
```

**Categories used in this project:** Programming Languages, DevOps & Infrastructure, Career & Soft Skills, Tools & Utilities, Web Development, AI & Machine Learning, Computer Science, System Design, Book Notes.

### New Tool Page

Create a file under `src/pages/tools/<name>.astro`. Follow the pattern of
existing pages like `cupsabot.astro` or `herbs-app.astro`.

### Add a Category or Tag

Just use a new string in the `category` or `tags` fields of a blog post's
frontmatter. The index pages are auto-generated.

---

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `bun run dev`        | Start dev server (port 4321)        |
| `bun run build`      | Production build + search index     |
| `bun run preview`    | Preview production build locally    |
| `bun run lint`       | ESLint check                        |
| `bun run lint:fix`   | ESLint auto-fix                     |
| `bun run test`       | Run Vitest unit tests               |
| `bun run audit`      | Dependency security audit           |
| `bun run size`       | Check JS bundle size against budget |

---

## Project Structure

```text
src/
├── components/
│   ├── blog/           # BlogPostCard, ShareButtons, BlogNav, etc.
│   ├── content/        # MDX components: InfoBox, CodeExplainer, etc.
│   ├── layout/         # Navbar, Footer
│   └── ui/             # FeatureCard, OfflineIndicator, ProgressBar
├── content/
│   └── blog/           # MDX blog posts (each in its own directory)
├── layouts/            # BaseLayout, BlogPostLayout
├── lib/                # Supabase client
├── pages/              # File-based routing
│   ├── api/            # Server-side API endpoints
│   ├── blog/           # Blog index, tags, categories, series
│   ├── tools/          # Tool showcase pages
│   └── hosxp/          # HosXP project pages
├── styles/             # Global CSS and design tokens
└── utils/              # Reading time, slugify, post-utils
public/
├── images/             # All images (WebP)
├── sw.js               # Service worker
└── site.webmanifest    # PWA manifest
```

---

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).

## Changelog

See [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Contributing

See [docs/contributing.md](docs/contributing.md).

## License

[MIT](LICENSE)

> **"The best developers are eternal students."**
