import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How to Politely Decline a Meeting Request',
  description:
    'A clear, polite decline protects your time and sets a useful expectation. Here are examples and guidance for saying no to meetings — in any context.',
  alternates: { canonical: '/blog/how-to-politely-decline-a-meeting-request' },
  openGraph: {
    title: 'How to Politely Decline a Meeting Request',
    description:
      'A clear, polite decline protects your time and sets a useful expectation. Here are examples and guidance for saying no to meetings — in any context.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Writora — AI Writing Assistant' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Politely Decline a Meeting Request',
    description:
      'A clear, polite decline protects your time and sets a useful expectation. Here are examples and guidance for saying no to meetings — in any context.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Politely Decline a Meeting Request',
  description:
    'A clear, polite decline protects your time and sets a useful expectation. Here are examples and guidance for saying no to meetings — in any context.',
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
            <h1>How to Politely Decline a Meeting Request</h1>
            <p className="article-meta">November 2026</p>
            <p className="article-intro">
              Most of us accept meetings we should not. The cost of one wasted hour is obvious;
              what is less obvious is that saying yes also signals your time is available on
              demand. A clear, direct decline protects your time and sets a useful precedent
              — and it does not have to be rude.
            </p>
          </div>

          <div className="article-body">
            <h2>Why people struggle to say no</h2>
            <p>
              Meeting requests come packaged with implicit social pressure. Saying yes is easy;
              it feels collaborative. Saying no can feel like a rejection of the person, not
              just the event. Add a power imbalance — a request from your manager or a client
              — and the default becomes yes almost every time.
            </p>
            <p>
              The result is calendars full of meetings that could have been an email or nothing
              at all. A polite, direct decline is not rude. It is a professional skill.
            </p>

            <h2>What a good decline looks like</h2>
            <p>A well-written meeting decline does three things:</p>
            <ul>
              <li>It is <strong>direct</strong> — the person knows you are not attending</li>
              <li>It is <strong>brief</strong> — you do not owe a 200-word apology</li>
              <li>
                It offers a <strong>path forward</strong> if one is appropriate and genuine
              </li>
            </ul>
            <p>
              Offering an alternative is optional. If you are genuinely unable to contribute
              and have nothing to add, a clean no is better than a half-hearted offer you will
              not follow through on. If you do want to stay involved, suggest something
              specific — &ldquo;Would it work to share your questions over email?&rdquo; is
              more useful than a vague &ldquo;Let&rsquo;s find another time.&rdquo;
            </p>

            <h2>Decline examples for different situations</h2>

            <h3>A meeting where your attendance is not needed</h3>
            <div className="article-example-pair">
              <div className="article-example article-example--before">
                <span className="article-example-label">The invite</span>
                <p>&ldquo;Hi, would you be able to join our Q4 planning sync on Thursday?&rdquo;</p>
              </div>
              <div className="article-example article-example--after">
                <span className="article-example-label">Your decline</span>
                <p>
                  &ldquo;Thanks for the invite. I&rsquo;ll sit this one out — my input
                  isn&rsquo;t needed at this stage and I don&rsquo;t want to slow the
                  discussion down. Could you share the notes after? Happy to follow up async
                  if anything is relevant to me.&rdquo;
                </p>
              </div>
            </div>

            <h3>A vendor pitch you are not interested in</h3>
            <div className="article-example-pair">
              <div className="article-example article-example--before">
                <span className="article-example-label">The invite</span>
                <p>&ldquo;Would you have 30 minutes for a product demo this week?&rdquo;</p>
              </div>
              <div className="article-example article-example--after">
                <span className="article-example-label">Your decline</span>
                <p>
                  &ldquo;Thank you for reaching out. I don&rsquo;t have a need for this
                  right now, so I&rsquo;ll pass on a call. I&rsquo;ll keep you in mind if
                  that changes.&rdquo;
                </p>
              </div>
            </div>

            <h3>A recurring meeting that no longer serves you</h3>
            <div className="article-example article-example--after" style={{ marginBottom: '16px' }}>
              <span className="article-example-label">Your message</span>
              <p>
                &ldquo;I wanted to flag that this recurring sync has become less directly
                relevant to my current work. Would it be okay to remove myself for now? I
                can always rejoin if the scope changes — happy to discuss if that&rsquo;s
                useful.&rdquo;
              </p>
            </div>

            <h3>A request from your manager (when genuinely overcommitted)</h3>
            <div className="article-example article-example--after" style={{ marginBottom: '16px' }}>
              <span className="article-example-label">Your message</span>
              <p>
                &ldquo;I want to flag that I&rsquo;m committed to [X] and [Y] in that window.
                Could we look at which one makes more sense for me to attend — or is there
                something specific you need from me that I could address in a different
                format?&rdquo;
              </p>
            </div>

            <h2>What not to do</h2>
            <p>
              Avoid the &ldquo;just&rdquo; softener. &ldquo;I just can&rsquo;t make
              it&rdquo; reads as uncertain. If you cannot attend, say you cannot attend.
            </p>
            <p>
              Do not over-apologize. One &ldquo;unfortunately&rdquo; or &ldquo;sorry I
              can&rsquo;t join&rdquo; is appropriate; multiple apologies make a simple
              decline feel like a crisis.
            </p>
            <p>
              Do not promise a vague reschedule you have no intention of booking.
              &ldquo;Let&rsquo;s find another time!&rdquo; creates awkwardness when nothing
              gets scheduled. If you mean it, suggest a specific time. If you do not, leave
              it out.
            </p>

            <h2>Tone</h2>
            <p>
              Most meeting declines should be brief and professional. Formal language — &ldquo;I
              regret that I am unable to attend&rdquo; — is usually unnecessary and can come
              across as stiff between colleagues. A direct, polite tone works in almost every
              workplace context. For social invitations, a warmer tone is fine; for client
              requests, a professional one is safer.
            </p>

            <div className="article-tool-cta">
              <p className="article-tool-cta-label">Write your reply</p>
              <h2>Not sure how to word it?</h2>
              <p>
                Paste the meeting request below, describe what you want to say, and get a
                clear, well-worded decline in seconds. Adjust the tone to match the
                relationship.
              </p>
            </div>
          </div>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="reply" />
          </div>
        </section>

        <div className="article-layout">
          <div className="article-footer">
            <p className="article-footer-heading">Related reading</p>
            <div className="article-related">
              <Link href="/blog/how-to-reply-to-a-rude-email-professionally" className="article-related-link">
                How to Reply to a Rude Email Professionally
              </Link>
              <Link href="/blog/formal-vs-professional-vs-casual-email-tone" className="article-related-link">
                Formal vs Professional vs Casual Email Tone
              </Link>
              <Link href="/tools/polite-refusal" className="article-related-link">
                Tool: How to Say No Politely →
              </Link>
              <Link href="/tools/reply-generator" className="article-related-link">
                Tool: AI Reply Generator →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
