import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllAdminUsersForUser, getAllRoles, getAdminProfileById } from '@/lib/queries/admin';
import { AdminsClient } from './admins-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Admins & Staff | Admin',
};

export default async function AdminsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const currentUserProfile = await getAdminProfileById(user.id);
  if (!currentUserProfile || currentUserProfile.user_type !== 'admin') {
    redirect('/login');
  }

  const [admins, roles] = await Promise.all([
    getAllAdminUsersForUser(user.id),
    getAllRoles(),
  ]);

  return (
    <div className="space-y-6">
      <AdminTopBar title="Administrators & Staff Management" />
      <AdminsClient admins={admins} roles={roles} currentUser={currentUserProfile} />
    </div>
  );
}
