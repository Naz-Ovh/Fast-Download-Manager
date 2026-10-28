// Docs home header: eyebrow, title, lead and the chunk motif (the logo with download lanes filling block by block,
// once on load). Server component; styles in ./docs.css (.fdm-docs-hero*, .fdm-lanes*).
import type { CSSProperties } from 'react';
import { Logo } from '@/components/brand/logo';
import { site } from '@/lib/site';

// Lane colors follow the icon's rows, top to bottom.
const LANES = ['#7CF5C6', '#45E0B0', '#20C997', '#12B886', '#0CA678'];
const BLOCKS = 9;

export function DocsHero({ title, description }: { title: string; description?: string }) {
  return (
    <header className="fdm-docs-hero">
      <div className="fdm-docs-hero-text">
        <p className="fdm-eyebrow">Documentation · v{site.version}</p>
        <h1 className="fdm-heading fdm-docs-hero-title">{title}</h1>
        {description && <p className="fdm-docs-hero-lead">{description}</p>}
      </div>
      <div className="fdm-lanes" aria-hidden>
        <Logo size={44} className="fdm-lanes-logo" />
        <div className="fdm-lanes-rows">
          {LANES.map((color, lane) => (
            <div key={color} className="fdm-lane" style={{ '--lane': color, '--l': lane } as CSSProperties}>
              {Array.from({ length: BLOCKS }, (_, b) => (
                <span key={b} style={{ '--b': b } as CSSProperties} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
