import { Metadata } from 'next';
import { logger } from '@/lib/logger';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin';
import { FadeIn } from '@/components/animations';
import { WholesaleStatusButton } from './WholesaleStatusButton';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale Inquiries | Admin',
  description: 'Manage wholesale business inquiries',
};

async function WholesaleStats() {
  const supabase = createServiceRoleClient();

  const [
    { count: totalInquiries },
    { count: newInquiries },
    { count: contacted },
    { count: qualified },
    { count: closed }
  ] = await Promise.all([
    supabase.from('wholesale_inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('wholesale_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('wholesale_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    supabase.from('wholesale_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'qualified'),
    supabase.from('wholesale_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
  ]);

  const stats = [
    { label: 'Total Inquiries', value: totalInquiries || 0, color: 'blue' },
    { label: 'New', value: newInquiries || 0, color: 'yellow' },
    { label: 'Contacted', value: contacted || 0, color: 'purple' },
    { label: 'Qualified', value: qualified || 0, color: 'green' },
    { label: 'Closed', value: closed || 0, color: 'gray' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
          <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

async function InquiryList() {
  const supabase = createServiceRoleClient();

  const { data: inquiries, error } = await supabase
    .from('wholesale_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    logger.error('Error loading inquiries:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-semibold mb-2">Failed to load inquiries</p>
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No wholesale inquiries yet"
        description="Business inquiries will appear here"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Inquiries ({inquiries.length})</h3>
        <a
          href="/api/admin/wholesale/export"
          className="px-4 py-2 bg-accent-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Export CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {inquiry.company}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{inquiry.name}</div>
                  <div className="text-sm text-gray-500">{inquiry.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {inquiry.location}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {inquiry.expected_volume}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <WholesaleStatusButton
                    inquiryId={inquiry.id}
                    currentStatus={inquiry.status}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {inquiry.message || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function WholesalePage() {
  await requireAdmin();

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Wholesale Inquiries
        </h1>
        <p className="text-gray-600">
          Manage business and wholesale partnership inquiries
        </p>
      </div>

      {/* Status Guide */}
      <details className="bg-gray-50 rounded-xl border border-gray-200 mb-6">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          View Status Pipeline & Guide
        </summary>
        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Pipeline Stages</h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">new</span>
                  <span>— Fresh inquiry, needs review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">contacted</span>
                  <span>— Initial outreach sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">qualified</span>
                  <span>— Good fit, negotiating terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">closed</span>
                  <span>— Deal done or declined</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
              <ul className="space-y-1 text-gray-600 list-disc list-inside">
                <li>Click the status badge to change pipeline stage</li>
                <li>Export CSV for your CRM or spreadsheet</li>
                <li>Expected volume helps prioritize high-value leads</li>
              </ul>
            </div>
          </div>
        </div>
      </details>

      <Suspense fallback={<LoadingSkeleton variant="stat" lines={5} />}>
        <WholesaleStats />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton variant="table" lines={5} />}>
        <InquiryList />
      </Suspense>
    </FadeIn>
  );
}
