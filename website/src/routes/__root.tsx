// Root route: <html>, the default <head> tags, the design system CSS, Geist fonts, RouteProgress and the
// Fumadocs provider. Pages set their own title, description and canonical with pageHead() (src/lib/head.ts).
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { Provider } from '@/components/provider';
import { RouteProgress } from '@/components/ui/route-progress';
import { site } from '@/lib/site';
import globalCss from '@/styles/global.css?url';
// Fonts are fetched at build time by scripts/prebuild/fonts.mjs and shipped from the site itself.
import fontsCss from '@/generated/fonts/fonts.css?url';
import { preload as fontPreload } from '@/generated/fonts/fonts';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${site.name}: ${site.tagline}` },
      { name: 'description', content: site.description },
      { name: 'application-name', content: site.name },
    ],
    links: [
      ...fontPreload.map((href) => ({
        rel: 'preload',
        href,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous' as const,
      })),
      { rel: 'stylesheet', href: fontsCss },
      { rel: 'stylesheet', href: globalCss },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Two tags with one name: HeadContent would keep only one, so they are written here. */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7fbf9" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a1416" />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <RouteProgress />
        <Provider>
          <Outlet />
        </Provider>
        <Scripts />
      </body>
    </html>
  );
}
