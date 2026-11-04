import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Formal vs Professional vs Casual Email Tone — What Is the Difference?',
  description:
    '"Formal" and "professional" are not the same register. Using the wrong one is a common email mistake. Here is how to tell them apart and when to use each.',
  alternates: { canonical: '/blog/formal-vs-professional-vs-casual-email-tone' },
  openGraph: {
    title: 'Formal vs Professional vs Casual Email Tone — What Is the Difference?',
    description:
      '"Formal" and "professional" are not the same register. Using the wrong one is a common email mistake. Here is how to tell them apart and when to use each.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Writora — AI Writing Assistant' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formal vs Professional vs Casual Email Tone — What Is the Difference?',
    description:
      '"Formal" and "professional" are not the same register. Using the wrong one is a common email mistake. Here is how to tell them apart and when to use each.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Formal vs Professional vs Casual Email Tone — What Is the Difference?',
  description:
    '"Formal" and "professional" are not the same register. Using the wrong one is a common email mistake. Here is how to tell them apart and when to use each.',
  datePublished: '2026-11-04',
  dateModified: '2026-11-04',
  author: { '@type': 'Organization', name: 'Writora', url: 'https://writora.live' },
  publisher: { '@type': 'Organization', name: 'Writora', url: 'https://writora.live' },
};

export default function ArticlePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main>
        <div className="article-layout">
          <div className="article-hero">
            <Link href="/blog" className="article-back-link">← All guides</Link>
            <p className="article-eyebrow">Writing Guide</p>
            <h1>Formal vs Professional vs Casual Email Tone</h1>
            <p className="article-meta">November 2026</p>
            <p className="article-intro">
              &ldquo;Formal&rdquo; and &ldquo;professional&rdquo; are not the same thing.
              Neither is &ldquo;casual&rdquo; always informal. These three registers are
              often used interchangeably, but they describe distinct writing styles — each
              appropriate in different situations and wrong in others. Getting the register
              right is one of the most practical things you can do to improve how you come
              across in writing.
            </p>
          </div>

          <div className="article-body">
            <h2>Formal</h2>
            <p>
              Formal writing follows strict conventions: full names and titles, complete
              sentences, no contractions, restrained vocabulary, and a fixed structure. It is
              appropriate for:
            </p>
            <ul>
              <li>Legal and official documents</li>
              <li>First contact with a government body or institution</li>
              <li>Correspondence where you do not know the recipient and the stakes are high</li>
            </ul>
            <div className="article-example article-example--after" style={{ margin: '16px 0' }}>
              <span className="article-example-label">Formal — same invoice query</span>
              <p>
                &ldquo;Dear Mr Harrington, I am writing to enquire about the status of invoice
                number 1024, dated 10 October 2026, which remains outstanding. I would be
                grateful if you could advise on the expected settlement date at your earliest
                convenience. Yours sincerely, ...&rdquo;
              </p>
            </div>
            <p>
              The problem with formal writing: in most workplace contexts it comes across as
              cold and unnecessarily distant. Using it with colleagues or clients you know
              creates friction rather than professionalism.
            </p>

            <h2>Professional</h2>
            <p>
              Professional writing is clear, respectful, and competent — without the
              structural rigidity of formal writing. It uses plain language, contractions
              where appropriate, and a tone that is warm but not casual. This is the right
              register for:
            </p>
            <ul>
              <li>Most business correspondence</li>
              <li>Client emails, especially earlier in a relationship</li>
              <li>Internal communication across hierarchies (upward, downward, sideways)</li>
            </ul>
            <div className="article-example article-example--after" style={{ margin: '16px 0' }}>
              <span className="article-example-label">Professional — same invoice query</span>
              <p>
                &ldquo;Hi James, I wanted to follow up on invoice #1024, which was due last
                week. Could you let me know when payment is likely to come through? Happy to
                answer any questions if something is holding it up. Thanks, ...&rdquo;
              </p>
            </div>
            <p>
              Professional writing reads like a competent, considerate person wrote it — not
              a corporate template. It moves things forward without creating unnecessary
              distance.
            </p>

            <h2>Casual</h2>
            <p>
              Casual writing uses informal vocabulary, shorter sentences, and a tone closer
              to spoken conversation. It works well for:
            </p>
            <ul>
              <li>Established relationships with close colleagues</li>
              <li>Internal team communication where formality would feel odd</li>
              <li>Quick back-and-forth exchanges where you already share context</li>
            </ul>
            <div className="article-example article-example--after" style={{ margin: '16px 0' }}>
              <span className="article-example-label">Casual — same invoice query</span>
              <p>
                &ldquo;Hey James, quick check — has invoice #1024 landed on your end? It
                was due last week. Let me know if anything is stuck. Cheers, ...&rdquo;
              </p>
            </div>
            <p>
              In the right context, casual writing is efficient and human. In the wrong
              context — a client escalation, a first contact, a complaint — it can undermine
              your credibility or come across as dismissive.
            </p>

            <h2>The most common mistakes</h2>

            <h3>Using formal where professional is better</h3>
            <p>
              Many people default to formal when they are uncertain, which is the wrong
              default. Formal language in everyday professional contexts reads as cold and
              difficult to engage with. &ldquo;I am writing to request your assistance in
              this matter&rdquo; is not more professional than &ldquo;Could you help with
              this?&rdquo; — it is just harder to read and reply to.
            </p>

            <h3>Using casual where professional is expected</h3>
            <p>
              This tends to happen in internal communication — people who are relaxed about
              how they write to close colleagues can carry that tone into contexts where it
              does not belong: a complaint, a disciplinary matter, an email to a senior
              person who does not know them well. Casual writing in those contexts reads as
              careless.
            </p>

            <h3>Using formal language as a substitute for being direct</h3>
            <p>
              Some people reach for formal language when delivering bad news or difficult
              feedback, hoping the register will soften the message. It usually does not. A
              polished formal email delivering a rejection is not easier to receive than a
              clear, direct professional one. It is just harder to read.
            </p>

            <h2>How to pick the right register</h2>
            <p>
              Ask yourself: if you were speaking to this person, how would you open the
              conversation? If you would use their first name and speak at a normal pace,
              write professionally. If you would be more careful and structured — first
              contact with an institution, a legal matter — write more formally. If you would
              be chatting over coffee, writing casually is fine.
            </p>
            <p>
              The other factor is the relationship history. The first email to someone you
              have never met should lean professional or formal depending on context. By the
              tenth email, you have enough of a signal to adjust.
            </p>

            <div className="article-tool-cta">
              <p className="article-tool-cta-label">Try it</p>
              <h2>Change the tone of any text</h2>
              <p>
                Paste your draft, pick a tone — Formal, Professional, Casual, Friendly, and
                more — and get a rewritten version that matches the register you need.
              </p>
            </div>
          </div>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="tone" />
          </div>
        </section>

        <div className="article-layout">
          <div className="article-footer">
            <p className="article-footer-heading">Related reading</p>
            <div className="article-related">
              <Link href="/blog/how-to-reply-to-a-rude-email-professionally" className="article-related-link">
                How to Reply to a Rude Email Professionally
              </Link>
              <Link href="/blog/how-to-shorten-a-long-email" className="article-related-link">
                How to Shorten a Long Email Without Losing the Point
              </Link>
              <Link href="/tools/change-tone" className="article-related-link">
                Tool: Change Tone →
              </Link>
              <Link href="/tools/improve-writing" className="article-related-link">
                Tool: Improve Writing →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
