import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Workspace from '@/components/workspace/Workspace';

export const metadata: Metadata = {
  title: 'Writora — AI Writing Assistant',
  description:
    'Improve your writing, fix grammar, change tone and write better replies with AI. Free, no signup required.',
  alternates: { canonical: '/' },
};

const EXAMPLES = [
  {
    mode: 'Improve Writing',
    before:
      'I wanted to follow up regarding the thing we talked about and see if there was any update on that.',
    after: 'I wanted to follow up on our earlier discussion — do you have any updates to share?',
  },
  {
    mode: 'Reply',
    received: 'Can you have this ready by tomorrow morning?',
    intention: 'I need two more days',
    after:
      "Thanks for reaching out. I want to make sure this is done properly — I'll need until Wednesday morning to get it right. Does that work for you?",
  },
  {
    mode: 'Fix Grammar',
    before: "Their going to the store, but they dont have no money for buying anything.",
    after: "They're going to the store, but they don't have any money to buy anything.",
  },
];

const FAQ = [
  {
    q: 'Is Writora free?',
    a: 'Yes. Writora is completely free to use. No subscription, no account required. Just type and get results.',
  },
  {
    q: 'Do you save my writing?',
    a: 'Your text is sent to our AI for processing but is not stored on our servers. We take privacy seriously.',
  },
  {
    q: 'What AI powers Writora?',
    a: 'We use state-of-the-art large language models to produce natural, accurate results. The full details are in our Privacy Policy.',
  },
  {
    q: 'Is there a limit on how much I can use it?',
    a: "There are generous fair-use limits to keep the service sustainable for everyone. Most users will never hit them.",
  },
  {
    q: 'What languages are supported?',
    a: 'Writora works best with English. Support for additional languages is coming soon.',
  },
];

const USE_CASES = [
  {
    icon: '✦',
    title: 'Improve Writing',
    desc: 'Polish your emails, messages, and documents while keeping your voice.',
  },
  {
    icon: '↩',
    title: 'Write a Reply',
    desc: 'Paste a message, describe what you want to say, and get a natural reply.',
  },
  {
    icon: '≋',
    title: 'Change Tone',
    desc: 'Make the same message more formal, casual, confident, or friendly.',
  },
  {
    icon: '✧',
    title: 'Simplify Text',
    desc: 'Turn complex writing into clear, easy-to-understand language.',
  },
  { icon: '⊟', title: 'Shorten Text', desc: 'Cut the fluff and get straight to the point.' },
  {
    icon: '∿',
    title: 'Fix Grammar',
    desc: 'Correct spelling, grammar, and punctuation in seconds.',
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <p className="hero-eyebrow">Free AI Writing Tool</p>
            <h1 className="hero-headline">
              Say what you really mean.
              <br />
              Better.
            </h1>
            <p className="hero-sub">
              Improve your writing, find the right words, and respond with confidence.
            </p>
          </div>
        </section>

        {/* Main Workspace */}
        <section className="workspace-section">
          <div className="container">
            <Workspace />
          </div>
        </section>

        {/* Use cases */}
        <section className="section" id="examples">
          <div className="container">
            <h2 className="section-heading">What would you like to say?</h2>
            <p className="section-sub">Six tools, one workspace. Pick what you need.</p>
            <div className="use-case-grid">
              {USE_CASES.map((uc) => (
                <div key={uc.title} className="use-case-card">
                  <span className="use-case-icon" aria-hidden="true">
                    {uc.icon}
                  </span>
                  <h3 className="use-case-title">{uc.title}</h3>
                  <p className="use-case-desc">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before & After Examples */}
        <section className="section examples-section">
          <div className="container">
            <h2 className="section-heading">Before &amp; after</h2>
            <p className="section-sub">Real examples of what Writora can do.</p>
            <div className="examples-list">
              {EXAMPLES.map((ex, i) => (
                <div key={i} className="example-card">
                  <span className="example-mode">{ex.mode}</span>
                  {'before' in ex ? (
                    <div className="example-pair">
                      <div className="example-before">
                        <span className="example-label">Original</span>
                        <p>{ex.before}</p>
                      </div>
                      <div className="example-arrow" aria-hidden="true">
                        →
                      </div>
                      <div className="example-after">
                        <span className="example-label">Improved</span>
                        <p>{ex.after}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="example-pair">
                      <div className="example-before">
                        <span className="example-label">Received</span>
                        <p>{ex.received}</p>
                        <span className="example-label mt">Wanted to say</span>
                        <p className="example-intention">{ex.intention}</p>
                      </div>
                      <div className="example-arrow" aria-hidden="true">
                        →
                      </div>
                      <div className="example-after">
                        <span className="example-label">Reply</span>
                        <p>{ex.after}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section" id="how-it-works">
          <div className="container">
            <h2 className="section-heading">How it works</h2>
            <div className="steps-grid">
              {[
                {
                  num: '1',
                  title: 'Choose your task',
                  desc: 'Select what you need — improve, reply, change tone, simplify, shorten, or fix grammar.',
                },
                {
                  num: '2',
                  title: 'Enter your text',
                  desc: 'Type what you want to say, or paste existing text. Add context if it helps.',
                },
                {
                  num: '3',
                  title: 'Get your result',
                  desc: 'AI generates a polished version in seconds. Edit it, copy it, or refine it further.',
                },
              ].map((step) => (
                <div key={step.num} className="step">
                  <span className="step-num" aria-hidden="true">
                    {step.num}
                  </span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ad slot — between sections, non-intrusive */}
        {/* AdSense script will go here once publisher account is approved */}
        {/* <div className="ad-slot ad-slot--horizontal" aria-label="Advertisement" /> */}

        {/* FAQ */}
        <section className="section">
          <div className="container narrow">
            <h2 className="section-heading">Common questions</h2>
            <div className="faq-list">
              {FAQ.map((item, i) => (
                <div key={i} className="faq-item">
                  <h3 className="faq-q">{item.q}</h3>
                  <p className="faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="logo"><img src="/writora-mark.svg" alt="" width={24} height={24} className="logo-mark" aria-hidden="true" />Writora</span>
            <p className="footer-tagline">Write better. Communicate smarter.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <span className="footer-col-title">Tools</span>
              <a href="/tools/improve-writing">Improve Writing</a>
              <a href="/tools/reply-generator">Reply Generator</a>
              <a href="/tools/change-tone">Change Tone</a>
              <a href="/tools/fix-grammar">Fix Grammar</a>
              <a href="/tools/shorten-text">Shorten Text</a>
              <a href="/tools/simplify-text">Simplify Text</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">More Tools</span>
              <a href="/tools/write-professional-email">Professional Email</a>
              <a href="/tools/follow-up-email">Follow-Up Email</a>
              <a href="/tools/polite-refusal">Say No Politely</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Company</span>
              <a href="/about">About</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Writora. Free AI writing assistant.</p>
        </div>
      </footer>
    </>
  );
}
