// Video: a CSS-built player with the extension's in-page download button and its quality menu sliding in.
// No real screenshot and no third-party branding. Loop in landing.css ("Video"); reduced motion shows the
// open menu, static.
import { Captions, Check, Maximize, MousePointer2, Play, Settings, Volume2 } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Container } from '@/components/ui/container';

// The one-color tray arrow (assets/brand/tray.svg), drawn inside the in-page button.
const TRAY: readonly [number, number][] = [
  [5, 1], [7, 0], [9, 1], [5, 4], [7, 4], [9, 4], [5, 6], [7, 6], [9, 6], [1, 8], [3, 8], [5, 8], [7, 8],
  [9, 8], [11, 8], [13, 8], [3, 10], [5, 10], [7, 10], [9, 10], [11, 10], [5, 12], [7, 12], [9, 12], [7, 14],
];

function TrayArrow() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" shapeRendering="crispEdges" aria-hidden focusable="false">
      {TRAY.map(([x, y]) => (
        <rect key={`${x},${y}`} x={x} y={y} width="2" height="2" fill="currentColor" />
      ))}
    </svg>
  );
}

const QUALITIES = [
  { label: 'quality 1080p', type: 'MP4' },
  { label: 'quality 720p', type: 'MP4' },
  { label: 'quality 480p', type: 'MP4', minor: true },
  { label: '128 kbps (audio only)', type: 'M4A' },
];

const POINTS = [
  'HLS and DASH streams save as one file, video and audio merged.',
  'Every quality the page offers, with its type, in one menu.',
  'The toolbar popup lists every video and audio on the page.',
  'Drag the button anywhere. Each site remembers its spot.',
];

function Player() {
  return (
    <div className="lp-player-wrap" role="img" aria-label="Illustration: a video player with a small download button in its top-right corner and a menu of qualities.">
      <div className="lp-player" aria-hidden>
        <div className="lp-player-scene">
          <span className="lp-scene-sun" />
          <span className="lp-scene-hill lp-scene-hill-1" />
          <span className="lp-scene-hill lp-scene-hill-2" />
        </div>
        <span className="lp-player-btn">
          <TrayArrow />
        </span>
        <div className="lp-player-menu">
          <p className="lp-menu-title">Download this video</p>
          <p className="lp-menu-item max-sm:hidden">Download all</p>
          <span className="lp-menu-sep" />
          {QUALITIES.map((q, i) => (
            <p key={q.label} className={`lp-menu-item lp-menu-q${i === 0 ? ' lp-menu-pick' : ''}${q.minor ? ' max-sm:hidden' : ''}`}>
              <span>{q.label}</span>
              <span className="lp-menu-type fdm-num">{q.type}</span>
            </p>
          ))}
          <span className="lp-menu-sep max-xl:hidden" />
          <p className="lp-menu-item lp-menu-minor max-xl:hidden">About this panel</p>
          <p className="lp-menu-item lp-menu-minor max-xl:hidden">Close</p>
        </div>
        <MousePointer2 className="lp-player-cursor" />
        <div className="lp-player-bar">
          <Play className="size-4 fill-current" />
          <span className="lp-player-progress">
            <span />
          </span>
          <span className="fdm-num text-[11px] text-white/80">1:24 / 4:10</span>
          <span className="ms-auto flex items-center gap-3 text-white/80">
            <Volume2 className="size-4" />
            <Captions className="size-4 max-sm:hidden" />
            <Settings className="size-4" />
            <Maximize className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function VideoSection() {
  return (
    <section id="video" className="py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal className="flex flex-col gap-4 lg:order-2">
          <p className="fdm-eyebrow">Video</p>
          <h2 className="fdm-heading text-3xl sm:text-4xl">Play it. Then keep it.</h2>
          <p className="text-lg text-fd-muted-foreground">
            When a page plays a video, a small button appears in the corner of the player. Pick a quality and the
            app takes it from there.
          </p>
          <ul className="mt-2 flex flex-col gap-3">
            {POINTS.map((text) => (
              <li key={text} className="flex gap-3">
                <span className="lp-point-icon">
                  <Check aria-hidden />
                </span>
                <span className="pt-0.5 text-fd-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={60} className="lg:order-1">
          <Player />
        </Reveal>
      </Container>
    </section>
  );
}
