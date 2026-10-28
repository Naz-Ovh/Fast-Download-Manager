// Download hero: an ink stage in both themes with a short CSS-only boot (transfer line, 8 speed streaks,
// speed-blur title), then the OS-aware primary button. The server HTML already carries every animation
// class, so nothing depends on JS to appear. Styles: download.css (.dl-stage ...).
import type { CSSProperties } from 'react';
import { site } from '@/lib/site';
import { PrimaryCta } from './primary-cta';

// [top %, width px, height px, delay ms, duration ms]. The last two keep passing every few seconds.
const STREAKS: readonly [number, number, number, number, number][] = [
  [14, 260, 1, 40, 460],
  [27, 140, 2, 120, 380],
  [39, 380, 1, 0, 560],
  [52, 200, 1, 220, 420],
  [63, 320, 2, 90, 620],
  [76, 120, 1, 300, 400],
  [33, 300, 1, 1600, 4200],
  [70, 220, 1, 3400, 5100],
];

const TITLE = [
  { word: 'Download', mint: false },
  { word: 'Fast', mint: true },
  { word: 'Download', mint: true },
  { word: 'Manager', mint: true },
];

export function DownloadHero() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-3 pt-3 sm:px-6 sm:pt-4">
      <section className="dl-stage" aria-labelledby="download-title">
        <div className="dl-stage-grid" aria-hidden />
        <div className="dl-stage-glow" aria-hidden />
        <div className="dl-transfer fdm-streak" aria-hidden />
        <div className="dl-streaks" aria-hidden>
          {STREAKS.map(([top, w, h, delay, dur], i) => (
            <span
              key={i}
              className={`dl-streak fdm-streak${i >= 6 ? ' is-loop' : ''}`}
              style={
                {
                  '--y': `${top}%`,
                  '--w': `${w}px`,
                  '--h': `${h}px`,
                  '--delay': `${delay}ms`,
                  '--dur': `${dur}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="dl-stage-inner">
          <p className="dl-pill dl-rise" style={{ '--delay': '60ms' } as CSSProperties}>
            <span className="dl-pill-dot" aria-hidden />
            <span className="fdm-num">Version {site.version}</span>
            <span className="dl-pill-sep" aria-hidden />
            <span>Windows first</span>
          </p>

          <h1 id="download-title" className="dl-title fdm-heading">
            {TITLE.map(({ word, mint }, i) => (
              <span key={i}>
                <span
                  className={`dl-word${mint ? ' is-mint' : ''}`}
                  style={{ '--i': i } as CSSProperties}
                >
                  {word}
                </span>
                {i === 0 ? <br /> : i < TITLE.length - 1 ? ' ' : null}
              </span>
            ))}
          </h1>

          <p className="dl-lead dl-rise" style={{ '--delay': '340ms' } as CSSProperties}>
            One package holds the app, the browser extension, the native host and the fdm command. Windows comes
            first; Linux and macOS follow.
          </p>

          <PrimaryCta />
        </div>
      </section>
    </div>
  );
}
