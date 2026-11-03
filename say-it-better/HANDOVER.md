# Say It Better — Developer Handover

This document covers architecture, request flow, environment variables, key files, and outstanding tasks. Read it alongside `README.md`.

---

## Architecture Overview

```
Browser
  └── Next.js App Router (SSR/SSG)
        ├── Static pages: /, /about, /privacy, /terms, /tools/*
        └── API route: POST /api/generate
              ├── Rate limiter  (lib/rate-limit.ts)
              ├── Validation    (app/api/generate/route.ts)
              ├── Prompt build  (lib/prompts.ts)
              └── AI provider   (lib/ai.ts)
                    ├── Cloudflare Workers AI  ← production
                    └── Demo mode              ← no credentials
```

The app is a single Next.js 14 project using the App Router. There is no database, no auth, no sessions, and no persistent storage. Every request is stateless.

---

## API Request Flow

1. **Browser** POSTs JSON to `/api/generate`.
2. **Rate limiter** checks the IP (X-Forwarded-For or X-Real-IP). Returns 429 if over 8 req/min.
3. **Validation** checks mode, text length, and required fields. Returns 400 on failure.
4. **Provider detection**: if `CF_ACCOUNT_ID` and `CF_API_TOKEN` are set → Cloudflare. Otherwise → demo mode.
5. **Demo mode**: waits 600ms, returns a clearly-labelled placeholder. The response includes `"demo": true`.
6. **Prompt builder** (`lib/prompts.ts`): constructs a `system` + `user` message pair for the model.
7. **Cloudflare call** (`lib/ai.ts → callCloudflare`):
   - POSTs to `https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/{model}`
   - Single attempt — no retry, no fallback model.
   - On non-2xx: reads `errors[0].code` and throws a typed exception.
   - On success: returns `data.result.response.trim()`.
8. **Route handler** catches typed errors and maps them to user-safe HTTP responses.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CF_ACCOUNT_ID` | Production | Cloudflare account ID from dash.cloudflare.com |
| `CF_API_TOKEN` | Production | Cloudflare API token with Workers AI permission |
| `NEXT_PUBLIC_SITE_URL` | Production | Full URL of the live site, e.g. `https://sayitbetter.ai` |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 measurement ID. Not set = analytics disabled. |
| `NEXT_PUBLIC_ADSENSE_ID` | Optional | AdSense publisher ID. Not set = ads disabled. |

**Never commit `.env.local`** — it is gitignored. Set production secrets in Netlify's UI under Site Settings → Environment Variables.

---

## Key Files

### `lib/ai.ts`
The AI provider abstraction. Contains:
- `AIProvider` type: `'cloudflare' | 'demo'`
- `getActiveProvider()`: returns `'cloudflare'` if both CF env vars are set, else `'demo'`
- `callCloudflare(system, user)`: single-attempt CF call with typed error dispatch
- `QuotaExhaustedError` (CF 3036), `CapacityTemporaryError` (CF 3040), `ModelRequiresPaidError` (CF 5035)
- `throwCFError(httpStatus, body)`: maps CF error codes to typed exceptions
- `getDemoResponse(mode)`: returns labelled demo placeholders

**Critical invariant:** There is no fallback model. `callCloudflare` makes exactly one attempt. All errors propagate to the route handler. No paid path is triggered automatically.

### `lib/prompts.ts`
Builds the `{ system, user }` message pair for each of the 6 modes. Prompts are instruction-based and include rules to prevent preamble, invented content, and tone drift.

### `lib/types.ts`
TypeScript types for all request/response shapes. Also exports the `TONES` array (14 tones) and `MODES` array (6 modes) used by the frontend.

### `lib/rate-limit.ts`
In-process Map-based rate limiter: 8 requests/minute per IP, 1-minute sliding window. Stale entries purged every 10 minutes. **Resets on serverless cold starts** — see Known Limitations in README.

### `lib/analytics.ts`
Client-side GA4 wrapper. Calls `window.gtag` if present. Tracks modes and outcomes — never text content. Currently inactive (no `NEXT_PUBLIC_GA_ID` set).

### `app/api/generate/route.ts`
The single API endpoint. Handles rate limiting, validation, demo mode, AI calls, and error mapping. All error messages exposed to users are generic and safe.

