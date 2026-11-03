import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Write a Follow-Up Email — Free AI Follow-Up Generator',
  description:
    'Send a follow-up that gets a response — without sounding pushy. Free AI follow-up email generator, no signup required.',
  alternates: { canonical: '/tools/follow-up-email' },
};

export default function FollowUpEmailPage() {
  return (
    <>
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">Write a Follow-Up Email</h1>
          <p className="tool-sub">
            Chase up an unanswered message, nudge a stalled conversation, or check in on
            a pending decision — politely and confidently, without sounding desperate.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="reply" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>When to send a follow-up</h2>
            <p>
              Most unanswered emails are not ignored on purpose — people are busy, distracted,
              or genuinely forgot. A well-timed follow-up is expected and appropriate in most
              professional contexts. The key is getting the tone right: confident and clear
              without coming across as impatient or passive-aggressive.
            </p>

            <h2>Common follow-up situations</h2>
            <ul>
              <li>
                <strong>No reply to a job application</strong> — checking in after sending a
                CV or completing an interview
              </li>
              <li>
                <strong>Waiting on a client decision</strong> — nudging a prospect after
                sending a proposal or quote
              </li>
              <li>
                <strong>Chasing an overdue invoice</strong> — reminding a client about a
                payment without being confrontational
              </li>
              <li>
                <strong>Following up on a request</strong> — when you asked someone for
                something and heard nothing back
              </li>
              <li>
                <strong>After a meeting or call</strong> — confirming what was agreed and
                what the next steps are
              </li>
              <li>
                <strong>Re-engaging a cold contact</strong> — getting back in touch after a
                long gap without it feeling awkward
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Awkward draft</span>
                <p>
                  &ldquo;Hi, just following up again on my previous email. Sorry to bother you,
                  just wanted to check if you had a chance to look at it yet? No worries if not,
                  just let me know when you can.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Confident follow-up</span>
                <p>
                  &ldquo;Hi [Name], I wanted to follow up on my email from last week. Please let
                  me know if you need any further information from my side — I&rsquo;m happy to
                  jump on a call if that&rsquo;s easier.&rdquo;
                </p>
              </div>
            </div>

            <h2>How to use the Reply Generator for follow-ups</h2>
            <p>
              Paste the original message you sent (or a summary of the situation) into the first
              box. In the second box, write what you want to achieve — for example: &ldquo;I want
              to follow up on my proposal, remind them of the deadline, and ask for a decision by
              Friday.&rdquo; The AI will write a follow-up that is direct and appropriate.
            </p>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>How many follow-ups should I send?</h3>
                <p>
                  In most professional contexts, two to three follow-ups are appropriate before
                  accepting that the person is not going to respond. Space them out: three to five
                  days apart for active conversations, a week or more for cold outreach.
                </p>
              </div>
              <div className="faq-item">
                <h3>Should I explain why I am following up?</h3>
                <p>
                  Keep it brief. You can note a deadline if there is one, or mention that you
                  want to make sure your message arrived — but do not over-explain or apologise.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I follow up about an overdue invoice?</h3>
                <p>
                  Yes. Include the invoice amount and due date in your intention. Use the Professional
                  or Firm tone to get the balance right between polite and clear.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/reply-generator">Reply Generator</Link>
              <Link href="/tools/write-professional-email">Write a Professional Email</Link>
              <Link href="/tools/change-tone">Change Tone</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
