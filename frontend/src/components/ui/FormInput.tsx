import { ComponentPropsWithoutRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FormInputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
}

export const FormInput = ({
  label,
  error,
  id,
  type = 'text',
  disabled,
  className,
  ...props
}: FormInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';

  // Switch between 'text' and 'password' only when type="password" was passed
  const resolvedType = isPasswordField
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-ink-label"
      >
        {label}
      </label>

      <div className="relative mt-1.5">
        <input
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'block w-full rounded-sm bg-surface-input border px-3.5 py-2.5 text-sm text-ink-primary placeholder-ink-muted/70 shadow-sm transition focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed',
            isPasswordField && 'pr-10',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-brand-border focus:border-brand focus:ring-brand',
            className
          )}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            disabled={disabled}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-brand transition focus:outline-none focus:text-brand disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};