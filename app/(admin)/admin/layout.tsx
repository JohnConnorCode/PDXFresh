import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/admin';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Double-check admin access (middleware should have caught this, but be safe)
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/admin');
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    redirect('/unauthorized');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
