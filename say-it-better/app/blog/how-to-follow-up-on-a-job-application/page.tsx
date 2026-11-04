import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How to Follow Up on a Job Application',
  description:
    'A well-timed follow-up shows initiative. A badly timed one looks desperate. Here is what to say, when to say it, and when to stop.',
  alternates: { canonical: '/blog/how-to-follow-up-on-a-job-application' },
  openGraph: {
    title: 'How to Follow Up on a Job Application',
    description:
      'A well-timed follow-up shows initiative. A badly timed one looks desperate. Here is what to say, when to say it, and when to stop.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Writora — AI Writing Assistant' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Follow Up on a Job Application',
    description:
      'A well-timed follow-up shows initiative. A badly timed one looks desperate. Here is what to say, when to say it, and when to stop.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Follow Up on a Job Application',
  description:
    'A well-timed follow-up shows initiative. A badly timed one looks desperate. Here is what to say, when to say it, and when to stop.',
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
            <h1>How to Follow Up on a Job Application</h1>
            <p className="article-meta">November 2026</p>
            <p className="article-intro">
              Most job applications are met with silence — not because hiring teams are
              dismissive, but because they are managing hundreds of applications at once.
              A follow-up email, timed and worded correctly, can remind a recruiter of your
              interest without pushing them away. Here is how to get it right.
            </p>
          </div>

          <div className="article-body">
            <h2>When to follow up</h2>
            <p>
              Timing matters more than the words. The general rule: wait at least five to
              seven business days after submitting an application before reaching out. Hiring
              teams are busy, and a follow-up sent 48 hours after applying signals impatience,
              not enthusiasm.
            </p>
            <p>
              If the job posting specified a timeline — &ldquo;we will be in touch within two
              weeks&rdquo; — wait until that period has passed before contacting anyone. If a
              recruiter gave you a specific date during an interview, do the same.
            </p>
            <p>
              The situation after an interview is different. A brief thank-you email within
              24 hours of the interview is standard and expected. It is not pushy — it is
              professional.
            </p>

            <h2>What to include</h2>
            <p>
              Keep it short. The follow-up email is not a second cover letter. It has one job:
              to remind the reader of who you are, confirm your interest, and ask a clear
              question. That can be done in four sentences.
            </p>
            <ul>
              <li>A reference to the role and when you applied or interviewed</li>
              <li>A brief restatement of your interest (one sentence is enough)</li>
              <li>A direct, low-pressure question about the timeline or next steps</li>
            </ul>
            <p>
              What to leave out: a re-pitch of your qualifications, long explanations of why
              you are following up, and anything apologetic. Following up after a week of
              silence is completely normal professional behavior.
            </p>

            <h2>Examples</h2>

            <h3>After submitting an application (one week later)</h3>
            <div className="article-example article-example--after" style={{ marginBottom: '16px' }}>
              <span className="article-example-label">Follow-up email</span>
              <p>
                &ldquo;Hi [Name], I applied for the [role] position on [date] and wanted to
                follow up. I&rsquo;m still very interested in the opportunity and would love
                to know whether there is anything else you need from me, or when I might
                hear about next steps.&rdquo;
              </p>
            </div>

            <h3>Thank-you email after an interview (same day or next morning)</h3>
            <div className="article-example article-example--after" style={{ marginBottom: '16px' }}>
              <span className="article-example-label">Thank-you email</span>
              <p>
                &ldquo;Hi [Name], thank you for the time today — I really enjoyed learning
                more about [specific topic discussed]. I&rsquo;m very interested in the role
                and look forward to hearing about next steps. Please let me know if
                there&rsquo;s anything else you&rsquo;d like from me.&rdquo;
              </p>
            </div>

            <h3>Following up after the stated decision date has passed</h3>
            <div className="article-example article-example--after" style={{ marginBottom: '16px' }}>
              <span className="article-example-label">Follow-up email</span>
              <p>
                &ldquo;Hi [Name], I wanted to follow up as I haven&rsquo;t heard back since
                our conversation on [date]. I&rsquo;m still very interested in the
                opportunity and would love to know where things stand when you have a moment.
                No pressure — I appreciate that these decisions take time.&rdquo;
              </p>
            </div>

            <h2>Tone</h2>
            <p>
              Confident and direct, without being pushy. The goal is to come across as
              interested and professional — not anxious. Phrases like &ldquo;I know you must
              be very busy&rdquo; or &ldquo;I&rsquo;m so sorry to bother you&rdquo;
              undermine the confidence you want to project. You are not bothering anyone.
              You are asking a reasonable question.
            </p>

            <h2>When to stop following up</h2>
            <p>
              Two unanswered follow-ups is usually the limit. If you have heard nothing after
              two attempts at reasonable intervals, the lack of response is itself an answer.
              It is worth moving on with your search rather than waiting on a process that
              has gone quiet.
            </p>
            <p>
              The exception: if a recruiter confirmed they would be in touch by a specific
              date and missed it, one follow-up past that date is entirely reasonable — even
              if you have already followed up once before.
            </p>

            <div className="article-tool-cta">
              <p className="article-tool-cta-label">Write your follow-up</p>
              <h2>Get the wording right</h2>
              <p>
                Paste the job description or a summary of your situation, describe what you
                want to say, and get a confident, well-worded follow-up email in seconds.
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
              <Link href="/blog/how-to-shorten-a-long-email" className="article-related-link">
                How to Shorten a Long Email Without Losing the Point
              </Link>
              <Link href="/blog/formal-vs-professional-vs-casual-email-tone" className="article-related-link">
                Formal vs Professional vs Casual Email Tone
              </Link>
              <Link href="/tools/follow-up-email" className="article-related-link">
                Tool: Write a Follow-Up Email →
              </Link>
              <Link href="/tools/write-professional-email" className="article-related-link">
                Tool: Write a Professional Email →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
