// Hero visual: one download the way the engine runs it. Connections ramp up (1, 2, 4, 8), every lane fills
// its segment at its own pace, the lanes merge into one file, "Complete", the icon's three blocks land.
// Pure CSS (landing.css, "Download Stage"): the lanes, the percent and the clock all follow registered custom
// properties animated on .lp-stage, so no JavaScript runs. Reduced motion shows the finished state.
import { Check } from 'lucide-react';
import type { CSSProperties } from 'react';
import { ChunkMark } from './chunk-mark';

// [color, start, end]: start and end are points of the shared fill progress (0-100) where the lane begins
// and finishes. Starts follow the engine's ramp-up: 1 connection, then 2, then 4, then 8.
const LANES: readonly [string, number, number][] = [
  ['#7CF5C6', 0, 86],
  ['#5FEBBB', 5, 94],
  ['#45E0B0', 11, 100],
  ['#20C997', 11, 90],
  ['#12B886', 18, 97],
  ['#0CA678', 18, 84],
  ['#099268', 18, 100],
  ['#087F5B', 18, 92],
];

function laneStyle([color, start, end]: (typeof LANES)[number]): CSSProperties {
  return {
    '--lane': color,
    '--s': `${start}%`,
    '--k': (100 / (end - start)).toFixed(4),
  } as CSSProperties;
}

export function DownloadStage() {
  return (
    <figure
      className="lp-stage"
      role="img"
      aria-label="Illustration: a file downloads over 8 connections at once, the parts merge into one file, and the download completes."
    >
      <div className="lp-stage-head" aria-hidden>
        <ChunkMark size={40} motion="stage" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#e6f2ee]">release-build.zip</p>
          <p className="fdm-num truncate text-xs text-[#8fa8a1]">
            1.8 GB<span className="max-sm:hidden"> · 8 connections</span>
          </p>
        </div>
        <span className="lp-stage-pill">
          <span className="lp-stage-pill-run">
            <span className="lp-stage-pill-dot" />
            Downloading
          </span>
          <span className="lp-stage-pill-done">
            <Check className="size-3" />
            Complete
          </span>
        </span>
      </div>

      <div className="lp-stage-body" aria-hidden>
        <div className="lp-lanes">
          {LANES.map((lane, i) => (
            <div key={lane[0]} className="lp-lane" style={laneStyle(lane)}>
              <span className="lp-lane-label fdm-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lp-lane-track">
                <span className="lp-lane-fill" />
                <span className="lp-lane-run">
                  <span className="lp-lane-head" />
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="lp-merged">
          <span className="lp-merged-bar" />
          <span className="lp-merged-label">
            <span className="lp-merged-check">
              <Check />
            </span>
            Complete <span className="fdm-num text-[#8fa8a1]">· 8 segments, 1 file</span>
          </span>
        </div>
      </div>

      <div className="lp-stage-foot" aria-hidden>
        <div className="flex items-baseline gap-5">
          <span className="lp-readout">
            <span className="lp-pct fdm-num" />
            <span className="lp-readout-label">done</span>
          </span>
          <span className="lp-readout">
            <span className="lp-clock fdm-num" />
            <span className="lp-readout-label">elapsed</span>
          </span>
        </div>
        <span className="lp-readout items-end">
          <span className="lp-conns">
            {LANES.map((lane) => (
              <span key={lane[0]} style={{ '--s': `${lane[1]}%`, '--lane': lane[0] } as CSSProperties} />
            ))}
          </span>
          <span className="lp-readout-label">connections</span>
        </span>
      </div>
    </figure>
  );
}
