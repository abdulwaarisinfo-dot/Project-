#!/usr/bin/env bash
# Quality evaluation test suite for Writora
# Tests AI output quality across all 6 modes (5 cases each = 30 tests) plus 5 naturalness tests = 35 total.
#
# REQUIREMENTS
#   - CF_ACCOUNT_ID + CF_API_TOKEN must be set in the environment.
#   - A server running on $BASE (default: http://localhost:3000) must be active.
#
# EXIT CODES
#   0   — all tests passed
#   1   — one or more tests failed
#   2   — blocked: server is in demo mode (credentials not configured)
#          Quality cannot be evaluated. Configure credentials and re-run.
#
# AUTOMATED VS HUMAN REVIEW
#   Automated checks catch structural failures: empty output, boilerplate preamble,
#   invented percentages/reference numbers, word-count reduction (shorten mode),
#   and surface tone signals.
#   They cannot fully verify semantic correctness, naturalness, voice preservation,
#   or meaning fidelity. Each test includes a human-reviewable EXPECTED OUTCOME
#   comment describing what a correct response should look like.
#   After running, read the printed outputs alongside those expectations.
#
# WHAT IS NOT TESTED HERE
#   - Safety/refusal behavior
#   - Non-English inputs
#   - Very long inputs (>1000 words)
#   - Adversarial or ambiguous instructions

BASE="${BASE:-http://localhost:3000}"
PASS=0
FAIL=0

# ── Helpers ──────────────────────────────────────────────────────────────────

# Each test uses a unique X-Forwarded-For IP so the in-process rate limiter
# (8 req/min per IP) never fires across tests.
# --max-time 30: abort if the server or upstream CF takes longer than 30 seconds.
# --connect-timeout 10: fail fast if the server is not reachable at all.
api_call() {
  curl -s --max-time 30 --connect-timeout 10 \
    -X POST "$BASE/api/generate" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: $1" \
    -d "$2"
}

extract_result() {
  echo "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('result',''))" 2>/dev/null
}

extract_error() {
  echo "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error','(no error field)'))" 2>/dev/null
}

is_demo_response() {
  echo "$1" | grep -q '"demo":true'
}

# ── Automated check functions ─────────────────────────────────────────────────

# Fails if output is empty or whitespace-only.
check_not_empty() {
  [ -n "$(echo "$1" | tr -d '[:space:]')" ]
}

# Fails if output starts with a preamble the prompts explicitly forbid:
#   "Here is / Here's / Below is / I have improved..." etc.
check_no_preamble() {
  ! echo "$1" | grep -qiE '^(here is|here.s|below is|i have (improved|rewritten|simplified|shortened|corrected|fixed)|the (improved|rewritten|simplified|shortened|corrected) (text|version|message) (is|follows))'
}

# Fails if output introduces percentage figures not present in the input.
check_no_invention() {
  local input="$1" output="$2"
  if echo "$output" | grep -qE '[0-9]+%'; then
    if ! echo "$input" | grep -qE '[0-9]+%'; then
      return 1
    fi
  fi
  return 0
}

# Stricter invention check for Reply mode: no invented order/ticket/reference
# numbers, no dollar/currency amounts absent from the input.
check_reply_no_invention() {
  local input="$1" output="$2"
  if echo "$output" | grep -qE '#[0-9]{3,}|[Oo]rder\s+[0-9]+|[Tt]icket\s+[0-9]+|[Rr]ef(erence)?\s*(#|[Nn]o\.?)\s*[0-9]+'; then
    if ! echo "$input" | grep -qE '#[0-9]{3,}|[Oo]rder\s+[0-9]+|[Tt]icket\s+[0-9]+|[Rr]ef(erence)?\s*(#|[Nn]o\.?)\s*[0-9]+'; then
      return 1
    fi
  fi
  if echo "$output" | grep -qE '\$[0-9]+|[0-9]+\s*(USD|GBP|EUR)'; then
    if ! echo "$input" | grep -qE '\$[0-9]+|[0-9]+\s*(USD|GBP|EUR)'; then
      return 1
    fi
  fi
  return 0
}

# Fails if output word-count is not less than input word-count (shorten mode).
check_shorter() {
  local in_words out_words
  in_words=$(echo "$1" | wc -w)
  out_words=$(echo "$2" | wc -w)
  [ "$out_words" -lt "$in_words" ]
}

