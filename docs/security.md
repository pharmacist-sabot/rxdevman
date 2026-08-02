# RxDev Man — Security

This document describes how RxDev Man handles security — what's protected, how, and what to do if something goes wrong.

---

## Architecture

RxDev Man is a static site (Astro SSG/SSR hybrid) deployed to Vercel. There is no custom server. The browser talks to:

1. **Supabase PostgREST** — for reading public view counts (anon key, RLS-protected).
2. **Supabase GoTrue** — not currently used (no auth).
3. **`/api/track`** — a Vercel serverless function that writes page view data using the service role key.

The service role key **never** reaches the browser. It is only used server-side in the API route.

---

## Environment Variables

| Variable                    | Prefix    | Public? | Purpose                               |
| --------------------------- | --------- | ------- | ------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | `PUBLIC_` | Yes     | Supabase project URL                  |
| `PUBLIC_SUPABASE_ANON_KEY`  | `PUBLIC_` | Yes     | Supabase anon key (read-only via RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | (none)    | **No**  | Server-side only — bypasses RLS       |
| `HASH_SALT`                 | (none)    | **No**  | Salt for IP hashing                   |

**Rule:** Variables prefixed with `PUBLIC_` are bundled into client-side JavaScript. Never put secrets in `PUBLIC_` variables.

---

## Content Security Policy (CSP)

Defined in `vercel.json`, applied to all routes:

```
default-src 'self';
img-src 'self' https: data:;
script-src 'self' 'unsafe-inline' https:;
style-src 'self' 'unsafe-inline' https:;
font-src 'self' https: data:;
connect-src 'self' https:;
frame-ancestors 'self';
base-uri 'self';
form-action 'self'
```

**Known weaknesses:**

- `'unsafe-inline'` in `script-src` — required by Astro's Vercel adapter for hydration scripts. Removing it would break client-side JS. This is a trade-off documented here for transparency.
- `'unsafe-inline'` in `style-src` — required by Astro's scoped CSS injection. Same trade-off.
- `https:` wildcard in script/style/font/connect — allows any HTTPS origin. A tighter policy would enumerate specific CDN domains, but this adds maintenance burden for minimal practical risk on a public blog.

**Other headers:**

| Header                      | Value                                          | Purpose                  |
| --------------------------- | ---------------------------------------------- | ------------------------ |
| `X-Frame-Options`           | `SAMEORIGIN`                                   | Prevents clickjacking    |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevents MIME sniffing   |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Limits referrer leakage  |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | Disables sensitive APIs  |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years |

---

## Supabase Row-Level Security (RLS)

All `rxdevman_*` tables have RLS enabled.

### `rxdevman_page_views`

| Operation | anon    | service_role |
| --------- | ------- | ------------ |
| SELECT    | Blocked | Full access  |
| INSERT    | Blocked | Full access  |
| UPDATE    | Blocked | Full access  |

IP hashes are never publicly readable. No SELECT policy for anonymous users.

### `rxdevman_view_counts`

| Operation | anon        | service_role |
| --------- | ----------- | ------------ |
| SELECT    | **Allowed** | Full access  |
| INSERT    | Blocked     | Full access  |
| UPDATE    | Blocked     | Full access  |

Anonymous users can read aggregate counts (this powers the public view counter UI). Writes go through the server-side API route only.

### RPC Functions

`increment_view_count(p_slug TEXT)` — runs as `SECURITY DEFINER` (executes as table owner, bypasses RLS). Called server-side after every page view insert.

---

## IP Anonymization

Visitor IP addresses are never stored raw. The tracking pipeline:

1. Extract IP from `cf-connecting-ip` (Cloudflare) or `x-forwarded-for` / `x-real-ip` headers.
2. Hash with SHA-256: `SHA-256(ip + HASH_SALT)`.
3. Store only the hash.

The hash rotates daily (the date is part of the hash input), so a visitor's identifier changes every day. This means:

- We can count unique visitors per day, not per lifetime.
- Even if the database were compromised, IPs cannot be recovered without the salt.
- The `pg_cron` job deletes raw view records after 90 days.

---

## Data Retention

- **Page view records**: auto-deleted after 90 days by `pg_cron` (daily at 03:00 UTC).
- **Aggregate counts**: retained indefinitely (these contain no personal data).
- **No cookies**: the tracking system uses no cookies, localStorage, or browser storage for analytics.

---

## Third-Party Services

| Service          | What it sees                     | Data                                  |
| ---------------- | -------------------------------- | ------------------------------------- |
| **Vercel**       | Deployment hosting, edge network | Request logs (IP, user-agent, timing) |
| **Supabase**     | Database, API                    | Page view hashes, aggregate counts    |
| **Google Fonts** | Font loading                     | IP address (standard CDN request)     |

No analytics services (Google Analytics, Plausible, etc.) are loaded. No tracking scripts. No advertising.

---

## Reporting a Vulnerability

If you discover a security issue:

1. **Do not** open a public GitHub issue.
2. Email security concerns to the repository owner (see GitHub profile for contact).
3. Include: description of the vulnerability, steps to reproduce, potential impact.
4. Expect initial response within 72 hours.

We will work with you to understand and address the issue before any public disclosure.

---

## CI/CD Security

- **Pinned actions**: All GitHub Actions are pinned to commit SHAs, not tags.
- **Minimal permissions**: CI workflows request only `contents: read`.
- **CodeQL**: Automated security scanning runs on every push/PR and weekly.
- **Commitlint**: Enforces Conventional Commits format.
- **Pre-commit**: ESLint runs on staged files before every commit.
- **No secrets in CI**: The CI workflow uses no environment variables or secrets.

---

## Known Limitations

1. **No rate limiting on `/api/track`**: The endpoint has no throttle. Vercel's edge limits provide some protection, but application-level rate limiting would be stronger. This is acceptable for a low-traffic personal blog.
2. **IP header spoofing**: `x-forwarded-for` and `x-real-ip` can be spoofed. The hash-salting mitigates impact (spoofed IPs produce different hashes, inflating unique visitor counts slightly).
3. **No CSP nonces**: Inline scripts use `'unsafe-inline'` instead of nonces. This is a known trade-off for Astro compatibility.
