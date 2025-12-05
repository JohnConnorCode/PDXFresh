import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InventoryManager } from '@/components/admin/InventoryManager';

export const metadata = {
  title: 'Inventory Management | Admin',
  description: 'Manage product inventory levels and stock',
};

export default async function InventoryPage() {
  // Check if user is admin
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/admin/inventory');
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600">
          Track and manage product stock levels to prevent overselling
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">How Inventory Tracking Works</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-2">Stock Levels:</p>
            <ul className="space-y-1 list-disc list-inside text-blue-700">
              <li><strong>In Stock</strong> — Available quantity for each variant</li>
              <li><strong>Low Stock</strong> — Below threshold, consider reordering</li>
              <li><strong>Out of Stock</strong> — 0 units, blocks checkout</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Automatic Updates:</p>
            <ul className="space-y-1 list-disc list-inside text-blue-700">
              <li>Stock decreases when orders are placed</li>
              <li>Stock restores if order is cancelled/refunded</li>
              <li>Set low stock alerts to get notified</li>
            </ul>
          </div>
        </div>
      </div>

      <InventoryManager />
    </div>
  );
}
