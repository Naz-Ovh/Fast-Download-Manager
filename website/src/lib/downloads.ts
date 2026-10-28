// Every download the site offers, in one typed list. The download page and the landing CTA read this file.
//
// Flipping a package live: set `status: 'available'` and add `size` and `sha256` (the download page shows
// both next to the file and under the big button). Rows that are 'soon' keep their planned file name and
// URL so nothing else changes on release day, but pages must not link to a 'soon' URL. Only the Windows
// .msi name is fixed today (crates/fdm-pack/src/windows.rs); the other names follow each format's usual
// convention and are confirmed when their packager is built.
import { site, type Platform } from './site';

export type DownloadOs = Platform | 'browser' | 'cli';
export type DownloadFormat =
  | 'msi'
  | 'zip'
  | 'dmg'
  | 'deb'
  | 'rpm'
  | 'pacman'
  | 'appimage'
  | 'sh'
  | 'store'
  | 'crx'
  | 'binary';
export type DownloadArch = 'x64' | 'arm64' | 'any';
export type DownloadStatus = 'available' | 'soon';

export interface DownloadEntry {
  /** Stable key, also usable as an HTML id. */
  id: string;
  os: DownloadOs;
  /** Short human label, e.g. "Windows installer". */
  label: string;
  format: DownloadFormat;
  arch: DownloadArch;
  status: DownloadStatus;
  /** Where the file or listing lives. May be '' (unknown yet). Never link it while status is 'soon'. */
  url: string;
  /** File name inside the release, when the entry is a file. */
  file?: string;
  /** Human size, e.g. "12.4 MB". Only real, measured values. */
  size?: string;
  /** Lowercase hex SHA-256 of `file`. Only real, measured values. */
  sha256?: string;
  /** One or two short sentences shown under the label. */
  notes?: string;
  /** Command that installs (or, for the CLI, uses) this entry, shown with a copy button. */
  install?: string;
  /** The main call to action of its OS group (and, for Windows, of the whole site). */
  primary?: boolean;
}

/** Facts per desktop platform, shown on the download page. */
export interface PlatformInfo {
  /** Short requirement, e.g. "Windows 10 or 11, x64". */
  requirement: string;
  /** How setup behaves, one or two short sentences. */
  hint: string;
  /** What setup does, as short checklist lines (optional). */
  setup?: string[];
}

/** `${site.repo}/releases/latest/download/<file>`, or '' when no repo is set. */
export function releaseUrl(file: string): string {
  return site.repo ? `${site.repo}/releases/latest/download/${file}` : '';
}

const v = site.version;

function file(name: string): Pick<DownloadEntry, 'file' | 'url'> {
  return { file: name, url: releaseUrl(name) };
}

export const osLabels: Record<DownloadOs, string> = {
  windows: 'Windows',
  linux: 'Linux',
  macos: 'macOS',
  browser: 'Browser extension',
  cli: 'Command line',
};

/** Display order of the groups. */
export const osOrder: readonly DownloadOs[] = ['windows', 'linux', 'macos', 'browser', 'cli'];

/** Desktop platforms in display order (the OS cards of the download page). */
export const platformOrder: readonly Platform[] = ['windows', 'linux', 'macos'];

/** Short format names for labels and buttons. */
export const formatLabels: Record<DownloadFormat, string> = {
  msi: '.msi',
  zip: '.zip',
  dmg: '.dmg',
  deb: '.deb',
  rpm: '.rpm',
  pacman: '.pkg.tar.zst',
  appimage: '.AppImage',
  sh: 'shell script',
  store: 'store listing',
  crx: '.crx',
  binary: 'binary',
};

/** Architecture names for labels. */
export const archLabels: Record<DownloadArch, string> = {
  x64: 'x64',
  arm64: 'arm64',
  any: 'any',
};

export const platformInfo: Record<Platform, PlatformInfo> = {
  windows: {
    requirement: 'Windows 10 or 11, x64',
    hint: 'One .msi with everything inside. Setup asks once who it is for.',
    // crates/fdm-pack/src/windows.rs (scope, folders, shortcuts, settings kept) and the packaging plan
    // (starts with Windows by default).
    setup: [
      '"Just me": no admin needed, installs in your user folder',
      '"Everyone": for all users, asks for admin once',
      'Start menu shortcut, desktop shortcut if you want one',
      'Starts with Windows by default',
      'Updates keep your settings and download list',
    ],
  },
  linux: {
    requirement: 'x64, Wayland, glibc 2.31 or newer',
    hint: 'One command sets up everything: the app, the browser extension host and the fdm command. It asks for your password only if you choose "Everyone". Other package formats are still to come.',
    // crates/fdm-pack/src/linux/mod.rs (target/package/linux/, served at <site>/linux/) and
    // packages/…/fdm-setup-linux: the Just me / Everyone scopes, XDG autostart, Wayland only.
    setup: [
      '"Just me": no admin needed, installs in your user folder',
      '"Everyone": for all users, asks for your password once',
      'Menu entry and the fdm command, no package manager',
      'Starts with your session by default',
      'Wayland only (GNOME, KDE and others); no X11',
    ],
  },
  macos: {
    requirement: 'Apple silicon or Intel',
    hint: 'One disk image per processor type: Apple silicon (M-series) or Intel.',
  },
};

