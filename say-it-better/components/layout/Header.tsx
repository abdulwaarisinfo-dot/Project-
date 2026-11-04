import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <Image src="/writora-mark-32.png" alt="" width={24} height={24} className="logo-mark" aria-hidden="true" />
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
