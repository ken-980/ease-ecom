import { ComponentPropsWithoutRef, useId } from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FormSelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
}

export const FormSelect = ({
  label,
  options,
  placeholder = 'Select an option',
  error,
  id,
  className,
  ...props
}: FormSelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-ink-label"
      >
        {label}
      </label>

      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'mt-1.5 block w-full rounded-sm bg-surface-input border px-3.5 py-2.5 text-sm text-ink-primary shadow-sm transition focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-brand-border focus:border-brand focus:ring-brand',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};