import type { Metadata } from 'next';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'About Say It Better',
  description:
    'Say It Better is a free AI writing assistant that helps people communicate more clearly, confidently, and effectively.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <div className="static-page">
          <h1>About Say It Better</h1>
          <p className="page-date">Building better communication, one message at a time.</p>

          <p>
            Say It Better is a free AI writing assistant built for anyone who has ever struggled to
            find the right words. Whether you&apos;re writing an email, crafting a reply, or trying
            to make your point more clearly — Say It Better helps you get there.
          </p>

          <h2>Why we built this</h2>
          <p>
            Most people know exactly what they want to say. The challenge is saying it well. Clear,
            confident writing opens doors — it builds trust, avoids misunderstandings, and makes a
            lasting impression. But not everyone has the time or the skill to polish every word.
          </p>
          <p>
            Say It Better bridges that gap. It takes what you mean and helps you say it better —
            without requiring an account, a subscription, or any technical knowledge.
          </p>

          <h2>How it works</h2>
          <p>
            Say It Better uses state-of-the-art AI language models to understand your text and
            produce natural, human-sounding results. The AI is designed to be helpful and accurate —
            it preserves your meaning while improving how it reads.
          </p>
          <p>
            We&apos;ve built dedicated tools for six communication tasks: improving writing, writing
            replies, changing tone, simplifying text, shortening text, and fixing grammar. Each tool
            is purpose-built with specific instructions that help the AI understand the goal and
            produce the right kind of result.
          </p>

          <h2>Who it&apos;s for</h2>
          <p>Say It Better is for everyone:</p>
          <ul>
            <li>Students writing assignments or emails to professors</li>
            <li>Professionals drafting client communication</li>
            <li>Non-native English speakers checking their writing</li>
            <li>Anyone who wants to sound clearer and more confident</li>
            <li>Busy people who need a polished result fast</li>
          </ul>

          <h2>Privacy and cost</h2>
          <p>
            Say It Better is free to use and requires no account. We process your text through
            a third-party AI service to generate results, but we do not store your writing on
            our servers. You can find the full details in our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
          <p>
            We keep the service free through responsible advertising that never compromises
            your experience.
          </p>

          <h2>Contact</h2>
          <p>
            Questions or feedback? Reach us at{' '}
            <a href="mailto:hello.flintel@gmail.com">hello.flintel@gmail.com</a>.
          </p>
        </div>
      </main>
    </>
  );
}
