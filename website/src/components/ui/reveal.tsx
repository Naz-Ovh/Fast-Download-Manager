// Reveal on scroll: when the element enters the viewport the fdm-reveal keyframe runs once (220 ms,
// translateY 8px -> 0; opacity only with reduced motion). With `stagger`, the direct children reveal one
// after another (`stagger` ms apart) instead of the wrapper.
//
// Only elements that start below the viewport are hidden, and only after hydration (class is-pending).
// Content in view at load (the hero) is never hidden, so first paint, no-JS visitors and crawlers always
// see it. Give above-the-fold motion its own CSS animation instead of <Reveal>.
import { useEffect, useRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render (default 'div'). */
  as?: ElementType;
  /** Delay before the reveal starts, in ms (default 0). */
  delay?: number;
  /** Reveal direct children one by one, this many ms apart (brief: 40). Off when undefined. */
  stagger?: number;
}

export function Reveal({ as: Tag = 'div', delay = 0, stagger, className, style, ...props }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already in view: leave it alone

    if (stagger !== undefined) {
      Array.from(el.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty('--fdm-i', String(i));
      });
    }
    el.classList.add('is-pending');
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.classList.remove('is-pending');
        el.classList.add('is-visible');
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  return (
    <Tag
      ref={ref}
      className={cn(stagger !== undefined ? 'fdm-reveal-stagger' : 'fdm-reveal', className)}
      style={{
        ...(delay ? { '--fdm-delay': `${delay}ms` } : {}),
        ...(stagger !== undefined ? { '--fdm-stagger': `${stagger}ms` } : {}),
        ...style,
      }}
      {...props}
    />
  );
}
