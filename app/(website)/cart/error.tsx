'use client';

/**
 * Cart Page Error Boundary
 *
 * Catches errors specific to the cart page and provides cart-specific recovery options.
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Cart error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Cart Error Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Cart Error
            </h1>
            <p className="text-gray-600">
              We had trouble loading your cart. Your items are safe, but we need to try again.
            </p>
          </div>

          {/* Error Details (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="text-xs font-mono text-gray-700 break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reload Cart
            </button>
            <button
              onClick={() => {
                // Clear local storage cart and reload
                localStorage.removeItem('cart');
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Clear Cart & Start Over
            </button>
            <Link
              href="/products"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            Don't worry - your cart is stored locally and won't be lost if you navigate away.
          </p>
        </div>
      </div>
    </div>
  );
}
