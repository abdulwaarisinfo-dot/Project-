'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mode, Tone, Length, SimplifyLevel, TONES, MODES, GenerateRequest } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface WorkspaceProps {
  initialMode?: Mode;
}

export default function Workspace({ initialMode = 'improve' }: WorkspaceProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [intention, setIntention] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState<Tone | ''>('');
  const [length, setLength] = useState<Length | ''>('');
  const [simplifyLevel, setSimplifyLevel] = useState<SimplifyLevel>('simple');
  const [result, setResult] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [privacyDismissed, setPrivacyDismissed] = useState(() => {
    try { return localStorage.getItem('sib_privacy_ok') === '1'; } catch { return false; }
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMode = MODES.find((m) => m.value === mode)!;

  // Close dropdown on outside click
  useEffect(() => {
    if (!showToneDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowToneDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showToneDropdown]);

  const generate = useCallback(async () => {
    const primaryText = mode === 'reply' ? replyTo : text;
    if (!primaryText.trim()) return;

    setLoading(true);
    setError('');
    trackEvent('generation_requested', { mode, tone: tone || undefined });

    const reqBody: GenerateRequest = {
      mode,
      text: mode !== 'reply' ? text : '',
      replyTo: mode === 'reply' ? replyTo : undefined,
      intention: mode === 'reply' ? intention : undefined,
      recipient: mode === 'reply' && recipient ? recipient : undefined,
      tone: tone || undefined,
      length: length || undefined,
      simplifyLevel: mode === 'simplify' ? simplifyLevel : undefined,
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const isQuota = res.status === 503;
        setError(data.error || 'Something went wrong. Please try again.');
        trackEvent(isQuota ? 'quota_exhausted' : 'generation_failed', { mode, error_type: String(res.status) });
      } else {
        setResult(data.result);
        setIsDemo(!!data.demo);
        trackEvent('generation_completed', { mode });
      }
    } catch {
      setError('Connection error. Please check your internet and try again.');
      trackEvent('generation_failed', { mode, error_type: 'network' });
    } finally {
      setLoading(false);
    }
  }, [mode, text, replyTo, intention, recipient, tone, length, simplifyLevel]);

  const quickAction = useCallback(
    async (quickMode: Mode, quickTone?: Tone) => {
      if (!result) return;

      const reqBody: GenerateRequest = {
        mode: quickMode,
        text: result,
        tone: quickTone || undefined,
      };

      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || 'Something went wrong.');
        } else {
          setResult(data.result);
          setIsDemo(!!data.demo);
        }
      } catch {
        setError('Connection error.');
      } finally {
        setLoading(false);
      }
    },
    [result]
  );

  const copyToClipboard = async () => {
    trackEvent('copy_clicked', { mode });
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.getElementById('result-text');
      if (el) {
        const range = document.createRange();
        range.selectNode(el);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
    }
  };

  const reset = () => {
    setText('');
    setReplyTo('');
    setIntention('');
    setRecipient('');
    setResult('');
    setError('');
    setTone('');
    setLength('');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setResult('');
    setError('');
    trackEvent('mode_selected', { mode: newMode });
  };

  const primaryText = mode === 'reply' ? replyTo : text;
  const canGenerate = primaryText.trim().length > 0 && !loading;
  const toneRequired = mode === 'tone';

  const dismissPrivacy = () => {
    setPrivacyDismissed(true);
    try { localStorage.setItem('sib_privacy_ok', '1'); } catch { /* ignore */ }
  };

  return (
    <div className="workspace" role="main">
      {/* Privacy notice */}
      {!privacyDismissed && (
        <div className="privacy-notice" role="note">
          <span>
            Text you submit is sent to{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              Cloudflare&apos;s AI API
            </a>{' '}
            for processing. Cloudflare does not train models on your text.{' '}
            <a href="/privacy">Privacy policy</a>
          </span>
          <button className="privacy-dismiss" onClick={dismissPrivacy} aria-label="Dismiss privacy notice">
            Got it
          </button>
        </div>
      )}

      {/* Mode selector */}
      <div className="mode-bar">
        <div className="mode-chips" role="tablist" aria-label="Writing modes">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => switchMode(m.value)}
              className={`mode-chip${mode === m.value ? ' active' : ''}`}
              role="tab"
              aria-selected={mode === m.value}
              title={m.description}
            >
              {m.label}
              {mode === m.value && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="chip-x"
                  role="button"
                  aria-label="Clear and reset"
                >
                  ×
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="input-panel">
        {mode === 'reply' ? (
          <>
            <textarea
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="Paste the message you received..."
              className="textarea"
              rows={4}
              aria-label="Message you received"
            />
            <div className="divider-line" />
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What do you want to say in your reply?"
              className="textarea"
              rows={3}
              aria-label="Your intention for the reply"
            />
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Who are you replying to? (optional — e.g. my manager, a client)"
              className="text-input"
              aria-label="Recipient context"
            />
          </>
        ) : (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={getPlaceholder(mode)}
            className="textarea main-textarea"
            rows={6}
            maxLength={5000}
            aria-label="Your text"
          />
        )}

        {/* Options row */}
        <div className="options-row">
          {(mode === 'improve' || mode === 'reply' || mode === 'grammar') && (
            <div className="select-wrapper">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="select"
                aria-label="Tone (optional)"
              >
                <option value="">Tone (optional)</option>
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'tone' && (
            <div className="select-wrapper">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="select"
                aria-label="Select tone"
                required
              >
                <option value="">Select a tone...</option>
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'simplify' && (
            <div className="select-wrapper">
              <select
                value={simplifyLevel}
                onChange={(e) => setSimplifyLevel(e.target.value as SimplifyLevel)}
                className="select"
                aria-label="Simplification level"
              >
                <option value="simple">Simple English</option>
                <option value="very-simple">Very Simple</option>
                <option value="everyday">Everyday Language</option>
              </select>
            </div>
          )}

          {mode === 'shorten' && (
            <div className="select-wrapper">
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as Length)}
                className="select"
                aria-label="Length option"
              >
                <option value="slightly-shorter">Slightly Shorter</option>
                <option value="much-shorter">Much Shorter</option>
                <option value="one-sentence">One Sentence</option>
                <option value="very-concise">Very Concise</option>
              </select>
            </div>
          )}

          <button
            onClick={generate}
            disabled={!canGenerate || (toneRequired && !tone)}
            className="generate-btn"
            aria-label={`Run ${currentMode.label}`}
          >
            {loading ? (
              <span className="loading-dots" aria-label="Processing">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              currentMode.label
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={() => setError('')} className="error-dismiss" aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {/* Loading (first generation) */}
      {loading && !result && (
        <div className="loading-panel" aria-live="polite" aria-label="Generating result">
          <div className="loading-spinner" />
          <p>Working on it...</p>
        </div>
      )}

      {/* Loading (regeneration) */}
      {loading && result && (
        <div className="loading-result-panel" aria-live="polite">
          <div className="loading-spinner" />
          <span>Rewriting...</span>
        </div>
      )}

      {/* Result area */}
      {result && !loading && (
        <div className="result-panel">
          <div className="result-header">
            <span className="result-label">Result</span>
            {isDemo && (
              <span className="demo-badge" title="No API key set — this is a placeholder response, not real AI output">
                Demo mode
              </span>
            )}
          </div>

          <div
            id="result-text"
            className="result-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setResult(e.currentTarget.textContent || '')}
            aria-label="Generated result (editable)"
            role="textbox"
            aria-multiline="true"
          >
            {result}
          </div>

          {/* Action buttons */}
          <div className="action-row">
            <div className="quick-actions">
              {/* Change Tone dropdown */}
              <div className="dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="action-btn"
                  onClick={() => setShowToneDropdown(!showToneDropdown)}
                  aria-haspopup="listbox"
                  aria-expanded={showToneDropdown}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                  Change Tone
                </button>
                {showToneDropdown && (
                  <div className="dropdown-menu" role="listbox">
                    {TONES.slice(0, 7).map((t) => (
                      <button
                        key={t.value}
                        className="dropdown-item"
                        role="option"
                        aria-selected={false}
                        onClick={() => {
                          quickAction('tone', t.value);
                          setShowToneDropdown(false);
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="action-btn" onClick={() => quickAction('simplify')}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Simplify
              </button>

              <button className="action-btn" onClick={() => quickAction('shorten')}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="21" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="8" y1="18" x2="3" y2="18" />
                </svg>
                Shorten
              </button>
            </div>

            <div className="copy-actions">
              <button className="secondary-btn" onClick={generate} aria-label="Regenerate result">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
                Regenerate
              </button>

              <button
                className={`copy-btn${copied ? ' copied' : ''}`}
                onClick={copyToClipboard}
                aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
              >
                {copied ? (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getPlaceholder(mode: Mode): string {
  const map: Record<Mode, string> = {
    improve: 'Paste or type your text here...',
    reply: 'Paste the message you received...',
    tone: 'Enter the text you want to change the tone of...',
    simplify: 'Paste complex text to simplify...',
    shorten: 'Paste the text you want to shorten...',
    grammar: 'Paste your text to fix grammar and spelling...',
  };
  return map[mode];
}
