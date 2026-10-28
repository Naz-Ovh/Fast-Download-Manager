// Link into the source repository from MDX: <RepoLink path="/issues">the issue tracker</RepoLink>.
// Reads site.repo, so the guide never repeats the URL; renders the plain text when no repo is set.
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

export function RepoLink({ path = '', children }: { path?: string; children: ReactNode }) {
  if (!site.repo) return <>{children}</>;
  return (
    <a href={`${site.repo}${path}`} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
