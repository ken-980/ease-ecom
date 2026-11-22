// src/components/ui/StatsCard.tsx
import { Link } from 'react-router-dom';

export type StatsCardVariant = 'green' | 'blue' | 'amber' | 'rose' | 'neutral';

export interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
  variant?: StatsCardVariant;
  valueClassName?: string;
  className?: string;
}

const VARIANT_STYLES: Record<
  StatsCardVariant,
  { container: string; link: string }
> = {
  green: {
    container: 'bg-green-50/80 border-green-100',
    link: 'text-green-600 hover:bg-green-100/80 hover:text-green-700',
  },
  blue: {
    container: 'bg-blue-50/80 border-blue-100',
    link: 'text-blue-600 hover:bg-blue-100/80 hover:text-blue-700',
  },
  amber: {
    container: 'bg-amber-50/80 border-amber-100',
    link: 'text-amber-600 hover:bg-amber-100/80 hover:text-amber-700',
  },
  rose: {
    container: 'bg-rose-50/80 border-rose-100',
    link: 'text-rose-600 hover:bg-rose-100/80 hover:text-rose-700',
  },
  neutral: {
    container: 'bg-white border-gray-200',
    link: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  },
};

export const StatsCard = ({
  title,
  value,
  unit,
  subtitle,
  linkText = 'View all',
  linkTo,
  variant = 'neutral',
  valueClassName = 'text-gray-900',
  className = '',
}: StatsCardProps) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`p-4 rounded-sm min-h-34 border shadow-sm flex flex-col justify-between font-plus-font transition-shadow hover:shadow-md ${styles.container} ${className}`.trim()}
    >
      <div className="space-y-1">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </h5>

        <h3 className={`text-3xl font-bold tracking-tight ${valueClassName}`}>
          {value}
          {unit && (
            <span className="ml-1.5 text-base font-semibold text-gray-600">
              {unit}
            </span>
          )}
        </h3>

        {subtitle && (
          <p className="text-xs text-gray-500 pt-0.5">{subtitle}</p>
        )}
      </div>

      {linkTo && (
        <div className="pt-2">
          <Link
            to={linkTo}
            className={`inline-block text-xs font-semibold rounded px-1.5 py-0.5 -ml-1.5 transition-colors ${styles.link}`}
          >
            {linkText} →
          </Link>
        </div>
      )}
    </div>
  );
};