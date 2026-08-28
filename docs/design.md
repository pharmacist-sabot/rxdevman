# RxDev Man - Design System

This document explains _why_ the design system looks the way it does - not what the code already shows. The source of truth for values and implementation is `src/styles/global.css`.

---

## Philosophy

RxDev Man is a developer's personal knowledge base. It should feel like a well-organized notebook: clean, fast, distraction-free. Not a corporate marketing site, not a social platform, not a dashboard.

**Design principles:**

1. **Content first.** Typography and spacing serve readability. Nothing competes with the article.
2. **Warm, not cold.** The gray palette leans warm (yellow-green undertone) - closer to paper than to steel. A developer reading at midnight shouldn't feel like they're staring at a terminal.
3. **Fast by default.** Zero-JS by default. Interactive elements hydrate only when needed (Astro islands). The design must work without JavaScript.
4. **Honest.** No animations that waste time, no decorative elements that add weight, no metrics that exist to make numbers go up.

---

## Typography

### Font Stack

| Token         | Value                                      | Rationale                                                                                                                                                                                            |
| ------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--font-sans` | IBM Plex Sans, Noto Sans Thai, system-ui   | IBM Plex Sans is a humanist sans-serif designed for developers - technical but not sterile. Noto Sans Thai covers Thai script without visual jarring. System-ui as fallback for zero-cost rendering. |
| `--font-mono` | Source Code Pro, JetBrains Mono, monospace | Source Code Pro is purpose-built for code. JetBrains Mono as fallback for ligatures. Both are free and widely available.                                                                             |

### Type Scale

Fluid type using `clamp()` - no breakpoints needed for font size. The scale is compact (7 steps from xs to 3xl) because a knowledge base doesn't need display headlines.

| Token         | Min      | Max      | Use                    |
| ------------- | -------- | -------- | ---------------------- |
| `--text-xs`   | 0.75rem  | 0.8rem   | Captions, metadata     |
| `--text-sm`   | 0.875rem | 0.95rem  | Secondary text, labels |
| `--text-base` | 1rem     | 1.125rem | Body text (default)    |
| `--text-lg`   | 1.125rem | 1.3rem   | Lead paragraphs        |
| `--text-xl`   | 1.25rem  | 1.6rem   | h3                     |
| `--text-2xl`  | 1.5rem   | 2rem     | h2                     |
| `--text-3xl`  | 1.875rem | 2.5rem   | h1                     |

Line height: 1.7 for body (generous for Thai text which has tall ascenders), 1.25 for headings.

---

## Color Palette

### Why warm grays

Cold grays (blue undertone) feel corporate and digital. Warm grays (yellow-green undertone) feel like paper and ink - appropriate for a reading-focused tool. The palette is inspired by aged paper and natural materials.

### Primitive tokens

The gray scale runs from `#fdfdf8` (warm white) to `#1e1f23` (near-black). There is no pure gray - every step has a slight warm cast.

| Token              | Hex       | Role                             |
| ------------------ | --------- | -------------------------------- |
| `--color-gray-50`  | `#fdfdf8` | Page background (warm off-white) |
| `--color-gray-100` | `#f5f5f0` | Subtle backgrounds               |
| `--color-gray-200` | `#e5e7e0` | Borders, accents                 |
| `--color-gray-300` | `#bfc1b7` | Default borders                  |
| `--color-gray-400` | `#9ea096` | Muted text                       |
| `--color-gray-600` | `#65675e` | Secondary text                   |
| `--color-gray-700` | `#4d4f46` | Primary text                     |
| `--color-gray-800` | `#23251d` | Headings                         |
| `--color-gray-900` | `#1e1f23` | Dark surfaces                    |

### Brand colors

Two accent colors - red and orange - carry the brand identity:

- **Red (`#f54e00`)**: Primary brand color. Used for links, active states, key CTAs. A burnt red, not a fire-engine red - warm, readable, not alarming.
- **Orange (`#eb9d2a`)**: Secondary accent. Used for hover states, highlights, the 3D depth effect on buttons. Complements the red without competing.

### Semantic states

- **Success (`#10b981`)**: Green for positive indicators (pros, tips).
- **Warning (`#f59e0b`)**: Amber for caution (warnings, caveats).
- **Danger (`#ef4444`)**: Red for danger/errors (cons, errors).

These are muted enough to not scream, but distinct enough to convey meaning at a glance.

---

## Spacing

4px base unit. Every spacing value is a multiple of 4px:

