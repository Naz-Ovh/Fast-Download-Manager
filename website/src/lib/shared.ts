// Docs routes shared by the docs pages, the llms.txt routes and the search index.
import { createGetUrl } from 'fumadocs-core/source';
import { site } from './site';

export const appName = site.name;
export const docsRoute = '/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Where the hand-written docs sources live in the repo ('' when no repo is set). */
export const docsSourceUrl = site.repo ? `${site.repo}/blob/main/website/content/docs` : '';

/** Repo link to the MDX file a page is made from. Undefined when no repo is set. */
export function pageSourceUrl(page: { path: string }): string | undefined {
  if (!site.repo) return undefined;
  return `${docsSourceUrl}/${page.path}`;
}

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}
