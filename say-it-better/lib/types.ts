export type Mode = 'improve' | 'reply' | 'tone' | 'simplify' | 'shorten' | 'grammar';

export type Tone =
  | 'neutral'
  | 'casual'
  | 'formal'
  | 'professional'
  | 'friendly'
  | 'confident'
  | 'polite'
  | 'firm'
  | 'empathetic'
  | 'persuasive'
  | 'direct'
  | 'romantic'
  | 'straightforward'
  | 'urgent';

export type Length = 'slightly-shorter' | 'much-shorter' | 'one-sentence' | 'very-concise' | 'slightly-longer' | 'original';

export type SimplifyLevel = 'simple' | 'very-simple' | 'everyday';

export interface GenerateRequest {
  mode: Mode;
  text: string;
  replyTo?: string;
  intention?: string;
  recipient?: string;
  tone?: Tone;
  length?: Length;
  simplifyLevel?: SimplifyLevel;
  language?: string;
}

export interface GenerateResponse {
  result: string;
  alternatives?: string[];
  error?: string;
}

export const TONES: { value: Tone; label: string }[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'confident', label: 'Confident' },
  { value: 'polite', label: 'Polite' },
  { value: 'firm', label: 'Firm' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'direct', label: 'Direct' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'straightforward', label: 'Straightforward' },
  { value: 'urgent', label: 'Urgent' },
];

export const MODES: { value: Mode; label: string; description: string; icon: string }[] = [
  { value: 'improve', label: 'Improve Writing', description: 'Polish your text while preserving your meaning', icon: '✦' },
  { value: 'reply', label: 'Reply', description: 'Generate a response to any message', icon: '↩' },
  { value: 'tone', label: 'Change Tone', description: 'Express the same idea differently', icon: '≋' },
  { value: 'simplify', label: 'Simplify', description: 'Make your writing easier to understand', icon: '✧' },
  { value: 'shorten', label: 'Shorten', description: 'Say more with fewer words', icon: '⊟' },
  { value: 'grammar', label: 'Fix Grammar', description: 'Correct spelling, grammar and punctuation', icon: '∿' },
];
