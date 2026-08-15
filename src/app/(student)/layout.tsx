import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { NavBar } from '@/components/student/nav-bar';
import { SessionInactivityProvider } from '@/components/auth/session-inactivity-provider';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (user.profile?.user_type !== 'student') {
    redirect('/');
  }

  return (
    <SessionInactivityProvider>
      <div className="min-h-screen bg-navy-950 text-slate-200">
        <NavBar user={user} />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </SessionInactivityProvider>
  );
}
