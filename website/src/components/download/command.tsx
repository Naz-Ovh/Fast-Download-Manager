// A shell command in a dark terminal box (both themes) with a copy button. With `live={false}` (a package
// that is not out yet) the command is shown dimmed with a "soon" tag and no copy button.
import { CopyButton } from '@/components/ui/copy-button';

export function Command({ text, live = true, label }: { text: string; live?: boolean; label?: string }) {
  return (
    <div className={`dl-term${live ? '' : ' is-soon'}`}>
      <code>
        <span className="dl-prompt" aria-hidden>
          ${' '}
        </span>
        {text}
      </code>
      {live ? (
        <CopyButton text={text} ariaLabel={label ? `Copy: ${label}` : 'Copy command'} className="dl-term-copy" />
      ) : (
        <span className="dl-term-note fdm-num">soon</span>
      )}
    </div>
  );
}
