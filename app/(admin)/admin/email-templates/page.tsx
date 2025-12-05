import { Metadata } from 'next';
import { EmailTemplateManager } from '@/components/admin/email/EmailTemplateManager';

export const metadata: Metadata = {
  title: 'Email Templates | Admin',
  description: 'Manage email templates',
};

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-gray-600 mt-2">
          Manage database-driven email templates with draft/publish workflow
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-3">How Email Templates Work</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-2">Draft/Publish Workflow:</p>
            <ul className="space-y-1 list-disc list-inside text-blue-700">
              <li><strong>Draft</strong> — Safe to edit, not sent to customers</li>
              <li><strong>Published</strong> — Live version used for actual emails</li>
              <li>Edit drafts safely, then publish when ready</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Variable Substitution:</p>
            <ul className="space-y-1 list-disc list-inside text-blue-700">
              <li>Use <code className="bg-blue-100 px-1 rounded">{'{{variableName}}'}</code> in templates</li>
              <li>Auto-formats: <code className="bg-blue-100 px-1 rounded">{'{{total}}'}</code> → $129.97</li>
              <li>Common vars: customerName, orderNumber, items</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Template Categories Guide */}
      <details className="bg-gray-50 rounded-xl border border-gray-200">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          View Template Categories & When They're Sent
        </summary>
        <div className="px-5 pb-4 pt-2 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Transactional (auto-sent)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>order_confirmation</strong> — After successful checkout</li>
                <li>• <strong>shipping_confirmation</strong> — When order ships</li>
                <li>• <strong>subscription_confirmation</strong> — New subscription</li>
                <li>• <strong>payment_failed</strong> — Subscription payment issue</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Marketing & Engagement</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>welcome</strong> — After account creation</li>
                <li>• <strong>newsletter_welcome</strong> — Newsletter signup</li>
                <li>• <strong>contact_form_notification</strong> — Internal alert</li>
              </ul>
            </div>
          </div>
        </div>
      </details>

      <EmailTemplateManager />
    </div>
  );
}