export const downloads: DownloadEntry[] = [
  // ── Windows ──
  {
    id: 'windows-msi-x64',
    os: 'windows',
    label: 'Windows installer',
    format: 'msi',
    arch: 'x64',
    status: 'soon',
    ...file(`FastDownloadManager-${v}-x64.msi`),
    notes:
      'Everything in one package: app, browser extension, native host and the fdm command. Install for just you (no admin) or for everyone.',
    primary: true,
  },

  // ── Linux ──
  {
    id: 'linux-sh',
    os: 'linux',
    label: 'One-line installer',
    format: 'sh',
    arch: 'x64',
    status: 'soon',
    // Built by `fdm-pack run` into target/package/linux/, published as-is at <site>/linux/.
    url: `${site.url}/linux/install.sh`,
    notes:
      'Sets up the app, the browser extension host and the fdm command. Needs Wayland and glibc 2.31 or newer.',
    install: `curl -fsSL ${site.url}/linux/install.sh | sh`,
    primary: true,
  },
  {
    id: 'linux-deb-x64',
    os: 'linux',
    label: 'Debian, Ubuntu',
    format: 'deb',
    arch: 'x64',
    status: 'soon',
    ...file(`fast-download-manager_${v}_amd64.deb`),
  },
  {
    id: 'linux-rpm-x64',
    os: 'linux',
    label: 'Fedora, openSUSE',
    format: 'rpm',
    arch: 'x64',
    status: 'soon',
    ...file(`fast-download-manager-${v}-1.x86_64.rpm`),
  },
  {
    id: 'linux-pacman-x64',
    os: 'linux',
    label: 'Arch Linux',
    format: 'pacman',
    arch: 'x64',
    status: 'soon',
    ...file(`fast-download-manager-${v}-1-x86_64.pkg.tar.zst`),
  },
  {
    id: 'linux-appimage-x64',
    os: 'linux',
    label: 'AppImage',
    format: 'appimage',
    arch: 'x64',
    status: 'soon',
    ...file(`FastDownloadManager-${v}-x86_64.AppImage`),
    notes: 'Runs on most distributions without installing.',
  },

  // ── macOS ──
  {
    id: 'macos-dmg-arm64',
    os: 'macos',
    label: 'Apple silicon',
    format: 'dmg',
    arch: 'arm64',
    status: 'soon',
    ...file(`FastDownloadManager-${v}-arm64.dmg`),
    primary: true,
  },
  {
    id: 'macos-dmg-x64',
    os: 'macos',
    label: 'Intel',
    format: 'dmg',
    arch: 'x64',
    status: 'soon',
    ...file(`FastDownloadManager-${v}-x64.dmg`),
  },

  // ── Browser extensions ──
  {
    id: 'browser-chrome',
    os: 'browser',
    label: 'Chrome Web Store',
    format: 'store',
    arch: 'any',
    status: 'soon',
    url: '',
    notes: 'For Chrome and Brave.',
  },
  {
    id: 'browser-edge',
    os: 'browser',
    label: 'Edge Add-ons',
    format: 'store',
    arch: 'any',
    status: 'soon',
    url: '',
    notes: 'For Microsoft Edge.',
  },
  {
    id: 'browser-firefox',
    os: 'browser',
    label: 'Firefox Add-ons',
    format: 'store',
    arch: 'any',
    status: 'soon',
    url: '',
    notes: 'For Firefox.',
  },

  // ── Command line ──
  {
    id: 'cli-fdm',
    os: 'cli',
    label: 'fdm command',
    format: 'binary',
    arch: 'any',
    status: 'soon',
    url: '',
    notes: 'Included in every package. Downloads, resumes and merges video from a terminal.',
    install: 'fdm get <url> <dir> [connections]',
  },
];

/** The site-wide primary download (the Windows .msi). */
export const primaryDownload: DownloadEntry = downloads.find((d) => d.primary && d.os === 'windows')!;

/** The main download of one desktop platform: its `primary` row, else its first row. */
export function primaryDownloadFor(os: Platform): DownloadEntry {
  return downloads.find((d) => d.os === os && d.primary) ?? downloads.find((d) => d.os === os)!;
}

/** Downloads grouped by OS in display order; empty groups are left out. */
export function downloadsByOs(): { os: DownloadOs; label: string; items: DownloadEntry[] }[] {
  return osOrder
    .map((os) => ({ os, label: osLabels[os], items: downloads.filter((d) => d.os === os) }))
    .filter((g) => g.items.length > 0);
}
