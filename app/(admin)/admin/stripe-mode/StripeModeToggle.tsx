'use client';

import { useState } from 'react';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';

interface StripeModeToggleProps {
  currentMode: 'test' | 'production';
  variantCount: number;
}

export function StripeModeToggle({ currentMode, variantCount }: StripeModeToggleProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetMode, setTargetMode] = useState<'test' | 'production' | null>(null);
  const router = useRouter();

  const handleModeSwitch = (newMode: 'test' | 'production') => {
    setTargetMode(newMode);
    setShowConfirmation(true);
  };

  const confirmSwitch = async () => {
    if (!targetMode) return;

    setIsChanging(true);
    setShowConfirmation(false);

    try {
      const response = await fetch('/api/admin/stripe-mode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to switch mode: ${error.error || 'Unknown error'}`);
        return;
      }

      router.refresh();
      alert(`Successfully switched to ${targetMode.toUpperCase()} mode!\n\nAll checkout sessions will now use ${targetMode} Stripe ${targetMode === 'production' ? '(REAL MONEY)' : '(test cards)'}.`);
    } catch (error) {
      logger.error('Error switching mode:', error);
      alert('Failed to switch mode. Check console for details.');
    } finally {
      setIsChanging(false);
      setTargetMode(null);
    }
  };

  const cancelSwitch = () => {
    setShowConfirmation(false);
    setTargetMode(null);
  };

  return (
    <div>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {targetMode === 'production' ? '🚨 ENABLE PRODUCTION MODE?' : '⚠️ SWITCH TO TEST MODE?'}
            </h3>

            {targetMode === 'production' ? (
              <div className="space-y-3 text-sm text-gray-700 mb-6">
                <p className="font-semibold text-red-600">
                  This will enable REAL credit card processing with REAL money!
                </p>
                <p>Before confirming, ensure:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>All {variantCount} product variants have PRODUCTION price IDs</li>
                  <li>Validation script passed: <code className="bg-gray-100 px-1">node scripts/validate-checkout.mjs</code></li>
                  <li>Production webhook is configured in Stripe dashboard</li>
                  <li>You're ready to accept real payments</li>
                </ul>
                <p className="font-semibold mt-3">
                  Have you run and verified <code className="bg-gray-100 px-1">node scripts/validate-checkout.mjs</code> shows ALL CHECKS PASSED?
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p>
                  This will switch to TEST mode. All checkout sessions will use Stripe test cards.
                </p>
                <p className="text-green-700 font-medium">
                  ✓ Safe to use for development and testing
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={cancelSwitch}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
                  targetMode === 'production'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {targetMode === 'production' ? 'ENABLE PRODUCTION' : 'Switch to Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleModeSwitch('test')}
          disabled={isChanging || currentMode === 'test'}
          className={`flex-1 px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
            currentMode === 'test'
              ? 'bg-green-100 border-green-500 text-green-800 cursor-default'
              : 'bg-white border-gray-300 text-gray-700 hover:border-green-500 hover:bg-green-50'
          } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">🟢</div>
            <div>Test Mode</div>
            <div className="text-xs font-normal text-gray-600">
              Use test cards, no real money
            </div>
          </div>
        </button>

        <button
          onClick={() => handleModeSwitch('production')}
          disabled={isChanging || currentMode === 'production'}
          className={`flex-1 px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
            currentMode === 'production'
              ? 'bg-red-100 border-red-500 text-red-800 cursor-default'
              : 'bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:bg-red-50'
          } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex-col items-center gap-2">
            <div className="text-2xl">🔴</div>
            <div>Production Mode</div>
            <div className="text-xs font-normal text-gray-600">
              REAL payments, REAL money
            </div>
          </div>
        </button>
      </div>

      {isChanging && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Switching mode...
        </div>
      )}
    </div>
  );
}
