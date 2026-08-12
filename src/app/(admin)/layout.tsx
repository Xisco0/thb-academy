import React from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { AdminSidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (user.profile?.user_type !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <AdminSidebar
        user={{
          email: user.email,
          firstName: user.profile?.first_name || 'Admin',
          lastName: user.profile?.last_name || '',
        }}
      />
      <div className="pl-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
