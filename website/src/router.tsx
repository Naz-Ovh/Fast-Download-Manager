// The TanStack router. `trailingSlash: 'always'` matches the static files (route/index.html, served at /route/).
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { NotFound } from '@/components/not-found';

export function getRouter() {
  return createRouter({
    routeTree,
    trailingSlash: 'always',
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
  });
}
