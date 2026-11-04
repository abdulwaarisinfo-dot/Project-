#!/usr/bin/env bash
# Functional test suite for Writora API and pages.
# Does NOT require AI credentials — all checks are structural/HTTP.
# Runs against a locally running server on $BASE (default: http://localhost:3000).
#
# Test categories and counts:
#   1. Demo AI responses (6 tests)   — one request per mode; confirms non-empty result
#   2. Input validation (7 tests)    — missing/invalid fields return correct 4xx
#   3. Rate limiting (1 test)        — 9th request within window returns 429
#   4. Security headers (4 tests)    — X-Frame-Options, X-Content-Type-Options, etc.
#   5. Page rendering (13 tests)     — every route returns 200
#   6. SEO fundamentals (6 tests)    — canonical + og:title present on key pages
#
# Total: 37 tests

BASE="${BASE:-http://localhost:3000}"
PASS=0
FAIL=0

pass() { echo "PASS [$1]"; ((PASS++)); }
fail() { echo "FAIL [$1]: $2"; ((FAIL++)); }

# ──────────────────────────────────────────────────────────────────────────────
echo "=== 1. DEMO AI RESPONSES (6 tests) ==="

for mode in improve reply tone simplify shorten grammar; do
  if [ "$mode" = "reply" ]; then
    body='{"mode":"reply","replyTo":"Can you help?","intention":"Yes I can"}'
  else
    body="{\"mode\":\"$mode\",\"text\":\"Hello world this is test input\"}"
  fi
  resp=$(curl -s -X POST "$BASE/api/generate" \
    -H "Content-Type: application/json" -H "X-Forwarded-For: 10.0.0.1" \
    -d "$body")
  result=$(echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('result',''))" 2>/dev/null)
  if [ -n "$result" ]; then
    pass "demo/$mode"
  else
    fail "demo/$mode" "empty or missing result — response: $resp"
  fi
done

echo ""
echo "=== 2. INPUT VALIDATION (7 tests) ==="

# Missing mode
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" -d '{"text":"hello"}')
[ "$resp" = "400" ] && pass "validation/missing-mode" || fail "validation/missing-mode" "expected 400, got $resp"

# Invalid mode
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" -d '{"mode":"nonsense","text":"hello"}')
[ "$resp" = "400" ] && pass "validation/invalid-mode" || fail "validation/invalid-mode" "expected 400, got $resp"

# Empty text
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" -d '{"mode":"improve","text":""}')
[ "$resp" = "400" ] && pass "validation/empty-text" || fail "validation/empty-text" "expected 400, got $resp"

# Missing text field
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" -d '{"mode":"improve"}')
[ "$resp" = "400" ] && pass "validation/missing-text" || fail "validation/missing-text" "expected 400, got $resp"

# Text too long (>4000 chars)
long_text=$(python3 -c "print('a ' * 2500)")
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"improve\",\"text\":\"$long_text\"}")
[ "$resp" = "400" ] && pass "validation/text-too-long" || fail "validation/text-too-long" "expected 400, got $resp"

# Reply mode: missing replyTo
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" -d '{"mode":"reply","intention":"be polite"}')
[ "$resp" = "400" ] && pass "validation/reply-missing-replyTo" || fail "validation/reply-missing-replyTo" "expected 400, got $resp"

# Invalid JSON body
resp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
  -H "Content-Type: application/json" -d 'not json')
[ "$resp" = "400" ] && pass "validation/invalid-json" || fail "validation/invalid-json" "expected 400, got $resp"

echo ""
echo "=== 3. RATE LIMITING (1 test) ==="

# Send 9 requests from the same IP in quick succession; 9th should be 429
rl_ip="192.168.100.1"
status_code=""
for i in $(seq 1 9); do
  status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/generate" \
    -H "Content-Type: application/json" -H "X-Forwarded-For: $rl_ip" \
    -d '{"mode":"improve","text":"rate limit test"}')
done
[ "$status_code" = "429" ] && pass "rate-limit/9th-request-blocked" || fail "rate-limit/9th-request-blocked" "expected 429 on 9th request, got $status_code"

echo ""
echo "=== 4. SECURITY HEADERS (4 tests) ==="

headers=$(curl -s -I "$BASE/")
echo "$headers" | grep -qi "x-frame-options" && pass "headers/x-frame-options" || fail "headers/x-frame-options" "header not present"
echo "$headers" | grep -qi "x-content-type-options" && pass "headers/x-content-type-options" || fail "headers/x-content-type-options" "header not present"
echo "$headers" | grep -qi "referrer-policy" && pass "headers/referrer-policy" || fail "headers/referrer-policy" "header not present"
echo "$headers" | grep -qi "permissions-policy" && pass "headers/permissions-policy" || fail "headers/permissions-policy" "header not present"

echo ""
echo "=== 5. PAGE RENDERING (13 tests) ==="

pages=(
  "/"
  "/about"
  "/privacy"
  "/terms"
  "/tools/improve-writing"
  "/tools/reply-generator"
  "/tools/change-tone"
  "/tools/simplify-text"
  "/tools/shorten-text"
  "/tools/fix-grammar"
  "/tools/write-professional-email"
  "/tools/polite-refusal"
  "/tools/follow-up-email"
)

for page in "${pages[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$page")
  [ "$code" = "200" ] && pass "pages$page" || fail "pages$page" "expected 200, got $code"
done

echo ""
echo "=== 6. SEO FUNDAMENTALS (6 tests) ==="

seo_pages=("/" "/tools/improve-writing" "/tools/reply-generator")
for page in "${seo_pages[@]}"; do
  html=$(curl -s "$BASE$page")
  echo "$html" | grep -qi 'rel="canonical"' \
    && pass "seo/canonical$page" \
    || fail "seo/canonical$page" "canonical link not found"
  echo "$html" | grep -qi 'og:title' \
    && pass "seo/og-title$page" \
    || fail "seo/og-title$page" "og:title not found"
done

echo ""
echo "=== RESULTS ==="
TOTAL=$((PASS + FAIL))
echo "Passed:  $PASS / $TOTAL"
echo "Failed:  $FAIL / $TOTAL"
echo ""
echo "Categories: Demo AI (6) | Validation (7) | Rate limit (1) | Headers (4) | Pages (13) | SEO (6)"
