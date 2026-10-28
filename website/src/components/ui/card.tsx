// Surface card: 16px radius, 1px border. `interactive` (or `href`) adds the 120 ms lift + mint ring on hover.
// With `href` the whole card is a link. Styles: .fdm-card in global.css.
import Link from 'fumadocs-core/link';
import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Element to render when there is no href (default 'div'). */
  as?: ElementType;
  /** Makes the whole card a link (internal: the router link). */
  href?: string;
  /** Hover lift and mint ring (default: true when href is set). */
  interactive?: boolean;
  /** Inner padding preset (default 'md' = 24px; 'none' for custom layouts). */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' } as const;

export function Card({ as: Tag = 'div', href, interactive, padding = 'md', className, ...props }: CardProps) {
  const cls = cn('fdm-card', (interactive ?? !!href) && 'fdm-card-interactive', paddings[padding], className);
  if (href) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props} />;
    }
    return <Link href={href} className={cls} {...props} />;
  }
  return <Tag className={cls} {...props} />;
}
