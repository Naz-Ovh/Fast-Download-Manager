// The product version the site shows: the newest release notes file in ../changelog (one `<x.y.z>.md` per
// release, see changelog/README.md), so the site always names a version that has notes. Writes
// src/generated/build.json (git-ignored).
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const changelog = join(site, '..', 'changelog');
const outDir = join(site, 'src', 'generated');

/** The highest x.y.z among `<x.y.z>.md` names, or throws when there is none. */
export function newestVersion(names) {
  const versions = names
    .map((name) => /^(\d+)\.(\d+)\.(\d+)\.md$/.exec(name))
    .filter((m) => m !== null)
    .map((m) => [Number(m[1]), Number(m[2]), Number(m[3])]);
  if (versions.length === 0) throw new Error(`${changelog} has no <x.y.z>.md release notes`);
  versions.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  return versions.at(-1).join('.');
}

export function buildInfo() {
  const version = newestVersion(readdirSync(changelog));
  const info = { version, builtAt: new Date().toISOString() };
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'build.json'), `${JSON.stringify(info, null, 2)}\n`);
  console.log(`version: ${version} -> src/generated/build.json`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) buildInfo();
