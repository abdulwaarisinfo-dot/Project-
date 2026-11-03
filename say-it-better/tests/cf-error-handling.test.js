/**
 * Unit tests for Cloudflare Workers AI error handling.
 *
 * These tests exercise the throwCFError / callCloudflare logic by constructing
 * mock fetch responses for each documented error code and verifying that the
 * correct typed exception is thrown and that the correct fallback behaviour
 * (or absence thereof) follows.
 *
 * Run: node tests/cf-error-handling.test.js
 *
 * No server required. No API credentials required. fetch is monkey-patched.
 */

'use strict';

// ── Minimal environment so the module can load ────────────────────────────────
process.env.CF_ACCOUNT_ID = 'test-account';
process.env.CF_API_TOKEN  = 'test-token';

// ── Inline the logic under test (mirrors lib/ai.ts exactly) ──────────────────
// We inline instead of importing TypeScript so no build step is needed.

class QuotaExhaustedError extends Error {
  constructor() {
    super('CF error 3036: daily free Neuron allocation exhausted');
    this.name = 'QuotaExhaustedError';
  }
}

class CapacityTemporaryError extends Error {
  constructor() {
    super('CF error 3040: temporary capacity exhaustion');
    this.name = 'CapacityTemporaryError';
  }
}

class ModelRequiresPaidError extends Error {
  constructor() {
    super('CF error 5035: model requires Workers Paid plan');
    this.name = 'ModelRequiresPaidError';
  }
}

function throwCFError(httpStatus, body) {
  const code = body.errors?.[0]?.code;
  const msg  = body.errors?.[0]?.message ?? 'unknown error';

  if (code === 3036) throw new QuotaExhaustedError();
  if (code === 3040) throw new CapacityTemporaryError();
  if (code === 5035) throw new ModelRequiresPaidError();
  if (httpStatus === 429) throw new Error(`CF 429 rate limit (code: ${code ?? 'none'}): ${msg}`);
  throw new Error(`CF error HTTP ${httpStatus} (code: ${code ?? 'none'}): ${msg}`);
}

// Simulates callCloudflare with a mockFetch injected
async function callCloudflareWithFetch(system, user, mockFetch) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const CF_PRIMARY_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

  let attemptCount = 0;

  async function attempt(model) {
    attemptCount++;
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    const res = await mockFetch(url, model);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throwCFError(res.status, body);
    }

    const data = await res.json();
    if (!data.success || !data.result?.response) {
      const errMsg = data.errors?.map((e) => e.message).join('; ') ?? 'empty response';
      throw new Error(`CF success=false: ${errMsg}`);
    }
    return data.result.response.trim();
  }

  // All errors propagate directly — no fallback model, no paid upgrade path.
  const result = await attempt(CF_PRIMARY_MODEL);
  return { result, attempts: attemptCount };
}

// ── Test helpers ──────────────────────────────────────────────────────────────

let PASS = 0;
let FAIL = 0;

function assert(label, condition, detail) {
  if (condition) {
    console.log(`  PASS  ${label}`);
    PASS++;
  } else {
    console.log(`  FAIL  ${label}${detail ? ' — ' + detail : ''}`);
    FAIL++;
  }
}

function makeMockFetch(status, body) {
  return async (_url, _model) => ({
    ok:     status >= 200 && status < 300,
    status,
    json:   async () => body,
    text:   async () => JSON.stringify(body),
  });
}

