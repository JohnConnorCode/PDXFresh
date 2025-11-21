import { Metadata } from 'next';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin';
import { StripeModeToggle } from './StripeModeToggle';
import { FadeIn } from '@/components/animations';

export const metadata: Metadata = {
  title: 'Stripe Mode | Admin',
  description: 'Manage Stripe test/production mode',
};

export const dynamic = 'force-dynamic';

async function getCurrentMode() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('stripe_settings')
    .select('mode')
    .limit(1)
    .single();

  return data?.mode || 'test';
}

async function getProductVariantCount() {
  const supabase = createServiceRoleClient();
  const { count } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true });

  return count || 0;
}

export default async function StripeMod ePage() {
  await requireAdmin();

  const [currentMode, variantCount] = await Promise.all([
    getCurrentMode(),
    getProductVariantCount(),
  ]);

  return (
    <FadeIn>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Stripe Mode Configuration
          </h1>
          <p className="text-gray-600">
            Switch between test and production Stripe modes. Changes affect all checkout sessions immediately.
          </p>
        </div>

        {/* Critical Warning */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🚨</div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-lg mb-2">CRITICAL WARNING</h3>
              <div className="space-y-2 text-sm text-red-800">
                <p className="font-semibold">
                  Switching to PRODUCTION mode enables REAL payments with REAL money.
                </p>
                <p>
                  Before switching to production mode, you MUST:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verify all product variant price IDs are production prices</li>
                  <li>Test checkout flow in test mode first</li>
                  <li>Ensure production Stripe webhook is configured</li>
                  <li>Have production price IDs ready in database</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Current Mode</div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  currentMode === 'production'
                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                    : 'bg-green-100 text-green-800 border border-green-300'
                }`}>
                  {currentMode === 'production' ? '🔴 PRODUCTION' : '🟢 TEST'}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Product Variants</div>
              <div className="text-lg font-semibold text-gray-900">{variantCount} variants</div>
              <div className="text-xs text-gray-500 mt-1">
                All must have valid price IDs for selected mode
              </div>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Switch Mode</h2>
          <StripeModeToggle currentMode={currentMode} variantCount={variantCount} />
        </div>

        {/* Validation Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">✓ Validation Checklist</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>Before switching to production, run these validation scripts:</p>
            <div className="bg-blue-100 rounded p-3 font-mono text-xs space-y-1">
              <div># 1. Validate all price IDs</div>
              <div className="text-blue-900 font-semibold">node scripts/validate-checkout.mjs</div>
              <div className="mt-2"># 2. Test checkout with real data</div>
              <div className="text-blue-900 font-semibold">node scripts/test-real-checkout.mjs</div>
              <div className="mt-2"># 3. Run full test suite</div>
              <div className="text-blue-900 font-semibold">./scripts/run-all-checkout-tests.sh</div>
            </div>
            <p className="mt-3 font-semibold">
              All tests must pass before enabling production mode.
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
