// Small pill label. Status variants: 'available' (mint), 'soon' (muted, dashed), 'neutral'. Styles: .fdm-badge.
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'available' | 'soon' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Leading status dot (default: true for 'available' and 'soon'). */
  dot?: boolean;
}

export function Badge({ variant = 'neutral', dot, className, children, ...props }: BadgeProps) {
  const showDot = dot ?? variant !== 'neutral';
  return (
    <span className={cn('fdm-badge', `fdm-badge-${variant}`, className)} {...props}>
      {showDot && <span className="fdm-badge-dot" aria-hidden />}
      {children}
    </span>
  );
}

/** Default badge text for a download status. */
export const statusLabel = { available: 'Available', soon: 'Coming soon' } as const;
