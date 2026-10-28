// Hero on the ink stage (dark in both themes). The Boot plays on every load with CSS alone (landing.css,
// "Boot"): the transfer line, speed streaks, the headline word by word with a speed blur, then the lead, the
// CTAs and the Download Stage. The server HTML already carries every animation class, so nothing flashes and
// no JavaScript is needed; the h1 is the LCP element.
import { Globe, Monitor } from 'lucide-react';
import { Fragment, type CSSProperties } from 'react';
import { site } from '@/lib/site';
import { CtaButtons } from './cta-buttons';
import { CursorGlow } from './cursor-glow';
import { DownloadStage } from './download-stage';

// Boot streaks: [top %, width px, delay ms, duration ms, travel end vw, thickness px].
const BOOT_STREAKS: readonly [number, number, number, number, number, number][] = [
  [8, 260, 40, 520, 92, 1],
  [14, 120, 160, 420, 70, 1],
  [21, 380, 0, 600, 105, 2],
  [27, 90, 260, 380, 55, 1],
  [33, 300, 90, 560, 98, 1],
  [39, 160, 330, 450, 80, 2],
  [45, 420, 120, 650, 110, 1],
  [51, 110, 420, 400, 60, 1],
  [57, 240, 200, 540, 95, 2],
  [62, 80, 480, 380, 50, 1],
  [68, 340, 60, 620, 104, 1],
  [74, 140, 300, 440, 75, 2],
  [80, 280, 180, 580, 100, 1],
  [86, 100, 380, 410, 65, 1],
  [91, 220, 240, 500, 88, 1],
  [96, 360, 20, 640, 108, 1],
];

// After the boot: a few sparse streaks keep passing. [top %, width px, delay s, period s].
const IDLE_STREAKS: readonly [number, number, number, number][] = [
  [18, 320, 1.4, 4.2],
  [43, 180, 2.6, 3.6],
  [66, 400, 3.3, 5.0],
  [84, 220, 4.4, 4.6],
  [30, 260, 5.6, 4.8],
];

const LINE_1 = ['Split', 'every', 'download.'];
const LINE_2 = ['Finish', 'sooner.'];

function Word({ text, i, accent }: { text: string; i: number; accent?: boolean }) {
  return (
    <span className={accent ? 'lp-word lp-word-accent' : 'lp-word'} style={{ '--i': i } as CSSProperties}>
      {text}
    </span>
  );
}

export function Hero() {
  return (
    <div className="lp-hero-wrap">
      <section className="lp-ink lp-hero" aria-labelledby="lp-hero-title">
        <div aria-hidden className="lp-hero-bg" />
        <div aria-hidden className="lp-hero-grid" />
        <CursorGlow />
        <div aria-hidden className="lp-transfer fdm-streak" />
        <div aria-hidden className="lp-streaks">
          {BOOT_STREAKS.map(([top, w, delay, dur, to, h]) => (
            <span
              key={`b${top}`}
              className="lp-streak fdm-streak"
              style={
                {
                  top: `${top}%`,
                  width: w,
                  height: h,
                  animationDelay: `${delay}ms`,
                  animationDuration: `${dur}ms`,
                  '--to': `${to}vw`,
                } as CSSProperties
              }
            />
          ))}
          {IDLE_STREAKS.map(([top, w, delay, period]) => (
            <span
              key={`i${top}`}
              className="lp-streak lp-streak-idle fdm-streak"
              style={{ top: `${top}%`, width: w, animationDelay: `${delay}s`, animationDuration: `${period}s` }}
            />
          ))}
        </div>

        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <p className="lp-hero-kicker lp-rise" style={{ '--d': '0ms' } as CSSProperties}>
              <span className="lp-kicker-dot" aria-hidden />
              Download manager written in Rust
            </p>
            <h1 id="lp-hero-title" className="fdm-heading lp-hero-title">
              <span className="lp-line">
                {LINE_1.map((w, i) => (
                  <Fragment key={w}>
                    {i > 0 && ' '}
                    <Word text={w} i={i} />
                  </Fragment>
                ))}
              </span>{' '}
              <span className="lp-line">
                {LINE_2.map((w, i) => (
                  <Fragment key={w}>
                    {i > 0 && ' '}
                    <Word text={w} i={LINE_1.length + i} accent />
                  </Fragment>
                ))}
              </span>
            </h1>
            <p className="lp-hero-lead lp-rise" style={{ '--d': '430ms' } as CSSProperties}>
              {site.name} cuts each file into segments and fetches them over up to 32 connections at once. Stop
              any time and it resumes. Downloads and videos arrive straight from your browser.
            </p>
            <CtaButtons className="lp-rise" style={{ '--d': '520ms' } as CSSProperties} />
            <ul className="lp-trust lp-rise" style={{ '--d': '600ms' } as CSSProperties}>
              <li>
                <Monitor aria-hidden />
                Windows today · Linux and macOS coming
              </li>
              <li>
                <Globe aria-hidden />
                Chrome, Edge, Brave, Firefox
              </li>
            </ul>
          </div>
          <div className="lp-hero-visual">
            <DownloadStage />
          </div>
        </div>
      </section>
    </div>
  );
}
