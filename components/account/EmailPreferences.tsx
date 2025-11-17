'use client';

import { useState, useEffect } from 'react';
import { Mail, Bell, BellOff } from 'lucide-react';

interface EmailPreferencesProps {
  userEmail: string;
}

export function EmailPreferences({ userEmail }: EmailPreferencesProps) {
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch subscription status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/klaviyo/status');
        if (response.ok) {
          const data = await response.json();
          setSubscribed(data.subscribed || false);
        }
      } catch (error) {
        console.error('Failed to fetch subscription status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleToggleSubscription = async () => {
    setUpdating(true);
    setMessage(null);

    try {
      const endpoint = subscribed ? '/api/klaviyo/unsubscribe' : '/api/klaviyo/subscribe';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          firstName: userEmail.split('@')[0], // Fallback if name not available
          lastName: '',
        }),
      });

      if (response.ok) {
        setSubscribed(!subscribed);
        setMessage({
          type: 'success',
          text: subscribed
            ? 'Successfully unsubscribed from newsletter'
            : 'Successfully subscribed to newsletter!',
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.error || 'Failed to update subscription',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred while updating your preferences',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-accent-primary" />
          <h2 className="font-heading text-2xl font-bold">Email Preferences</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-accent-primary" />
        <h2 className="font-heading text-2xl font-bold">Email Preferences</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {subscribed ? (
                <Bell className="w-5 h-5 text-green-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="font-semibold text-lg">Newsletter Subscription</h3>
            </div>
            <p className="text-sm text-gray-600">
              Receive updates about new products, exclusive promotions, and wellness tips
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Email: <strong>{userEmail}</strong>
            </p>
          </div>

          <button
            onClick={handleToggleSubscription}
            disabled={updating}
            className={`ml-4 px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              subscribed
                ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'
                : 'bg-accent-primary text-white hover:opacity-90 hover:scale-105'
            }`}
          >
            {updating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            ) : subscribed ? (
              'Subscribed'
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Klaviyo Integration Active:</strong> Your email preferences are managed through
            Klaviyo, our email marketing platform. Unsubscribing here will also unsubscribe you
            from all marketing emails.
          </p>
        </div>
      </div>
    </div>
  );
}
