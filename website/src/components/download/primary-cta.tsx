// The one big call to action in the download hero, for the visitor's OS (Windows on the server and for
// unknown systems). Two states from src/lib/downloads.ts:
// - 'soon': still a strong button, but it says the build is coming and links to the build-from-source guide.
// - 'available': a real download link with size and SHA-256 under it. A row with an `install` command (the
//   Linux one-liner) shows that command with a copy button instead.
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'fumadocs-core/link';
import { Fragment, type CSSProperties } from 'react';
import { Logo } from '@/components/brand/logo';
import { CopyButton } from '@/components/ui/copy-button';
import {
  archLabels,
  downloads,
  formatLabels,
  osLabels,
  platformInfo,
  platformOrder,
  primaryDownloadFor,
  type DownloadEntry,
} from '@/lib/downloads';
import { site, type Platform } from '@/lib/site';
import { OsIcon } from './os-icon';
import { usePlatform } from './use-platform';

const INSTALL_GUIDE = '/docs/guide/install/';

function shortHash(sha: string) {
  return sha.length > 20 ? `${sha.slice(0, 10)}…${sha.slice(-10)}` : sha;
}

/** "v0.2.0 · x64 · .msi · 14.2 MB"; lines break only between parts. */
function metaLine(d: DownloadEntry) {
  return [`v${site.version}`, archLabels[d.arch], formatLabels[d.format], d.size]
    .filter(Boolean)
    .map((part, i) => (
      <Fragment key={i}>
        {i > 0 && ' · '}
        <span className="whitespace-nowrap">{part}</span>
      </Fragment>
    ));
}

function osStatus(os: Platform) {
  return downloads.some((d) => d.os === os && d.status === 'available') ? 'available' : 'soon';
}

export function PrimaryCta() {
  const os = usePlatform();
  const d = primaryDownloadFor(os);
  const name = osLabels[os];
  const live = d.status === 'available' && (d.url !== '' || !!d.install);
  const others = platformOrder.filter((p) => p !== os);
  // The macOS card has a second processor type; offer it right under the button.
  const alt = downloads.find((x) => x.os === os && x.id !== d.id && x.format === d.format);

  return (
    <div className="dl-cta-wrap dl-rise" style={{ '--delay': '420ms' } as CSSProperties} data-os={os}>
      {!live ? (
        <Link href={INSTALL_GUIDE} className="dl-cta" aria-label={`${name} build coming soon. See the install guide`}>
          <span className="dl-cta-logo">
            <Logo size={44} />
          </span>
          <span className="dl-cta-text">
            <span className="dl-cta-title">{name} build coming soon</span>
            <span className="dl-cta-sub">See the install guide</span>
          </span>
          <ArrowRight className="dl-cta-arrow" aria-hidden />
        </Link>
      ) : d.install ? (
        <div className="dl-cta-cmd">
          <span className="dl-cta-cmd-label">
            <OsIcon os={os} size={16} /> Install on {name}
          </span>
          <div className="dl-cta-cmd-row">
            <code>
              <span className="dl-prompt" aria-hidden>
                ${' '}
              </span>
              {d.install}
            </code>
            <CopyButton text={d.install} label="Copy" />
          </div>
        </div>
      ) : (
        <a href={d.url} className="dl-cta" download>
          <span className="dl-cta-logo">
            <Logo size={44} />
          </span>
          <span className="dl-cta-text">
            <span className="dl-cta-title">Download for {name}</span>
            <span className="dl-cta-sub">{metaLine(d)}</span>
          </span>
          <ArrowDown className="dl-cta-arrow is-down" aria-hidden />
        </a>
      )}

      <div className="dl-cta-meta">
        {!live && (
          <span className="fdm-num">
            v{site.version} · {formatLabels[d.format]} · {platformInfo[os].requirement}
          </span>
        )}
        {live && !d.install && d.sha256 && (
          <span className="dl-sha">
            <span className="fdm-num">SHA-256</span>
            <code title={d.sha256}>{shortHash(d.sha256)}</code>
            <CopyButton text={d.sha256} ariaLabel="Copy SHA-256" />
          </span>
        )}
        {live && d.install && (
          <span>
            Or pick a package for your distribution <a href={`#${os}`}>below</a>.
          </span>
        )}
        {live && alt && alt.status === 'available' && alt.url && (
          <span>
            {alt.label}? <a href={alt.url}>Get the {alt.label} build</a>
          </span>
        )}
      </div>

      <nav className="dl-chips" aria-label="Other platforms">
        {others.map((p) => (
          <a key={p} href={`#${p}`} className="dl-chip">
            <OsIcon os={p} size={16} />
            <span>{osLabels[p]}</span>
            <span className={`dl-chip-dot is-${osStatus(p)}`} aria-hidden />
            <span className="sr-only">{osStatus(p) === 'available' ? 'available' : 'coming soon'}</span>
          </a>
        ))}
        <a href="#all-downloads" className="dl-chip is-plain">
          All downloads
          <ArrowDown size={14} aria-hidden />
        </a>
      </nav>
    </div>
  );
}
