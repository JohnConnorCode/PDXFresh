import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { redirect } from 'next/navigation';
import { SubscriptionsTable } from './SubscriptionsTable';
import { FadeIn } from '@/components/animations';

export const metadata = {
  title: 'Subscriptions | Admin',
  description: 'Manage customer subscriptions',
};

async function getSubscriptions() {
  const supabase = createClient();

  // Check admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/');

  // Fetch subscriptions with user details
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      profile:profiles(id, email, full_name, name)
    `)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    logger.error('Error fetching subscriptions:', error);
    return [];
  }

  return subscriptions || [];
}

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const trialingCount = subscriptions.filter((s) => s.status === 'trialing').length;
  const canceledCount = subscriptions.filter((s) => s.status === 'canceled').length;
  const pastDueCount = subscriptions.filter((s) => s.status === 'past_due').length;

  return (
    <div className="p-8">
      {/* Header */}
      <FadeIn direction="up" delay={0.05}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">
            Monitor recurring orders and customer retention. {subscriptions.length} total subscriptions.
          </p>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn direction="up" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-green-200 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-600">Active</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{activeCount}</div>
            <p className="text-xs text-gray-500 mt-2">Billing successfully, generating revenue</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-blue-200 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-600">Trialing</div>
            <div className="text-3xl font-bold text-blue-600 mt-1">{trialingCount}</div>
            <p className="text-xs text-gray-500 mt-2">Free trial period, not yet charged</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-yellow-200 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-600">Past Due</div>
            <div className="text-3xl font-bold text-yellow-600 mt-1">{pastDueCount}</div>
            <p className="text-xs text-gray-500 mt-2">Payment failed, retrying automatically</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-gray-600">Canceled</div>
            <div className="text-3xl font-bold text-gray-500 mt-1">{canceledCount}</div>
            <p className="text-xs text-gray-500 mt-2">Customer ended subscription</p>
          </div>
        </div>
      </FadeIn>

      {/* Status Legend */}
      <FadeIn direction="up" delay={0.12}>
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Subscription Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-gray-700">Active</span>
                <span className="text-gray-500"> — Subscription is live and billing normally. Customer has full access.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-gray-700">Trialing</span>
                <span className="text-gray-500"> — Customer is in a free trial. Will convert to active when trial ends.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-gray-700">Past Due</span>
                <span className="text-gray-500"> — Payment failed. Stripe will retry automatically for up to 4 weeks.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-gray-700">Canceled</span>
                <span className="text-gray-500"> — Subscription ended by customer or payment exhausted.</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Table */}
      <FadeIn direction="up" delay={0.15}>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <SubscriptionsTable subscriptions={subscriptions} />
        </div>
      </FadeIn>
    </div>
  );
}
