/**
 * PerkCard - Reusable component for displaying partnership perks
 *
 * Displays perk title, description, tier badge, and CTA button.
 * Supports featured styling for highlighted perks.
 */

import Link from 'next/link';

export interface PartnershipPerk {
  _id: string;
  title: string;
  shortDescription?: string;
  requiredTier: string;
  category?: string;
  icon?: string;
  image?: {
    url: string;
    alt?: string;
  };
  ctaLabel?: string;
  ctaUrl?: string;
  expiresAt?: string;
  featured: boolean;
  discountCode?: string;
}

interface PerkCardProps {
  perk: PartnershipPerk;
  variant?: 'default' | 'compact';
}

export function PerkCard({ perk, variant = 'default' }: PerkCardProps) {
  const tierLabel = perk.requiredTier.charAt(0).toUpperCase() + perk.requiredTier.slice(1);
  const isExpiringSoon = perk.expiresAt
    ? new Date(perk.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
    : false;

  if (variant === 'compact') {
    return (
      <div
        className={`p-4 rounded-lg border transition-all ${
          perk.featured
            ? 'bg-gradient-to-br from-accent-yellow/10 to-accent-green/10 border-accent-yellow/30'
            : 'bg-white border-gray-200 hover:border-accent-primary/30'
        }`}
      >
        <div className="flex items-start gap-3">
          {perk.icon && (
            <span className="text-2xl flex-shrink-0">{perk.icon}</span>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{perk.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{tierLabel} Perk</p>
          </div>
          {perk.ctaUrl && (
            <Link
              href={perk.ctaUrl}
              className="text-xs font-semibold text-accent-primary hover:text-accent-dark transition-colors flex-shrink-0"
            >
              View
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-xl border-2 transition-all ${
        perk.featured
          ? 'bg-gradient-to-br from-accent-yellow/20 to-accent-green/20 border-accent-yellow/50'
          : 'bg-gray-50 border-gray-200 hover:border-accent-primary/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        {perk.icon && (
          <div className="text-4xl">{perk.icon}</div>
        )}
        {perk.featured && (
          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl font-bold mb-2">
        {perk.title}
      </h3>

      {/* Description */}
      {perk.shortDescription && (
        <p className="text-gray-600 mb-4 text-sm">
          {perk.shortDescription}
        </p>
      )}

      {/* Expiration Warning */}
      {isExpiringSoon && perk.expiresAt && (
        <div className="mb-3 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
          Expires {new Date(perk.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}

      {/* Discount Code */}
      {perk.discountCode && (
        <div className="mb-4">
          <code className="px-3 py-1.5 bg-white rounded-lg text-sm font-mono font-semibold text-accent-primary border border-accent-primary/20">
            {perk.discountCode}
          </code>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs px-3 py-1 bg-white rounded-full font-semibold text-accent-primary border border-accent-primary/30">
          {tierLabel} Perk
        </span>
        {perk.ctaUrl && (
          <Link
            href={perk.ctaUrl}
            className="text-sm font-semibold text-accent-primary hover:text-accent-dark transition-colors"
          >
            {perk.ctaLabel || 'Learn More'} &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * PerkGrid - Grid layout for multiple perks
 */
interface PerkGridProps {
  perks: PartnershipPerk[];
  variant?: 'default' | 'compact';
}

export function PerkGrid({ perks, variant = 'default' }: PerkGridProps) {
  if (perks.length === 0) {
    return null;
  }

  const gridClass = variant === 'compact'
    ? 'grid grid-cols-1 gap-3'
    : 'grid grid-cols-1 md:grid-cols-2 gap-6';

  return (
    <div className={gridClass}>
      {perks.map((perk) => (
        <PerkCard key={perk._id} perk={perk} variant={variant} />
      ))}
    </div>
  );
}

/**
 * EmptyPerkState - Shown when no perks are available
 */
export function EmptyPerkState() {
  return (
    <div className="text-center py-12">
      <div className="mb-4 text-6xl">🎁</div>
      <p className="text-gray-600 mb-4">
        No perks available yet for your membership level.
      </p>
      <p className="text-sm text-gray-500">
        Contact us to learn about partnership opportunities and unlock exclusive benefits!
      </p>
    </div>
  );
}
