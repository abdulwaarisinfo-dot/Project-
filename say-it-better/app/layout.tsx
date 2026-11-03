import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Say It Better — AI Writing Assistant',
    template: '%s | Say It Better',
  },
  description:
    'AI-powered writing assistant that helps you improve writing, fix grammar, change tone, simplify text, and write better replies. Free, no signup required.',
  keywords: [
    'AI writing assistant',
    'improve writing',
    'fix grammar',
    'change tone',
    'writing tool',
    'free AI writing',
    'rewrite text',
    'writing improver',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sayitbetter.ai'),
  openGraph: {
    type: 'website',
    siteName: 'Say It Better',
    title: 'Say It Better — AI Writing Assistant',
    description:
      'Improve your writing, find the right words, and respond with confidence. Free AI writing tool.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Say It Better — AI Writing Assistant',
    description: 'Improve your writing, find the right words, and respond with confidence.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
