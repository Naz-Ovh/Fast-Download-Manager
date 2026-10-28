// Platforms (Windows now, Linux and macOS coming) and the fdm command line with one example.
import { Monitor, SquareTerminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';

const PLATFORMS = [
  {
    name: 'Windows',
    status: 'available' as const,
    badge: 'Now',
    arch: 'x64',
    body: 'The app, the browser extension and the fdm command.',
  },
  {
    name: 'Linux',
    status: 'soon' as const,
    badge: 'Coming soon',
    arch: 'x64',
    body: 'A one-line installer, .deb, .rpm, pacman and AppImage packages are planned.',
  },
  {
    name: 'macOS',
    status: 'soon' as const,
    badge: 'Coming soon',
    arch: 'Apple silicon · Intel',
    body: 'A .dmg for both chip families is planned. The code is already cross-platform.',
  },
];

const COMMAND = String.raw`fdm get https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.10.tar.xz D:\Downloads 8`;

const COMMANDS = [
  { cmd: 'fdm get', text: 'download a file, resume it later' },
  { cmd: 'fdm dash', text: 'list a DASH stream and save one quality' },
  { cmd: 'fdm mux', text: 'merge video and audio into MP4 or MKV' },
];

export function Platforms() {
  return (
    <Section
      id="platforms"
      eyebrow="Platforms"
      title="Windows first. Linux and macOS next."
      lead="Built in Rust with every OS-specific part kept separate, so each port is a step, not a rewrite."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal stagger={40} className="flex flex-col gap-3">
          {PLATFORMS.map((p) => (
            <Card key={p.name} interactive padding="sm" className="lp-platform">
              <span className="lp-feature-icon">
                <Monitor aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className="fdm-num text-xs text-fd-muted-foreground">{p.arch}</span>
                  <Badge variant={p.status} className="ms-auto">
                    {p.badge}
                  </Badge>
                </div>
                <p className="text-sm text-fd-muted-foreground">{p.body}</p>
              </div>
            </Card>
          ))}
        </Reveal>

        <Reveal delay={60} className="lp-ink lp-term">
          <div className="lp-term-head">
            <span className="flex items-center gap-2 text-sm font-medium">
              <SquareTerminal className="size-4 text-[#45e0b0]" aria-hidden />
              Command line
            </span>
            <CopyButton text={COMMAND} ariaLabel="Copy the command" />
          </div>
          <div className="lp-term-body">
            <p className="lp-term-line">
              <span className="lp-term-prompt" aria-hidden>
                &gt;
              </span>
              <code>{COMMAND}</code>
            </p>
            <p className="lp-term-comment">
              # Ctrl+C saves the segment list. Run the same command again to resume.
            </p>
          </div>
          <ul className="lp-term-list" aria-label="Commands">
            {COMMANDS.map((c) => (
              <li key={c.cmd}>
                <code className="lp-term-cmd">{c.cmd}</code>
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
