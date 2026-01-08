'use client';

import { useState } from 'react';
import { sendTestEmail } from '@/lib/actions/emailTemplate';
import { EmailTemplate } from '@/lib/services/emailTemplateService';

interface SendTestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate;
}

// Sample data for each template type
const getSampleData = (templateName: string): Record<string, any> => {
  switch (templateName) {
    case 'order_confirmation':
      return {
        orderNumber: 'TEST123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          { name: 'Orange Bomb', quantity: 2, price: 4999 },
          { name: 'Green Bomb', quantity: 1, price: 4999 },
        ],
        subtotal: 9998,
        total: 9998,
        currency: 'usd',
      };
    case 'subscription_confirmation':
      return {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        planName: 'Weekly Sauce Plan',
        planPrice: 7999,
        billingInterval: 'week',
        nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        currency: 'usd',
      };
    case 'newsletter_welcome':
      return {
        customerName: 'Alex Johnson',
        customerEmail: 'alex@example.com',
      };
    case 'contact_form_notification':
      return {
        name: 'Contact User',
        email: 'contact@example.com',
        message: 'This is a test contact form message.',
      };
    default:
      return {};
  }
};

export function SendTestEmailModal({ isOpen, onClose, template }: SendTestEmailModalProps) {
  const [email, setEmail] = useState('');
  const [testData, setTestData] = useState(JSON.stringify(getSampleData(template.template_name), null, 2));
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const data = JSON.parse(testData);
      const response = await sendTestEmail(email, template.template_name, data);

      if (response.success) {
        setResult({
          success: true,
          message: `Test email sent successfully to ${email}!`,
        });
        setTimeout(() => {
          onClose();
          setResult(null);
        }, 2000);
      } else {
        setResult({
          success: false,
          message: response.error || 'Failed to send test email',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid JSON data',
      });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setResult(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Send Test Email</h2>
          <button
            onClick={handleClose}
            disabled={sending}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Template Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900">Template: {template.description || template.template_name}</h3>
            <p className="text-sm text-blue-700 mt-1">Subject: {template.subject_template}</p>
          </div>

          {/* Recipient Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Test Data */}
          <div>
            <label htmlFor="testData" className="block text-sm font-medium text-gray-700 mb-1">
              Test Data (JSON) *
            </label>
            <textarea
              id="testData"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              required
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
              placeholder='{"key": "value"}'
            />
            <p className="text-xs text-gray-500 mt-1">
              Available variables: {Object.keys(template.data_schema || {}).join(', ') || 'None defined'}
            </p>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {result.message}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={sending}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={sending}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
