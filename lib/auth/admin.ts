import { createServerClient } from '@/lib/supabase/server';

/**
 * Check if a user is an admin based on database is_admin flag
 *
 * SECURITY: This uses ONLY the database flag, not hardcoded emails.
 * Admin status can be granted/revoked via direct database updates.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;

  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  return profile?.is_admin || false;
}

/**
 * Get the currently authenticated user and check if they're an admin
 */
export async function getCurrentAdminUser() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    isAdmin: true,
  };
}

/**
 * Verify admin access and return user, or throw error
 */
export async function requireAdminUser() {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return admin;
}
