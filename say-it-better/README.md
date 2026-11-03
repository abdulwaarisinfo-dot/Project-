# Say It Better

An AI writing assistant that helps users improve, rewrite, simplify, shorten, and reply to text — powered by Cloudflare Workers AI on a zero-cost free tier.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| AI provider | Cloudflare Workers AI — `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| Deployment | Netlify (free tier) via `@netlify/plugin-nextjs` |
| Font | Inter (next/font/google) |

---

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- A Cloudflare account (free — no credit card required) for real AI responses
- A Netlify account (free) for deployment

---

## Installation

```bash
git clone <your-repo-url>
cd say-it-better
npm ci
```

---

## Local Development

**Without AI credentials (demo mode):**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All requests return clearly-labelled `[DEMO]` placeholder responses. No API keys needed.

**With real AI (Cloudflare Workers AI):**

1. Create `.env.local` in the project root (this file is gitignored):

```bash
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_API_TOKEN=your_cloudflare_api_token
```

2. Start the dev server:

```bash
npm run dev
```

The app detects credentials at startup and routes all requests to Cloudflare.

> **Where to get credentials:** [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Workers AI. The API token needs the **Workers AI** permission. Free tier: ~10,000 Neurons/day, no credit card required.

---

## Production Build

```bash
npm run build       # compiles and type-checks
npx next start      # serves at http://localhost:3000
```

With credentials loaded:

```bash
CF_ACCOUNT_ID=xxx CF_API_TOKEN=xxx npx next start -p 3000
```

---

## Cloudflare Workers AI Configuration

| Setting | Value |
|---|---|
| Model | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| Est. cost per request | ~49 Neurons (300 input + 200 output tokens) |
| Free tier calls/day | ~204 |
| Hard daily cap | 10,000 Neurons — no charges after cap |
| Required env vars | `CF_ACCOUNT_ID`, `CF_API_TOKEN` |

**Error handling:** The app maps documented CF error codes to user-facing messages:

| CF Code | HTTP | Behaviour |
|---|---|---|
| 3036 | 429 | Daily quota exhausted — tell user to try tomorrow |
| 3040 | 429 | Temporary capacity — tell user to retry shortly |
| 5035 | 403 | Model requires paid plan — generic unavailable message |
| Other 429 | 429 | Unknown rate limit — no fallback, propagate |

No paid fallback model exists. No automatic charges can occur.

---

## Running Tests

**Unit tests (CF error-handling logic):**

```bash
npm test
# Runs: node tests/cf-error-handling.test.js
# Expected: 17/17 passed
```

**Functional tests (requires a running server):**

```bash
# Terminal 1:
npm run build && npx next start -p 3000

# Terminal 2:
npm run test:functional
# or against a different port:
BASE=http://localhost:3005 bash tests/functional.sh
# Expected: 37/37 passed (runs in demo mode, no credentials needed)
```

**Real AI quality tests (requires credentials + running server):**

```bash
# Terminal 1 — server with credentials:
CF_ACCOUNT_ID=xxx CF_API_TOKEN=xxx npx next start -p 3000

# Terminal 2:
npm run test:quality
# or against a different port:
BASE=http://localhost:3005 bash tests/quality-eval.sh
```

The quality suite:
- Exits with code 2 immediately if the server is in demo mode (no credentials configured).
- Runs 30 tests across all 6 modes (5 per mode): improve, reply, tone, simplify, shorten, grammar.
- Automated checks: non-empty output, no preamble boilerplate, no invented percentages or reference numbers, word-count reduction (shorten), surface tone signals.
- Prints each AI output for human review alongside `# EXPECTED` comments in the script.
- Automated checks alone cannot verify meaning preservation, tone fidelity, or naturalness — human review of the printed outputs is required.

---

## Deployment (Netlify)

1. Connect your repository in the Netlify dashboard.
2. Set environment variables under **Site Settings → Environment Variables**:
   - `CF_ACCOUNT_ID`
   - `CF_API_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` (your live domain, e.g. `https://sayitbetter.ai`)
3. Deploy. Netlify uses `netlify.toml` (build command: `npm run build`, publish: `.next`, plugin: `@netlify/plugin-nextjs`).

> **Free-tier note:** Netlify free tier provides 300 build minutes/month. Each deploy uses ~15 minutes. No paid plan is required.

---

## Writing Modes

| Mode | Description |
|---|---|
| `improve` | Polish text while preserving the writer's voice |
| `reply` | Generate a contextual reply to a received message |
| `tone` | Rewrite text in a different tone (14 options) |
| `simplify` | Translate complex writing into plain language |
| `shorten` | Remove padding while keeping essential meaning |
| `grammar` | Fix spelling, grammar, and punctuation |

---

## API Reference

**`POST /api/generate`**

```json
{
  "mode": "improve",
  "text": "Your text here",
  "tone": "formal",
  "length": "slightly-shorter",
  "simplifyLevel": "simple",
  "replyTo": "Message you received",
  "intention": "What you want to say",
  "recipient": "Context about recipient"
}
```

Required: `mode` + either `text` (all modes except `reply`) or `replyTo` (reply mode).

Limits: `text` ≤ 4,000 chars, `replyTo` ≤ 2,000 chars, `intention` ≤ 500 chars.

Rate limit: 8 requests/minute per IP (resets on serverless cold starts — see Known Limitations).

---

## Known Limitations and Outstanding Tasks

**Rate limiter resets on cold starts.** The in-process Map resets on each serverless function cold start. For persistent rate limiting, replace with Upstash Redis (free tier, no credit card). See `lib/rate-limit.ts` for notes.

**Real AI quality not verified in CI.** The 30-case quality suite requires CF credentials and a running server. It cannot run in automated CI without secrets. Intended for manual pre-release validation.

**GA4 analytics wired but inactive.** `lib/analytics.ts` and `app/layout.tsx` support GA4 via `NEXT_PUBLIC_GA_ID`. The env var is not set — no analytics fire. Add it when ready to track usage.

**AdSense commented out.** The AdSense script in `app/layout.tsx` is commented out pending publisher account approval. Uncomment and set `NEXT_PUBLIC_ADSENSE_ID` when approved.

**No persistent storage.** User text is never stored. All processing is stateless — text enters the API, the AI processes it, the result is returned, nothing is logged or saved.

**Domain not yet purchased.** `NEXT_PUBLIC_SITE_URL` is set to `https://sayitbetter.ai` in `.env.example` as a placeholder. Update to the actual live domain when purchased.

**Netlify www redirect commented out.** `netlify.toml` has a bare→www redirect commented out. Uncomment and update direction when the domain is live.
