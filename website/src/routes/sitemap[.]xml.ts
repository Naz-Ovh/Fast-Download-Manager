// /sitemap.xml: the landing page, the download page and every docs page, as absolute URLs with the trailing
// slash the static site serves. /home/ is left out: it is the same page as / (canonical /).
import { createFileRoute } from '@tanstack/react-router';
import { site } from '@/lib/site';
import { source } from '@/lib/source';

/** `/docs/guide` -> `https://fdm.naz.ovh/docs/guide/`; `/` stays `https://fdm.naz.ovh/`. */
function absolute(path: string): string {
  return `${site.url}${path.endsWith('/') ? path : `${path}/`}`;
}

function sitemap(): string {
  const paths = ['/', '/download', ...source.getPages().map((page) => page.url)];
  const urls = [...new Set(paths.map(absolute))].map((url) => `<url>\n<loc>${url}</loc>\n</url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => new Response(sitemap(), { headers: { 'Content-Type': 'application/xml' } }),
    },
  },
});
