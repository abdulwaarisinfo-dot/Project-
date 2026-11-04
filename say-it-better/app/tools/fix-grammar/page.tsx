import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'AI Grammar Fixer — Correct Grammar, Spelling and Punctuation',
  description:
    'Paste your text and get all grammar, spelling, and punctuation errors corrected instantly. Preserves your writing style. Free, no signup.',
  alternates: { canonical: '/tools/fix-grammar' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Will it rewrite my text entirely?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. The grammar fixer only corrects errors. It preserves your sentence structure and style. If you want a full rewrite, use Improve Writing.' },
    },
    {
      '@type': 'Question',
      name: 'Does it support British and American English?',
      acceptedAnswer: { '@type': 'Answer', text: 'The AI corrects based on standard usage and will match the variety present in your text. If you are writing British English, it will not change “colour” to “color”.' },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum text length?',
      acceptedAnswer: { '@type': 'Answer', text: 'Up to 4,000 characters per request.' },
    },
  ],
};

export default function FixGrammarPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">AI Grammar Fixer</h1>
          <p className="tool-sub">
            Paste your text and get every grammar, spelling, and punctuation error corrected —
            while keeping your original writing style and voice intact.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="grammar" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>What it corrects</h2>
            <p>
              The grammar fixer corrects spelling mistakes, grammatical errors, incorrect
              punctuation, misused words (their/there/they&rsquo;re, its/it&rsquo;s), missing
              apostrophes, double negatives, subject-verb agreement errors, and sentence
              fragments. It works on text at any length, from a single sentence to several
              paragraphs.
            </p>
            <p>
              Unlike a full rewrite, the grammar fixer only touches what is actually wrong. If
              your sentence structure is correct but your phrasing is awkward, it leaves that
              alone — use the{' '}
              <Link href="/tools/improve-writing">Writing Improver</Link> for that.
            </p>

            <h2>When to use it</h2>
            <ul>
              <li>
                <strong>Before sending a professional email</strong> — a quick check to catch
                typos and grammar slips that could undermine your credibility
              </li>
              <li>
                <strong>Non-native English writing</strong> — checking text written in
                English as a second or third language before sending it to a native speaker
              </li>
              <li>
                <strong>Social media posts</strong> — catching errors before they go live and
                cannot easily be edited
              </li>
              <li>
                <strong>Documents and reports</strong> — a final pass before sharing a draft
                with colleagues or submitting it
              </li>
              <li>
                <strong>Messages typed quickly</strong> — autocorrect misses and typos from
                fast typing on a phone
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Original</span>
                <p>
                  &ldquo;Their going to the store, but they dont have no money for buying
                  anything.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Corrected</span>
                <p>
                  &ldquo;They&rsquo;re going to the store, but they don&rsquo;t have any money
                  to buy anything.&rdquo;
                </p>
              </div>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>Will it rewrite my text entirely?</h3>
                <p>
                  No. The grammar fixer only corrects errors. It preserves your sentence
                  structure and style. If you want a full rewrite, use{' '}
                  <Link href="/tools/improve-writing">Improve Writing</Link>.
                </p>
              </div>
              <div className="faq-item">
                <h3>Does it support British and American English?</h3>
                <p>
                  The AI corrects based on standard usage and will match the variety present
                  in your text. If you are writing British English, it will not change
                  &ldquo;colour&rdquo; to &ldquo;color&rdquo;.
                </p>
              </div>
              <div className="faq-item">
                <h3>What is the maximum text length?</h3>
                <p>Up to 4,000 characters per request.</p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/improve-writing">Improve Writing</Link>
              <Link href="/tools/change-tone">Change Tone</Link>
              <Link href="/tools/simplify-text">Simplify Text</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
