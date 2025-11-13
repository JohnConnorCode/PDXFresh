import { createClient } from '@supabase/supabase-js';

/**
 * Database helpers for E2E test verification
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for authenticated requests (uses RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get order by session ID
 */
export async function getOrderBySessionId(sessionId: string): Promise<any | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Get order by email
 */
export async function getOrderByEmail(email: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Get subscription by customer ID
 */
export async function getSubscriptionByCustomerId(customerId: string): Promise<any | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Get subscription by user ID
 */
export async function getSubscriptionByUserId(userId: string): Promise<any[] | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Get user profile by email
 */
export async function getUserByEmail(email: string): Promise<any | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Delete test order by session ID
 */
export async function deleteOrderBySessionId(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('stripe_session_id', sessionId);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

/**
 * Delete test user by email
 */
export async function deleteUserByEmail(email: string): Promise<boolean> {
  try {
    // First get the user to find their ID
    const user = await getUserByEmail(email);
    if (!user) return true; // User doesn't exist, that's fine

    // Delete all orders for this user
    await supabaseAdmin.from('orders').delete().eq('customer_email', email);

    // Delete all subscriptions for this user
    await supabaseAdmin.from('subscriptions').delete().eq('user_id', user.id);

    // Delete the profile
    const { error } = await supabaseAdmin.from('profiles').delete().eq('id', user.id);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

/**
 * Wait for order to appear in database
 */
export async function waitForOrder(
  sessionId: string,
  timeoutMs: number = 30000,
  pollIntervalMs: number = 1000
): Promise<any | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const order = await getOrderBySessionId(sessionId);

    if (order) {
      return order;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

/**
 * Wait for subscription to appear in database
 */
export async function waitForSubscription(
  customerId: string,
  timeoutMs: number = 30000,
  pollIntervalMs: number = 1000
): Promise<any | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const subscription = await getSubscriptionByCustomerId(customerId);

    if (subscription) {
      return subscription;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

/**
 * Verify order status
 */
export async function verifyOrderStatus(sessionId: string, expectedStatus: string): Promise<boolean> {
  const order = await getOrderBySessionId(sessionId);

  if (!order) {
    return false;
  }

  return order.status === expectedStatus;
}

/**
 * Get customer stripe ID from database
 */
export async function getCustomerStripeId(email: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('email', email)
      .single();

    if (error || !data?.stripe_customer_id) {
      return null;
    }

    return data.stripe_customer_id;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}
