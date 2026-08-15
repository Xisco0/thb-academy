import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAdminProfileById } from '@/lib/queries/admin';
import { ProfileClient } from './profile-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'My Profile | Admin Dashboard',
};

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getAdminProfileById(user.id);

  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <AdminTopBar title="My Profile" />
      <ProfileClient profile={profile} />
    </div>
  );
}