### `app/layout.tsx`
Root layout. Sets `lang="en"`, loads Inter font, sets `metadataBase` from `NEXT_PUBLIC_SITE_URL`. Contains commented-out AdSense script (activate when publisher account is approved).

### `next.config.mjs`
Security headers for all routes: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`. API routes additionally set `Cache-Control: no-store`.

### `netlify.toml`
Netlify deployment config. Build command: `npm run build`. Publish dir: `.next`. Plugin: `@netlify/plugin-nextjs`. The www-redirect rule is commented out — enable when the domain is live.

### `components/workspace/Workspace.tsx`
The main interactive component. Contains the text input, mode selector, tone/length/level pickers, and result display. The privacy notice correctly states that text is processed by "Cloudflare's AI API."

---

## Test Suite

| File | What it tests |
|---|---|
| `tests/cf-error-handling.test.js` | CF error code dispatch: 17 unit tests with mock fetch. No credentials needed. |
| `tests/functional.sh` | 37 end-to-end tests: demo responses, input validation, rate limiting, security headers, page rendering, SEO. Runs in demo mode — no credentials needed. |
| `tests/quality-eval.sh` | 30 AI quality tests across 6 modes. Requires real CF credentials and a running server. Exits code 2 if demo mode detected. |

### Quality suite exit codes
- `0` — all 30 tests passed automated checks
- `1` — one or more tests failed automated checks
- `2` — blocked: server is in demo mode (credentials not configured)

### Running the quality suite
```bash
# Server in terminal 1:
CF_ACCOUNT_ID=xxx CF_API_TOKEN=xxx npx next start -p 3000

# Quality suite in terminal 2:
bash tests/quality-eval.sh
# or:
BASE=http://localhost:3005 bash tests/quality-eval.sh
```

---

## Tool Pages

Each tool page under `app/tools/` is a thin wrapper that renders `<Workspace>` with the mode pre-selected. The slug maps directly to the mode name:

| URL | Mode |
|---|---|
| `/tools/improve-writing` | `improve` |
| `/tools/reply-generator` | `reply` |
| `/tools/change-tone` | `tone` |
| `/tools/simplify-text` | `simplify` |
| `/tools/shorten-text` | `shorten` |
| `/tools/fix-grammar` | `grammar` |
| `/tools/write-professional-email` | `improve` (professional tone) |
| `/tools/polite-refusal` | `reply` |
| `/tools/follow-up-email` | `reply` |

---

## SEO and Metadata

- `app/sitemap.ts` generates a dynamic sitemap at `/sitemap.xml`.
- `public/robots.txt` allows all crawlers and references the sitemap.
- Each page sets its own `title`, `description`, and Open Graph metadata via Next.js `generateMetadata`.
- Canonical URLs derive from `NEXT_PUBLIC_SITE_URL`.

---

## Security Notes

- User text is never logged. The route handler logs only the error class name, not message content.
- CF credentials are server-side only — never exposed to client JavaScript.
- Input length limits prevent prompt injection via oversized payloads.
- No database, no session storage, no cookies.
- Security headers are set globally via `next.config.mjs`.

---

## Deferred Upgrades (Not Blockers)

1. **Persistent rate limiting**: Replace `lib/rate-limit.ts` Map with Upstash Redis (`@upstash/ratelimit`, free tier). Fixes the cold-start reset issue on serverless.
2. **GA4**: Set `NEXT_PUBLIC_GA_ID` in Netlify environment variables. `lib/analytics.ts` and `app/layout.tsx` are already wired.
3. **AdSense**: Uncomment the AdSense script in `app/layout.tsx` and set `NEXT_PUBLIC_ADSENSE_ID` after publisher account approval.
4. **Domain**: Purchase domain, update `NEXT_PUBLIC_SITE_URL`, enable www redirect in `netlify.toml`.
5. **CI quality gate**: Add CF credentials as GitHub secrets, start the production server in CI, run `npm run test:quality` as a pre-release check.

---

## What Was Not Built

- User accounts, authentication, or sessions
- Text history or saved results
- Stripe or any payment integration
- Custom domain (placeholder only)
- Server-side analytics (only client-side GA4 is wired)
- Content moderation beyond the AI provider's own filters