# Surface-level tone signal check. Heuristic only — a human reviewer should
# confirm the tone reads correctly end-to-end.
check_tone_signal() {
  local output="$1" tone="$2"
  case "$tone" in
    formal)       echo "$output" | grep -qiE 'regard|herein|hereby|pursuant|kindly|please be advised|I am writing' ;;
    casual)       echo "$output" | grep -qiE "hey|yeah|great|awesome|gonna|wanna|'re |'ve |sounds good|no worries" ;;
    professional) echo "$output" | grep -qiE 'please|team|appreciate|follow.up|regards|look forward' ;;
    friendly)     echo "$output" | grep -qiE 'happy|glad|hope|looking forward|wonderful|exciting|great to' ;;
    confident)    ! echo "$output" | grep -qiE 'maybe|perhaps|kind of|sort of|I think|I guess|possibly|might want to' ;;
    empathetic)   echo "$output" | grep -qiE 'understand|appreciate|sorry|difficult|hear you|must be' ;;
    *)            return 0 ;;
  esac
}

# Fails if the output opens with a generic AI filler phrase.
# Targets the most common patterns: "Absolutely!", "Certainly!", "Of course!",
# "I'd be happy to", "I hope this finds you", etc.
check_no_ai_opener() {
  ! echo "$1" | head -1 | grep -qiE '^(absolutely[^a-z]|certainly[^a-z]|of course[^a-z]|sure[^a-z]|great[^a-z]|definitely[^a-z]|i.d be (happy|glad|delighted) to|i would be (happy|glad|delighted) to|i hope this (message |email )?(finds|reaches))'
}

# Fails if the output contains more em dashes (—) than the input.
# Detects the AI habit of merging sentences with em dashes instead of using
# natural punctuation. Correctly hyphenated compound words are unaffected
# because this checks for the em dash character only.
check_no_introduced_emdash() {
  local in_count out_count
  in_count=$(echo "$1" | grep -o '—' | wc -l)
  out_count=$(echo "$2" | grep -o '—' | wc -l)
  [ "$out_count" -le "$in_count" ]
}

# ── Detect demo mode ─────────────────────────────────────────────────────────
echo "=== Detecting mode ==="
PROBE=$(api_call "99.0.0.1" '{"mode":"improve","text":"test"}')
if is_demo_response "$PROBE"; then
  DEMO=true
  echo "BLOCKED: Server is in demo mode — no AI credentials configured."
  echo "Set CF_ACCOUNT_ID + CF_API_TOKEN, restart the server, then re-run."
  echo ""
  echo "Quality test results: 0 passed / 0 failed / 35 skipped (blocked — demo mode)"
  exit 2
fi
echo "AI mode active — running quality checks."
echo ""

# ── Test runner ───────────────────────────────────────────────────────────────
# Args: id  mode  label  ip  body  input_text  tone_check  check_short  check_reply_inv  check_ai_opener  check_no_emdash
run_quality_test() {
  local id="$1" mode="$2" label="$3" ip="$4" body="$5"
  local input_text="$6" tone_check="$7" check_short="$8" check_reply_inv="$9"
  local check_ai_opener="${10}" check_no_emdash="${11}"

  local resp result
  resp=$(api_call "$ip" "$body")
  result=$(extract_result "$resp")

  if [ -z "$result" ]; then
    local server_error
    server_error=$(extract_error "$resp")
    echo "FAIL [$id | $mode | $label] — empty result. Server: $server_error"
    ((FAIL++))
    return
  fi

  local checks_passed=0 checks_total=0 fail_reasons=""

  ((checks_total++))
  if check_not_empty "$result";         then ((checks_passed++)); else fail_reasons+=" [empty]"; fi

  ((checks_total++))
  if check_no_preamble "$result";       then ((checks_passed++)); else fail_reasons+=" [preamble]"; fi

  ((checks_total++))
  if check_no_invention "$input_text" "$result"; then ((checks_passed++)); else fail_reasons+=" [invented %]"; fi

  if [ "$check_reply_inv" = "yes" ]; then
    ((checks_total++))
    if check_reply_no_invention "$input_text" "$result"; then ((checks_passed++)); else fail_reasons+=" [invented ref/amount]"; fi
  fi

  if [ -n "$tone_check" ]; then
    ((checks_total++))
    if check_tone_signal "$result" "$tone_check"; then ((checks_passed++)); else fail_reasons+=" [tone:$tone_check]"; fi
  fi

  if [ "$check_short" = "yes" ]; then
    ((checks_total++))
    if check_shorter "$input_text" "$result"; then ((checks_passed++)); else fail_reasons+=" [not shorter]"; fi
  fi

  if [ "$check_ai_opener" = "yes" ]; then
    ((checks_total++))
    if check_no_ai_opener "$result"; then ((checks_passed++)); else fail_reasons+=" [ai-opener]"; fi
  fi

  if [ "$check_no_emdash" = "yes" ]; then
    ((checks_total++))
    if check_no_introduced_emdash "$input_text" "$result"; then ((checks_passed++)); else fail_reasons+=" [em-dash]"; fi
  fi

  if [ "$checks_passed" -eq "$checks_total" ]; then
    echo "PASS [$id | $mode | $label] ($checks_passed/$checks_total automated checks)"
    echo "     Output: $(echo "$result" | head -c 300)"
    echo "     ↳ HUMAN REVIEW REQUIRED — see expected outcome in script comments."
    ((PASS++))
  else
    echo "FAIL [$id | $mode | $label] ($checks_passed/$checks_total automated checks)$fail_reasons"
    echo "     Output: $(echo "$result" | head -c 300)"
    ((FAIL++))
  fi
  echo ""
}

