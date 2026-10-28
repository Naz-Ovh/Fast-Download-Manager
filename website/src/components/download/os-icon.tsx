// Small platform glyphs in lucide's 24px stroke style, so they sit next to lucide icons. Generic shapes
// (four panes, a penguin, an apple), not vendor logos. Decorative: the OS name is always next to them.
import { Apple, Puzzle, SquareTerminal } from 'lucide-react';
import type { SVGProps } from 'react';
import type { DownloadOs } from '@/lib/downloads';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function WindowsGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </Svg>
  );
}

export function LinuxGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      {/* head and body */}
      <path d="M12 2.5c-2.2 0-3.6 1.8-3.6 4.2 0 1.5-.4 2.6-1.4 4.1C5.6 12.9 5 14.6 5 16.4c0 2.8 3 4.6 7 4.6s7-1.8 7-4.6c0-1.8-.6-3.5-2-5.6-1-1.5-1.4-2.6-1.4-4.1 0-2.4-1.4-4.2-3.6-4.2Z" />
      {/* belly */}
      <path d="M9.6 12.5c-.9 1.2-1.3 2.4-1.3 3.6 0 1.6 1.6 2.6 3.7 2.6s3.7-1 3.7-2.6c0-1.2-.4-2.4-1.3-3.6" />
      {/* eyes and beak */}
      <path d="M10.6 6.6h.01M13.4 6.6h.01" />
      <path d="M11 8.8 12 9.6l1-.8" />
    </Svg>
  );
}

export function OsIcon({ os, size = 20, className }: { os: DownloadOs; size?: number; className?: string }) {
  switch (os) {
    case 'windows':
      return <WindowsGlyph size={size} className={className} />;
    case 'linux':
      return <LinuxGlyph size={size} className={className} />;
    case 'macos':
      return <Apple size={size} className={className} aria-hidden />;
    case 'browser':
      return <Puzzle size={size} className={className} aria-hidden />;
    case 'cli':
      return <SquareTerminal size={size} className={className} aria-hidden />;
  }
}
