import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ReferralsTable } from './ReferralsTable';
import { getReferralLeaderboardWithUsers } from '@/lib/referral-utils';
import { FadeIn } from '@/components/animations';

export const metadata = {
  title: 'Referrals | Admin',
  description: 'Manage referral program',
};

async function getReferrals() {
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

  // Fetch all referrals with user details
  const { data: referrals, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referrer:profiles!referrer_id(id, email, full_name, name),
      referred:profiles!referred_user_id(id, email, full_name, name)
    `)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Error fetching referrals:', error);
    return [];
  }

  return referrals || [];
}

export const dynamic = 'force-dynamic';

export default async function ReferralsPage() {
  const referrals = await getReferrals();
  const leaderboard = await getReferralLeaderboardWithUsers(10);

  const totalReferrals = referrals.filter((r) => r.referred_user_id).length;
  const completedPurchases = referrals.filter((r) => r.completed_purchase).length;
  const pendingRewards = referrals.filter((r) => r.completed_purchase && !r.reward_issued).length;
  const issuedRewards = referrals.filter((r) => r.reward_issued).length;
  const conversionRate = totalReferrals > 0 ? ((completedPurchases / totalReferrals) * 100).toFixed(1) : '0';

  return (
    <div className="p-8">
      {/* Header */}
      <FadeIn direction="up" delay={0.05}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-600 mt-1">Track referrals and rewards</p>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn direction="up" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Referrals</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{totalReferrals}</div>
            <p className="text-xs text-gray-500 mt-2">Unique sign-ups via referral links</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-2 border-green-200">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{completedPurchases}</div>
            <p className="text-xs text-gray-500 mt-2">Referred users who made a purchase</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-2 border-yellow-200">
            <div className="text-sm text-gray-600">Pending Rewards</div>
            <div className="text-3xl font-bold text-yellow-600 mt-1">{pendingRewards}</div>
            <p className="text-xs text-gray-500 mt-2">Rewards waiting to be issued</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-200">
            <div className="text-sm text-gray-600">Rewards Issued</div>
            <div className="text-3xl font-bold text-blue-600 mt-1">{issuedRewards}</div>
            <p className="text-xs text-gray-500 mt-2">Successfully paid out to referrers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-2">Referrals → Purchases</p>
          </div>
        </div>
      </FadeIn>

      {/* How Referrals Work */}
      <FadeIn direction="up" delay={0.12}>
        <details className="bg-gray-50 rounded-xl border border-gray-200 mb-8">
          <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            View Referral Flow & Status Guide
          </summary>
          <div className="px-4 pb-4 pt-2 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
                <ol className="space-y-1 text-gray-600 list-decimal list-inside">
                  <li>Existing customer shares their unique referral link</li>
                  <li>New customer signs up using that link</li>
                  <li>Referral is tracked (shows in &quot;Total Referrals&quot;)</li>
                  <li>When referred user makes a purchase → &quot;Completed&quot;</li>
                  <li>Reward marked pending → Admin issues reward</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reward Status</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span><strong>Pending</strong> — Purchase complete, reward not yet issued</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span><strong>Issued</strong> — Reward sent to referrer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </FadeIn>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <FadeIn direction="up" delay={0.15}>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Top Referrers</h2>
            <div className="grid grid-cols-1 gap-4">
              {leaderboard.map((entry, index) => (
                <div key={entry.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-gray-900">{entry.userName}</div>
                      <div className="text-sm text-gray-500">{entry.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{entry.count}</div>
                      <div className="text-gray-500">Referred</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{entry.completedCount}</div>
                      <div className="text-gray-500">Converted</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* All Referrals Table */}
      <FadeIn direction="up" delay={0.2}>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">All Referrals</h2>
          </div>
          <ReferralsTable referrals={referrals} />
        </div>
      </FadeIn>
    </div>
  );
}
