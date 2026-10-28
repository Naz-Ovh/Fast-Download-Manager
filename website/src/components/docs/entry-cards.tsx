// Docs home: three large entry cards (Install, Browser extension, Video) and a quieter row of further links.
// Server components; styles in ./docs.css (.fdm-entry*, .fdm-more*).
import Link from 'fumadocs-core/link';
import { ArrowRight, Download, LifeBuoy, CirclePlay, Puzzle, Terminal } from 'lucide-react';
import type { ComponentType, CSSProperties, SVGProps } from 'react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const entries: { href: string; title: string; text: string; label: string; icon: Icon }[] = [
  {
    href: '/docs/guide/install/',
    title: 'Install',
    text: 'Get Fast Download Manager running on Windows, or build it from source today.',
    label: 'Windows · build from source',
    icon: Download,
  },
  {
    href: '/docs/guide/browser-extension/',
    title: 'Browser extension',
    text: 'Send downloads and videos from Chrome, Edge, Brave and Firefox straight to the app.',
    label: '4 browsers · 17 languages',
    icon: Puzzle,
  },
  {
    href: '/docs/guide/video/',
    title: 'Video',
    text: 'Save the video on a page: direct files, HLS and DASH streams, with audio merged in.',
    label: 'HLS · DASH · MP4 · MKV',
    icon: CirclePlay,
  },
];

const more: { href: string; title: string; icon: Icon }[] = [
  { href: '/docs/guide/cli/', title: 'Command line', icon: Terminal },
  { href: '/docs/guide/troubleshooting/', title: 'Troubleshooting', icon: LifeBuoy },
];

/** The three main ways into the guide, as large cards with the chunk lane motif. */
export function EntryCards() {
  return (
    <div className="fdm-entry-grid not-prose">
      {entries.map(({ href, title, text, label, icon: Icon }, i) => (
        <Link key={href} href={href} className="fdm-entry" style={{ '--fdm-i': i } as CSSProperties}>
          <span className="fdm-entry-lane" aria-hidden>
            {Array.from({ length: 6 }, (_, k) => (
              <span key={k} style={{ '--fdm-k': k } as CSSProperties} />
            ))}
          </span>
          <span className="fdm-entry-icon" aria-hidden>
            <Icon />
          </span>
          <span className="fdm-entry-title">{title}</span>
          <span className="fdm-entry-text">{text}</span>
          <span className="fdm-entry-foot">
            <span className="fdm-entry-label">{label}</span>
            <ArrowRight className="fdm-entry-arrow" aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Quieter links under the entry cards: CLI, troubleshooting. */
export function MoreLinks() {
  return (
    <nav aria-label="More docs" className="fdm-more not-prose">
      {more.map(({ href, title, icon: Icon }) => (
        <Link key={href} href={href} className="fdm-more-link">
          <Icon aria-hidden />
          <span>{title}</span>
          <ArrowRight className="fdm-more-arrow" aria-hidden />
        </Link>
      ))}
    </nav>
  );
}
