// Site-wide facts. Every page imports from here instead of repeating names, links or the version.
import build from '@/generated/build.json';

export type Platform = 'windows' | 'linux' | 'macos';

export const site = {
  name: 'Fast Download Manager',
  shortName: 'FDM',
  /** One line, used in the <title> of the home page and in the hero. */
  tagline: 'Every download split into parallel chunks, done sooner.',
  /** Meta description. */
  description:
    'A download manager written in Rust. Up to 32 parallel connections per file, resume after a stop, and video capture from Chrome, Edge, Brave and Firefox.',
  /** Production URL (Cloudflare Workers, see README "Deploy"): metadataBase, canonicals, sitemap. No trailing slash. */
  url: 'https://fdm.naz.ovh',
  /** The public repo: this site's source, the releases and their notes. Empty hides every repo link. */
  repo: 'https://github.com/Naz-Ovh/Fast-Download-Manager',
  /** Newest version in ../changelog, written by scripts/prebuild/version.mjs. */
  version: build.version,
  /** When the site was built (ISO 8601), written by scripts/prebuild/version.mjs. */
  builtAt: build.builtAt,
  platforms: ['windows', 'linux', 'macos'] as const satisfies readonly Platform[],
};

/** Main navigation, shared by the navbar and the footer. */
export const navLinks = [
  { text: 'Home', url: '/' },
  { text: 'Download', url: '/download' },
  { text: 'Docs', url: '/docs' },
] as const;
