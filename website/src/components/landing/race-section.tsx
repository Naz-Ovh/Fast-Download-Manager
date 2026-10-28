// "Why it feels fast": the parallel-segments explanation next to the Race.
import { Layers, RefreshCw, Save, Split } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { Race } from './race';

const POINTS = [
  { icon: Split, text: 'The file is split into segments, and every connection takes one.' },
  { icon: Layers, text: 'A connection that finishes takes over an idle neighbor’s range.' },
  { icon: RefreshCw, text: 'A stalled connection restarts on its own, with retries and backoff.' },
  { icon: Save, text: 'Stop whenever you like. The download resumes from its saved segment list.' },
];

export function RaceSection() {
  return (
    <section id="why-fast" className="py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="flex flex-col gap-4">
          <p className="fdm-eyebrow">Why it feels fast</p>
          <h2 className="fdm-heading text-3xl sm:text-4xl">One file, many connections.</h2>
          <p className="text-lg text-fd-muted-foreground">
            Servers often limit each connection. Several connections at once share the work, and their speeds add up.
          </p>
          <ul className="mt-2 flex flex-col gap-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3">
                <span className="lp-point-icon">
                  <Icon aria-hidden />
                </span>
                <span className="pt-0.5 text-fd-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={60}>
          <Race />
        </Reveal>
      </Container>
    </section>
  );
}
