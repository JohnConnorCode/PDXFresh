'use client';

import { useState, useMemo } from 'react';
import { EmailTemplate } from '@/lib/services/emailTemplateService';

interface PreviewEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate;
}

// Sample data for preview (same as test email)
const getSampleData = (templateName: string): Record<string, any> => {
  switch (templateName) {
    case 'order_confirmation':
      return {
        orderNumber: 'PREVIEW123',
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
        planName: 'Weekly Wellness Plan',
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
        message: 'This is a test contact form message from the preview.',
      };
    default:
      return {};
  }
};

// Simple variable substitution (mirrors Edge Function logic)
const substituteVariables = (template: string, data: Record<string, any>): string => {
  let result = template;

  // Handle special {{itemsTable}} for orders
  if (template.includes('{{itemsTable}}') && data.items && Array.isArray(data.items)) {
    const itemsHtml = `
<table class="items-table" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead><tr><th style="text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb;">Item</th><th style="text-align: center; padding: 12px; border-bottom: 2px solid #e5e7eb;">Quantity</th><th style="text-align: right; padding: 12px; border-bottom: 2px solid #e5e7eb;">Price</th></tr></thead>
  <tbody>
    ${data.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="text-align: center; padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
      <td style="text-align: right; padding: 12px; border-bottom: 1px solid #e5e7eb;">$${(item.price / 100).toFixed(2)}</td>
    </tr>
    `).join('')}
  </tbody>
</table>`.trim();
    result = result.replace('{{itemsTable}}', itemsHtml);
  }

  // Replace all variables
  for (const [key, value] of Object.entries(data)) {
    const pattern = new RegExp(`{{${key}}}`, 'g');
    let formattedValue = value;

    // Format currency values
    if (key === 'subtotal' || key === 'total' || key === 'planPrice') {
      formattedValue = `$${((value as number) / 100).toFixed(2)}`;
    }

    result = result.replace(pattern, String(formattedValue));
  }

  return result;
};

export function PreviewEmailModal({ isOpen, onClose, template }: PreviewEmailModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const sampleData = useMemo(() => getSampleData(template.template_name), [template.template_name]);

  const previewHtml = useMemo(() => {
    return substituteVariables(template.html_template, sampleData);
  }, [template.html_template, sampleData]);

  const previewSubject = useMemo(() => {
    return substituteVariables(template.subject_template, sampleData);
  }, [template.subject_template, sampleData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Email Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              {template.description || template.template_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                viewMode === 'desktop'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                viewMode === 'mobile'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Mobile
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Using sample data for preview
          </div>
        </div>

        {/* Subject Line */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subject</div>
          <div className="font-medium text-gray-900">{previewSubject}</div>
          {template.preheader && (
            <>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 mt-3">Preheader</div>
              <div className="text-sm text-gray-700">{template.preheader}</div>
            </>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className={`mx-auto bg-white shadow-lg ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
            <iframe
              srcDoc={previewHtml}
              className="w-full border-0"
              style={{ height: '600px' }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
