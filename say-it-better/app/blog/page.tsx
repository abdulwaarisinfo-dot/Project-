import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How to Shorten a Long Email Without Losing the Point',
  description:
    'Most professional emails are longer than they need to be. Here is a simple framework for cutting them down — without losing anything that matters.',
  alternates: { canonical: '/blog/how-to-shorten-a-long-email' },
  openGraph: {
    title: 'How to Shorten a Long Email Without Losing the Point',
    description:
      'Most professional emails are longer than they need to be. Here is a simple framework for cutting them down — without losing anything that matters.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Writora — AI Writing Assistant' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Shorten a Long Email Without Losing the Point',
    description:
      'Most professional emails are longer than they need to be. Here is a simple framework for cutting them down — without losing anything that matters.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Shorten a Long Email Without Losing the Point',
  description:
    'Most professional emails are longer than they need to be. Here is a simple framework for cutting them down — without losing anything that matters.',
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
            <h1>How to Shorten a Long Email Without Losing the Point</h1>
            <p className="article-meta">November 2026</p>
            <p className="article-intro">
              Most professional emails are too long. Not dramatically — people do not write
              essays — but long enough that the main point gets buried, the ask is unclear,
              and the recipient ends up scanning rather than reading. Shortening an email is
              not just about cutting words; it is about understanding what the email is
              actually for.
            </p>
          </div>

          <div className="article-body">
            <h2>Start with the ask</h2>
            <p>
              The most reliable way to shorten an email is to change the structure. Most long
              emails bury the main request at the end, after extensive context and explanation.
              The reader has to get through all of it before they know what you want from them.
            </p>
            <p>
              BLUF — Bottom Line Up Front — is a simple principle: lead with the ask or
              conclusion, then provide supporting context if needed. Applied to email:
            </p>
            <div className="article-example-pair">
              <div className="article-example article-example--before">
                <span className="article-example-label">Buried ask</span>
                <p>
                  &ldquo;As you may know, we have been reviewing the Q4 budget since last
                  month. After speaking with the finance team and reviewing the contractor
                  line items... I was wondering if you could approve the revised figures?&rdquo;
                </p>
              </div>
              <div className="article-example article-example--after">
                <span className="article-example-label">Ask first</span>
                <p>
                  &ldquo;Could you approve the revised Q4 budget by Thursday? I&rsquo;ve
                  adjusted the contractor line after speaking with finance — happy to walk
                  you through the changes if useful.&rdquo;
                </p>
              </div>
            </div>
            <p>
              Starting with the ask lets a busy reader reply immediately if they have all the
              context they need. It also forces you to be clear about what you actually want
              before you start writing.
            </p>

            <h2>What to cut</h2>

            <h3>Context that serves the writer, not the reader</h3>
            <p>
              &ldquo;As you may know, we have been working on this project since Q2, when we
              first identified the need to...&rdquo; — if the recipient does not need this
              context to answer your question, cut it. You may have included it to show your
              work, but the recipient just needs to know what you need and when.
            </p>

            <h3>Passive voice</h3>
            <p>
              Passive voice inflates word count and obscures responsibility. &ldquo;It has
              been decided that changes will be made to the reporting process&rdquo; is 14
              words. &ldquo;We&rsquo;re changing the reporting process&rdquo; is 5. The second
              is also clearer about who is acting.
            </p>

            <h3>Filler phrases</h3>
            <p>
              These add length without meaning and are almost always safe to delete:
            </p>
            <ul>
              <li>&ldquo;I hope this email finds you well&rdquo;</li>
              <li>&ldquo;Please do not hesitate to contact me if you have any questions&rdquo;</li>
              <li>&ldquo;In order to&rdquo; → &ldquo;to&rdquo;</li>
              <li>&ldquo;At this point in time&rdquo; → &ldquo;now&rdquo;</li>
              <li>&ldquo;Due to the fact that&rdquo; → &ldquo;because&rdquo;</li>
            </ul>

            <h3>Hedging that weakens the message</h3>
            <p>
              &ldquo;I was just wondering if perhaps we might be able to look at potentially
              revisiting the timeline&rdquo; is eleven words to say &ldquo;Could we revisit
              the timeline?&rdquo; Hedging reads as uncertain and makes a reader work harder
              than they need to.
            </p>

            <h2>Before and after</h2>
            <div className="article-example-pair">
              <div className="article-example article-example--before">
                <span className="article-example-label">Before</span>
                <p>
                  &ldquo;Hi Sarah, I hope you&rsquo;re well. I wanted to follow up on the
                  conversation we had last week about the Q4 budget review. As you may
                  remember, we talked through the proposed changes to the headcount line and
                  I mentioned that there might be some flexibility in the external contractor
                  spend. I&rsquo;ve had a chance to look at the numbers and I think we could
                  potentially make this work if we adjust a couple of line items. Would it be
                  possible to find some time this week or next to go through this together?
                  I think it would be helpful to look at the spreadsheet at the same
                  time.&rdquo;
                </p>
              </div>
              <div className="article-example article-example--after">
                <span className="article-example-label">After</span>
                <p>
                  &ldquo;Hi Sarah, could we book 20 minutes this week to go through the Q4
                  budget numbers? I&rsquo;ve looked at the headcount and contractor lines and
                  think there&rsquo;s room to make it work — easier to show you in the
                  spreadsheet. What times suit you?&rdquo;
                </p>
              </div>
            </div>
            <p>
              Both emails make the same request. Only the second is easy to act on.
            </p>

            <h2>The one-email, one-ask rule</h2>
            <p>
              Emails that contain multiple asks often get a response to one of them — usually
              the easiest one — and the rest gets ignored. If you genuinely need several
              things, number them clearly so the recipient knows how many items require a
              response. Or consider whether a brief meeting would handle it more efficiently
              than three rounds of email.
            </p>

            <h2>When long emails are justified</h2>
            <p>
              Not all long emails are wrong. A briefing document, a comprehensive update to
              multiple stakeholders, or a carefully reasoned position paper can legitimately
              run long. The question is whether the length serves the reader or the writer.
              If the subject demands it, leave it in. If it is there because writing shorter
              is harder, cut it.
            </p>

            <div className="article-tool-cta">
              <p className="article-tool-cta-label">Try it</p>
              <h2>Shorten your email now</h2>
              <p>
                Paste your draft and choose how much to cut — slightly shorter, much shorter,
                or down to a single sentence. The tool keeps everything that matters and
                removes the rest.
              </p>
            </div>
          </div>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="shorten" />
          </div>
        </section>

        <div className="article-layout">
          <div className="article-footer">
            <p className="article-footer-heading">Related reading</p>
            <div className="article-related">
              <Link href="/blog/formal-vs-professional-vs-casual-email-tone" className="article-related-link">
                Formal vs Professional vs Casual Email Tone
              </Link>
              <Link href="/blog/how-to-follow-up-on-a-job-application" className="article-related-link">
                How to Follow Up on a Job Application
              </Link>
              <Link href="/tools/shorten-text" className="article-related-link">
                Tool: Shorten Text →
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
