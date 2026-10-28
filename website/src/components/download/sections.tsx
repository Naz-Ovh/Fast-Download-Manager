// The sections under the downloads matrix: what is inside every package, the three install steps, the
// requirements, and how to verify a download. Content only states what the repo docs state.
import { AppWindow, ArrowRight, BookOpen, Cable, Hammer, MousePointerClick, Package, Puzzle, SquareTerminal } from 'lucide-react';
import Link from 'fumadocs-core/link';
import type { CSSProperties, ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { platformInfo } from '@/lib/downloads';
import { site } from '@/lib/site';
import { ChecksumTabs } from './checksums';

const GUIDE = {
  install: '/docs/guide/install/',
  extension: '/docs/guide/browser-extension/',
  downloading: '/docs/guide/downloading/',
};

// ── What's inside ──
const PARTS: { icon: ReactNode; title: string; text: string; lane: string }[] = [
  {
    icon: <AppWindow aria-hidden />,
    title: 'Desktop app',
    text: 'Downloads list, categories, Properties and a tray icon. 39 languages.',
    lane: 'var(--fdm-mint-300)',
  },
  {
    icon: <Puzzle aria-hidden />,
    title: 'Browser extension',
    text: 'Builds for Chrome, Edge, Brave and Firefox. Captures downloads and finds videos.',
    lane: 'var(--fdm-mint-400)',
  },
  {
    icon: <Cable aria-hidden />,
    title: 'Native messaging host',
    text: 'Connects the browser to the app and starts the app in the background when needed.',
    lane: 'var(--fdm-mint-500)',
  },
  {
    icon: <SquareTerminal aria-hidden />,
    title: 'fdm command',
    text: 'Download, resume and merge video from a terminal.',
    lane: 'var(--fdm-mint-700)',
  },
];

export function InsideSection() {
  return (
    <div className="flex flex-col gap-5">
      <Reveal stagger={40} className="dl-grid-4">
        {PARTS.map((p) => (
          <Card key={p.title} interactive className="dl-part" style={{ '--lane': p.lane } as CSSProperties}>
            <span className="dl-part-icon">{p.icon}</span>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-fd-muted-foreground">{p.text}</p>
          </Card>
        ))}
      </Reveal>
      <Reveal>
        <p className="dl-note">
          <Package aria-hidden />
          Nothing is downloaded during setup: everything is in the file you install.
        </p>
      </Reveal>
    </div>
  );
}

// ── Three steps ──
const STEPS: { title: string; text: string; link: string; linkText: string; icon: ReactNode }[] = [
  {
    title: 'Install',
    text: 'Run the installer and choose "Just me" or "Everyone". On Linux, the one-line command does the same.',
    link: GUIDE.install,
    linkText: 'Install guide',
    icon: <Package aria-hidden />,
  },
  {
    title: 'Turn on the extension',
    text: 'Load it unpacked from the install folder, once. When the store listings are live, your browser asks you to enable it instead.',
    link: GUIDE.extension,
    linkText: 'Browser extension guide',
    icon: <Puzzle aria-hidden />,
  },
  {
    title: 'Click a download link',
    text: 'The app takes the download from the browser and splits it over parallel connections: 8 by default, up to 32.',
    link: GUIDE.downloading,
    linkText: 'Downloading guide',
    icon: <MousePointerClick aria-hidden />,
  },
];

export function StepsSection() {
  return (
    <Reveal as="ol" stagger={40} className="dl-steps">
      {STEPS.map((s, i) => (
        <li key={s.title} className="dl-step">
          <Card interactive className="dl-step-card">
            <div className="dl-step-top">
              <span className="dl-step-num fdm-num" aria-hidden>
                0{i + 1}
              </span>
              <span className="dl-step-icon">{s.icon}</span>
            </div>
            <h3 className="fdm-heading text-xl">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </h3>
            <p className="text-sm text-fd-muted-foreground">{s.text}</p>
            <Link href={s.link} className="dl-link mt-auto">
              {s.linkText} <ArrowRight aria-hidden />
            </Link>
          </Card>
        </li>
      ))}
    </Reveal>
  );
}

// ── Requirements ──
const REQUIREMENTS: { label: string; value: string; status?: 'available' | 'soon' | 'neutral'; badge?: string }[] = [
  { label: 'Windows', value: platformInfo.windows.requirement, badge: 'First', status: 'neutral' },
  { label: 'Browsers', value: 'Chrome, Edge, Brave or Firefox, current versions' },
  { label: 'Linux', value: 'x64: .deb, .rpm, pacman, AppImage or one command', badge: 'Coming soon', status: 'soon' },
  { label: 'macOS', value: platformInfo.macos.requirement, badge: 'Coming soon', status: 'soon' },
];

export function RequirementsSection() {
  return (
    <Reveal as="dl" stagger={40} className="dl-reqs">
      {REQUIREMENTS.map((r) => (
        <div key={r.label} className="dl-req">
          <dt className="dl-req-label">
            {r.label}
            {r.badge && (
              <Badge variant={r.status} dot={r.status === 'soon'}>
                {r.badge}
              </Badge>
            )}
          </dt>
          <dd className="dl-req-value">{r.value}</dd>
        </div>
      ))}
    </Reveal>
  );
}

// ── Verify ──
export function VerifySection() {
  const releases = site.repo ? `${site.repo}/releases` : '';
  return (
    <div className="flex flex-col gap-5">
      <Reveal>
        <ChecksumTabs />
      </Reveal>
      <Reveal className="dl-verify-foot">
        <p className="text-sm text-fd-muted-foreground">
          Compare the output with the SHA-256 shown next to the file on this page. They must match exactly.
        </p>
        <div className="flex flex-wrap gap-2">
          {releases && (
            <a href={releases} target="_blank" rel="noopener noreferrer" className="dl-pill-link">
              <BookOpen aria-hidden /> Release notes
            </a>
          )}
          <Link href={GUIDE.install} className="dl-pill-link">
            <Hammer aria-hidden /> Install guide
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
