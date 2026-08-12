import 'server-only';
import { createClient } from '@/lib/supabase/server';

export async function getStudentProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('students')
    .select('*, profile:profiles(*)')
    .eq('profile_id', userId)
    .single();
  return data;
}

export async function getStudentEnrollments(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('*, course:courses(*, instrument:instruments(name)), instructor:instructors(first_name, last_name), venue:venues(name)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getStudentPayments(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payments')
    .select('*, enrollment:enrollments(*, course:courses(name))')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getStudentSchedules(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('schedules')
    .select('*, enrollment:enrollments(*, course:courses(name)), instructor:instructors(first_name, last_name), venue:venues(name)')
    .eq('enrollment_id', studentId)  // We need to filter by enrollment IDs belonging to this student
    .order('date', { ascending: true });
  return data || [];
}

export async function getStudentNotifications(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}
