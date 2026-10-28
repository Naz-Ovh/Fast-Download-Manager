// Fetches Geist and Geist Mono from Google Fonts at build time, as next/font/google did when the site ran on
// Next.js, and writes them to src/generated/fonts/ (git-ignored):
//   <family>-<subset>.woff2  the variable font files (weights 100 to 900)
//   fonts.css                @font-face rules pointing at them, plus --font-geist-sans / --font-geist-mono
//   fonts.ts                 the latin files to preload (Vite ?url imports, so the hashed names match)
// Vite bundles them, so the site serves its own fonts and asks nothing of Google at runtime. Once fetched, the
// files are reused (offline builds work); delete the folder to fetch again. Without the network and without a
// cached copy the site falls back to the system fonts and says so.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(site, 'src', 'generated', 'fonts');

const families = [
  { name: 'Geist', slug: 'geist', variable: '--font-geist-sans' },
  { name: 'Geist Mono', slug: 'geist-mono', variable: '--font-geist-mono' },
];
const cssUrl = `https://fonts.googleapis.com/css2?${families
  .map((f) => `family=${f.name.replaceAll(' ', '+')}:wght@100..900`)
  .join('&')}&display=swap`;
// Google sends woff2 only to browsers that support it, so ask as one.
const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const variables = `:root {\n${families.map((f) => `  ${f.variable}: '${f.name}';`).join('\n')}\n}\n`;

/** True when fonts.css exists and every file it points at is there. */
function cached() {
  const css = join(outDir, 'fonts.css');
  if (!existsSync(css) || !existsSync(join(outDir, 'fonts.ts'))) return false;
  const files = [...readFileSync(css, 'utf8').matchAll(/url\('\.\/([^']+)'\)/g)].map((m) => m[1]);
  return files.length > 0 && files.every((file) => existsSync(join(outDir, file)));
}

/** Splits Google's stylesheet into its `/* subset *\/ @font-face {…}` blocks. */
function parseFaces(css) {
  const faces = [];
  for (const m of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)) {
    const [, subset, rule] = m;
    const family = /font-family:\s*'([^']+)'/.exec(rule)?.[1];
    const url = /url\((https:[^)]+\.woff2)\)/.exec(rule)?.[1];
    const meta = families.find((f) => f.name === family);
    if (!meta || !url) continue;
    faces.push({ rule, url, file: `${meta.slug}-${subset}.woff2`, subset });
  }
  return faces;
}

async function fetchFonts() {
  const res = await fetch(cssUrl, { headers: { 'user-agent': userAgent } });
  if (!res.ok) throw new Error(`${cssUrl}: ${res.status}`);
  const faces = parseFaces(await res.text());
  if (faces.length === 0) throw new Error(`no woff2 @font-face rules in ${cssUrl}`);

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const face of faces) {
    const font = await fetch(face.url);
    if (!font.ok) throw new Error(`${face.url}: ${font.status}`);
    writeFileSync(join(outDir, face.file), Buffer.from(await font.arrayBuffer()));
  }

  const rules = faces.map((f) => `/* ${f.subset} */\n${f.rule.replace(f.url, `'./${f.file}'`)}`);
  writeFileSync(join(outDir, 'fonts.css'), `${rules.join('\n')}\n${variables}`);

  const latin = faces.filter((f) => f.subset === 'latin');
  const imports = latin.map((f, i) => `import font${i} from './${f.file}?url';`);
  writeFileSync(
    join(outDir, 'fonts.ts'),
    `${imports.join('\n')}\n\n/** The latin files, preloaded on every page. */\nexport const preload: string[] = [${latin.map((_, i) => `font${i}`).join(', ')}];\n`,
  );
  return faces.length;
}

/** System fonts only: the stylesheet keeps the variables, so the CSS falls through to its fallback stacks. */
function writeFallback() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'fonts.css'), `/* Geist could not be fetched: system fonts. */\n`);
  writeFileSync(join(outDir, 'fonts.ts'), 'export const preload: string[] = [];\n');
}

export async function fonts() {
  if (cached()) {
    console.log('fonts: Geist cached in src/generated/fonts');
    return;
  }
  try {
    const count = await fetchFonts();
    console.log(`fonts: ${count} Geist files -> src/generated/fonts`);
  } catch (error) {
    writeFallback();
    console.warn(`fonts: could not fetch Geist (${error.message}); the site uses the system fonts until the next build`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await fonts();
