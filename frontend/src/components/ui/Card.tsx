// src/components/ui/Card.tsx
import { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'bg-surface-card border border-brand-border rounded-sm p-8 shadow-md',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'header'>) => (
  <header className={cn('mb-6', className)} {...props}>
    {children}
  </header>
);

export const CardTitle = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'h1'>) => (
  <h1
    className={cn(
      'text-2xl font-poppins font-semibold tracking-wider text-brand',
      className
    )}
    {...props}
  >
    {children}
  </h1>
);

export const CardDescription = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'p'>) => (
  <p className={cn('mt-1 text-sm text-ink-muted', className)} {...props}>
    {children}
  </p>
);

export const CardFooter = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'footer'>) => (
  <footer className={cn('mt-6 text-sm text-ink-muted', className)} {...props}>
    {children}
  </footer>
);