// A soft mint glow that follows the pointer over its parent (the hero). Moves one absolutely positioned
// layer with transform, at most once per frame. Off on touch devices and with reduced motion.
import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const glow = layer?.firstElementChild as HTMLElement | null;
    const host = layer?.parentElement; // the hero section
    if (!glow || !host) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
      return;
    }
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      glow.dataset.on = '';
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const leave = () => {
      delete glow.dataset.on;
    };
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="lp-cursor">
      <div className="lp-cursor-glow" />
    </div>
  );
}
