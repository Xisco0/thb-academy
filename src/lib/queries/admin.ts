import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function getAdminDb() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      return createAdminClient();
    } catch (e) {
      console.warn('Failed to initialize Admin Supabase Client, falling back to Server Client:', e);
    }
  }
  return await createClient();
}

// ==========================================
// Dashboard Stats
// ==========================================

export async function getDashboardStats() {
  const supabase = await getAdminDb();

  const [students, courses, enrollments, events, payments] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return {
    totalStudents: students.count || 0,
    activeCourses: courses.count || 0,
    activeEnrollments: enrollments.count || 0,
    publishedEvents: events.count || 0,
    pendingPayments: payments.count || 0,
  };
}

export async function getRecentEnrollments(limit: number = 5) {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('enrollments')
    .select(`
      *,
      student:students(*, profile:profiles(*)),
      course:courses(name, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getRecentPayments(limit: number = 5) {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('payments')
    .select(`
      *,
      student:students(*, profile:profiles(*)),
      enrollment:enrollments(*, course:courses(name))
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// ==========================================
// Admin CRUD Queries
// ==========================================

export async function getAllStudents() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getStudentById(id: string) {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single();
  return data;
}

export async function getAllInstructors() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('instructors')
    .select('*')
    .order('first_name', { ascending: true });
  return data || [];
}

export async function getAllInstruments() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('instruments')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getAllCourses() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('courses')
    .select(`*, instrument:instruments(name), instructor:instructors(first_name, last_name)`)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getAllEnrollments() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('enrollments')
    .select(`
      *,
      student:students(*, profile:profiles(first_name, last_name, email)),
      course:courses(name, level),
      instructor:instructors(first_name, last_name),
      venue:venues(name),
      payments(status)
    `)
    .neq('status', 'cancelled')
    .neq('status', 'rejected')
    .order('created_at', { ascending: false });

  // Exclude enrollments with rejected payment status until proof is resubmitted and approved
  const valid = (data || []).filter((e: any) => {
    if (e.status === 'cancelled' || e.status === 'rejected') return false;
    if (Array.isArray(e.payments) && e.payments.length > 0) {
      const isRejected = e.payments.some((p: any) => p.status === 'rejected');
      if (isRejected && e.status !== 'active') return false;
    }
    return true;
  });

  return valid;
}

export async function getAllVenues() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('venues')
    .select('*')
    .order('name', { ascending: true });
  return data || [];
}

export async function getAllEvents() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });
  return data || [];
}

export async function getAllPayments() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('payments')
    .select(`
      *,
      student:students(*, profile:profiles(first_name, last_name, email)),
      enrollment:enrollments(*, course:courses(name, level))
    `)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getWebsiteSettingsAdmin() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('website_settings')
    .select('*')
    .single();
  return data;
}

export async function getAllWebsiteContentAdmin() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('website_content')
    .select('*')
    .order('section_key', { ascending: true });
  return data || [];
}

export async function getAllNotifications() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('notifications')
    .select('*, profile:profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(100);
  return data || [];
}

import { getRoleRankByName } from '@/lib/utils/roles';
export { getRoleRankByName };

export async function getAdminProfileById(userId: string) {
  const supabase = await getAdminDb();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) return null;

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id, role:roles(id, name, description)')
    .eq('user_id', userId);

  const roleObj = userRoles?.[0]?.role as any;
  const roleName = roleObj?.name || 'Admin';
  const roleRank = getRoleRankByName(roleName);

  return {
    ...profile,
    role_name: roleName,
    role_rank: roleRank,
    user_roles: userRoles || [],
  };
}

export async function getAllAdminUsersForUser(currentUserId?: string) {
  const supabase = await getAdminDb();

  let callerRank = 100; // Default to highest if no ID passed (server context)
  if (currentUserId) {
    const callerProfile = await getAdminProfileById(currentUserId);
    if (callerProfile) {
      callerRank = callerProfile.role_rank;
    }
  }

  // 1. Fetch admin profiles EXCLUDING the current user
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'admin');

  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }

  const { data: admins, error: profileError } = await query.order('first_name', { ascending: true });

  if (profileError || !admins) {
    console.error('Error fetching admin profiles:', profileError?.message);
    return [];
  }

  if (admins.length === 0) return [];

  // 2. Fetch user_roles and associated role details for admin users
  const adminIds = admins.map((a) => a.id);
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('user_id, role_id, role:roles(id, name, description)')
    .in('user_id', adminIds);

  const userRolesMap = new Map<string, any[]>();
  (userRoles || []).forEach((ur) => {
    const list = userRolesMap.get(ur.user_id) || [];
    list.push(ur);
    userRolesMap.set(ur.user_id, list);
  });

  // Fetch metadata from auth.users if service key present
  const authUsersMap = new Map<string, any>();
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      if (usersData?.users) {
        usersData.users.forEach((u: any) => authUsersMap.set(u.id, u));
      }
    } catch {}
  }

  // 3. Map user_roles and filter by hierarchy rule:
  // A higher role can see lower roles. A lower role CANNOT see equal/higher roles (unless Super Admin).
  const mappedAdmins = admins.map((admin) => {
    const rolesList = userRolesMap.get(admin.id) || [];
    const mainRoleName = rolesList[0]?.role?.name || 'Staff';
    const targetRank = getRoleRankByName(mainRoleName);
    const authUser = authUsersMap.get(admin.id);
    const defaultPwd = `${(admin.last_name || 'admin').toLowerCase().trim()}thb`;
    const password = authUser?.user_metadata?.raw_password || defaultPwd;

    return {
      ...admin,
      password,
      role_name: mainRoleName,
      role_rank: targetRank,
      user_roles: rolesList,
    };
  });

  // Server-side hierarchy filter:
  // Super Admin (rank 100) sees all other admins.
  // Lower ranks (50 or 10) only see admins with rank strictly lower than their own rank.
  if (callerRank >= 100) {
    return mappedAdmins;
  }

  return mappedAdmins.filter((targetAdmin) => targetAdmin.role_rank < callerRank);
}

export async function getAllAdminUsers() {
  return getAllAdminUsersForUser();
}

export async function getAllRoles() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('roles')
    .select('*, role_permissions(*, permission:permissions(*))')
    .order('name', { ascending: true });
  return data || [];
}

export async function getAllSchedules() {
  const supabase = await getAdminDb();
  const { data } = await supabase
    .from('schedules')
    .select(`
      *,
      enrollment:enrollments(*, student:students(*, profile:profiles(first_name, last_name)), course:courses(name)),
      instructor:instructors(first_name, last_name),
      venue:venues(name)
    `)
    .order('date', { ascending: false })
    .limit(100);
  return data || [];
}
