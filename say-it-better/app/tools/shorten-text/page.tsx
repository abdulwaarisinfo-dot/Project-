import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'AI Text Shortener — Make Your Writing More Concise',
  description:
    'Remove padding and filler from any text without losing the meaning. Free AI text shortener — paste and shorten in seconds.',
  alternates: { canonical: '/tools/shorten-text' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Will it remove important information?',
      acceptedAnswer: { '@type': 'Answer', text: 'The shortener is designed to keep all information that changes the meaning. If you choose much shorter or one sentence, some detail will be dropped — check the result before using it.' },
    },
    {
      '@type': 'Question',
      name: 'What is the one sentence option for?',
      acceptedAnswer: { '@type': 'Answer', text: 'It distils a paragraph or more down to its single most important point. Use it for subject lines, headings, executive summaries, or social media previews.' },
    },
    {
      '@type': 'Question',
      name: 'Can I shorten a result I already generated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Use the Shorten button under any result to make it more concise without going back to the input.' },
    },
  ],
};

export default function ShortenTextPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">AI Text Shortener</h1>
          <p className="tool-sub">
            Remove the filler, cut the repetition, and say the same thing in fewer words —
            without losing any of the meaning that matters.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="shorten" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>Why shorter is usually better</h2>
            <p>
              Most first drafts are longer than they need to be. We add hedging phrases,
              repeat points we already made, open with unnecessary context, and pad sentences
              with words that do no work. The text shortener identifies and removes these
              without touching the information that actually matters.
            </p>
            <p>
              You can choose how aggressively to shorten. &ldquo;Slightly shorter&rdquo;
              removes obvious filler. &ldquo;Much shorter&rdquo; cuts significantly.
              &ldquo;One sentence&rdquo; distils the whole thing to its core point.
            </p>

            <h2>What gets removed</h2>
            <ul>
              <li>
                <strong>Filler phrases</strong> — &ldquo;I just wanted to reach out and let
                you know that&rdquo;, &ldquo;As you may already be aware&rdquo;
              </li>
              <li>
                <strong>Repeated points</strong> — saying the same thing twice in slightly
                different words
              </li>
              <li>
                <strong>Weak hedges</strong> — &ldquo;kind of&rdquo;, &ldquo;sort of&rdquo;,
                &ldquo;in some ways&rdquo;, &ldquo;perhaps&rdquo; when certainty is
                appropriate
              </li>
              <li>
                <strong>Unnecessary preamble</strong> — context the reader does not need
                before you get to the point
              </li>
              <li>
                <strong>Redundant qualifiers</strong> — &ldquo;completely finished&rdquo;,
                &ldquo;past history&rdquo;, &ldquo;currently ongoing&rdquo;
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Original (35 words)</span>
                <p>
                  &ldquo;I just wanted to quickly reach out and let you know that I have now
                  had the opportunity to review the document that you sent over to me
                  yesterday.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Shortened (12 words)</span>
                <p>&ldquo;I&rsquo;ve reviewed the document you sent yesterday.&rdquo;</p>
              </div>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>Will it remove important information?</h3>
                <p>
                  The shortener is designed to keep all information that changes the meaning.
                  If you choose &ldquo;much shorter&rdquo; or &ldquo;one sentence&rdquo;,
                  some detail will be dropped — check the result before using it.
                </p>
              </div>
              <div className="faq-item">
                <h3>What is the &ldquo;one sentence&rdquo; option for?</h3>
                <p>
                  It distils a paragraph or more down to its single most important point. Use
                  it for subject lines, headings, executive summaries, or social media
                  previews.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I shorten a result I already generated?</h3>
                <p>
                  Yes. Use the Shorten button under any result to make it more concise
                  without going back to the input.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/simplify-text">Simplify Text</Link>
              <Link href="/tools/improve-writing">Improve Writing</Link>
              <Link href="/tools/change-tone">Change Tone</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
