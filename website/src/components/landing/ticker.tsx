// Fast marquee of capabilities (~18 s per loop). The list is rendered twice and the track moves by half its
// width, so the loop has no seam. Pauses on hover; static and wrapped with reduced motion.
const ITEMS = [
  'Up to 32 connections',
  'Chrome',
  'Edge',
  'Brave',
  'Firefox',
  'HLS',
  'AES-128',
  'DASH',
  'MP4',
  'MKV',
  'No ffmpeg',
  'Pause and resume',
  'Automatic retries',
  'Speed limiter',
  'Categories',
  '39 languages',
  'Right to left',
  'fdm command line',
];

function List({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="lp-ticker-list" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function Ticker() {
  return (
    <section className="lp-ticker" aria-label="Capabilities">
      <div className="lp-ticker-track">
        <List />
        <List hidden />
      </div>
    </section>
  );
}
