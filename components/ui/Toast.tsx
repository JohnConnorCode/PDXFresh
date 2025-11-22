'use client';

import { Toaster, toast as hotToast } from 'react-hot-toast';
import { ReactNode } from 'react';

/**
 * Toast Notification Provider using react-hot-toast
 * Replaces custom toast implementation with battle-tested library
 *
 * Features:
 * - Success, error, info, loading toasts
 * - Promise-based toasts
 * - Auto-dismiss with customizable duration
 * - Stacking and animations
 * - Accessible
 *
 * Usage:
 * import { toast } from '@/components/ui/Toast';
 *
 * toast.success('Saved!');
 * toast.error('Failed to save');
 * toast.loading('Saving...');
 * toast.promise(asyncFn(), { loading: 'Saving...', success: 'Saved!', error: 'Failed' });
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },

          // Success toast
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              background: '#059669',
              color: '#fff',
            },
          },

          // Error toast
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          },

          // Loading toast
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3B82F6',
              secondary: '#fff',
            },
            style: {
              background: '#2563EB',
              color: '#fff',
            },
          },
        }}
      />
    </>
  );
}

/**
 * Enhanced toast API with helper functions
 * Compatible with old useToast() hook for backward compatibility
 */
export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  info: (message: string) => hotToast(message), // default toast for info

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => hotToast.promise(promise, messages),

  custom: (jsx: ReactNode) => hotToast.custom(() => jsx as any),
  dismiss: (toastId?: string) => hotToast.dismiss(toastId),
};

/**
 * Backward compatibility: useToast hook
 * Maintains compatibility with existing code using the old API
 */
export function useToast() {
  return {
    showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      switch (type) {
        case 'success':
          return toast.success(message);
        case 'error':
          return toast.error(message);
        default:
          return toast.info(message);
      }
    },
  };
}

// Export raw toast API for advanced usage
export { toast as rawToast } from 'react-hot-toast';
