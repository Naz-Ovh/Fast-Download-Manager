// The Race: one connection against eight, started when the card scrolls into view, restarted by Replay.
// The motion is CSS (landing.css, "Race"); this component only adds is-running and re-mounts the tracks
// (key) to replay. Percent labels only: it illustrates parallel segments, it is not a benchmark.
import { Check, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';

// [start, end] of each of the 8 segments on the shared 0-100 progress of the 8-connection run.
const SEGMENTS: readonly [number, number][] = [
  [0, 92],
  [4, 100],
  [2, 95],
  [8, 98],
  [5, 90],
  [10, 100],
  [3, 94],
  [7, 97],
];

function Done() {
  return (
    <span className="lp-race-done" aria-hidden>
      <Check />
      Done
    </span>
  );
}

export function Race() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRun(1);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setRun((r) => r || 1);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="lp-race fdm-card">
      <div key={run} className={cn('lp-race-tracks', run > 0 && 'is-running')}>
        <div className="lp-race-row lp-race-one">
          <div className="lp-race-meta">
            <span className="font-medium">One connection</span>
            <Done />
            <span className="lp-race-pct fdm-num" aria-hidden />
          </div>
          <div className="lp-race-track" aria-hidden>
            <span className="lp-race-fill" />
            <span className="lp-race-run">
              <span className="lp-race-head" />
            </span>
          </div>
        </div>

        <div className="lp-race-row lp-race-many">
          <div className="lp-race-meta">
            <span className="font-medium">
              Fast Download Manager <span className="text-fd-muted-foreground">· 8 connections</span>
            </span>
            <Done />
            <span className="lp-race-pct fdm-num" aria-hidden />
          </div>
          <div className="lp-race-track lp-race-segs" aria-hidden>
            {SEGMENTS.map(([start, end]) => (
              <span
                key={start}
                className="lp-race-seg"
                style={{ '--s': `${start}%`, '--k': (100 / (end - start)).toFixed(4) } as CSSProperties}
              >
                <span className="lp-race-seg-fill" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="lp-race-foot">
        <p className="text-xs text-fd-muted-foreground">
          Illustration. Real results depend on the server and your connection.
        </p>
        <button type="button" className="fdm-btn fdm-btn-secondary fdm-btn-sm" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw aria-hidden />
          Replay
        </button>
      </div>
    </div>
  );
}
