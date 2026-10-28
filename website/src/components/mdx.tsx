// MDX component map for the docs pages: Fumadocs' defaults (Callout, Cards, code blocks, headings, tables),
// Steps and Tabs, plus our docs components (entry cards on the docs home).
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { EntryCards, MoreLinks } from '@/components/docs/entry-cards';
import { RepoLink } from '@/components/docs/repo-link';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    Tab,
    Tabs,
    EntryCards,
    MoreLinks,
    RepoLink,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
