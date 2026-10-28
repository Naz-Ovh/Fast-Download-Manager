// Centered content column: max 1200px, 16px gutters on phones, 24px from sm up.
import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Element to render (default 'div'). */
  as?: ElementType;
}

export function Container({ as: Tag = 'div', className, ...props }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6', className)} {...props} />;
}
