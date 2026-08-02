# Reproducible Build

This document records the exact toolchain and environment that produces the
`dist/` output for a given commit. Pinning these ensures anyone can rebuild the
same artifact.

---

## Toolchain Versions (v2.0.0)

| Tool         | Version  | Purpose                       |
| ------------ | -------- | ----------------------------- |
| **Node.js**  | 24.x     | Runtime for Astro build       |
| **Bun**      | 1.3.x    | Package manager + test runner |
| **Astro**    | 7.0.6    | Static site generator         |
| **TypeScript** | 6.0.3  | Type checking                 |
| **Vitest**   | 4.1.10   | Unit tests                    |
| **ESLint**   | 10.3.0   | Linting                       |

### CI pinned versions (`.github/workflows/ci.yml`)

| Action             | SHA                                      | Tag     |
| ------------------ | ---------------------------------------- | ------- |
| `actions/checkout` | `3d3c42e5aac5ba805825da76410c181273ba90b1` | v7.0.1 |
| `actions/setup-node` | `820762786026740c76f36085b0efc47a31fe5020` | v7.0.0 |
| `oven-sh/setup-bun` | `0c5077e51419868618aeaa5fe8019c62421857d6` | v2.2.0 |

---

## Reproduce a Build

1.  **Clone and checkout the target commit:**

    ```bash
    git clone https://github.com/suradet-ps/rxdevman.git
    cd rxdevman
    git checkout <commit-sha>
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

    The `bun.lock` file pins exact versions. Never run `bun install --no-save`.

3.  **Configure environment:**

    ```bash
    cp .env.example .env
    # Edit .env with Supabase credentials (or leave defaults for static-only build)
    ```

4.  **Build:**

    ```bash
    bun run build
    ```

    This runs `astro build && bunx pagefind --site dist`.

5.  **Verify output:**

    ```bash
    ls dist/          # should contain index.html, blog/, tools/, etc.
    du -sh dist/      # expected: ~2-3 MB total
    ```

---

## Build Inputs

| Input              | Source                    | Client-visible? |
| ------------------ | ------------------------- | --------------- |
| `PUBLIC_SUPABASE_URL`    | `.env` / Vercel env | Yes (bundled)   |
| `PUBLIC_SUPABASE_ANON_KEY` | `.env` / Vercel env | Yes (bundled)   |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env` / Vercel env | No (server-only) |
| `HASH_SALT`              | `.env` / Vercel env | No (server-only) |

---

## What Changes Between Builds

- **Content changes** (MDX edits, new posts) — rebuild produces different pages.
- **Dependency updates** (`bun.lock` changes) — may change JS bundle output.
- **Astro/framework upgrades** — may change HTML structure or bundle splitting.
- **Image changes** — new/modified images in `public/images/`.

---

## Current Build Output (v2.0.0 baseline)

Measured from `bun run build` on a clean install:

| Metric               | Value             |
| -------------------- | ----------------- |
| **Pages generated**  | 100               |
| **JS (client)**      | ~5 KB total       |
| **JS (gzipped)**     | ~1.16 KB          |
| **CSS**              | ~120 KB (3 files) |
| **Images (WebP)**    | ~1.8 MB total     |
| **Total dist/**      | ~2.5 MB           |

For up-to-date numbers, run `bun run build && bun run size`.
