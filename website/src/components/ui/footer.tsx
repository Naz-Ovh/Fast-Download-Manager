// Site footer for the home layout: wordmark, main links, version from the root Cargo.toml.
import Link from 'fumadocs-core/link';
import { Wordmark } from '@/components/brand/wordmark';
import { navLinks, site } from '@/lib/site';
import { Container } from './container';

export function Footer() {
  return (
    <footer className="border-t border-fd-border bg-fd-background">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="w-fit rounded-md">
            <Wordmark size={22} />
          </Link>
          <p className="text-sm text-fd-muted-foreground">
            <span className="fdm-num">v{site.version}</span> · © 2026 {site.name}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  className="rounded-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
