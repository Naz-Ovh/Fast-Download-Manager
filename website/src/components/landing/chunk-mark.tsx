// The "Chunks" icon with its three arriving blocks in their own group, so landing animations can drop them
// onto the arrow. Same rects and colors as src/components/brand/logo.tsx (and assets/brand/icon.svg); keep
// the two in sync. `motion`: 'stage' follows the hero Download Stage cycle, 'loop' repeats on its own.
import { useId, type SVGProps } from 'react';
import { cn } from '@/lib/cn';

type Rect = readonly [x: number, y: number, w: number, h: number, fill: string, opacity: number];

const ARRIVING: readonly Rect[] = [
  [183, 72, 44, 44, '#7CF5C6', 0.9],
  [201, 14, 8, 50, '#7CF5C6', 0.45],
  [234, 94, 44, 44, '#7CF5C6', 0.9],
  [252, 58, 8, 28, '#7CF5C6', 0.45],
  [285, 54, 44, 44, '#7CF5C6', 0.9],
  [303, -22, 8, 68, '#7CF5C6', 0.45],
];

// Arrow body, row by row (shaft, head), with the icon's color per row.
const ROWS: readonly [y: number, xs: readonly number[], fill: string][] = [
  [163, [183, 234, 285], '#45E0B0'],
  [214, [183, 234, 285], '#20C997'],
  [265, [81, 132, 183, 234, 285, 336, 387], '#12B886'],
  [316, [132, 183, 234, 285, 336], '#0CA678'],
  [367, [183, 234, 285], '#099268'],
  [418, [234], '#087F5B'],
];

export interface ChunkMarkProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number | string;
  motion?: 'none' | 'stage' | 'loop';
}

export function ChunkMark({ size = 40, motion = 'none', className, ...props }: ChunkMarkProps) {
  const clip = `lp-mark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden
      focusable="false"
      className={cn('lp-mark', motion !== 'none' && `lp-mark-${motion}`, className)}
      {...props}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="16" y="16" width="480" height="480" rx="120" />
        </clipPath>
      </defs>
      <rect x="16" y="16" width="480" height="480" rx="120" fill="#0D1B1E" />
      <g clipPath={`url(#${clip})`}>
        <g className="lp-mark-arrive">
          {ARRIVING.map(([x, y, w, h, fill, opacity]) => (
            <rect key={`${x},${y}`} x={x} y={y} width={w} height={h} rx={w < 20 ? 4 : 8} fill={fill} opacity={opacity} />
          ))}
        </g>
        {ROWS.flatMap(([y, xs, fill]) =>
          xs.map((x) => <rect key={`${x},${y}`} x={x} y={y} width="44" height="44" rx="8" fill={fill} />),
        )}
      </g>
    </svg>
  );
}
