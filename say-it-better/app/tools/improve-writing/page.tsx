import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Writing Improver — Polish Any Text Instantly',
  description:
    'Paste your text and get a cleaner, clearer version in seconds. Preserves your voice and meaning. Free, no signup.',
  alternates: { canonical: '/tools/improve-writing' },
};

export default function ImproveWritingPage() {
  return (
    <>
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">AI Writing Improver</h1>
          <p className="tool-sub">
            Paste any text and get a polished version that says exactly what you mean — more
            clearly, more naturally, and without losing your voice.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="improve" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>What the writing improver does</h2>
            <p>
              The writing improver reads your text and returns a version that flows better,
              uses clearer word choices, and removes awkward phrasing — while keeping your
              intended meaning intact. It does not add information, invent commitments, or
              change your voice dramatically. The goal is to say what you already meant, better.
            </p>
            <p>
              Unlike a grammar checker, which only flags errors, the writing improver also
              catches weak sentences, vague language, padding, and phrasing that sounds
              unnatural. It works on everything from a single sentence to several paragraphs.
            </p>

            <h2>When to use it</h2>
            <ul>
              <li>
                <strong>Work emails</strong> — a rushed email to a client or manager that
                could read more professionally
              </li>
              <li>
                <strong>Cover letters</strong> — making a job application letter sound
                confident and clear rather than tentative
              </li>
              <li>
                <strong>LinkedIn posts</strong> — tightening a professional update so it
                lands with impact rather than trailing off
              </li>
              <li>
                <strong>Customer messages</strong> — making a support reply or complaint
                response sound composed and helpful
              </li>
              <li>
                <strong>Reports and proposals</strong> — cleaning up a first draft before
                sending it to a stakeholder
              </li>
              <li>
                <strong>Non-native English writing</strong> — smoothing out a message written
                in a second language so it reads naturally to a native speaker
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Original</span>
                <p>
                  &ldquo;I wanted to follow up regarding the thing we talked about last week and
                  see if maybe there was any update on that situation at all.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Improved</span>
                <p>
                  &ldquo;I wanted to follow up on our conversation from last week. Do you have
                  any updates?&rdquo;
                </p>
              </div>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>Will it change what I mean?</h3>
                <p>
                  No. The improver is designed to preserve your intended meaning. If you want
                  the tone to change, use the{' '}
                  <Link href="/tools/change-tone">Tone Changer</Link> instead.
                </p>
              </div>
              <div className="faq-item">
                <h3>How long can my text be?</h3>
                <p>Up to 4,000 characters per request — roughly 600–700 words.</p>
              </div>
              <div className="faq-item">
                <h3>Can I edit the result?</h3>
                <p>
                  Yes. The result panel is fully editable. Click into it and make changes
                  before copying.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/fix-grammar">Fix Grammar</Link>
              <Link href="/tools/change-tone">Change Tone</Link>
              <Link href="/tools/shorten-text">Shorten Text</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