# ── IMPROVE mode (5 tests) ────────────────────────────────────────────────────
echo "=== IMPROVE (5 tests) ==="

# EXPECTED I-1: A single, clear sentence like "The meeting has been rescheduled
# to 3pm on Tuesday." The vague "instead of the one that was previously scheduled"
# clause should be dropped or reworded. Same factual content (3pm, Tuesday).
run_quality_test "I-1" "improve" "basic clarity" "20.0.0.1" \
  '{"mode":"improve","text":"I wanted to let you know that the meeting has been changed to 3pm on tuesday instead of the one that was previously scheduled"}' \
  "I wanted to let you know that the meeting has been changed to 3pm on tuesday instead of the one that was previously scheduled" "" "" ""

# EXPECTED I-2: Formal register. "I would like to propose exploring an alternative
# approach to the project." No slang. Should still be about the project.
run_quality_test "I-2" "improve" "formal tone" "20.0.0.2" \
  '{"mode":"improve","text":"Hey so I was thinking maybe we could do the project a different way","tone":"formal"}' \
  "Hey so I was thinking maybe we could do the project a different way" "formal" "" ""

# EXPECTED I-3: Active voice. "The team made mistakes and missed the deadline."
# Not a fabricated excuse or additional context. No invented actors.
run_quality_test "I-3" "improve" "passive to active" "20.0.0.3" \
  '{"mode":"improve","text":"Mistakes were made and the deadline was not met by the team"}' \
  "Mistakes were made and the deadline was not met by the team" "" "" ""

# EXPECTED I-4: Coherent paragraph. All five facts present (login bug, errors,
# users can't log in, mobile). Not padded. Not a bullet list unless that reads
# more naturally.
run_quality_test "I-4" "improve" "fragmented sentences" "20.0.0.4" \
  '{"mode":"improve","text":"We need to fix the bug. It is in the login. It causes errors. Users cannot log in. Happens on mobile."}' \
  "We need to fix the bug. It is in the login. It causes errors. Users cannot log in. Happens on mobile." "" "" ""

# EXPECTED I-5: Concise sentence. "We are currently reviewing the document."
# All redundant time-markers (at this point in time, currently, at the present
# moment) removed. Meaning unchanged.
run_quality_test "I-5" "improve" "redundant phrasing" "20.0.0.5" \
  '{"mode":"improve","text":"At this point in time, it is currently the case that we are in the process of reviewing the document at the present moment"}' \
  "At this point in time, it is currently the case that we are in the process of reviewing the document at the present moment" "" "" ""

echo ""

# ── REPLY mode (5 tests) ─────────────────────────────────────────────────────
echo "=== REPLY (5 tests) ==="

# EXPECTED R-1: Politely declines 2pm. Proposes 4pm. No invented date, no
# invented deadline, no commitment to anything not stated. Natural tone.
run_quality_test "R-1" "reply" "decline, counter-propose" "21.0.0.1" \
  '{"mode":"reply","replyTo":"Can you join us for the 2pm meeting tomorrow?","intention":"I cannot make it, suggest 4pm instead"}' \
  "Can you join us for the 2pm meeting tomorrow?" "" "" "yes"

