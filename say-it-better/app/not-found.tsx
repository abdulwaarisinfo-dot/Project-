import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found-page">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you were looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary">
          Back to Writora
        </Link>
      </main>
    </>
  );
}
