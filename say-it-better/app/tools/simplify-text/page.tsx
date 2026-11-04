import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'AI Text Simplifier — Make Complex Writing Easy to Understand',
  description:
    'Paste complicated text and get a clear, plain-language version anyone can understand. Free AI text simplifier, no signup required.',
  alternates: { canonical: '/tools/simplify-text' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between the three simplification levels?',
      acceptedAnswer: { '@type': 'Answer', text: 'Simple English removes jargon and shortens sentences but keeps technical terms where they are necessary. Very simple avoids all technical vocabulary and explains concepts from scratch. Everyday language produces a conversational version, as if explaining it in a chat.' },
    },
    {
      '@type': 'Question',
      name: 'Does it keep all the original information?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — the goal is to preserve all essential meaning. If the original contains multiple technical ideas, all of them will appear in the simplified version.' },
    },
    {
      '@type': 'Question',
      name: 'Can I simplify a long document?',
      acceptedAnswer: { '@type': 'Answer', text: 'Up to 4,000 characters per request. For longer texts, process it in sections.' },
    },
  ],
};

export default function SimplifyTextPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">AI Text Simplifier</h1>
          <p className="tool-sub">
            Paste any complicated, technical, or jargon-heavy text and get a clear, plain
            version that anyone can understand — without losing the essential meaning.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="simplify" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>What simplification does</h2>
            <p>
              Text simplification replaces complex vocabulary with plain words, breaks long
              sentences into shorter ones, unpacks jargon, and reorganises ideas so they flow
              from simple to complex rather than the reverse. The goal is that someone
              encountering the topic for the first time can understand it on first read.
            </p>
            <p>
              Unlike shortening, simplification does not necessarily reduce the word count. It
              may actually use more words to explain something that was compressed into
              technical language. What it removes is complexity, not content.
            </p>

            <h2>When to use it</h2>
            <ul>
              <li>
                <strong>Legal or contractual language</strong> — making a clause or agreement
                understandable before signing
              </li>
              <li>
                <strong>Medical information</strong> — translating a doctor&rsquo;s letter or
                diagnosis report into language a patient can understand
              </li>
              <li>
                <strong>Technical documentation</strong> — making a manual, API guide, or
                specification accessible to a non-technical audience
              </li>
              <li>
                <strong>Academic writing</strong> — taking a passage from a paper or thesis
                and making it readable for a general audience
              </li>
              <li>
                <strong>Writing for non-native speakers</strong> — ensuring a message written
                for an international audience is easy to follow
              </li>
              <li>
                <strong>Explaining something to a child or teenager</strong> — use the
                &ldquo;very simple&rdquo; option for maximum clarity
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Original</span>
                <p>
                  &ldquo;The implementation of the aforementioned methodology necessitates a
                  comprehensive review of the existing procedural framework to ensure
                  regulatory compliance.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Simplified</span>
                <p>
                  &ldquo;Before using this approach, we need to review the current process to
                  make sure it follows the rules.&rdquo;
                </p>
              </div>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>What is the difference between the three simplification levels?</h3>
                <p>
                  <strong>Simple English</strong> removes jargon and shortens sentences but
                  keeps technical terms where they are necessary.{' '}
                  <strong>Very simple</strong> avoids all technical vocabulary and explains
                  concepts from scratch. <strong>Everyday language</strong> produces a
                  conversational version, as if explaining it in a chat.
                </p>
              </div>
              <div className="faq-item">
                <h3>Does it keep all the original information?</h3>
                <p>
                  Yes — the goal is to preserve all essential meaning. If the original
                  contains multiple technical ideas, all of them will appear in the simplified
                  version.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I simplify a long document?</h3>
                <p>
                  Up to 4,000 characters per request. For longer texts, process it in
                  sections.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/shorten-text">Shorten Text</Link>
              <Link href="/tools/fix-grammar">Fix Grammar</Link>
              <Link href="/tools/improve-writing">Improve Writing</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
