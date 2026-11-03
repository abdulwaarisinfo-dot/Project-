/**
 * AI provider abstraction
 *
 * Provider selection (checked in order):
 *   1. Cloudflare Workers AI — CF_ACCOUNT_ID + CF_API_TOKEN set
 *      Terms status: Cloudflare Self-Serve Agreement reviewed; no consumer-use
 *      prohibition found. Treat as provisionally approved.
 *   2. Demo — credentials not set. Returns clearly labelled placeholder text.
 *      Never presented as real AI output.
 *
 * Free-tier limits (Cloudflare Workers AI):
 *   - 10,000 Neurons/day free (hard cap — no charges after exceeded)
 *   - Source: developers.cloudflare.com/workers-ai/platform/pricing/
 *
 *   Neuron cost per request (est. 300 input + 200 output tokens):
 *     llama-3.3-70b-fp8-fast : 26,668/M input + 204,805/M output
 *                               → ~8 + ~41 = ~49 Neurons/call
 *                               → ~204 calls/day on free tier
 *
 *   Documented CF Workers AI error codes (source: developers.cloudflare.com/workers-ai/platform/errors/):
 *     3036 (HTTP 429): Daily free Neuron allocation exhausted.
 *                      → throw QuotaExhaustedError; stop; no charge possible.
 *     3040 (HTTP 429): Temporary capacity shortage.
 *                      → throw CapacityTemporaryError; stop; NOT a quota issue.
 *     5035 (HTTP 403): Model requires Workers Paid plan.
 *                      → throw ModelRequiresPaidError; stop; no billing triggered.
 *     Other 429      : Unknown rate limit → stop; propagate as generic error.
 *     Other 4xx/5xx  : Propagate as generic error.
 *
 *   Error handling is code-based (errors[0].code), NOT string-based, to avoid
 *   false matches on message text that may change between CF releases.
 *   No paid fallback exists; no secondary model is ever tried.
 */

export type AIProvider = 'cloudflare' | 'demo';

export function getActiveProvider(): AIProvider {
  if (process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN) return 'cloudflare';
  return 'demo';
}

// ─── Cloudflare Workers AI ────────────────────────────────────────────────────

const CF_PRIMARY_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

interface CFResponse {
  result?: { response?: string };
  success?: boolean;
  errors?: { message: string; code?: number }[];
}

// ── Typed CF error classes ────────────────────────────────────────────────────

export class QuotaExhaustedError extends Error {
  // CF error 3036 (HTTP 429): daily free Neuron allocation exhausted.
  // No retry is appropriate; no paid fallback is triggered.
  constructor() {
    super('CF error 3036: daily free Neuron allocation exhausted');
    this.name = 'QuotaExhaustedError';
  }
}

export class CapacityTemporaryError extends Error {
  // CF error 3040 (HTTP 429): temporary capacity shortage.
  // This is NOT quota exhaustion. Do NOT fall back to another model;
  // the service is temporarily unavailable cluster-wide.
  constructor() {
    super('CF error 3040: temporary capacity exhaustion');
    this.name = 'CapacityTemporaryError';
  }
}

export class ModelRequiresPaidError extends Error {
  // CF error 5035 (HTTP 403): this model requires Workers Paid plan.
  // No fallback should be attempted because the account would need billing.
  constructor() {
    super('CF error 5035: model requires Workers Paid plan');
    this.name = 'ModelRequiresPaidError';
  }
}

// ── CF error code → typed exception ──────────────────────────────────────────

function throwCFError(httpStatus: number, body: CFResponse): never {
  const code = body.errors?.[0]?.code;
  const msg  = body.errors?.[0]?.message ?? 'unknown error';

  if (code === 3036) throw new QuotaExhaustedError();
  if (code === 3040) throw new CapacityTemporaryError();
  if (code === 5035) throw new ModelRequiresPaidError();

  // Unknown 429 — propagate as generic error; no fallback.
  if (httpStatus === 429) throw new Error(`CF 429 rate limit (code: ${code ?? 'none'}): ${msg}`);

  // Other documented or undocumented codes
  throw new Error(`CF error HTTP ${httpStatus} (code: ${code ?? 'none'}): ${msg}`);
}

// ── Main call ─────────────────────────────────────────────────────────────────

export async function callCloudflare(system: string, user: string): Promise<string> {
  const accountId = process.env.CF_ACCOUNT_ID!;
  const token     = process.env.CF_API_TOKEN!;

  async function attempt(model: string): Promise<string> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    const res = await fetch(url, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: system },
          { role: 'user',   content: user   },
        ],
        max_tokens:  1024,
        temperature: 0.65,
      }),
    });

    // All error status codes: parse the body and throw a typed exception.
    // This covers 429 (3036/3040/unknown) and 403 (5035).
    if (!res.ok) {
      const body = await res.json().catch(() => ({} as CFResponse)) as CFResponse;
      throwCFError(res.status, body);
    }

    const data: CFResponse = await res.json();
    if (!data.success || !data.result?.response) {
      const errMsg = data.errors?.map((e) => e.message).join('; ') ?? 'empty response';
      throw new Error(`CF success=false: ${errMsg}`);
    }

    return data.result.response.trim();
  }

  // All errors propagate directly — no fallback model, no paid upgrade path.
  return await attempt(CF_PRIMARY_MODEL);
}

// ─── Demo mode ────────────────────────────────────────────────────────────────

export const DEMO_LABEL = '[DEMO — configure AI credentials for real results]';

const DEMO_RESPONSES: Record<string, string> = {
  improve:
    `${DEMO_LABEL}\n\nThis is a placeholder improved version. In production mode, the AI preserves your intended meaning while improving clarity, flow, and word choice.`,
  reply:
    `${DEMO_LABEL}\n\nThank you for your message. I have noted your request and will follow up shortly with a complete response.`,
  tone:
    `${DEMO_LABEL}\n\nThis is a placeholder rewrite in the selected tone. In production mode, the AI preserves exact meaning while adjusting style and register.`,
  simplify:
    `${DEMO_LABEL}\n\nThis is a simplified placeholder. In production mode, the AI replaces technical language with plain words anyone can understand.`,
  shorten:
    `${DEMO_LABEL}\n\nShorter placeholder. In production mode, the AI removes padding while keeping all essential meaning.`,
  grammar:
    `${DEMO_LABEL}\n\nThis is your text with corrections applied (placeholder). In production mode, the AI preserves your original style.`,
};

export function getDemoResponse(mode: string): string {
  return DEMO_RESPONSES[mode] ?? `${DEMO_LABEL}\n\nDemo placeholder for mode: ${mode}`;
}
