// A page section: optional eyebrow (mono, mint), title (h2), lead paragraph, then children.
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './container';

export interface SectionProps {
  id?: string;
  /** Small mono label above the title, e.g. "Engine". */
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  /** Heading alignment (default 'left'). */
  align?: 'left' | 'center';
  /** Heading level of the title (default 2). */
  level?: 1 | 2 | 3;
  className?: string;
  /** Class of the inner Container. */
  containerClassName?: string;
  children?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
  level = 2,
  className,
  containerClassName,
  children,
}: SectionProps) {
  const Heading = `h${level}` as const;
  const hasHeader = eyebrow || title || lead;
  return (
    <section id={id} className={cn('py-16 sm:py-24', className)}>
      <Container className={containerClassName}>
        {hasHeader && (
          <header
            className={cn('mb-10 flex max-w-2xl flex-col gap-3', align === 'center' && 'mx-auto items-center text-center')}
          >
            {eyebrow && <p className="fdm-eyebrow">{eyebrow}</p>}
            {title && <Heading className="fdm-heading text-3xl sm:text-4xl">{title}</Heading>}
            {lead && <p className="text-lg text-fd-muted-foreground">{lead}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
