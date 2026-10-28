// How it works: three steps, each with a small CSS illustration in the chunk motif.
import { Download, Globe, MousePointer2 } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { ChunkMark } from './chunk-mark';

function ClickArt() {
  return (
    <div className="lp-step-art" aria-hidden>
      <span className="lp-link">
        <Download />
        <span className="fdm-num">release-build.zip</span>
      </span>
      <MousePointer2 className="lp-step-cursor" />
    </div>
  );
}

function HandoffArt() {
  return (
    <div className="lp-step-art" aria-hidden>
      <div className="lp-handoff">
        <span className="lp-node">
          <Globe />
        </span>
        <span className="lp-wire">
          <span className="lp-packet" />
          <span className="lp-packet" style={{ animationDelay: '0.6s' } as CSSProperties} />
          <span className="lp-packet" style={{ animationDelay: '1.2s' } as CSSProperties} />
        </span>
        <span className="lp-node lp-node-app">
          <ChunkMark size={30} />
        </span>
      </div>
    </div>
  );
}

// The icon's arrow on a 7 x 8 grid (row 1 stays empty): [row, first column, last column, color]; row 0 is the arriving blocks.
const ARROW: readonly [number, number, number, string][] = [
  [0, 2, 4, '#7CF5C6'],
  [2, 2, 4, '#45E0B0'],
  [3, 2, 4, '#20C997'],
  [4, 0, 6, '#12B886'],
  [5, 1, 5, '#0CA678'],
  [6, 2, 4, '#099268'],
  [7, 3, 3, '#087F5B'],
];

function AssembleArt() {
  return (
    <div className="lp-step-art" aria-hidden>
      <div className="lp-assemble">
        {ARROW.flatMap(([row, from, to, color]) =>
          Array.from({ length: to - from + 1 }, (_, j) => {
            const col = from + j;
            return (
              <span
                key={`${row}-${col}`}
                className="lp-block"
                style={
                  {
                    gridRow: row + 1,
                    gridColumn: col + 1,
                    '--c': color,
                    animationDelay: `${(((col * 5 + (7 - row) * 3) % 9) * 60).toFixed(0)}ms`,
                  } as CSSProperties
                }
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

const STEPS: { title: string; body: string; art: ReactNode }[] = [
  {
    title: 'Click a link',
    body: 'Download a file the way you always do, or play a video and pick a quality from its button.',
    art: <ClickArt />,
  },
  {
    title: 'The extension hands it over',
    body: 'The browser’s download stops and the app takes it, with the same cookies, referrer and headers.',
    art: <HandoffArt />,
  },
  {
    title: 'Segments arrive in parallel',
    body: 'Connections ramp up and fetch their segments at once. They land in one file, which moves into place when done.',
    art: <AssembleArt />,
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Three steps, most of them automatic."
      className="lp-how"
    >
      <Reveal as="ol" stagger={40} className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="lp-step fdm-card">
            {step.art}
            <div className="flex flex-col gap-2 p-6 pt-5">
              <p className="lp-step-num fdm-num">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-fd-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