# EXPECTED R-2: Thanks them briefly. Asks what specifically concerns them about
# the timeline. Does NOT accept the concerns as valid or promise changes. No
# invented numbers, no invented timeline, no invented names.
run_quality_test "R-2" "reply" "request clarification" "21.0.0.2" \
  '{"mode":"reply","replyTo":"We reviewed your proposal and have some concerns about the timeline","intention":"Thank them, ask what specifically concerns them"}' \
  "We reviewed your proposal and have some concerns about the timeline" "" "" "yes"

# EXPECTED R-3: Formal. Confirms attendance at the review next Friday at 10am.
# Short, professional. No extra commitments. Appropriate for replying to a manager.
run_quality_test "R-3" "reply" "confirm to manager" "21.0.0.3" \
  '{"mode":"reply","replyTo":"Your performance review is scheduled for next Friday at 10am","intention":"Confirm I will attend","recipient":"my manager"}' \
  "Your performance review is scheduled for next Friday at 10am" "" "" "yes"

# EXPECTED R-4: Sincere apology. States the matter will be investigated
# immediately. Does NOT invent an order number, tracking code, cause of delay,
# or specific resolution timeline. Does NOT promise a refund or replacement
# that wasn't in the intention.
run_quality_test "R-4" "reply" "apologise, no invented details" "21.0.0.4" \
  '{"mode":"reply","replyTo":"I have been waiting 3 weeks for my order and it still has not arrived","intention":"Apologise sincerely and say we will investigate immediately"}' \
  "I have been waiting 3 weeks for my order and it still has not arrived" "" "" "yes"

# EXPECTED R-5: Casual and friendly. Agrees to lunch. Suggests noon at the usual
# place. Does NOT name a restaurant (none was given). Does NOT add extra plans or
# commitments.
run_quality_test "R-5" "reply" "casual, no invented venue" "21.0.0.5" \
  '{"mode":"reply","replyTo":"Want to grab lunch tomorrow?","intention":"Yes, sounds great, suggest noon at the usual place","recipient":"a colleague"}' \
  "Want to grab lunch tomorrow?" "" "" "yes"

echo ""

# ── TONE mode (5 tests) ───────────────────────────────────────────────────────
echo "=== TONE (5 tests) ==="

# EXPECTED T-1: Formal. Same message: report due by Friday or there will be a
# problem. No slang. Probably starts with "Please" or "I wanted to advise you."
run_quality_test "T-1" "tone" "casual → formal" "22.0.0.1" \
  '{"mode":"tone","text":"Hey we need that report thing done by Friday or like it will be a problem","tone":"formal"}' \
  "Hey we need that report thing done by Friday or like it will be a problem" "formal" "" ""

# EXPECTED T-2: Friendly. Same message: your request was received, will be
# processed. Uses warm language. Not "in due course" (too stiff). May say
# "we'll get that sorted for you" or similar.
run_quality_test "T-2" "tone" "stiff → friendly" "22.0.0.2" \
  '{"mode":"tone","text":"Your request has been received and will be processed in due course","tone":"friendly"}' \
  "Your request has been received and will be processed in due course" "friendly" "" ""

# EXPECTED T-3: Confident. Same message: consider a different approach. No
# hedging words (maybe, possibly, perhaps, I think, kind of). Direct assertion.
run_quality_test "T-3" "tone" "hedging → confident" "22.0.0.3" \
  '{"mode":"tone","text":"I think maybe we could possibly consider looking at a different approach if that might work","tone":"confident"}' \
  "I think maybe we could possibly consider looking at a different approach if that might work" "confident" "" ""

# EXPECTED T-4: Professional plain English. Same meaning: your account balance
# has been adjusted per the agreement. Removes legalese (herewith, aforementioned,
# pursuant). Meaning preserved, jargon removed.
run_quality_test "T-4" "tone" "legalese → professional" "22.0.0.4" \
  '{"mode":"tone","text":"I am writing to formally advise you that your account balance has herewith been adjusted in accordance with the aforementioned agreement","tone":"professional"}' \
  "I am writing to formally advise you that your account balance has herewith been adjusted in accordance with the aforementioned agreement" "" "" ""

