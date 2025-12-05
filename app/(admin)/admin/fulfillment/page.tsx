import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { OrderFulfillmentManager } from '@/components/admin/OrderFulfillmentManager';

export const metadata = {
  title: 'Order Fulfillment | Admin',
  description: 'Manage order fulfillment and shipping',
};

export default async function FulfillmentPage() {
  // Check if user is admin
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/admin/fulfillment');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Fulfillment
        </h1>
        <p className="text-gray-600">
          Manage order status, shipping, and tracking information
        </p>
      </div>

      {/* Fulfillment Workflow */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">Fulfillment Workflow</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">Paid</span>
          <span className="text-green-600">→</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">Processing</span>
          <span className="text-green-600">→</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">Shipped</span>
          <span className="text-green-600">→</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">Delivered</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
          <div>
            <p className="font-medium mb-2">Status Actions:</p>
            <ul className="space-y-1 list-disc list-inside text-green-700">
              <li><strong>Mark Processing</strong> — Order being prepared</li>
              <li><strong>Add Tracking</strong> — Enter carrier + tracking #</li>
              <li><strong>Mark Shipped</strong> — Triggers shipping email</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Customer Notifications:</p>
            <ul className="space-y-1 list-disc list-inside text-green-700">
              <li>Shipping confirmation email sent automatically</li>
              <li>Tracking link included in email</li>
              <li>Customer can track via order lookup page</li>
            </ul>
          </div>
        </div>
      </div>

      <OrderFulfillmentManager />
    </div>
  );
}
