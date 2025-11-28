'use client';

/**
 * DiscountCard - Reusable component for displaying user discounts
 *
 * Displays discount code, value, expiration, and copy functionality.
 * Supports featured styling and various discount types.
 */

import { useState } from 'react';

export interface UserDiscount {
  _id: string;
  displayTitle: string;
  shortDescription?: string;
  discountCode: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  expiresAt?: string;
  icon?: string;
  ctaLabel?: string;
  featured: boolean;
  eligibility: string;
  requiredTier?: string;
}

interface DiscountCardProps {
  discount: UserDiscount;
  variant?: 'default' | 'compact';
}

export function DiscountCard({ discount, variant = 'default' }: DiscountCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(discount.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDiscountValue = () => {
    switch (discount.discountType) {
      case 'percentage':
        return `${discount.discountValue}% off`;
      case 'fixed_amount':
        return `$${(discount.discountValue / 100).toFixed(2)} off`;
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return '';
    }
  };

  const isExpiringSoon = discount.expiresAt
    ? new Date(discount.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
    : false;

  if (variant === 'compact') {
    return (
      <div
        className={`p-4 rounded-lg border transition-all ${
          discount.featured
            ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
            : 'bg-white border-gray-200 hover:border-blue-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {discount.icon && <span className="text-xl flex-shrink-0">{discount.icon}</span>}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">{discount.displayTitle}</p>
              <p className="text-xs text-gray-500">{formatDiscountValue()}</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 px-3 py-1.5 bg-accent-primary text-white text-xs font-semibold rounded-lg hover:bg-accent-dark transition-colors"
          >
            {copied ? 'Copied!' : discount.discountCode}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-xl border-2 transition-all ${
        discount.featured
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        {discount.icon && <div className="text-4xl">{discount.icon}</div>}
        {discount.featured && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl font-bold mb-2">
        {discount.displayTitle}
      </h3>

      {/* Description */}
      {discount.shortDescription && (
        <p className="text-gray-600 mb-4 text-sm">
          {discount.shortDescription}
        </p>
      )}

      {/* Code with Copy Button */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-dashed border-accent-primary">
          <span className="font-mono font-bold text-lg text-accent-primary">
            {discount.discountCode}
          </span>
          <button
            onClick={handleCopy}
            className="text-accent-primary hover:text-accent-dark transition-colors"
            title="Copy code"
          >
            {copied ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Expiration Warning */}
      {isExpiringSoon && discount.expiresAt && (
        <div className="mb-3 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Expires soon!
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">
          {formatDiscountValue()}
        </span>
        {discount.expiresAt && (
          <span className="text-gray-500">
            Expires: {new Date(discount.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * DiscountGrid - Grid layout for multiple discounts
 */
interface DiscountGridProps {
  discounts: UserDiscount[];
  variant?: 'default' | 'compact';
}

export function DiscountGrid({ discounts, variant = 'default' }: DiscountGridProps) {
  if (discounts.length === 0) {
    return null;
  }

  const gridClass = variant === 'compact'
    ? 'grid grid-cols-1 gap-3'
    : 'grid grid-cols-1 md:grid-cols-2 gap-6';

  return (
    <div className={gridClass}>
      {discounts.map((discount) => (
        <DiscountCard key={discount._id} discount={discount} variant={variant} />
      ))}
    </div>
  );
}

/**
 * ActiveDiscountBanner - Compact banner for a single featured discount
 */
interface ActiveDiscountBannerProps {
  discount: UserDiscount;
}

export function ActiveDiscountBanner({ discount }: ActiveDiscountBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(discount.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {discount.icon && <span className="text-2xl">{discount.icon}</span>}
        <div>
          <p className="font-semibold">{discount.displayTitle}</p>
          <p className="text-sm opacity-90">
            {discount.discountType === 'percentage' && `${discount.discountValue}% off`}
            {discount.discountType === 'fixed_amount' && `$${(discount.discountValue / 100).toFixed(2)} off`}
            {discount.discountType === 'free_shipping' && 'Free Shipping'}
          </p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-white text-accent-primary rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        {copied ? 'Copied!' : `Use: ${discount.discountCode}`}
      </button>
    </div>
  );
}
