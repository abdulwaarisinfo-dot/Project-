import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest } from '@/lib/types';
import { buildPrompt } from '@/lib/prompts';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  getActiveProvider,
  callCloudflare,
  getDemoResponse,
  QuotaExhaustedError,
  CapacityTemporaryError,
  ModelRequiresPaidError,
} from '@/lib/ai';

const MAX_TEXT_CHARS      = 4000;
const MAX_REPLY_TO_CHARS  = 2000;
const MAX_INTENTION_CHARS = 500;

export async function POST(req: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous';

  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    const waitSecs = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Too many requests. Please wait ${waitSecs} seconds before trying again.` },
      { status: 429, headers: { 'Retry-After': String(waitSecs) } }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // ── Validate mode ──────────────────────────────────────────────────────────
  const validModes = ['improve', 'reply', 'tone', 'simplify', 'shorten', 'grammar'];
  if (!body.mode || !validModes.includes(body.mode)) {
    return NextResponse.json({ error: 'Invalid or missing mode.' }, { status: 400 });
  }

  // ── Validate & sanitise text ───────────────────────────────────────────────
  const primaryText = body.mode === 'reply' ? (body.replyTo ?? '') : (body.text ?? '');

  if (!primaryText.trim()) {
    return NextResponse.json({ error: 'Please enter some text first.' }, { status: 400 });
  }
  if (primaryText.length > (body.mode === 'reply' ? MAX_REPLY_TO_CHARS : MAX_TEXT_CHARS)) {
    return NextResponse.json(
      { error: `Text is too long. Maximum ${body.mode === 'reply' ? MAX_REPLY_TO_CHARS : MAX_TEXT_CHARS} characters.` },
      { status: 400 }
    );
  }
  if (body.intention && body.intention.length > MAX_INTENTION_CHARS) {
    return NextResponse.json({ error: 'Intention field is too long.' }, { status: 400 });
  }

  // ── Demo mode ──────────────────────────────────────────────────────────────
  const provider = getActiveProvider();
  if (provider === 'demo') {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ result: getDemoResponse(body.mode), demo: true });
  }

  // ── Build prompt & call AI ─────────────────────────────────────────────────
  const { system, user } = buildPrompt(body);

  try {
    const result = await callCloudflare(system, user);
    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error('[generate] AI error:', err instanceof Error ? err.name : err);
    const msg = err instanceof Error ? err.message : '';

    // CF error 3036: daily free Neuron allocation exhausted — try again tomorrow.
    if (err instanceof QuotaExhaustedError) {
      return NextResponse.json(
        { error: 'The free daily AI quota has been reached. Please try again tomorrow.' },
        { status: 503 }
      );
    }

    // CF error 3040: temporary capacity exhaustion — service is briefly unavailable.
    if (err instanceof CapacityTemporaryError) {
      return NextResponse.json(
        { error: 'The AI service is temporarily busy. Please try again in a moment.' },
        { status: 503 }
      );
    }

    // CF error 5035: model requires paid plan. Do NOT expose billing info to user.
    if (err instanceof ModelRequiresPaidError) {
      return NextResponse.json(
        { error: 'The AI service is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Unknown CF 429 — rate limit with no fallback.
    if (msg.includes('CF 429')) {
      return NextResponse.json(
        { error: 'Too many requests to the AI service. Please wait a moment and try again.' },
        { status: 503 }
      );
    }

    if (msg.toLowerCase().includes('safety') || msg.toLowerCase().includes('block')) {
      return NextResponse.json(
        { error: 'This text could not be processed. Please try different content.' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
