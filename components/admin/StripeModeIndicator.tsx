'use client';

import { useEffect, useState } from 'react';

export function StripeModeIndicator() {
  const [mode, setMode] = useState<'test' | 'production' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMode() {
      try {
        const res = await fetch('/api/admin/stripe-settings');
        const data = await res.json();
        setMode(data.mode);
      } catch (error) {
        console.error('Failed to fetch Stripe mode:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMode();
  }, []);

  if (loading) {
    return (
      <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
        Loading...
      </div>
    );
  }

  if (!mode) {
    return null;
  }

  const isProduction = mode === 'production';
  const bgColor = isProduction ? 'bg-red-50' : 'bg-green-50';
  const textColor = isProduction ? 'text-red-700' : 'text-green-700';
  const borderColor = isProduction ? 'border-red-200' : 'border-green-200';
  const badge = isProduction ? '🔴' : '🟢';

  return (
    <div className={`px-3 py-1.5 rounded-full border ${bgColor} ${textColor} text-xs font-medium ${borderColor}`}>
      <span className="mr-1">{badge}</span>
      <span>{isProduction ? 'Production' : 'Test'} Mode</span>
    </div>
  );
}
