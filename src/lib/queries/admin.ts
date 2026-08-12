import 'server-only';
import { createClient } from '@/lib/supabase/server';

// ==========================================
// Dashboard Stats
// ==========================================

export async function getDashboardStats() {
  const supabase = await createClient();

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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { data } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getStudentById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single();
  return data;
}

export async function getAllInstructors() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('instructors')
    .select('*')
    .order('first_name', { ascending: true });
  return data || [];
}

export async function getAllInstruments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('instruments')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getAllCourses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select(`*, instrument:instruments(name), instructor:instructors(first_name, last_name)`)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getAllEnrollments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select(`
      *,
      student:students(*, profile:profiles(first_name, last_name, email)),
      course:courses(name),
      instructor:instructors(first_name, last_name),
      venue:venues(name)
    `)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getAllVenues() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('venues')
    .select('*')
    .order('name', { ascending: true });
  return data || [];
}

export async function getAllEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });
  return data || [];
}

export async function getAllPayments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payments')
    .select(`
      *,
      student:students(*, profile:profiles(first_name, last_name, email)),
      enrollment:enrollments(*, course:courses(name))
    `)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getWebsiteSettingsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('website_settings')
    .select('*')
    .single();
  return data;
}

export async function getAllWebsiteContentAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('website_content')
    .select('*')
    .order('section_key', { ascending: true });
  return data || [];
}

export async function getAllNotifications() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notifications')
    .select('*, profile:profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(100);
  return data || [];
}

export async function getAllAdminUsers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*, user_roles(role:roles(name))')
    .eq('user_type', 'admin')
    .order('first_name', { ascending: true });
  return data || [];
}

export async function getAllRoles() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('roles')
    .select('*, role_permissions(*, permission:permissions(*))')
    .order('name', { ascending: true });
  return data || [];
}

export async function getAllSchedules() {
  const supabase = await createClient();
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
