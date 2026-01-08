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
  header = 'Fresh Updates Weekly',
  subtext = 'Get the scoop on this week\'s menu, pickup times, and seasonal specials before they sell out. Plus farm stories and recipes from our kitchen.',
  footnote = 'Weekly updates, no spam. Unsubscribe anytime.',
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
