import React, { ForwardedRef, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './styles.module.scss';

type LinkProps = Pick<HTMLAttributes<HTMLAnchorElement>, 'className' | 'onClick'> &
  Pick<HTMLAnchorElement, 'href' | 'target' | 'download'>;

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: LinkProps['href'];
  target?: LinkProps['target'];
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement | HTMLLinkElement, ButtonProps>(
  ({ disabled, type = 'button', href, target, onClick, className, children, ...rest }, ref) => {
    const classnames = clsx(styles.btn, disabled && styles.isDisabled, className);

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    return href ? (
      <Link
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        href={href!}
        target={target}
        aria-label={rest['aria-label']}
        className={classnames}
        onClick={handleClick}
      >
        <span>{children}</span>
      </Link>
    ) : (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
        className={classnames}
        onClick={handleClick}
        {...rest}
      >
        <span>{children}</span>
      </button>
    );
  },
);
