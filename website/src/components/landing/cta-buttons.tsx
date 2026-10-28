// The landing page's two calls to action: download (primary, with the shine sweep and arrow nudge) and docs.
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

export function CtaButtons({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)} style={style}>
      <Button href="/download/" size="lg" className="lp-btn-shine">
        Download for Windows
        <ArrowRight className="lp-btn-arrow" aria-hidden />
      </Button>
      <Button href="/docs/" size="lg" variant="secondary">
        <BookOpen aria-hidden />
        Read the docs
      </Button>
    </div>
  );
}
