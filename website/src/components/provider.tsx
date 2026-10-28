import SearchDialog from '@/components/search';
import { Link as RouterLink } from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { type ComponentProps, type ReactNode } from 'react';

/**
 * Every Fumadocs link (sidebar, MDX, cards, fumadocs-core/link). Fumadocs' own TanStack link passes the whole href
 * as `to`, so `/docs/a/#part` became the path `/docs/a/#part/` (trailingSlash) and never reached its heading. Here
 * the path, the query and the hash go to the router separately.
 */
function Link({ href = '', prefetch = true, ...props }: ComponentProps<'a'> & { prefetch?: boolean }) {
  if (href.startsWith('#') || href.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return <a href={href} {...props} />;
  }
  const url = new URL(href, 'http://site');
  return (
    <RouterLink
      to={url.pathname}
      search={url.search ? Object.fromEntries(url.searchParams) : undefined}
      hash={url.hash ? decodeURIComponent(url.hash.slice(1)) : undefined}
      preload={prefetch ? 'intent' : false}
      {...props}
    />
  );
}

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} components={{ Link }}>
      {children}
    </RootProvider>
  );
}