# EXPECTED T-5: Empathetic. Same core message: the deadline was missed and this
# is a problem. But delivered with understanding. May acknowledge difficulty.
# Does NOT remove the fact of the missed deadline or invent reasons for it.
run_quality_test "T-5" "tone" "blunt → empathetic" "22.0.0.5" \
  '{"mode":"tone","text":"You missed the deadline. This is unacceptable.","tone":"empathetic"}' \
  "You missed the deadline. This is unacceptable." "empathetic" "" ""

echo ""

# ── SIMPLIFY mode (5 tests) ───────────────────────────────────────────────────
echo "=== SIMPLIFY (5 tests) ==="

# EXPECTED S-1: Plain English. Core meaning: the first party will protect the
# second party from any legal claims. "Simple English" level.
run_quality_test "S-1" "simplify" "legal jargon" "23.0.0.1" \
  '{"mode":"simplify","text":"The party of the first part hereby indemnifies and holds harmless the party of the second part from any and all liabilities arising therefrom","simplifyLevel":"simple"}' \
  "The party of the first part hereby indemnifies and holds harmless the party of the second part from any and all liabilities arising therefrom" "" "" ""

# EXPECTED S-2: Very simple. Core message: the patient is having a heart attack
# affecting the front of the heart and needs emergency surgery to open the blocked
# artery. No medical acronyms (ST-elevation, V2-V4, PCI) in the output.
run_quality_test "S-2" "simplify" "medical language" "23.0.0.2" \
  '{"mode":"simplify","text":"The patient presents with acute myocardial infarction with ST-elevation in leads V2-V4 requiring immediate percutaneous coronary intervention","simplifyLevel":"very-simple"}' \
  "The patient presents with acute myocardial infarction with ST-elevation in leads V2-V4 requiring immediate percutaneous coronary intervention" "" "" ""

# EXPECTED S-3: Everyday language. Core meaning: when an API call fails, wait a
# bit longer each time before trying again, with some randomness, to avoid
# overloading the other service. No jargon (exponential backoff, jitter,
# thundering herd) in the output.
run_quality_test "S-3" "simplify" "technical docs" "23.0.0.3" \
  '{"mode":"simplify","text":"Implement exponential backoff with jitter when retrying failed API requests to avoid thundering herd problems on the upstream service","simplifyLevel":"everyday"}' \
  "Implement exponential backoff with jitter when retrying failed API requests to avoid thundering herd problems on the upstream service" "" "" ""

# EXPECTED S-4: Plain English. Core meaning: thinking about what we know and
# how we know it requires us to rethink what counts as true. No academic terms
# (epistemological, post-structuralist, reconceptualisation) in the output.
run_quality_test "S-4" "simplify" "academic prose" "23.0.0.4" \
  '{"mode":"simplify","text":"The epistemological implications of post-structuralist discourse necessitate a fundamental reconceptualisation of subjective truth-claims","simplifyLevel":"simple"}' \
  "The epistemological implications of post-structuralist discourse necessitate a fundamental reconceptualisation of subjective truth-claims" "" "" ""

# EXPECTED S-5: Very simple. Core meaning: if you don't send the required
# documents in time, your benefits may be suspended. No bureaucratic language
# (remit, requisite, stipulated, aforementioned entitlements).
run_quality_test "S-5" "simplify" "bureaucratic notice" "23.0.0.5" \
  '{"mode":"simplify","text":"Failure to remit the requisite documentation within the stipulated timeframe may result in the suspension of the aforementioned entitlements","simplifyLevel":"very-simple"}' \
  "Failure to remit the requisite documentation within the stipulated timeframe may result in the suspension of the aforementioned entitlements" "" "" ""

echo ""

# ── SHORTEN mode (5 tests) ────────────────────────────────────────────────────
echo "=== SHORTEN (5 tests) ==="

# EXPECTED SH-1: ~20 words or fewer. Core message: I've reviewed your document
# and want to share my thoughts. Padding ("just wanted to", "kind enough to
# send over", "now had the opportunity") removed.
run_quality_test "SH-1" "shorten" "padded email" "24.0.0.1" \
  '{"mode":"shorten","text":"I just wanted to quickly reach out and let you know that I have now had the opportunity to fully review the document that you were kind enough to send over to me yesterday and I wanted to share my initial thoughts with you"}' \
  "I just wanted to quickly reach out and let you know that I have now had the opportunity to fully review the document that you were kind enough to send over to me yesterday and I wanted to share my initial thoughts with you" "" "yes" ""

