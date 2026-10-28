// /robots.txt: every crawler may read everything; points at the sitemap. Static file in out/.
import { createFileRoute } from '@tanstack/react-router';
import { site } from '@/lib/site';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(`User-Agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`, {
          headers: { 'Content-Type': 'text/plain' },
        }),
    },
  },
});
