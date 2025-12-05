import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin';
import { getOrders, getOrderStats, OrderStatus, PaymentStatus } from '@/lib/admin/orders';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDateTime } from '@/lib/utils/formatDate';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { FadeIn } from '@/components/animations';

export const metadata: Metadata = {
  title: 'Orders | Admin',
  description: 'Manage customer orders and process refunds',
};

interface OrdersPageProps {
  searchParams: {
    search?: string;
    status?: OrderStatus;
    payment?: PaymentStatus;
  };
}

async function OrdersStats() {
  const stats = await getOrderStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Orders</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</div>
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Pending Orders</div>
        <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
      </div>
    </div>
  );
}

async function OrdersTable({ searchParams }: OrdersPageProps) {
  const orders = await getOrders({
    searchQuery: searchParams.search,
    status: searchParams.status,
    paymentStatus: searchParams.payment,
    limit: 50,
  });

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
        <p className="text-sm text-gray-500">
          {searchParams.search || searchParams.status || searchParams.payment
            ? 'Try adjusting your filters'
            : 'Orders will appear here once customers make purchases'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id.slice(0, 8)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.stripe_session_id.slice(0, 20)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.customer_email || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.amount_total)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PaymentStatusBadge status={order.payment_status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length >= 50 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing first 50 orders. Use filters to narrow results.
          </p>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn direction="up" delay={0.05}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Orders
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage customer orders, process refunds, and export data
            </p>
          </div>

          <Link
            href="/admin/orders/export"
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </Link>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn direction="up" delay={0.1}>
        <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-lg" />}>
          <OrdersStats />
        </Suspense>
      </FadeIn>

      {/* Status Guide */}
      <FadeIn direction="up" delay={0.15}>
        <details className="bg-gray-50 rounded-xl border border-gray-200 mb-6">
          <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            View Status Guide
          </summary>
          <div className="px-4 pb-4 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">pending</span>
                    <span className="text-gray-600">— Order created, awaiting payment confirmation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">paid</span>
                    <span className="text-gray-600">— Payment successful, ready to fulfill</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">processing</span>
                    <span className="text-gray-600">— Order being prepared for shipping</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">shipped</span>
                    <span className="text-gray-600">— Order dispatched to customer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">delivered</span>
                    <span className="text-gray-600">— Order received by customer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">cancelled</span>
                    <span className="text-gray-600">— Order cancelled before fulfillment</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">unpaid</span>
                    <span className="text-gray-600">— Awaiting payment from customer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">paid</span>
                    <span className="text-gray-600">— Full payment received via Stripe</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">refunded</span>
                    <span className="text-gray-600">— Full refund issued to customer</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">partial_refund</span>
                    <span className="text-gray-600">— Partial refund issued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </FadeIn>

      {/* Filters */}
      <FadeIn direction="up" delay={0.18}>
        <OrderFilters />
      </FadeIn>

      {/* Orders Table */}
      <FadeIn direction="up" delay={0.2}>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
          <OrdersTable searchParams={searchParams} />
        </Suspense>
      </FadeIn>
    </div>
  );
}
