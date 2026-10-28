// "All downloads": one card per desktop OS listing every format row, then the browser extension card and the
// command line card. Every value comes from src/lib/downloads.ts; a 'soon' row never links its URL.
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import Link from 'fumadocs-core/link';
import { Fragment } from 'react';
import { Badge, statusLabel } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { Reveal } from '@/components/ui/reveal';
import {
  archLabels,
  downloads,
  formatLabels,
  osLabels,
  platformInfo,
  platformOrder,
  type DownloadEntry,
  type DownloadOs,
  type DownloadStatus,
} from '@/lib/downloads';
import { Command } from './command';
import { OsIcon } from './os-icon';

const EXTENSION_GUIDE = '/docs/guide/browser-extension/';
const CLI_EXAMPLE = 'fdm get https://example.com/big-file.zip ./Downloads 16';

function groupStatus(os: DownloadOs): DownloadStatus {
  return downloads.some((d) => d.os === os && d.status === 'available') ? 'available' : 'soon';
}

function rowsOf(os: DownloadOs) {
  return downloads.filter((d) => d.os === os);
}

function FileRow({ d }: { d: DownloadEntry }) {
  const live = d.status === 'available' && d.url !== '';
  return (
    <li id={d.id} className={`dl-row${d.primary ? ' is-primary' : ''}`}>
      <div className="dl-row-main">
        <div className="dl-row-head">
          <span className="dl-row-label">{d.label}</span>
          {d.primary && <span className="dl-row-tag">Recommended</span>}
        </div>
        <p className="dl-row-meta fdm-num">
          {[formatLabels[d.format], archLabels[d.arch], d.size].filter(Boolean).map((part, i) => (
            // The separator stays outside the no-wrap span, so lines break between parts, never inside one.
            <Fragment key={i}>
              {i > 0 && ' · '}
              <span className="whitespace-nowrap">{part}</span>
            </Fragment>
          ))}
        </p>
        {d.file && <p className="dl-row-file fdm-num">{d.file}</p>}
      </div>
      <div className="dl-row-side">
        {live ? (
          <a href={d.url} className="dl-get" download>
            Download <ArrowDown aria-hidden />
          </a>
        ) : (
          <Badge variant={d.status}>{d.status === 'soon' ? 'Soon' : statusLabel[d.status]}</Badge>
        )}
      </div>
      {d.sha256 && (
        <p className="dl-row-sha">
          <span className="dl-row-sha-label fdm-num">SHA-256</span>
          <code title={d.sha256}>{d.sha256}</code>
          <CopyButton text={d.sha256} ariaLabel={`Copy SHA-256 of ${d.file ?? d.label}`} />
        </p>
      )}
    </li>
  );
}

function CardHead({ os, sub }: { os: DownloadOs; sub: string }) {
  const status = groupStatus(os);
  return (
    <header className="dl-card-head">
      <span className="dl-os-tile">
        <OsIcon os={os} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <h3 id={`${os}-title`} className="fdm-heading text-xl">
            {osLabels[os]}
          </h3>
          <Badge variant={status}>{statusLabel[status]}</Badge>
        </div>
        <p className="dl-card-sub fdm-num">{sub}</p>
      </div>
    </header>
  );
}

function OsCard({ os }: { os: (typeof platformOrder)[number] }) {
  const rows = rowsOf(os);
  const command = rows.find((d) => d.install);
  const files = rows.filter((d) => d !== command);
  return (
    <Card as="article" id={os} interactive padding="none" className="dl-card" aria-labelledby={`${os}-title`}>
      <CardHead os={os} sub={platformInfo[os].requirement} />
      <p className="dl-card-hint">{platformInfo[os].hint}</p>
      {platformInfo[os].setup && (
        <ul className="dl-setup" aria-label="What setup does">
          {platformInfo[os].setup.map((line) => (
            <li key={line}>
              <Check aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      )}
      {command?.install && (
        <div id={command.id} className="dl-card-cmd">
          <p className="dl-mini-label">
            {command.label}
            {command.status === 'soon' && <span> · with the {osLabels[os]} release</span>}
          </p>
          <Command text={command.install} live={command.status === 'available'} label={command.label} />
        </div>
      )}
      <ul className="dl-rows">
        {files.map((d) => (
          <FileRow key={d.id} d={d} />
        ))}
      </ul>
    </Card>
  );
}

function BrowserCard() {
  const rows = rowsOf('browser');
  return (
    <Card as="article" id="browser" interactive padding="none" className="dl-card" aria-labelledby="browser-title">
      <CardHead os="browser" sub="Chrome · Edge · Brave · Firefox" />
      <p className="dl-card-hint">
        The extension hands downloads and videos from your browser to the app. It ships inside every package.
      </p>
      <div className="dl-today">
        <span className="dl-today-tag fdm-num">Today</span>
        <p>
          Loaded unpacked from the install folder, once.{' '}
          <Link href={EXTENSION_GUIDE} className="dl-link">
            How to load it <ArrowRight aria-hidden />
          </Link>
        </p>
      </div>
      <ul className="dl-rows">
        {rows.map((d) => (
          <li key={d.id} id={d.id} className="dl-row">
            <div className="dl-row-main">
              <span className="dl-row-label">{d.label}</span>
              {d.notes && <p className="dl-row-meta">{d.notes}</p>}
            </div>
            <div className="dl-row-side">
              {d.status === 'available' && d.url ? (
                <a href={d.url} className="dl-get" target="_blank" rel="noopener noreferrer">
                  Add <ArrowRight aria-hidden />
                </a>
              ) : (
                <Badge variant={d.status}>{d.status === 'soon' ? 'Soon' : statusLabel[d.status]}</Badge>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CliCard() {
  const cli = rowsOf('cli')[0];
  return (
    <Card as="article" id="cli" interactive padding="none" className="dl-card" aria-labelledby="cli-title">
      <CardHead os="cli" sub="fdm get · fdm dash · fdm mux" />
      <p className="dl-card-hint">
        {cli?.notes ?? 'Included in every package.'} Ctrl+C saves the state; run the same command again to resume.
      </p>
      <div className="dl-card-cmd">
        <p className="dl-mini-label">Download one file over 16 connections</p>
        <Command text={CLI_EXAMPLE} label="fdm example" />
      </div>
      {cli?.install && (
        <p className="dl-usage fdm-num">
          <span>usage</span> {cli.install}
        </p>
      )}
    </Card>
  );
}

export function DownloadMatrix() {
  return (
    <div className="flex flex-col gap-5">
      <Reveal stagger={40} className="dl-grid-os">
        {platformOrder.map((os) => (
          <OsCard key={os} os={os} />
        ))}
      </Reveal>
      <Reveal stagger={40} className="dl-grid-extra">
        <BrowserCard />
        <CliCard />
      </Reveal>
    </div>
  );
}
