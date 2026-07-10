import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700/80',
        'dark:shadow-none',
        paddings[padding],
        hover &&
          'hover:shadow-md dark:hover:border-slate-600 dark:hover:bg-slate-900/90 transition-all cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
