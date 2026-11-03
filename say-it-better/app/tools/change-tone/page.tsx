import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Tone Changer — Rewrite Any Message in a Different Tone',
  description:
    'Make your writing sound formal, casual, friendly, confident, or professional — without changing what it says. Free AI tone changer, no signup.',
  alternates: { canonical: '/tools/change-tone' },
};

export default function ChangeTonePage() {
  return (
    <>
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">AI Tone Changer</h1>
          <p className="tool-sub">
            Enter your text, choose a tone, and get a version that sounds exactly the way you
            need it to — without changing what you are actually saying.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="tone" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>What tone changing does</h2>
            <p>
              Tone changing rewrites your message so it sounds different — more formal, more
              casual, more direct, more empathetic — while preserving exactly what you want to
              communicate. The facts, the request, and the meaning stay the same. Only the
              style and register change.
            </p>
            <p>
              This is useful when you know what you want to say but are not sure how to say it
              in the right context. A message drafted quickly in a casual tone might need to
              become formal before going to a client. Or a stiff, formal draft might need to
              sound warmer before going to a colleague.
            </p>

            <h2>Available tones</h2>
            <ul>
              <li>
                <strong>Formal</strong> — appropriate for legal correspondence, senior
                management, or official documents
              </li>
              <li>
                <strong>Professional</strong> — business-appropriate but not stiff; suits
                client emails and work communications
              </li>
              <li>
                <strong>Casual</strong> — relaxed and conversational; suitable for team chats
                and friendly messages
              </li>
              <li>
                <strong>Friendly</strong> — warm and approachable; suits customer messages
                and community communications
              </li>
              <li>
                <strong>Confident</strong> — direct and assured; removes hedging language and
                makes the message more decisive
              </li>
              <li>
                <strong>Empathetic</strong> — acknowledges feelings and shows understanding;
                useful for difficult conversations
              </li>
              <li>
                <strong>Direct</strong> — gets straight to the point with no pleasantries or
                padding
              </li>
              <li>
                <strong>Persuasive</strong> — frames the message to make the case more
                compellingly
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Casual draft</span>
                <p>
                  &ldquo;Hey, so like, I was wondering if maybe you could look at this thing I
                  sent? It&rsquo;s kind of important I think.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Professional tone</span>
                <p>
                  &ldquo;I wanted to follow up on the document I sent over. It covers something
                  time-sensitive — please let me know when you have had a chance to review
                  it.&rdquo;
                </p>
              </div>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>Will the meaning change?</h3>
                <p>
                  No. The tone changer is designed to preserve the meaning exactly. Only the
                  style, word choice, and register change.
                </p>
              </div>
              <div className="faq-item">
                <h3>What is the difference between formal and professional?</h3>
                <p>
                  Formal is more rigid — suited to legal or official documents. Professional
                  is business-appropriate but natural, suited to everyday workplace
                  communication.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I change the tone of a result I already generated?</h3>
                <p>
                  Yes. After any result appears, use the Change Tone button below it to apply
                  a different tone without re-entering your text.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/improve-writing">Improve Writing</Link>
              <Link href="/tools/reply-generator">Reply Generator</Link>
              <Link href="/tools/shorten-text">Shorten Text</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
