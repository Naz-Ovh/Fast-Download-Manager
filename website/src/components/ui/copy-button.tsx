// Copies `text` to the clipboard and shows "Copied" for 1.5 s (announced to screen readers).
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface CopyButtonProps {
  /** Text to copy. */
  text: string;
  /** Visible label (default: icon only, with "Copy" as the accessible name). */
  label?: string;
  /** Accessible name when there is no label (default "Copy"). */
  ariaLabel?: string;
  className?: string;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers or a non-secure context: fall back to a hidden textarea.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export function CopyButton({ text, label, ariaLabel = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    if (!(await copy(text))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('fdm-copy', copied && 'is-copied', className)}
      aria-label={label ? undefined : ariaLabel}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label && <span>{copied ? 'Copied' : label}</span>}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </button>
  );
}
