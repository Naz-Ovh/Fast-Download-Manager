// Options shared by the home layout and the docs layout (navbar title, links, repo button).
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Wordmark } from '@/components/brand/wordmark';
import { site } from './site';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Wordmark compact />,
      url: '/',
    },
    links: [
      { text: 'Home', url: '/', active: 'url' },
      { text: 'Download', url: '/download', active: 'nested-url' },
      { text: 'Docs', url: '/docs', active: 'nested-url' },
    ],
    ...(site.repo ? { githubUrl: site.repo } : {}),
  };
}
