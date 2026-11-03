import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Write a Professional Email — Free AI Email Writer',
  description:
    'Turn rough notes into a clear, professional email in seconds. Free AI email writer — paste your draft or key points and get a polished result.',
  alternates: { canonical: '/tools/write-professional-email' },
};

export default function WriteProfessionalEmailPage() {
  return (
    <>
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">Write a Professional Email</h1>
          <p className="tool-sub">
            Paste your rough draft, bullet points, or awkward first attempt — and get a clear,
            professional email that says exactly what you mean, in exactly the right tone.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="improve" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>What makes an email professional</h2>
            <p>
              A professional email does three things well: it gets to the point quickly, it uses
              a tone appropriate to the relationship, and it leaves no room for misunderstanding.
              Most people know what they want to say — the challenge is saying it in a way that
              reads well and reflects positively on them.
            </p>
            <p>
              The AI Writing Improver takes your draft and fixes sentence structure, removes
              hedging and filler, improves word choice, and adjusts the register to match your
              intended tone — without changing your message.
            </p>

            <h2>Common situations</h2>
            <ul>
              <li>
                <strong>Emailing a manager or senior colleague</strong> — striking the right
                balance between confident and respectful
              </li>
              <li>
                <strong>Writing to a client or prospect</strong> — clear, professional, and
                outcome-focused without sounding cold
              </li>
              <li>
                <strong>Requesting something</strong> — asking for time, feedback, a decision, or
                resources in a way that makes yes easy
              </li>
              <li>
                <strong>Delivering difficult news</strong> — communicating delays, rejections, or
                problems without damaging the relationship
              </li>
              <li>
                <strong>Following up</strong> — a nudge that is firm without being pushy
              </li>
              <li>
                <strong>Non-native English speakers</strong> — checking business emails for tone,
                grammar, and naturalness before sending
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Rough draft</span>
                <p>
                  &ldquo;Hi, I wanted to see if maybe you could have a look at the proposal I sent
                  last week? I think it&rsquo;s pretty good and would appreciate some feedback when
                  you get a chance, no rush though.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Improved</span>
                <p>
                  &ldquo;Hi [Name], I wanted to follow up on the proposal I sent last week. I&rsquo;d
                  welcome any feedback when you have a moment — please let me know if you need any
                  additional information.&rdquo;
                </p>
              </div>
            </div>

            <h2>Tips for better results</h2>
            <ul>
              <li>
                Write a rough draft first — even a messy one. The AI will improve it, not replace
                your thinking.
              </li>
              <li>
                Use the tone selector to set the register: Professional for most business emails,
                Formal for legal or senior stakeholders, Friendly for internal team messages.
              </li>
              <li>
                If the result is too long or too short, use the Shorten or Improve buttons to
                refine it further.
              </li>
            </ul>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>Can I use it for cold outreach emails?</h3>
                <p>
                  Yes. The Improve Writing mode works well for cold emails. Use the Confident or
                  Persuasive tone for outreach that needs to stand out.
                </p>
              </div>
              <div className="faq-item">
                <h3>Will it change the meaning of what I wrote?</h3>
                <p>
                  No. The AI improves how your message reads without changing what it says. Always
                  review the result before sending.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I improve an email reply?</h3>
                <p>
                  Yes — use the <Link href="/tools/reply-generator">Reply Generator</Link> if you
                  want to write a reply to a specific message you received.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/reply-generator">Reply Generator</Link>
              <Link href="/tools/change-tone">Change Tone</Link>
              <Link href="/tools/follow-up-email">Follow-Up Email</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