# EXPECTED SH-2: ~10 words or fewer. Core message: we're evaluating options for
# how to move this project forward. All filler about process and constraints cut.
run_quality_test "SH-2" "shorten" "much shorter" "24.0.0.2" \
  '{"mode":"shorten","text":"We are currently in the process of evaluating a number of different options and approaches for how best to move forward with this particular project given the current constraints and limitations that we are facing","length":"much-shorter"}' \
  "We are currently in the process of evaluating a number of different options and approaches for how best to move forward with this particular project given the current constraints and limitations that we are facing" "" "yes" ""

# EXPECTED SH-3: One sentence. Must include the key numbers (12%, 94%) and the
# conclusion (on track for annual targets). Cannot omit the new enterprise tier
# if space permits. The five original sentences → exactly one.
run_quality_test "SH-3" "shorten" "one-sentence distil" "24.0.0.3" \
  '{"mode":"shorten","text":"Our Q3 results show strong performance across all three product lines. Revenue grew 12% year on year. Customer retention improved to 94%. The new enterprise tier launched successfully. We are on track for our annual targets.","length":"one-sentence"}' \
  "Our Q3 results show strong performance across all three product lines. Revenue grew 12% year on year. Customer retention improved to 94%. The new enterprise tier launched successfully. We are on track for our annual targets." "" "yes" ""

# EXPECTED SH-4: ~15 words or fewer. Core message: this matter is urgent and
# needs immediate attention. All hedging preamble ("as you may already be aware",
# "it goes without saying") removed.
run_quality_test "SH-4" "shorten" "filler phrases" "24.0.0.4" \
  '{"mode":"shorten","text":"As you may already be aware and as I am sure you will agree, it goes without saying that the matter at hand is of the utmost importance and requires immediate attention"}' \
  "As you may already be aware and as I am sure you will agree, it goes without saying that the matter at hand is of the utmost importance and requires immediate attention" "" "yes" ""

# EXPECTED SH-5: Slightly shorter (~25–35 words vs 40). Core gratitude preserved.
# "so much", "really", "incredibly" and one of the three thank-you sentences
# may be trimmed. Still warm and genuine.
run_quality_test "SH-5" "shorten" "slightly shorter" "24.0.0.5" \
  '{"mode":"shorten","text":"Thank you so much for taking the time to get back to me. I really appreciate you sharing your thoughts on this matter. Your feedback is incredibly valuable to us.","length":"slightly-shorter"}' \
  "Thank you so much for taking the time to get back to me. I really appreciate you sharing your thoughts on this matter. Your feedback is incredibly valuable to us." "" "yes" ""

echo ""

# ── GRAMMAR mode (5 tests) ────────────────────────────────────────────────────
echo "=== GRAMMAR (5 tests) ==="

# EXPECTED G-1: Corrects their→they're, dont→don't, double negative (no money/
# not going). "They're going to the store, but they don't have any money, so
# they're not going to buy anything." Voice should feel unchanged.
run_quality_test "G-1" "grammar" "their/there/they're" "25.0.0.1" \
  '{"mode":"grammar","text":"Their going to the store but they dont have no money so there not going to buy anything"}' \
  "Their going to the store but they dont have no money so there not going to buy anything" "" "" ""

# EXPECTED G-2: Corrects its→it's (second sentence), teams→team's. First
# sentence ("its new product") is already correct and must NOT be changed.
run_quality_test "G-2" "grammar" "its/it's, possessives" "25.0.0.2" \
  '{"mode":"grammar","text":"The company announced its new product. Its going to launch in January. The teams ready for it."}' \
  "The company announced its new product. Its going to launch in January. The teams ready for it." "" "" ""

# EXPECTED G-3: was→were (results); have reviewed→has reviewed (Each);
# board were→board was (Neither…nor takes the closer subject). Voice unchanged.
# Human reviewer should confirm the subject-verb rule for "Neither…nor."
run_quality_test "G-3" "grammar" "subject-verb agreement" "25.0.0.3" \
  '{"mode":"grammar","text":"The results of the survey was surprising. Each of the managers have reviewed the report. Neither the CEO nor the board were informed."}' \
  "The results of the survey was surprising. Each of the managers have reviewed the report. Neither the CEO nor the board were informed." "" "" ""

