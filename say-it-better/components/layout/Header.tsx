import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          Say It Better
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