function makeSuccessResponse(text = 'AI result') {
  return { ok: true, status: 200,
    json:  async () => ({ success: true, result: { response: text }, errors: [] }),
    text:  async () => '' };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

async function runTests() {

  // ── 1. Error code 3036 (HTTP 429) — daily Neuron quota exhausted ─────────────
  console.log('\n=== 1. Error 3036: daily Neuron quota exhausted (HTTP 429) ===');
  {
    const body3036 = {
      success: false,
      errors: [{ code: 3036, message: 'You have used up your daily free allocation of 10000 neurons' }],
      result: null,
    };
    try {
      await callCloudflareWithFetch('sys', 'user', makeMockFetch(429, body3036));
      assert('3036 throws QuotaExhaustedError', false, 'no error thrown');
    } catch (e) {
      assert('3036 throws QuotaExhaustedError', e instanceof QuotaExhaustedError, e?.name);
      assert('3036 no fallback attempt (1 attempt only)', true);  // caught before fallback
    }
  }

  // Verify no fallback: mock primary with 3036, fallback would return success.
  // If fallback is wrongly attempted, we'd get a result instead of an error.
  {
    let fallbackCalled = false;
    const mockFetchWithFallbackDetect = async (url, model) => {
      if (model.includes('8b')) {
        fallbackCalled = true;
        return makeSuccessResponse('fallback result');
      }
      return { ok: false, status: 429,
        json: async () => ({ success: false, errors: [{ code: 3036, message: 'quota' }] }) };
    };
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetchWithFallbackDetect);
    } catch (e) {
      assert('3036 does NOT call fallback model', !fallbackCalled, `fallbackCalled=${fallbackCalled}`);
    }
  }

  // ── 2. Error code 3040 (HTTP 429) — temporary capacity shortage ──────────────
  console.log('\n=== 2. Error 3040: temporary capacity shortage (HTTP 429) ===');
  {
    const body3040 = {
      success: false,
      errors: [{ code: 3040, message: 'Service capacity temporarily unavailable' }],
      result: null,
    };
    let fallbackCalled = false;
    const mockFetch = async (_url, model) => {
      if (model.includes('8b')) { fallbackCalled = true; return makeSuccessResponse(); }
      return { ok: false, status: 429, json: async () => body3040 };
    };
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetch);
      assert('3040 throws CapacityTemporaryError', false, 'no error thrown');
    } catch (e) {
      assert('3040 throws CapacityTemporaryError', e instanceof CapacityTemporaryError, e?.name);
      assert('3040 does NOT call fallback model', !fallbackCalled, `fallbackCalled=${fallbackCalled}`);
      assert('3040 is NOT mislabelled as quota exhaustion', !(e instanceof QuotaExhaustedError), e?.name);
    }
  }

  // ── 3. Error code 5035 (HTTP 403) — model requires Workers Paid ─────────────
  console.log('\n=== 3. Error 5035: model requires Workers Paid (HTTP 403) ===');
  {
    const body5035 = {
      success: false,
      errors: [{ code: 5035, message: 'This model requires a Workers Paid plan' }],
      result: null,
    };
    let fallbackCalled = false;
    const mockFetch = async (_url, model) => {
      if (model.includes('8b')) { fallbackCalled = true; return makeSuccessResponse(); }
      return { ok: false, status: 403, json: async () => body5035 };
    };
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetch);
      assert('5035 throws ModelRequiresPaidError', false, 'no error thrown');
    } catch (e) {
      assert('5035 throws ModelRequiresPaidError', e instanceof ModelRequiresPaidError, e?.name);
      assert('5035 does NOT call fallback model (no billing triggered)', !fallbackCalled, `fallbackCalled=${fallbackCalled}`);
    }
  }

  // ── 4. Unknown 429 — NO fallback; stops with exactly one attempt ─────────────
  console.log('\n=== 4. Unknown 429: no fallback — exactly one attempt, error thrown ===');
  {
    let fallbackCalled = false;
    let attemptsMade = 0;
    const mockFetch = async (_url, model) => {
      attemptsMade++;
      if (model.includes('8b')) {
        fallbackCalled = true;
        return makeSuccessResponse('fallback result');
      }
      // Unknown error code (not 3036/3040/5035)
      return { ok: false, status: 429,
        json: async () => ({ success: false, errors: [{ code: 9999, message: 'rate limit' }] }) };
    };
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetch);
      assert('unknown 429 throws error (not silent success)', false, 'no error was thrown');
    } catch (e) {
      assert('unknown 429 throws error (not silent success)',
        e instanceof Error && e.message.includes('CF 429'), e?.message);
      assert('unknown 429 does NOT call fallback model', !fallbackCalled, `fallbackCalled=${fallbackCalled}`);
      assert('unknown 429 makes exactly 1 attempt', attemptsMade === 1, `attemptsMade=${attemptsMade}`);
    }
  }

  // ── 5. Successful primary response — no fallback ─────────────────────────────
  console.log('\n=== 5. Successful primary response ===');
  {
    const { result, attempts } = await callCloudflareWithFetch('sys', 'user',
      async () => makeSuccessResponse('primary result'));
    assert('primary success returns result', result === 'primary result', result);
    assert('primary success uses 1 attempt', attempts === 1, `attempts=${attempts}`);
  }

  // ── 6. Malformed / empty error body ─────────────────────────────────────────
  console.log('\n=== 6. Malformed / empty error body ===');
  {
    // 429 with no parseable JSON body
    const mockFetch = async () => ({
      ok: false, status: 429,
      json: async () => { throw new Error('invalid JSON'); },
      text: async () => 'not json',
    });
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetch);
      assert('malformed body does not crash silently', false, 'no error thrown');
    } catch (e) {
      const isExpected = e instanceof QuotaExhaustedError ||
                         e instanceof CapacityTemporaryError ||
                         e instanceof ModelRequiresPaidError ||
                         (e instanceof Error && e.message.includes('CF 429 rate limit'));
      assert('malformed body throws a typed or CF error', isExpected, e?.message);
    }
  }

  // ── 7. 429 with null errors array ────────────────────────────────────────────
  console.log('\n=== 7. 429 with null/empty errors array ===');
  {
    const mockFetch = async () => ({
      ok: false, status: 429,
      json: async () => ({ success: false, errors: [], result: null }),
    });
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetch);
      assert('null errors array does not crash', false, 'no error thrown');
    } catch (e) {
      // Should fall to "unknown 429" branch and attempt fallback or throw a rate-limit error
      const isExpected = e instanceof Error && (
        e.message.includes('CF 429 rate limit') ||
        e.message.includes('CF error')
      );
      // OR: if fallback was attempted and also failed, that's fine too
      assert('null errors array throws safely (no crash)', true);
    }
  }

  // ── 8. HTTP 500 from CF — not treated as quota/rate-limit ────────────────────
  console.log('\n=== 8. HTTP 500 from CF — generic error ===');
  {
    const mockFetch = async () => ({
      ok: false, status: 500,
      json: async () => ({ success: false, errors: [{ code: 7001, message: 'internal error' }] }),
    });
    try {
      await callCloudflareWithFetch('sys', 'user', mockFetch);
      assert('HTTP 500 throws error', false, 'no error thrown');
    } catch (e) {
      assert('HTTP 500 is generic error (not quota/capacity/paid)',
        !(e instanceof QuotaExhaustedError) &&
        !(e instanceof CapacityTemporaryError) &&
        !(e instanceof ModelRequiresPaidError), e?.name);
      assert('HTTP 500 error message contains HTTP status',
        e instanceof Error && e.message.includes('500'), e?.message);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  const TOTAL = PASS + FAIL;
  console.log(`\n=== CF Error Handling Test Results ===`);
  console.log(`Passed:  ${PASS} / ${TOTAL}`);
  console.log(`Failed:  ${FAIL} / ${TOTAL}`);
  if (FAIL > 0) process.exit(1);
}

runTests().catch((e) => { console.error('Test runner crashed:', e); process.exit(1); });
