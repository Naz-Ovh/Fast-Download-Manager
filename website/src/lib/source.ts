// The Fumadocs loader over the docs collection (docs.ts): page tree, URLs, search index, llms.txt. Used at build
// time only (server functions and server routes), so it stays out of the client bundle.
import { llms, loader } from 'fumadocs-core/source';
import { docs } from './docs';
import { docsRoute } from './shared';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
