// <head> tags of a page (route `head()`): title, description, canonical and the page's own stylesheets.
// HeadContent keeps the deepest route's title and each meta name once, so a page overrides the root's defaults.
import { site } from './site';

type PageHead = {
  /** Shown as "<title> | Fast Download Manager"; `absoluteTitle` is used as it is. */
  title?: string;
  absoluteTitle?: string;
  description?: string;
  /** Path with the trailing slash the static site serves (`/download/`); made absolute with site.url. */
  canonical?: string;
  /** Stylesheet URLs (`import css from '….css?url'`). */
  styles?: string[];
};

export function pageHead({ title, absoluteTitle, description, canonical, styles = [] }: PageHead) {
  const fullTitle = absoluteTitle ?? (title ? `${title} | ${site.name}` : undefined);
  return {
    meta: [
      ...(fullTitle ? [{ title: fullTitle }] : []),
      ...(description ? [{ name: 'description', content: description }] : []),
    ],
    links: [
      ...styles.map((href) => ({ rel: 'stylesheet', href })),
      ...(canonical && site.url ? [{ rel: 'canonical', href: `${site.url}${canonical}` }] : []),
    ],
  };
}
