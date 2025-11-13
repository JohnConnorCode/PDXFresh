import { Metadata } from 'next';
import Link from 'next/link';
import { requireAdminUser } from '@/lib/auth/admin';

export const metadata: Metadata = {
  title: 'Webhook Events | Admin',
};

export default async function AdminWebhooksPage() {
  // Verify admin access
  await requireAdminUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium mb-4 inline-block">
            ← Back to Site
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Webhook Events</h1>
          <p className="text-gray-600">Monitor Stripe webhook events and verify webhook configuration</p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium mb-1">Webhook Endpoint</p>
            <code className="text-sm bg-gray-100 p-2 rounded break-all">POST /api/stripe/webhook</code>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
            <p className="text-green-600 font-semibold">✓ Configured</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium mb-1">Secrets</p>
            <p className="text-green-600 font-semibold">✓ Test & Production</p>
          </div>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Monitoring</h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-900">
              <strong>Note:</strong> Real-time webhook event monitoring would require additional infrastructure.
              To test webhooks, use the Stripe Dashboard or the Stripe CLI.
            </p>
          </div>

          <div className="space-y-6">
            {/* Test Webhook Events */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Testing Webhooks Locally</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm space-y-2 overflow-x-auto">
                <div className="text-green-400"># Start Stripe webhook listener</div>
                <div>stripe listen --forward-to localhost:3000/api/stripe/webhook</div>
                <div className="text-green-400 mt-4"># Copy the webhook signing secret from output</div>
                <div>export STRIPE_WEBHOOK_SECRET_TEST=whsec_test_...</div>
                <div className="text-green-400 mt-4"># Test by creating an event</div>
                <div>stripe trigger checkout.session.completed</div>
              </div>
            </div>

            {/* Production Testing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Testing in Production</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Go to <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">Stripe Dashboard</a></li>
                <li>Navigate to Developers → Webhooks</li>
                <li>Find your endpoint: <code className="bg-gray-100 px-2 py-1 rounded text-sm">https://your-domain.com/api/stripe/webhook</code></li>
                <li>Click the endpoint to view recent events</li>
                <li>Check the "Events" tab to see all webhook deliveries</li>
              </ol>
            </div>

            {/* Expected Events */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Expected Webhook Events</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 font-semibold text-accent-primary">•</span>
                  <span><strong>checkout.session.completed</strong> - Customer completes checkout</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 font-semibold text-accent-primary">•</span>
                  <span><strong>payment_intent.succeeded</strong> - One-time payment succeeded</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 font-semibold text-accent-primary">•</span>
                  <span><strong>customer.subscription.created</strong> - New subscription created</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 font-semibold text-accent-primary">•</span>
                  <span><strong>customer.subscription.updated</strong> - Subscription modified</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 font-semibold text-accent-primary">•</span>
                  <span><strong>customer.subscription.deleted</strong> - Subscription cancelled</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 font-semibold text-accent-primary">•</span>
                  <span><strong>invoice.paid</strong> - Invoice paid (recurring subscriptions)</span>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Troubleshooting</h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <div>
                  <p className="font-semibold">Webhook not receiving events?</p>
                  <p className="text-gray-600">Check that your endpoint URL is correct and accessible. Stripe will retry failed webhooks exponentially.</p>
                </div>
                <div>
                  <p className="font-semibold">Signature verification errors?</p>
                  <p className="text-gray-600">Make sure both STRIPE_WEBHOOK_SECRET_TEST and STRIPE_WEBHOOK_SECRET_PRODUCTION are set in your environment variables.</p>
                </div>
                <div>
                  <p className="font-semibold">Wrong mode being used?</p>
                  <p className="text-gray-600">Verify the Stripe mode setting in Sanity. The webhook handler automatically detects which secret to use.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GET /api/admin/stripe-settings</h3>
              <p className="text-gray-600 mb-2">Get current Stripe mode setting (public endpoint)</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
                <div>{"{"}</div>
                <div className="ml-4">"mode": "test",</div>
                <div className="ml-4">"lastModified": "2025-11-13T...",</div>
                <div className="ml-4">"modifiedBy": "admin@example.com"</div>
                <div>{"}"}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PUT /api/admin/stripe-settings</h3>
              <p className="text-gray-600 mb-2">Update Stripe mode (admin only)</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
                <div className="text-green-400">{`// Request`}</div>
                <div>{"{"}</div>
                <div className="ml-4">"mode": "production"</div>
                <div>{"}"}</div>
                <div className="mt-2 text-green-400">{`// Response`}</div>
                <div>{"{"}</div>
                <div className="ml-4">"success": true,</div>
                <div className="ml-4">"mode": "production",</div>
                <div className="ml-4">"message": "Switched to production mode"</div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
