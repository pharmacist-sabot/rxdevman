# Changelog

All notable changes to RxDev Man are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1).
- GitHub PR template and issue templates (bug report, feature request).

### Fixed
- `bun audit --audit-level=high` now fails CI on high/critical advisories
  (previously `continue-on-error: true` made it informational). Dependency
  overrides added to clear all 17 known advisories.
- `README.md` link to `docs/contributing.md` (was uppercase, breaks on
  case-sensitive filesystems).
- `docs/ROADMAP.md` now names doc files in their actual lowercase form.

### Tests
- Zod frontmatter schema extracted to `src/lib/content-schema.ts` (testable
  outside Astro's virtual modules) with 21 unit tests covering required
  fields, invalid dates, invalid values, and unknown-field stripping.

---

## [2.0.0] - 2026-08-03

A complete developer knowledge base with dark mode, offline support, tests,
security hardening, and performance budgets.

### Added

#### Foundation (Phase 1)
- `docs/DESIGN.md` - visual language, color system, spacing, typography.
- `docs/SECURITY.md` - threat model, CSP, RLS, IP anonymization, data retention.
- `docs/CONTRIBUTING.md` - commit conventions, PR workflow, code style.
- `docs/AGENTS.md` - AI agent conventions for consistent code generation.
- `.env.example` - documented environment variables.
- Legacy CSS token alias migration to semantic design tokens.

#### Tests (Phase 2)
- Vitest test framework with 37 unit tests across 4 files.
- Tests for `hash`, `slugify`, `reading-time`, and `post-utils`.
- Test step added to CI pipeline.

#### Dark Mode & Themes (Phase 3)
- Dark mode and sepia theme system via `data-theme` attribute.
- Theme toggle in navbar with `localStorage` persistence.
- FOUC prevention via inline `<script>` in `<head>`.
- Expressive code blocks switch themes with the site.

#### Content Discovery (Phase 4)
- RSS feed at `/rss.xml` via `@astrojs/rss`.
- Series system with series index pages and prev/next navigation.
- Tag index (`/blog/tags/`) and category index (`/blog/categories/`).
- Blog navigation tab bar (`BlogNav.astro`) shared across all blog pages.

#### PWA & Offline (Phase 5)
- Web App Manifest with orange-themed icons (SVG + PNG).
- Hand-written service worker (`public/sw.js`) with CacheFirst/NetworkFirst.
- Offline indicator component for calm offline messaging.
- Dynamic `theme-color` meta tag matching active theme.

#### Security Hardening (Phase 6)
- `bun audit --audit-level=high` step in CI (non-blocking).
- CSP hardened: `object-src 'none'`, `upgrade-insecure-requests`.
- Verified: all GitHub Actions SHA-pinned, minimal CI permissions.

#### Performance Budgets (Phase 7)
- All 9 public images compressed to WebP (12 MB → 1.8 MB, 85% reduction).
- `Image.astro` requires `width`/`height` props to prevent CLS.
- `size-limit` with 10 KB gzipped budget enforced in CI.
- Build output baseline documented in `docs/perf-baseline.md`.

#### Release (Phase 8)
- `docs/reproducible-build.md` - exact toolchain versions for reproducible builds.
- `CHANGELOG.md` - this file.
- Version bumped to 2.0.0.

### Changed
- README rewritten with current tech stack (Astro 7, TypeScript 6).
- Hero avatar border fixed from `var(--color-white)` to `var(--surface-card)`.
- ShareButtons use `:global([data-theme='dark'])` instead of `prefers-color-scheme`.
- Footer SVG uses `currentColor` instead of hardcoded `#F54E00`.

### Fixed
- Dead `getSeriesNav` in `[series].astro` (was using series slug, not post slug).
- `.theme-toggle` buttons now have `:focus-visible` styles.
- Theme change announces to screen readers via `aria-live` region.
- `.sr-only` utility class added for accessible hidden content.

---

## [1.22.6] and earlier

See [git log](https://github.com/suradet-ps/rxdevman/commits/main) for history
before v2.0.0.
