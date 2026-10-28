// Button or link styled as a button. With `href` it renders the router link (internal) or <a> (http/https/mailto,
// opened in a new tab when `external`); without `href` it renders <button>. Styles: .fdm-btn in global.css.
import Link from 'fumadocs-core/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
}

export type ButtonAsLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'> & {
    href: string;
    /** Open in a new tab with rel="noopener noreferrer" (default: true for absolute URLs). */
    external?: boolean;
  };

export type ButtonAsButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

/** Class string for the given variant/size, for elements that cannot use <Button> directly. */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn('fdm-btn', `fdm-btn-${variant}`, `fdm-btn-${size}`, className);
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, external, ...rest } = props;
    const cls = buttonClass(variant, size, className);
    const isAbsolute = /^[a-z][a-z0-9+.-]*:/i.test(href);
    if (isAbsolute || external) {
      const newTab = external ?? /^https?:/i.test(href);
      return (
        <a
          href={href}
          className={cls}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, type = 'button', ...rest } = props;
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
