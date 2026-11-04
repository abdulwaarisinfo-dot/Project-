import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How to Say No Politely — AI Polite Refusal Generator',
  description:
    'Decline requests, invitations, and offers politely without damaging relationships. Free AI tool — write a polite refusal in seconds.',
  alternates: { canonical: '/tools/polite-refusal' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Will it explain why I am saying no?',
      acceptedAnswer: { '@type': 'Answer', text: 'Only if you include a reason in your intention. If you prefer not to give a reason, just say “decline without giving a reason” and the AI will write a respectful no without one.' },
    },
    {
      '@type': 'Question',
      name: 'Can I decline and leave the door open for later?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Include that in your intention — for example: “decline for now but express interest in the future.” The AI will write a no that keeps the option open.' },
    },
    {
      '@type': 'Question',
      name: 'What tone should I choose?',
      acceptedAnswer: { '@type': 'Answer', text: 'Friendly for informal relationships, Professional for workplace contexts, Formal for legal or official situations. Empathetic works well when you want to acknowledge that the person is disappointed.' },
    },
  ],
};

export default function PoliteRefusalPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main>
        <div className="tool-hero">
          <p className="tool-eyebrow">Free Writing Tool</p>
          <h1 className="tool-headline">How to Say No Politely</h1>
          <p className="tool-sub">
            Decline requests, turn down invitations, and push back on asks — clearly and
            respectfully, without damaging the relationship or leaving room for ambiguity.
          </p>
        </div>

        <section className="tool-workspace-section">
          <div className="container">
            <Workspace initialMode="reply" />
          </div>
        </section>

        <div className="tool-content">
          <div className="tool-content-inner">
            <h2>Why saying no is hard</h2>
            <p>
              Most people find it difficult to decline a request, especially in professional
              contexts. The worry is that saying no will seem rude, damage the relationship, or
              close off future opportunities. As a result, people either agree to things they
              shouldn&rsquo;t, or write refusals that come across as cold or apologetic.
            </p>
            <p>
              A well-written refusal does three things: it is clear (the person knows you are
              saying no), it is kind (it acknowledges their request and treats it with respect),
              and it does not leave the door open to negotiation when you genuinely cannot help.
            </p>

            <h2>When to use this tool</h2>
            <ul>
              <li>
                <strong>Declining a meeting request</strong> — when you cannot attend or the
                meeting is not a good use of your time
              </li>
              <li>
                <strong>Turning down a job offer</strong> — staying professional and keeping
                the relationship intact
              </li>
              <li>
                <strong>Refusing an extra project or task</strong> — setting limits without
                seeming unhelpful
              </li>
              <li>
                <strong>Declining a social invitation</strong> — saying no to a friend or
                colleague without causing offence
              </li>
              <li>
                <strong>Rejecting a proposal or pitch</strong> — giving a clear, respectful no
                to a vendor or collaborator
              </li>
              <li>
                <strong>Pushing back on an unreasonable request</strong> — when the ask is out
                of scope and you need to say so clearly
              </li>
            </ul>

            <h2>Before and after</h2>
            <div className="example-pair-static">
              <div className="ep-before">
                <span className="ep-label">Received message</span>
                <p>
                  &ldquo;Would you be available to join our advisory board? It&rsquo;s unpaid but a
                  great opportunity to shape the direction of the company.&rdquo;
                </p>
              </div>
              <div className="ep-after">
                <span className="ep-label">Polite refusal</span>
                <p>
                  &ldquo;Thank you for thinking of me — it sounds like an exciting project. I
                  don&rsquo;t have the capacity to take on advisory commitments at the moment, so
                  I&rsquo;ll have to decline. I wish you all the best with it.&rdquo;
                </p>
              </div>
            </div>

            <h2>How to use the Reply Generator</h2>
            <p>
              Paste the request you received into the first box. In the second box, describe what
              you want to say — for example: &ldquo;I want to decline politely, I&rsquo;m too busy
              right now, but I want to keep the relationship warm.&rdquo; Choose a tone like
              Friendly or Professional, and the AI will write the reply for you.
            </p>

            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>Will it explain why I am saying no?</h3>
                <p>
                  Only if you include a reason in your intention. If you prefer not to give a
                  reason, just say &ldquo;decline without giving a reason&rdquo; and the AI will
                  write a respectful no without one.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I decline and leave the door open for later?</h3>
                <p>
                  Yes. Include that in your intention — for example: &ldquo;decline for now but
                  express interest in the future.&rdquo; The AI will write a no that keeps the
                  option open.
                </p>
              </div>
              <div className="faq-item">
                <h3>What tone should I choose?</h3>
                <p>
                  Friendly for informal relationships, Professional for workplace contexts, Formal
                  for legal or official situations. Empathetic works well when you want to
                  acknowledge that the person is disappointed.
                </p>
              </div>
            </div>

            <div className="related-tools">
              <span className="related-label">Related tools:</span>
              <Link href="/tools/reply-generator">Reply Generator</Link>
              <Link href="/tools/change-tone">Change Tone</Link>
              <Link href="/tools/write-professional-email">Write a Professional Email</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
