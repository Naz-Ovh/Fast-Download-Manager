// A number that counts up from 0 in ~600 ms when it enters the viewport (ease-out), in Geist Mono with
// tabular figures. The server HTML holds the final value (no-JS and crawlers see it); with reduced motion
// the final value simply stays.
import { useEffect, useRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface CountUpProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Final value. */
  value: number;
  /** Animation length in ms (default 600). */
  duration?: number;
  /** Decimal places (default 0). */
  decimals?: number;
  /** Text before / after the number, e.g. suffix="+" (not animated). */
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  value,
  duration = 600,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  ...props
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    el.textContent = format(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(value);
    };
    // `format` is derived from these props only.
  }, [value, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={cn('fdm-num', className)} {...props}>
      {format(value)}
    </span>
  );
}
