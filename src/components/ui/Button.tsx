/*
 * Reusable Button component
 * - Supports primary, secondary, and tertiary variants
 * - Handles disabled state and click events
 * - Uses Tailwind classes for styling
 */

import { memo } from 'react';
import clsx from 'clsx';
import { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  ...props
}) => {
  /*
   * Handles button click events
   * - Prevents click actions when disabled
   * - Calls the provided onClick handler
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'button-block',
        `button-block--${variant}`,
        `button-block--${size}`,
        { 'button-block--is-disabled': disabled }
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default memo(Button);