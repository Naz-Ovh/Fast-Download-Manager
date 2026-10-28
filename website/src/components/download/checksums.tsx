// "Verify your download": the SHA-256 command per OS. From md up the three are side by side; on phones a
// segmented tab bar shows one at a time, starting with the visitor's OS.
import { useEffect, useState } from 'react';
import { downloads, osLabels, platformOrder } from '@/lib/downloads';
import type { Platform } from '@/lib/site';
import { Command } from './command';
import { OsIcon } from './os-icon';
import { usePlatform } from './use-platform';

const TOOLS: Record<Platform, { shell: string; command: (file: string) => string }> = {
  windows: { shell: 'PowerShell', command: (f) => `Get-FileHash .\\${f} -Algorithm SHA256` },
  linux: { shell: 'Terminal', command: (f) => `sha256sum ${f}` },
  macos: { shell: 'Terminal', command: (f) => `shasum -a 256 ${f}` },
};

/** Sample file per OS: its first package file (the .msi, the .deb, the Apple silicon .dmg). */
function sampleFile(os: Platform) {
  return downloads.find((d) => d.os === os && d.file && d.format !== 'sh')?.file ?? 'file';
}

export function ChecksumTabs() {
  const detected = usePlatform();
  const [active, setActive] = useState<Platform>('windows');
  useEffect(() => setActive(detected), [detected]);

  return (
    <div className="dl-tabs">
      <div className="dl-tablist" role="tablist" aria-label="Operating system">
        {platformOrder.map((os) => (
          <button
            key={os}
            type="button"
            role="tab"
            id={`sum-tab-${os}`}
            aria-controls={`sum-panel-${os}`}
            aria-selected={active === os}
            tabIndex={active === os ? 0 : -1}
            className="dl-tab"
            onClick={() => setActive(os)}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
              const i = platformOrder.indexOf(active);
              const next = platformOrder[(i + (e.key === 'ArrowRight' ? 1 : platformOrder.length - 1)) % platformOrder.length];
              setActive(next);
              document.getElementById(`sum-tab-${next}`)?.focus();
            }}
          >
            <OsIcon os={os} size={16} />
            {osLabels[os]}
          </button>
        ))}
      </div>
      <div className="dl-tabpanels">
        {platformOrder.map((os) => {
          const file = sampleFile(os);
          return (
            <div
              key={os}
              role="tabpanel"
              id={`sum-panel-${os}`}
              aria-labelledby={`sum-tab-${os}`}
              className="dl-tabpanel"
              data-active={active === os ? '' : undefined}
            >
              <p className="dl-tabpanel-head">
                <OsIcon os={os} size={18} />
                <span className="font-semibold">{osLabels[os]}</span>
                <span className="dl-tabpanel-shell fdm-num">{TOOLS[os].shell}</span>
              </p>
              <Command text={TOOLS[os].command(file)} label={`${osLabels[os]} checksum`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
