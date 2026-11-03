import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Reply Generator — Write the Right Response Every Time',
  description:
    'Paste the message you received, describe what you want to say, and get a natural, well-written reply in seconds. Free, no signup.',
  alternates: { canonical: '/tools/reply-generator' },
};

export default function ReplyGeneratorPage() {
  return (
    <>
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">AI Reply Generator</h1>
          <p className="tool-sub">
            Paste the message you received, tell us what you want to say, and get a natural,
            appropriate reply — without spending ten minutes drafting it yourself.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="reply" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>How to use the reply generator</h2>
            <p>
              Paste the original message into the first box. Then describe, in plain words,
              what you want your reply to communicate — a brief phrase or a full sentence is
              fine. Optionally tell us who you are replying to (your manager, a client, a
              friend) and choose a tone. The AI writes a reply that expresses your intention
              naturally and appropriately.
            </p>
            <p>
              The generator never invents facts, makes commitments you did not ask for, or
              adds promises you did not intend. It works from exactly what you provide.
            </p>

            <h2>Situations where it helps</h2>
            <ul>
              <li>
                <strong>Requests you need to push back on</strong> — someone asks for a
                deadline you cannot meet and you need to say so professionally
              </li>
              <li>
                <strong>Awkward messages</strong> — a complaint, a criticism, or a difficult
                request from a colleague or customer
              </li>
              <li>
                <strong>Formal correspondence</strong> — replying to a job offer, a contract
                query, or a legal notice
              </li>
              <li>
                <strong>When you are not sure of the right tone</strong> — a message from a
                senior person you want to reply to respectfully without being overly formal
              </li>
              <li>
                <strong>Follow-ups</strong> — you sent something a week ago and need a
                polite, non-pushy reminder
              </li>
            </ul>

            <h2>Example</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Received message</span>
                <p>&ldquo;Can you have the report ready by tomorrow morning?&rdquo;</p>
                <span className="ep-label" style={{ marginTop: '10px', display: 'block' }}>
                  Your intention
                </span>
                <p>&ldquo;I need two more days&rdquo;</p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Generated reply</span>
                <p>
                  &ldquo;Thanks for checking in. I want to make sure the report is accurate
                  and complete — I&rsquo;ll need until Wednesday morning to get it right. Does
                  that work for you?&rdquo;
                </p>
              </div>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>What if I only have a vague idea of what to say?</h3>
                <p>
                  That is fine. Write it the way you would tell a friend: &ldquo;I want to
                  say no but not sound rude&rdquo; or &ldquo;I need more time, maybe a
                  week&rdquo;. The AI fills in the phrasing.
                </p>
              </div>
              <div className="faq-item">
                <h3>Will it make up details I did not provide?</h3>
                <p>
                  No. The reply is based only on what you write. It will not invent a reason,
                  a date, or a commitment you did not give.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I change the tone of the reply?</h3>
                <p>
                  Yes. Select a tone before generating, or use the Change Tone button after
                  you see the result.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/change-tone">Change Tone</Link>
              <Link href="/tools/improve-writing">Improve Writing</Link>
              <Link href="/tools/shorten-text">Shorten Text</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
