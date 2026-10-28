// TanStack Start + Fumadocs, fully prerendered: every route is written to out/ as a plain file (route/index.html,
// out/api/search, out/robots.txt, ...), so any static host serves it without a server (README "Deploy").
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { glob } from 'node:fs/promises';
import { getSlugs } from 'fumadocs-core/source';

// Every docs page and its Markdown copy, read from content/docs.
// Listed up front instead of crawling links, so the output does not depend on what a page happens to link.
const docsPages: string[] = [];
for await (const entry of glob('**/*.{md,mdx}', { cwd: 'content/docs' })) {
  const slugs = getSlugs(entry.replaceAll('\\', '/'));
  docsPages.push(['/docs', ...slugs].join('/'), ['/llms.mdx/docs', ...slugs, 'content.md'].join('/'));
}

const files = ['/', '/home', '/download', '/api/search', '/llms.txt', '/llms-full.txt', '/robots.txt', '/sitemap.xml'];

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false },
      pages: [
        ...[...files, ...docsPages].map((path) => ({ path })),
        // The not-found page as out/404.html, which the host answers unknown paths with (src/start.ts).
        { path: '/404', prerender: { outputPath: '/404', autoSubfolderIndex: false } },
      ],
      // Our own /sitemap.xml route (src/routes/sitemap[.]xml.ts) leaves out /home and the 404 page.
      sitemap: { enabled: false },
    }),
    react(),
  ],
  // The static site goes to out/ (wrangler.jsonc, `pnpm start`); the server bundle used for prerendering stays in dist/.
  environments: {
    client: { build: { outDir: 'out' } },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: 'tslib/tslib.es6.js',
    },
  },
});
