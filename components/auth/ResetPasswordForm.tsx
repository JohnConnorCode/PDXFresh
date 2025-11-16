'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password
    if (password.length < 12) {
      setError('Password must be at least 12 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      // Success! Redirect to login
      router.push('/login?message=Password reset successful. Please sign in with your new password.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={12}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-primary"
          placeholder="Minimum 12 characters"
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be at least 12 characters long
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-primary"
        />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Reset Password'}
      </button>
    </form>
  );
}
