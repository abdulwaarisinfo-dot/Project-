import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Writing Guides — Practical Advice on Email and Professional Communication',
  description:
    'Practical guides on writing better emails, declining requests politely, following up professionally, and getting the right tone. No fluff.',
  alternates: { canonical: '/blog' },
};

const articles = [
  {
    slug: 'how-to-politely-decline-a-meeting-request',
    title: 'How to Politely Decline a Meeting Request',
    excerpt:
      'Most people say yes to meetings they should skip. A clear, direct decline protects your time and sets a useful precedent — here is how to write one.',
    date: 'November 2026',
  },
  {
    slug: 'how-to-reply-to-a-rude-email-professionally',
    title: 'How to Reply to a Rude Email Professionally',
    excerpt:
      'The reply you write in the first three minutes of reading a hostile email is rarely the one you should send. Here is a better approach.',
    date: 'November 2026',
  },
  {
    slug: 'how-to-follow-up-on-a-job-application',
    title: 'How to Follow Up on a Job Application',
    excerpt:
      'A well-timed follow-up shows initiative. A badly timed one looks desperate. Here is what to say, when to say it, and when to stop.',
    date: 'November 2026',
  },
  {
    slug: 'formal-vs-professional-vs-casual-email-tone',
    title: 'Formal vs Professional vs Casual Email Tone',
    excerpt:
      '"Formal" and "professional" are not the same thing. Using the wrong register is one of the most common email mistakes — and one of the easiest to fix.',
    date: 'November 2026',
  },
  {
    slug: 'how-to-shorten-a-long-email',
    title: 'How to Shorten a Long Email Without Losing the Point',
    excerpt:
      'Most professional emails are longer than they need to be. Here is a simple framework for cutting them down without losing anything that matters.',
    date: 'November 2026',
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <div className="blog-hero">
          <p className="tool-eyebrow">Writing Guides</p>
          <h1>Practical writing advice</h1>
          <p>
            Short, useful guides on emails, professional communication, and getting the tone
            right. No filler.
          </p>
        </div>
        <div className="blog-listing">
          <div className="blog-grid">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="blog-card"
              >
                <span className="blog-card-date">{article.date}</span>
                <h2 className="blog-card-title">{article.title}</h2>
                <p className="blog-card-excerpt">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
