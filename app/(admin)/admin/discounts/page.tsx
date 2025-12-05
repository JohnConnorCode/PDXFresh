import { requireAdmin } from '@/lib/admin';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { DiscountsManager } from './DiscountsManager';

export const metadata = {
  title: 'Discount Codes | Admin',
  description: 'Create and manage discount codes',
};

export const dynamic = 'force-dynamic';

export interface Discount {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  discount_type: 'percent' | 'amount';
  discount_percent: number | null;
  discount_amount_cents: number | null;
  min_amount_cents: number | null;
  max_redemptions: number | null;
  times_redeemed: number;
  first_time_only: boolean;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

async function getDiscounts(): Promise<{ discounts: Discount[]; error: string | null }> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Check if table doesn't exist
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        return {
          discounts: [],
          error: 'TABLE_NOT_FOUND'
        };
      }
      console.error('Error fetching discounts:', error);
      return { discounts: [], error: error.message };
    }

    return { discounts: data || [], error: null };
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return { discounts: [], error: 'Failed to fetch discounts' };
  }
}

export default async function DiscountsPage() {
  await requireAdmin();
  const { discounts, error } = await getDiscounts();

  const activeCount = discounts.filter((c) => c.is_active).length;
  const totalRedemptions = discounts.reduce((sum, c) => sum + (c.times_redeemed || 0), 0);

  // Show migration instructions if table doesn't exist
  if (error === 'TABLE_NOT_FOUND') {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-yellow-800">Database Migration Required</h1>
          </div>

          <p className="text-yellow-800 mb-4">
            The <code className="bg-yellow-200 px-1 rounded">discounts</code> table hasn&apos;t been created yet.
            Run the migration SQL in the Supabase Dashboard to enable database-only discounts.
          </p>

          <div className="space-y-3">
            <a
              href="https://supabase.com/dashboard/project/qjgenpwbaquqrvyrfsdo/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Open Supabase SQL Editor →
            </a>

            <p className="text-sm text-yellow-700">
              Paste the contents of <code className="bg-yellow-200 px-1 rounded">supabase/migrations/027_database_discounts.sql</code> and run it.
            </p>

            <p className="text-sm text-yellow-700">
              Or run: <code className="bg-yellow-200 px-1 rounded">node scripts/setup-discounts.mjs</code> for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discount Codes</h1>
        <p className="text-gray-600 mt-1">
          Create and manage discount codes. 100% database-controlled — no Stripe sync needed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Codes</div>
          <div className="text-2xl font-bold">{discounts.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Redemptions</div>
          <div className="text-2xl font-bold text-blue-600">{totalRedemptions}</div>
        </div>
      </div>

      {/* Main Manager Component */}
      <DiscountsManager initialDiscounts={discounts} />
    </div>
  );
}
