// The "Chunks" app icon as an inline SVG. Same rects, colors and opacities as assets/brand/icon.svg; if that
// file changes, update RECTS here too. Each instance gets its own clipPath id (useId), so many logos can share
// a page.
import { useId, type SVGProps } from 'react';

// [x, y, width, height, rx, fill, opacity], in icon.svg order (inside the clipped group).
const RECTS: readonly [number, number, number, number, number, string, number][] = [
  // arriving blocks and their streaks
  [183, 72, 44, 44, 8, '#7CF5C6', 0.9],
  [201, 14, 8, 50, 4, '#7CF5C6', 0.45],
  [234, 94, 44, 44, 8, '#7CF5C6', 0.9],
  [252, 58, 8, 28, 4, '#7CF5C6', 0.45],
  [285, 54, 44, 44, 8, '#7CF5C6', 0.9],
  [303, -22, 8, 68, 4, '#7CF5C6', 0.45],
  // arrow shaft
  [183, 163, 44, 44, 8, '#45E0B0', 1],
  [234, 163, 44, 44, 8, '#45E0B0', 1],
  [285, 163, 44, 44, 8, '#45E0B0', 1],
  [183, 214, 44, 44, 8, '#20C997', 1],
  [234, 214, 44, 44, 8, '#20C997', 1],
  [285, 214, 44, 44, 8, '#20C997', 1],
  // arrow head
  [81, 265, 44, 44, 8, '#12B886', 1],
  [132, 265, 44, 44, 8, '#12B886', 1],
  [183, 265, 44, 44, 8, '#12B886', 1],
  [234, 265, 44, 44, 8, '#12B886', 1],
  [285, 265, 44, 44, 8, '#12B886', 1],
  [336, 265, 44, 44, 8, '#12B886', 1],
  [387, 265, 44, 44, 8, '#12B886', 1],
  [132, 316, 44, 44, 8, '#0CA678', 1],
  [183, 316, 44, 44, 8, '#0CA678', 1],
  [234, 316, 44, 44, 8, '#0CA678', 1],
  [285, 316, 44, 44, 8, '#0CA678', 1],
  [336, 316, 44, 44, 8, '#0CA678', 1],
  [183, 367, 44, 44, 8, '#099268', 1],
  [234, 367, 44, 44, 8, '#099268', 1],
  [285, 367, 44, 44, 8, '#099268', 1],
  [234, 418, 44, 44, 8, '#087F5B', 1],
];

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width and height in px (default 32). */
  size?: number | string;
  /** Accessible name. Leave empty when text next to the logo already names the product (decorative). */
  title?: string;
}

export function Logo({ size = 32, title, className, ...props }: LogoProps) {
  const clip = `fdm-logo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title || undefined}
      focusable="false"
      {...props}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="16" y="16" width="480" height="480" rx="120" />
        </clipPath>
      </defs>
      <rect x="16" y="16" width="480" height="480" rx="120" fill="#0D1B1E" />
      <g clipPath={`url(#${clip})`}>
        {RECTS.map(([x, y, width, height, rx, fill, opacity]) => (
          <rect
            key={`${x},${y}`}
            x={x}
            y={y}
            width={width}
            height={height}
            rx={rx}
            fill={fill}
            opacity={opacity}
          />
        ))}
      </g>
    </svg>
  );
}
