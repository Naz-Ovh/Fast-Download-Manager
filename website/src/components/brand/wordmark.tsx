// Logo + "Fast Download Manager". Used as the navbar title and in the footer.
import { cn } from '@/lib/cn';
import { site } from '@/lib/site';
import { Logo } from './logo';

export interface WordmarkProps {
  /** Logo size in px (default 24). */
  size?: number;
  className?: string;
  /** Show "FDM" instead of the full name below the sm breakpoint (default false). */
  compact?: boolean;
}

export function Wordmark({ size = 24, className, compact = false }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      <Logo size={size} className="shrink-0" />
      {compact ? (
        <>
          <span className="sm:hidden">{site.shortName}</span>
          <span className="max-sm:hidden">{site.name}</span>
        </>
      ) : (
        <span>{site.name}</span>
      )}
    </span>
  );
}
