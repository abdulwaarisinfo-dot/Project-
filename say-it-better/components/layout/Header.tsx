import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/writora-mark.svg" alt="" width={24} height={24} className="logo-mark" aria-hidden="true" />
          Writora
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <Link href="/#how-it-works" className="nav-link">
            How It Works
          </Link>
          <Link href="/#examples" className="nav-link">
            Examples
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/privacy" className="nav-link">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
