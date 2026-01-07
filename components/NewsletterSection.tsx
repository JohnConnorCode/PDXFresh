'use client';

import { NewsletterForm } from './NewsletterForm';

interface NewsletterSectionProps {
  header?: string;
  subtext?: string;
  footnote?: string;
  listId?: string;
  className?: string;
  showHeader?: boolean;
  showSubtext?: boolean;
  showFootnote?: boolean;
}

export function NewsletterSection({
  header = 'Join the Portland Fresh Dispatch',
  subtext = 'Weekly menus, pickup windows, and farm stories straight from our Buckman kitchen. No noise—just what you need to plan your next drop.',
  footnote = 'No spam. Just seasonal intel and early access to limited runs.',
  listId,
  className = '',
  showHeader = true,
  showSubtext = true,
  showFootnote = true,
}: NewsletterSectionProps) {
  return (
    <div className={className}>
      {showHeader && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {header}
        </h2>
      )}

      {showSubtext && (
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl">
          {subtext}
        </p>
      )}

      <NewsletterForm listId={listId} />

      {showFootnote && (
        <p className="text-sm text-gray-500 mt-4 italic">
          {footnote}
        </p>
      )}
    </div>
  );
}
