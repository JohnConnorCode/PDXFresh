'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

interface SignupFormProps {
  redirectTo?: string;
  referralCode?: string;
}

export function SignupForm({ redirectTo = '/account', referralCode }: SignupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    // SECURITY: Strong password validation
    if (password.length < 12) {
      setError('Password must be at least 12 characters long');
      setLoading(false);
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName.split(' ')[0], // First name
          },
          emailRedirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

      // If session exists, user is logged in (email confirmation disabled)
      if (data.session) {
        // Track referral if present
        if (referralCode && data.user) {
          try {
            await fetch('/api/referrals/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                referralCode,
                userId: data.user.id,
              }),
            });
          } catch (err) {
            console.error('Failed to track referral:', err);
            // Don't block signup if referral tracking fails
          }
        }

        // Auto-subscribe to Klaviyo newsletter
        try {
          await fetch('/api/klaviyo/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              firstName: fullName.split(' ')[0],
              lastName: fullName.split(' ').slice(1).join(' ') || '',
            }),
          });
        } catch (err) {
          console.error('Failed to subscribe to Klaviyo:', err);
          // Don't block signup if Klaviyo subscription fails
        }

        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 text-6xl">📧</div>
        <h2 className="text-2xl font-bold mb-3">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent you a confirmation link. Please click it to activate your account.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={() => setEmailSent(false)}
            className="text-accent-primary hover:text-accent-dark font-semibold"
          >
            try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email/Password Form */}
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum 12 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-accent-primary text-white font-semibold rounded-lg hover:bg-accent-dark focus:ring-4 focus:ring-accent-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </div>
  );
}
