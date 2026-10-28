// Docs area: Fumadocs DocsLayout and one page. The Guide folder is a root folder (meta.json `root: true`), so the
// sidebar shows it on its pages; the docs home (/docs/) sits above it and shows the whole tree. Docs-only styles: src/components/docs/docs.css.
//
// The loader is a static server function: at build time its result (page facts and the page tree) is written to
// out/ as JSON, which client-side navigation fetches, so the static site needs no server. The MDX body is a lazy
// chunk per page (`async: true` in src/lib/source.ts).
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { Suspense, use } from 'react';
import { DocsHero } from '@/components/docs/docs-hero';
import { useMDXComponents } from '@/components/mdx';
import { pageHead } from '@/lib/head';
import { baseOptions } from '@/lib/layout.shared';
import { getPageMarkdownUrl, pageSourceUrl } from '@/lib/shared';
import { site } from '@/lib/site';
import { docs } from '@/lib/docs';
import { source } from '@/lib/source';
import docsCss from '@/components/docs/docs.css?url';

export const Route = createFileRoute('/docs/$')({
  loader: async ({ params }) => {
    const data = await loadPage({ data: params._splat?.split('/').filter(Boolean) ?? [] });
    await docs.getPage(data.path)?.preload();
    return data;
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.title,
      description: loaderData?.description,
      // page.url has no trailing slash (/docs/guide/install); the static site serves /docs/guide/install/.
      canonical: loaderData ? `${loaderData.url}/` : undefined,
      styles: [docsCss],
    }),
  component: Page,
});

const loadPage = createServerFn({ method: 'GET' })
  .validator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      full: page.data.full,
      isHome: page.slugs.length === 0,
      markdownUrl: getPageMarkdownUrl(page).url,
      sourceUrl: pageSourceUrl(page),
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

type PageData = Omit<Awaited<ReturnType<typeof loadPage>>, 'pageTree'>;

function Content({ path, title, description, full, isHome, markdownUrl, sourceUrl }: PageData) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;

  return (
    <DocsPage
      toc={toc}
      full={full}
      tableOfContent={{ enabled: !isHome }}
      tableOfContentPopover={{ enabled: !isHome }}
      breadcrumb={{ enabled: !isHome }}
    >
      {isHome ? (
        <DocsHero title={`${site.name} docs`} description={description} />
      ) : (
        <>
          <DocsTitle>{title}</DocsTitle>
          <DocsDescription className="mb-0">{description}</DocsDescription>
          <div className="fdm-docs-actions">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
            <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={sourceUrl} />
          </div>
        </>
      )}
      {/* On the short docs home the body keeps its content height (fdm-docs-home-body, docs.css). */}
      <DocsBody className={isHome ? 'fdm-docs-home-body' : undefined}>
        <MDX components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function Page() {
  const { pageTree, ...data } = useFumadocsLoader(Route.useLoaderData());
  const base = baseOptions();
  // Inside the docs the sidebar is the docs navigation, so the navbar's own "Docs" link is left out there.
  const links = base.links?.filter((link) => !('url' in link && link.url === '/docs'));

  return (
    <DocsLayout
      {...base}
      tree={pageTree}
      links={links}
      sidebar={{ defaultOpenLevel: 1 }}
      containerProps={{ className: 'fdm-docs' }}
    >
      <Suspense>
        <Content {...data} />
      </Suspense>
    </DocsLayout>
  );
}
