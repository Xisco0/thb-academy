import React from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { AdminSidebar } from '@/components/admin/sidebar';
import { SessionInactivityProvider } from '@/components/auth/session-inactivity-provider';

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
    <SessionInactivityProvider>
      <div className="min-h-screen bg-navy-950">
        <AdminSidebar
          user={{
            email: user.email,
            firstName: user.profile?.first_name || 'Admin',
            lastName: user.profile?.last_name || '',
          }}
        />
        <div className="pt-16 lg:pt-0 lg:pl-64 min-h-screen">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </SessionInactivityProvider>
  );
}