| Token        | px   | Common use                |
| ------------ | ---- | ------------------------- |
| `--space-1`  | 4px  | Tight gaps (icon to text) |
| `--space-2`  | 8px  | Small gaps                |
| `--space-3`  | 12px | Default inline spacing    |
| `--space-4`  | 16px | Standard padding          |
| `--space-6`  | 24px | Section gaps              |
| `--space-8`  | 32px | Major section breaks      |
| `--space-12` | 48px | Page-level spacing        |
| `--space-16` | 64px | Hero/section dividers     |

4px is small enough to feel precise but large enough to avoid sub-pixel rendering issues.

---

## Elevation

Three levels of depth using box-shadow + border-bottom for a tactile, physical feel:

| Level    | Token         | Effect                             |
| -------- | ------------- | ---------------------------------- |
| Resting  | `--shadow-sm` | 1px shadow - subtle lift           |
| Default  | `--shadow-md` | 4px shadow - card-level depth      |
| Hover    | `--shadow-lg` | 8px shadow - raised on interaction |
| Dramatic | `--shadow-xl` | 15px shadow - modal/overlay        |

The 3D depth effect (`--depth-shadow`) uses a solid-color `border-bottom` offset to simulate a physical button - giving the UI a tangible, paper-craft quality.

---

## Border Radius

| Token           | Value  | Use                         |
| --------------- | ------ | --------------------------- |
| `--radius-sm`   | 6px    | Focus rings, small elements |
| `--radius-md`   | 10px   | Cards, inputs               |
| `--radius-lg`   | 14px   | Large cards, modals         |
| `--radius-xl`   | 20px   | Hero sections               |
| `--radius-full` | 9999px | Pills, avatars, badges      |

Radii are generous but not bubbly - the UI should feel friendly, not toylike.

---

## Animation

Three named animations, all subtle:

| Animation | Effect           | Use                           |
| --------- | ---------------- | ----------------------------- |
| `wiggle`  | Rotate ±3deg     | Attention-drawing (sparingly) |
| `float`   | Translate Y ±8px | Gentle levitation             |
| `shimmer` | Background slide | Loading states                |

All animations respect `prefers-reduced-motion: reduce` - disabled entirely when the user has requested reduced motion. Transition durations are short (100-300ms) to feel responsive, not sluggish.

---

## CSS Architecture

### Layers

```css
@layer reset, base, components, utilities;
```

Explicit layer ordering ensures predictable cascade:

1. **reset** - box model normalization (minimal, not a full normalize)
2. **base** - element-level styles (body, headings, links, images)
3. **components** - all component styles (cards, buttons, grids, prose)
4. **utilities** - helper classes (animation, text color, surface background)

### Token hierarchy

```
Primitive tokens (raw hex values)
    ↓
Semantic tokens (meaning: --surface-page, --text-primary, --brand-red)
    ↓
Component tokens (specific: --nav-height, --depth-shadow)
```

Components should **only** reference semantic tokens, never primitives. This enables theme switching by remapping semantic tokens under `[data-theme]`.

---

## Responsive Design

Mobile-first with `@media (max-width: ...)` breakpoints:

| Breakpoint | Width   | Layout                    |
| ---------- | ------- | ------------------------- |
| Default    | >1100px | Full desktop, sidebar TOC |
| `--bp-3xl` | 1100px  | Narrow desktop            |
| `--bp-2xl` | 1024px  | Tablet landscape          |
| `--bp-xl`  | 900px   | Tablet portrait           |
| `--bp-lg`  | 768px   | Mobile landscape          |
| `--bp-md`  | 640px   | Mobile                    |
| `--bp-sm`  | 480px   | Small mobile              |

Breakpoints are reference-only (CSS custom properties don't work in `@media`), so values are hardcoded in media queries.

---

## Dark Mode (Phase 3)

The token architecture is designed for dark mode - semantic tokens can be remapped under `[data-theme="dark"]` without touching any component code. The warm gray palette shifts to a warm dark (not AMOLED black):

- Page background: warm dark gray, not `#000`
- Text: slightly warmed whites, not pure white
- Brand colors: slightly desaturated to maintain contrast ratios
- Shadows: lighter shadows on dark backgrounds (inverted depth)

A sepia mode (`[data-theme="sepia"]`) is also planned - warm background, reduced contrast, for late-night reading.

---

## What this system is not

- **Not a component library.** Components are Astro single-file components, not reusable across projects. The design system is tokens and conventions, not a Storybook.
- **Not a utility-first framework.** No Tailwind, no utility classes for everything. CSS is scoped per component, tokens are the abstraction layer.
- **Not a dark-mode-first design.** Light mode is the primary canvas. Dark mode is a remap, not a separate design. Sepia mode is a further remap for reading comfort.
