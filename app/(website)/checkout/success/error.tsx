'use client';

/**
 * Checkout Success Page Error Boundary
 *
 * Catches errors when loading order details after successful payment.
 * Critical: Payment succeeded but we can't show order details.
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutSuccessError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout success page error:', error);
    // TODO: Alert support team - payment succeeded but order display failed
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Success Icon (payment worked) */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Important Message */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Your payment was processed successfully, but we're having trouble displaying your order details.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-900 font-medium mb-1">
                ✅ Your order has been received
              </p>
              <p className="text-xs text-blue-700">
                You'll receive an email confirmation shortly with your order details and tracking information.
              </p>
            </div>
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
              Try Loading Again
            </button>
            <Link
              href="/account/orders"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>

          {/* Reassurance */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>Check your email for order confirmation.</p>
            <p className="text-xs text-gray-500">
              If you don't receive it within 10 minutes, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
