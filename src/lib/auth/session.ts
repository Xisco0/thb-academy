import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile } from '@/types/database.types';

export interface SessionUser {
  id: string;
  email: string;
  profile: Profile | null;
}

export async function getUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    profile: profile || null,
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.profile?.user_type !== 'admin') redirect('/');
  return user;
}

export async function requireStudent(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.profile?.user_type !== 'student') redirect('/');
  return user;
}

export async function getUserRoles(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('user_roles')
    .select('role:roles!inner(id, name, description, is_system)')
    .eq('user_id', userId);
  return data?.map(ur => (ur.role as any)) || [];
}

export async function isSuperAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.some((r: any) => r.name === 'Super Admin' && r.is_system === true);
}
