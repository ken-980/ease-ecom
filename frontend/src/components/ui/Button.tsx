import { ComponentPropsWithoutRef } from 'react';
import { LoadAnimationCircle } from '../common/LoadAnimation';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent hover:bg-accent-hover text-accent-ink font-semibold shadow-sm',
  secondary:
    'bg-surface-card hover:bg-surface-input text-ink-primary border border-brand-border font-medium',
  ghost:
    'bg-transparent hover:bg-surface-input text-ink-label font-medium',
};

export const Button = ({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  // Industry best practice: default to 'button' so buttons inside forms don't accidentally submit
  type = 'button', 
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`h-10 px-4 inline-flex items-center justify-center rounded-md text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        variantStyles[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? <LoadAnimationCircle /> : children}
    </button>
  );
};