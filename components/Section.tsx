import { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div';
}

export function Section({
  children,
  className,
  id,
  as: Component = 'section',
}: SectionProps) {
  return (
    <Component
      id={id}
      className={clsx(
        'w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </Component>
  );
}