# EXPECTED G-4: Fixes comma splices (add conjunctions or split sentences).
# Fixes the fragment "Because of the complexity." (attach to adjacent sentence).
# Does NOT add or invent reasons, context or outcomes.
run_quality_test "G-4" "grammar" "comma splices + fragment" "25.0.0.4" \
  '{"mode":"grammar","text":"The project is delayed, the team needs more time. Because of the complexity. We should reschedule, the client will understand."}' \
  "The project is delayed, the team needs more time. Because of the complexity. We should reschedule, the client will understand." "" "" ""

# EXPECTED G-5: Corrects we→We (sentence start), its→it's, alot→a lot.
# Preserves informal register ("really good", "coming in"). Does NOT
# convert to formal prose or restructure the sentences.
run_quality_test "G-5" "grammar" "style preserved" "25.0.0.5" \
  '{"mode":"grammar","text":"we launched the product last week. its doing really good. sales are up and there are alot of positive reviews coming in"}' \
  "we launched the product last week. its doing really good. sales are up and there are alot of positive reviews coming in" "" "" ""

echo ""

# ── NATURALNESS (5 tests) ────────────────────────────────────────────────────
echo "=== NATURALNESS (5 tests) ==="

# EXPECTED N-1: A casual, clear rewrite that still sounds like a quick internal
# message. NOT "I am pleased to report that today's client engagement yielded
# positive outcomes." Contractions fine. No AI opener, no em dash introduced.
run_quality_test "N-1" "improve" "casual voice preserved" "26.0.0.1" \
  '{"mode":"improve","text":"we had a call with the client today and i think theyre pretty happy with the direction were going"}' \
  "we had a call with the client today and i think theyre pretty happy with the direction were going" "" "" "" "yes" "yes"

# EXPECTED N-2: Two short, clean sentences stay as two short, clean sentences.
# Should NOT become "The deadline is Friday — make sure the report is ready."
# (em dash introduced) or "The deadline is on Friday; please ensure the report
# has been completed prior to this date." (over-formalised). No AI opener.
run_quality_test "N-2" "improve" "no em dash introduced" "26.0.0.2" \
  '{"mode":"improve","text":"The deadline is Friday. Make sure the report is ready by then."}' \
  "The deadline is Friday. Make sure the report is ready by then." "" "" "" "yes" "yes"

# EXPECTED N-3: One short, direct reply — no more than ~15 words. Something like
# "Sure, sending it now." or "Yes, on its way." NOT "Thank you for reaching out.
# I would be happy to send the file over. Please find it attached." No AI opener,
# no invented content.
run_quality_test "N-3" "reply" "brief reply stays brief" "26.0.0.3" \
  '{"mode":"reply","replyTo":"Can you send me the file?","intention":"Yes, sending it now"}' \
  "Can you send me the file?" "" "" "yes" "yes" ""

# EXPECTED N-4: Grammar fixed, casual register fully preserved. "We were going to
# reschedule the thing but nobody could agree on a time." NOT "We had intended to
# reschedule the matter; however, a consensus regarding timing could not be
# reached." The word "thing" may stay. No AI opener.
run_quality_test "N-4" "grammar" "informal register preserved" "26.0.0.4" \
  '{"mode":"grammar","text":"we was gonna reschedule the thing but nobody could agree on a time"}' \
  "we was gonna reschedule the thing but nobody could agree on a time" "" "" "" "yes" ""

# EXPECTED N-5: Professional, not corporate. Something like "The project is going
# well and we should be done by end of the week." NOT "I am writing to formally
# advise you that project progress remains on schedule — completion is anticipated
# by week's end." No AI opener, no introduced em dash.
run_quality_test "N-5" "tone" "professional stays human" "26.0.0.5" \
  '{"mode":"tone","text":"hey the project is going well and we should be done by end of week","tone":"professional"}' \
  "hey the project is going well and we should be done by end of week" "professional" "" "" "yes" "yes"

echo ""

# ── Summary ───────────────────────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
echo "=== Quality Test Results ==="
echo "Executed: $TOTAL / 35"
echo "Passed:   $PASS / $TOTAL  (automated checks only)"
echo "Failed:   $FAIL / $TOTAL"
echo ""
echo "NOTE: Automated checks verify structure only (non-empty, no preamble,"
echo "no invented numbers). They do NOT verify meaning preservation, tone"
echo "fidelity, naturalness or voice. Read the printed outputs above against"
echo "the EXPECTED outcome comments in this script before marking a test complete."

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
