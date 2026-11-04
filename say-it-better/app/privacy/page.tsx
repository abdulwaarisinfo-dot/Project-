import type { Metadata } from 'next';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Writora privacy policy — how we handle your data and protect your writing.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <div className="static-page">
          <h1>Privacy Policy</h1>
          <p className="page-date">Last updated: November 2025</p>

          <p>
            Writora is committed to protecting your privacy. This policy explains what
            information we collect, how we use it, and what choices you have.
          </p>

          <h2>What we collect</h2>
          <p>When you use Writora, we process:</p>
          <ul>
            <li>
              <strong>Text you submit:</strong> The text you enter into our tools is sent to a
              third-party AI API to generate results. This text is processed to produce your
              result. We do not store your text on our own servers after the request completes.
            </li>
            <li>
              <strong>Usage data:</strong> We collect standard server logs including IP addresses,
              request times, and HTTP status codes for rate limiting and abuse prevention.
            </li>
            <li>
              <strong>Analytics:</strong> We may use privacy-respecting analytics to understand how
              the tool is used. This does not include the content of your writing.
            </li>
          </ul>

          <h2>How your text is processed</h2>
          <p>
            When you submit text, it is sent securely to Cloudflare Workers AI — a service operated
            by Cloudflare, Inc. Cloudflare processes the text using an AI model and returns the
            result. Cloudflare does not use your inputs or outputs to train AI models. Cloudflare
            may temporarily process request data for reliability and abuse-prevention purposes. For
            details, see{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              Cloudflare&apos;s Privacy Policy
            </a>
            .
          </p>
          <p>
            <strong>Important:</strong> Any text you submit is transmitted to a third-party AI
            service. Do not submit passwords, payment card details, government ID numbers, or other
            highly sensitive information.
          </p>

          <h2>What we do not do</h2>
          <ul>
            <li>We do not require you to create an account</li>
            <li>We do not sell your data to third parties</li>
            <li>We do not use your writing to train AI models</li>
            <li>We do not share your text with advertisers</li>
            <li>We do not permanently store the content you submit</li>
          </ul>

          <h2>Cookies and advertising</h2>
          <p>
            Writora may use Google AdSense to display advertisements. AdSense uses cookies to
            serve relevant ads based on your browsing history. You can opt out of personalised
            advertising through{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google&apos;s ad settings
            </a>
            .
          </p>

          <h2>Rate limiting</h2>
          <p>
            We use your IP address to enforce fair-use rate limits. This helps keep the service
            available for all users and prevents abuse. IP data used for rate limiting is held in
            memory only and is cleared automatically. It is not logged or stored permanently.
          </p>

          <h2>Children</h2>
          <p>
            Writora is not directed at children under 13. We do not knowingly collect
            information from children under 13.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page shows
            when it was last updated.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this policy, please contact us at{' '}
            <a href="mailto:hello.flintel@gmail.com">hello.flintel@gmail.com</a>.
          </p>
        </div>
      </main>
    </>
  );
}
