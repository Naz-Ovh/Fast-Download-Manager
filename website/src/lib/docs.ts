// Docs content: content/docs, the user guide. Collections use the fumadocs-mdx macro API (no source.config.ts).
// Kept apart from the loader (source.ts): the docs page imports only this on the client, the loader stays on the
// build side.
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // Each page's compiled MDX is its own chunk, loaded when the page opens (src/routes/docs/$.tsx).
    async: true,
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});
