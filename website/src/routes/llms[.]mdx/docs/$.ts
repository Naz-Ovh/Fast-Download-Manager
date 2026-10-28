// /llms.mdx/docs/<slugs>/content.md: one docs page as Markdown (the page's "Copy Markdown" and "View as Markdown").
import { createFileRoute, notFound } from '@tanstack/react-router';
import { docsLlms, source } from '@/lib/source';

export const Route = createFileRoute('/llms.mdx/docs/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // remove the appended "content.md"
        const page = source.getPage(params._splat?.split('/').filter(Boolean).slice(0, -1));
        if (!page) throw notFound();

        return new Response(await docsLlms.page(page), {
          headers: {
            'Content-Type': 'text/markdown',
          },
        });
      },
    },
  },
});
