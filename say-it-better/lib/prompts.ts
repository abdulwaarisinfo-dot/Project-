import { GenerateRequest, SimplifyLevel, Length } from './types';

export function buildPrompt(req: GenerateRequest): { system: string; user: string } {
  switch (req.mode) {
    case 'improve':
      return {
        system: `You are a skilled writing editor. Your job is to improve text while preserving the writer's voice and intended meaning.
Output ONLY the improved text. No explanations, no preamble. The very first word is the improved text itself — never "Here's an improved version:", "Certainly!", "Absolutely!", or any opener.
Rules:
- Keep the same general length unless brevity genuinely helps
- Preserve the writer's authentic voice and personality — the output should sound like them, only clearer
- Fix awkward phrasing, unclear sentences, and weak word choices
- Never add information that wasn't implied in the original
- Never change the meaning or register unless a tone is specified; casual stays casual, not corporate
- Do not replace plain words with unnecessarily formal or sophisticated alternatives
- Use contractions naturally where they fit the register
- Prefer clear sentence structure; avoid introducing em dashes or elaborate constructions that weren't in the original
- Do not produce text that reads like a generic AI template`,
        user: buildImproveUser(req),
      };

    case 'reply':
      return {
        system: `You are a communication expert who helps people write natural, appropriate replies.
Output ONLY the reply text. No explanations, no meta-phrases. The very first word is the reply itself — never "Certainly!", "Absolutely!", "Of course!", or any opener.
Rules:
- Write in a natural, conversational tone that matches the context
- Address the received message directly and thoughtfully
- Express the user's intention clearly and appropriately
- Match the formality level of the received message unless a tone is specified; do not make casual replies formal
- Never invent facts, deadlines, or commitments not stated in the user's intention
- Keep it focused and brief; do not pad with "I hope this finds you well", "Please don't hesitate to reach out", or similar phrases unless the context is clearly formal
- Use contractions where they fit the register`,
        user: buildReplyUser(req),
      };

    case 'tone':
      return {
        system: `You are a tone transformation expert. Rewrite text in the requested tone while preserving its exact meaning.
Output ONLY the rewritten text. No explanations, no preamble. The very first word is the rewritten text itself.
Rules:
- The meaning must stay exactly the same; only tone, style, and register change
- Do not add or remove substantive information
- Render the tone authentically, not as a parody or AI stereotype of it
- Professional should sound like a competent human, not a corporate template
- Formal should be polished, not stiff or archaic
- Do not introduce unnecessary em dashes; use natural sentence structure for the target tone
- Adapt vocabulary, sentence rhythm, and register to match the tone precisely`,
        user: buildToneUser(req),
      };

    case 'simplify':
      return {
        system: `You are a plain-language expert who makes complex writing easy to understand.
Output ONLY the simplified text. No explanations, no preamble. Just the simplified text.
Rules:
- Preserve all essential meaning and information
- Use short sentences and common everyday words — not rare words that happen to be shorter
- Break up complex ideas into digestible pieces
- Keep technical terms only when necessary, and briefly clarify them inline
- The result should be immediately understandable to someone unfamiliar with the subject
- Do not open with "Simply put,", "In other words,", or similar transition phrases
- Prefer short, complete sentences; avoid em dashes`,
        user: buildSimplifyUser(req),
      };

    case 'shorten':
      return {
        system: `You are a concise writing expert who cuts unnecessary words without losing meaning.
Output ONLY the shortened text. No explanations, no preamble. Just the shortened text.
Rules:
- Every word must earn its place
- Preserve the key message and all essential information
- Remove filler, redundancy, hedging, and padding
- Never omit information that meaningfully changes the message
- Do not substitute removed words with em dashes — write clean, complete sentences
- The result must read as naturally as the original, just tighter`,
        user: buildShortenUser(req),
      };

    case 'grammar':
      return {
        system: `You are a careful grammar editor who fixes errors while preserving the writer's voice.
Output ONLY the corrected text. No explanations, no preamble, no list of corrections. Just the corrected text.
Rules:
- Fix spelling, grammar, and punctuation errors only — do not change what is not wrong
- Do not replace informal vocabulary with formal synonyms; fix errors, not style
- Do not expand contractions (don't → do not) or create them (I am → I'm) unless genuinely incorrect
- Do not restructure sentences unless the structure itself is grammatically broken
- The corrected text should still sound like the same person wrote it`,
        user: `Fix the grammar, spelling, and punctuation in this text:\n\n${req.text}`,
      };

    default:
      return { system: '', user: req.text };
  }
}

function buildImproveUser(req: GenerateRequest): string {
  let prompt = 'Improve this text';
  if (req.tone) prompt += ` with a ${req.tone} tone`;
  prompt += `:\n\n${req.text}`;
  return prompt;
}

function buildReplyUser(req: GenerateRequest): string {
  let prompt = `I received this message:\n"${req.replyTo}"\n\n`;
  prompt += `I want to reply expressing: ${req.intention}`;
  if (req.recipient) prompt += `\nContext about recipient: ${req.recipient}`;
  if (req.tone) prompt += `\nRequested tone: ${req.tone}`;
  return prompt;
}

function buildToneUser(req: GenerateRequest): string {
  return `Rewrite this text with a ${req.tone || 'neutral'} tone:\n\n${req.text}`;
}

function buildSimplifyUser(req: GenerateRequest): string {
  const levelMap: Record<SimplifyLevel, string> = {
    simple: 'simple, clear English',
    'very-simple': 'very simple English that anyone can understand',
    everyday: 'everyday, conversational language',
  };
  const level = levelMap[req.simplifyLevel || 'simple'];
  return `Simplify this text into ${level}:\n\n${req.text}`;
}

function buildShortenUser(req: GenerateRequest): string {
  const lengthMap: Record<string, string> = {
    'slightly-shorter': 'slightly shorter — remove unnecessary words while keeping the flow',
    'much-shorter': 'much shorter — cut it significantly, keep only the essentials',
    'one-sentence': 'one clear, complete sentence',
    'very-concise': 'as concise as possible while keeping all key information',
  };
  const instruction = lengthMap[req.length || 'slightly-shorter'];
  return `Make this text ${instruction}:\n\n${req.text}`;
}
