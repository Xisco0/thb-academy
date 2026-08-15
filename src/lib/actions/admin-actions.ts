'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail, sendAdminWelcomeEmail } from '@/lib/email';
import { getRoleRankByName, getAdminProfileById } from '@/lib/queries/admin';

async function getAdminSupabase() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      return createAdminClient();
    } catch {
      // Fallback to server client
    }
  }
  return await createClient();
}

// ==========================================
// Student Actions (Create, Update, Delete)
// ==========================================

export async function createStudentAction(formData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  musical_experience?: string;
  status?: string;
}) {
  const supabase = await getAdminSupabase();

  const cleanEmail = formData.email.trim().toLowerCase();
  if (!cleanEmail || !formData.first_name.trim() || !formData.last_name.trim()) {
    return { success: false, error: 'First name, last name, and email are required.' };
  }

  // 1. Case-insensitive email uniqueness check
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, user_type')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (existingProfile) {
    if (existingProfile.user_type === 'admin') {
      return {
        success: false,
        error: `The email "${cleanEmail}" is already registered as an Admin account. Admins cannot be created as students using an Admin email. Please use a separate student email.`,
      };
    }
    return {
      success: false,
      error: `An account with the email "${cleanEmail}" already exists. Duplicate accounts are prohibited.`,
    };
  }

  // 2. Insert into profiles using a generated UUID for non-auth or dummy auth profile
  const profileId = crypto.randomUUID();
  const { error: profileError } = await supabase.from('profiles').insert({
    id: profileId,
    email: cleanEmail,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    phone: formData.phone?.trim() || null,
    user_type: 'student',
    is_active: true,
  });

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  // 3. Insert into students table with default active status
  const surname = formData.last_name.trim();
  const { error: studentError } = await supabase.from('students').insert({
    profile_id: profileId,
    gender: formData.gender || null,
    date_of_birth: formData.date_of_birth || null,
    address: formData.address?.trim() || null,
    emergency_contact_name: formData.emergency_contact_name?.trim() || null,
    emergency_contact_phone: formData.emergency_contact_phone?.trim() || null,
    musical_experience: formData.musical_experience?.trim() || null,
    status: 'active',
  });

  if (studentError) {
    return { success: false, error: studentError.message };
  }

  revalidatePath('/admin/students');
  return {
    success: true,
    message: `Student account created successfully! Initial password is set to surname: "${surname}"`,
  };
}

export async function updateStudentAction(id: string, formData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  status?: string;
}) {
  const supabase = await getAdminSupabase();

  const cleanEmail = formData.email.trim().toLowerCase();
  
  // Fetch existing student profile id
  const { data: student } = await supabase
    .from('students')
    .select('profile_id')
    .eq('id', id)
    .single();

  if (!student) {
    return { success: false, error: 'Student record not found.' };
  }

  // Email uniqueness check excluding current profile
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .ilike('email', cleanEmail)
    .neq('id', student.profile_id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: 'This email address belongs to another account.' };
  }

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: cleanEmail,
      phone: formData.phone?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', student.profile_id);

  if (profileError) return { success: false, error: profileError.message };

  // Update student table
  const { error: studentError } = await supabase
    .from('students')
    .update({
      gender: formData.gender || null,
      date_of_birth: formData.date_of_birth || null,
      address: formData.address?.trim() || null,
      status: formData.status || 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (studentError) return { success: false, error: studentError.message };

  revalidatePath('/admin/students');
  return { success: true, message: 'Student record updated successfully.' };
}

export async function deleteStudentAction(id: string) {
  const supabase = await getAdminSupabase();

  const { data: student } = await supabase
    .from('students')
    .select('profile_id')
    .eq('id', id)
    .single();

  if (student) {
    await supabase.from('students').delete().eq('id', id);
    await supabase.from('profiles').delete().eq('id', student.profile_id);
  }

  revalidatePath('/admin/students');
  return { success: true, message: 'Student removed successfully.' };
}

// ==========================================
// Instructor Actions
// ==========================================

export async function createInstructorAction(formData: {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  specializations?: string[];
  is_active?: boolean;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase.from('instructors').insert({
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    email: formData.email?.trim().toLowerCase() || null,
    phone: formData.phone?.trim() || null,
    bio: formData.bio?.trim() || null,
    image_url: formData.image_url?.trim() || null,
    specializations: formData.specializations || [],
    is_active: formData.is_active ?? true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/instructors');
  return { success: true, message: 'Instructor added successfully.' };
}

export async function updateInstructorAction(id: string, formData: {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  specializations?: string[];
  is_active?: boolean;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase
    .from('instructors')
    .update({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email?.trim().toLowerCase() || null,
      phone: formData.phone?.trim() || null,
      bio: formData.bio?.trim() || null,
      image_url: formData.image_url?.trim() || null,
      specializations: formData.specializations || [],
      is_active: formData.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/instructors');
  return { success: true, message: 'Instructor updated successfully.' };
}

export async function deleteInstructorAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('instructors').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/instructors');
  return { success: true, message: 'Instructor removed successfully.' };
}

// ==========================================
// Course Actions
// ==========================================

export async function createCourseAction(formData: {
  name: string;
  slug?: string;
  instrument_id: string;
  instructor_id?: string;
  description?: string;
  level: string;
  price: number;
  duration?: string;
  image_url?: string;
  status?: string;
  is_featured?: boolean;
}) {
  const supabase = await getAdminSupabase();

  const generatedSlug = (formData.slug || formData.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const { error } = await supabase.from('courses').insert({
    name: formData.name.trim(),
    slug: generatedSlug,
    instrument_id: formData.instrument_id,
    instructor_id: formData.instructor_id || null,
    description: formData.description?.trim() || null,
    level: formData.level || 'beginner',
    price: formData.price || 0,
    duration: formData.duration?.trim() || '4 Weeks',
    currency: 'NGN',
    image_url: formData.image_url?.trim() || null,
    status: formData.status || 'published',
    is_featured: formData.is_featured ?? false,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  return { success: true, message: 'Course created successfully.' };
}

export async function updateCourseAction(id: string, formData: {
  name: string;
  slug?: string;
  instrument_id: string;
  instructor_id?: string;
  description?: string;
  level: string;
  price: number;
  duration?: string;
  image_url?: string;
  status?: string;
  is_featured?: boolean;
}) {
  const supabase = await getAdminSupabase();

  const generatedSlug = (formData.slug || formData.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const { error } = await supabase
    .from('courses')
    .update({
      name: formData.name.trim(),
      slug: generatedSlug,
      instrument_id: formData.instrument_id,
      instructor_id: formData.instructor_id || null,
      description: formData.description?.trim() || null,
      level: formData.level || 'beginner',
      price: formData.price || 0,
      duration: formData.duration?.trim() || '4 Weeks',
      image_url: formData.image_url?.trim() || null,
      status: formData.status || 'published',
      is_featured: formData.is_featured ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  return { success: true, message: 'Course updated successfully.' };
}

export async function deleteCourseAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  return { success: true, message: 'Course deleted successfully.' };
}

// ==========================================
// Event & Live Concert Actions
// ==========================================

export async function createEventAction(formData: {
  title: string;
  slug?: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  venue_id?: string;
  banner_url?: string;
  status?: string;
}) {
  const supabase = await getAdminSupabase();

  const generatedSlug = (formData.slug || formData.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const { error } = await supabase.from('events').insert({
    title: formData.title.trim(),
    slug: generatedSlug,
    description: formData.description?.trim() || null,
    date: formData.date,
    start_time: formData.start_time || null,
    end_time: formData.end_time || null,
    venue_id: formData.venue_id || null,
    venue_name: formData.venue_name?.trim() || 'THB Concert Hall',
    venue_address: formData.venue_address?.trim() || 'Lagos, Nigeria',
    banner_url: formData.banner_url?.trim() || null,
    status: formData.status || 'published',
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, message: 'Concert event created successfully.' };
}

export async function updateEventAction(id: string, formData: {
  title: string;
  slug?: string;
  description?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  venue_id?: string;
  banner_url?: string;
  status?: string;
}) {
  const supabase = await getAdminSupabase();

  const generatedSlug = (formData.slug || formData.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const { error } = await supabase
    .from('events')
    .update({
      title: formData.title.trim(),
      slug: generatedSlug,
      description: formData.description?.trim() || null,
      date: formData.date,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      venue_id: formData.venue_id || null,
      venue_name: formData.venue_name?.trim() || null,
      venue_address: formData.venue_address?.trim() || null,
      banner_url: formData.banner_url?.trim() || null,
      status: formData.status || 'published',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, message: 'Concert event updated successfully.' };
}

export async function deleteEventAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, message: 'Concert event deleted successfully.' };
}

// ==========================================
// Venue Actions
// ==========================================

export async function createVenueAction(formData: {
  name: string;
  address: string;
  city?: string;
  state?: string;
  capacity?: number;
  is_active?: boolean;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase.from('venues').insert({
    name: formData.name.trim(),
    address: formData.address.trim(),
    city: formData.city?.trim() || 'Lagos',
    state: formData.state?.trim() || 'Lagos',
    country: 'Nigeria',
    capacity: formData.capacity || 100,
    is_active: formData.is_active ?? true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/venues');
  return { success: true, message: 'Venue created successfully.' };
}

export async function updateVenueAction(id: string, formData: {
  name: string;
  address: string;
  city?: string;
  state?: string;
  capacity?: number;
  is_active?: boolean;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase
    .from('venues')
    .update({
      name: formData.name.trim(),
      address: formData.address.trim(),
      city: formData.city?.trim() || 'Lagos',
      state: formData.state?.trim() || 'Lagos',
      capacity: formData.capacity || 100,
      is_active: formData.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/venues');
  return { success: true, message: 'Venue updated successfully.' };
}

export async function deleteVenueAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('venues').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/venues');
  return { success: true, message: 'Venue deleted successfully.' };
}

// ==========================================
// Enrollment & Payment Status Actions
// ==========================================

export async function updateEnrollmentStatusAction(id: string, status: string, notes?: string) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase
    .from('enrollments')
    .update({
      status,
      notes: notes || null,
      activation_date: status === 'active' ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/enrollments');
  return { success: true, message: `Enrollment status updated to ${status}.` };
}

export async function updatePaymentStatusAction(id: string, status: 'approved' | 'rejected', rejection_reason?: string) {
  const supabase = await getAdminSupabase();

  const { data: payment } = await supabase
    .from('payments')
    .select(`
      enrollment_id,
      amount,
      student:students(profile:profiles(first_name, email)),
      enrollment:enrollments(course:courses(name, level))
    `)
    .eq('id', id)
    .single();

  const finalReason = status === 'rejected' ? rejection_reason?.trim() || 'Payment proof invalid or unreadable.' : null;

  const { error } = await supabase
    .from('payments')
    .update({
      status,
      rejection_reason: finalReason,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  const profile = (payment as any)?.student?.profile;
  const courseName = (payment as any)?.enrollment?.course?.name || 'Music Course';
  const courseLevel = (payment as any)?.enrollment?.course?.level || '';

  // If approved, automatically activate the associated enrollment & send approval email
  if (status === 'approved' && payment?.enrollment_id) {
    await supabase
      .from('enrollments')
      .update({ status: 'active', activation_date: new Date().toISOString() })
      .eq('id', payment.enrollment_id);

    if (profile?.email) {
      sendPaymentApprovedEmail({
        email: profile.email,
        name: profile.first_name || 'Student',
        courseName,
        level: courseLevel,
      }).catch(() => {});
    }
  }

  // If rejected, set enrollment status to cancelled & send rejection email
  if (status === 'rejected' && payment?.enrollment_id) {
    await supabase
      .from('enrollments')
      .update({ status: 'cancelled' })
      .eq('id', payment.enrollment_id);

    if (profile?.email) {
      sendPaymentRejectedEmail({
        email: profile.email,
        name: profile.first_name || 'Student',
        courseName,
        level: courseLevel,
        reason: finalReason || 'Payment proof is not clear.',
      }).catch(() => {});
    }
  }

  revalidatePath('/admin/payments');
  revalidatePath('/admin/enrollments');
  revalidatePath('/student/payments');
  revalidatePath('/student/enrollments');
  return { success: true, message: `Payment ${status} successfully.` };
}

// ==========================================
// Schedule Actions
// ==========================================

export async function createScheduleAction(formData: {
  course_id: string;
  instructor_id?: string;
  venue_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase.from('schedules').insert({
    course_id: formData.course_id,
    instructor_id: formData.instructor_id || null,
    venue_id: formData.venue_id || null,
    date: formData.date,
    start_time: formData.start_time,
    end_time: formData.end_time,
    status: formData.status || 'scheduled',
    notes: formData.notes?.trim() || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/schedules');
  return { success: true, message: 'Class schedule created successfully.' };
}

export async function updateScheduleAction(id: string, formData: {
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase
    .from('schedules')
    .update({
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status,
      notes: formData.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/schedules');
  return { success: true, message: 'Class schedule updated.' };
}

export async function deleteScheduleAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('schedules').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/schedules');
  return { success: true, message: 'Class schedule removed.' };
}

// ==========================================
// Website Settings Actions
// ==========================================

export async function updateWebsiteSettingsAction(formData: {
  academy_name: string;
  academy_short_name?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
}) {
  const supabase = await getAdminSupabase();

  const { data: existing } = await supabase.from('website_settings').select('id').maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('website_settings')
      .update({
        academy_name: formData.academy_name.trim(),
        academy_short_name: formData.academy_short_name?.trim() || 'THB',
        tagline: formData.tagline?.trim() || null,
        phone: formData.phone?.trim() || null,
        whatsapp: formData.whatsapp?.trim() || null,
        email: formData.email?.trim().toLowerCase() || null,
        address: formData.address?.trim() || null,
        bank_name: formData.bank_name?.trim() || null,
        bank_account_name: formData.bank_account_name?.trim() || null,
        bank_account_number: formData.bank_account_number?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('website_settings').insert({
      academy_name: formData.academy_name.trim(),
      academy_short_name: formData.academy_short_name?.trim() || 'THB',
      tagline: formData.tagline?.trim() || null,
      phone: formData.phone?.trim() || null,
      whatsapp: formData.whatsapp?.trim() || null,
      email: formData.email?.trim().toLowerCase() || null,
      address: formData.address?.trim() || null,
      bank_name: formData.bank_name?.trim() || null,
      bank_account_name: formData.bank_account_name?.trim() || null,
      bank_account_number: formData.bank_account_number?.trim() || null,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true, message: 'Website settings saved successfully.' };
}

// ==========================================
// Admin Users & Staff Actions
// ==========================================

// Helper to verify server-side authority of caller
async function getCallerAuthority() {
  const serverDb = await createClient();
  const { data: { user } } = await serverDb.auth.getUser();
  if (!user) return null;

  const callerProfile = await getAdminProfileById(user.id);
  if (!callerProfile || callerProfile.user_type !== 'admin' || !callerProfile.is_active) {
    return null;
  }

  return {
    userId: user.id,
    profile: callerProfile,
    roleName: callerProfile.role_name,
    roleRank: callerProfile.role_rank,
    isSuperAdmin: callerProfile.role_rank >= 100,
  };
}

export async function createAdminUserAction(formData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  role_id?: string;
  password?: string;
}) {
  const caller = await getCallerAuthority();
  if (!caller) {
    return { success: false, error: 'Unauthorized: Active administrator session required.' };
  }

  const adminDb = await getAdminSupabase();
  const serverDb = await createClient();

  const cleanEmail = formData.email.trim().toLowerCase();
  const firstName = formData.first_name.trim();
  const lastName = formData.last_name.trim();

  if (!cleanEmail || !firstName || !lastName) {
    return { success: false, error: 'First name, last name, and email are required.' };
  }

  // Role Assignment Authority Check: Cannot assign role with higher rank than caller's rank
  if (formData.role_id) {
    const { data: assignedRole } = await adminDb.from('roles').select('name').eq('id', formData.role_id).single();
    if (assignedRole?.name) {
      const targetAssignedRank = getRoleRankByName(assignedRole.name);
      if (targetAssignedRank > caller.roleRank && !caller.isSuperAdmin) {
        return { success: false, error: 'Unauthorized: You cannot assign a role with higher authority than your own.' };
      }
    }
  }

  // 1. Email Uniqueness Check
  const { data: existing } = await adminDb
    .from('profiles')
    .select('id, user_type')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (existing) {
    return { success: false, error: `An account with the email "${cleanEmail}" already exists.` };
  }

  // Phone number validation: strictly 11 digits, no letters
  if (formData.phone && formData.phone.trim()) {
    const rawPhone = formData.phone.trim();
    if (/[a-zA-Z]/.test(rawPhone)) {
      return { success: false, error: 'Phone number cannot contain letters or alphabets.' };
    }
    const digitsOnly = rawPhone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
      return { success: false, error: 'Phone number must be exactly 11 digits (e.g. 08144326123).' };
    }
  }

  let profileId: string | null = null;
  const cleanSurname = lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'admin';
  const defaultPassword = formData.password?.trim() || `${cleanSurname}thb`;

  // 2. Create User via Auth
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: authData, error: authError } = await adminDb.auth.admin.createUser({
      email: cleanEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
        user_type: 'admin',
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already') || authError.status === 422) {
        return { success: false, error: `An account with the email "${cleanEmail}" already exists.` };
      }
      return { success: false, error: authError.message };
    }
    profileId = authData.user?.id || null;
  }

  if (!profileId) {
    const { data: authData, error: signUpError } = await serverDb.auth.signUp({
      email: cleanEmail,
      password: defaultPassword,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: formData.phone?.trim() || '',
          address: formData.address?.trim() || '',
          user_type: 'admin',
        },
      },
    });

    if (signUpError) {
      const isRateLimit = signUpError.message.toLowerCase().includes('rate limit');
      if (isRateLimit) {
        return {
          success: false,
          error: 'Supabase Auth email rate limit exceeded. Please wait 15–30 minutes before trying again, or set SUPABASE_SERVICE_ROLE_KEY in .env.local.',
        };
      }
      return { success: false, error: signUpError.message };
    }
    profileId = authData.user?.id || null;
  }

  if (!profileId) {
    profileId = crypto.randomUUID();
  }

  // 3. Upsert profile record
  await adminDb.from('profiles').upsert({
    id: profileId,
    email: cleanEmail,
    first_name: firstName,
    last_name: lastName,
    phone: formData.phone?.trim() || null,
    user_type: 'admin',
    is_active: true,
    updated_at: new Date().toISOString(),
  });

  let selectedRoleName = 'Admin';
  if (formData.role_id && profileId) {
    const { data: role } = await adminDb.from('roles').select('name').eq('id', formData.role_id).single();
    if (role?.name) selectedRoleName = role.name;

    await adminDb.from('user_roles').upsert({
      user_id: profileId,
      role_id: formData.role_id,
    });
  }

  // 4. Send Email Notification with Login Credentials
  const emailRes = await sendAdminWelcomeEmail({
    email: cleanEmail,
    name: `${firstName} ${lastName}`,
    password: defaultPassword,
    roleName: selectedRoleName,
  });

  let emailNote = `Credentials email sent to ${cleanEmail}.`;
  if (!emailRes.success) {
    console.error('Failed to send admin welcome email:', emailRes.error);
    const errText = typeof emailRes.error === 'string' ? emailRes.error : JSON.stringify(emailRes.error);
    emailNote = `(Email notice: ${errText}).`;
  }

  revalidatePath('/admin/admins');
  revalidatePath('/admin/admins', 'page');
  revalidatePath('/admin/admins', 'layout');
  return {
    success: true,
    message: `Admin account for ${firstName} ${lastName} created successfully! Default Password: "${defaultPassword}". ${emailNote}`,
  };
}

export async function toggleAdminStatusAction(profileId: string, isActive: boolean) {
  const caller = await getCallerAuthority();
  if (!caller) {
    return { success: false, error: 'Unauthorized: Active administrator session required.' };
  }

  if (profileId === caller.userId) {
    return { success: false, error: 'Unauthorized: You cannot suspend or alter your own account status.' };
  }

  const targetAdmin = await getAdminProfileById(profileId);
  if (targetAdmin && targetAdmin.role_rank >= caller.roleRank && !caller.isSuperAdmin) {
    return { success: false, error: 'Unauthorized: You cannot suspend or alter an administrator with equal or higher authority.' };
  }

  const adminDb = await getAdminSupabase();

  const { error } = await adminDb
    .from('profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', profileId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/admins');
  revalidatePath('/admin/admins', 'page');
  revalidatePath('/admin/admins', 'layout');
  return {
    success: true,
    message: `Admin account has been ${isActive ? 'activated' : 'suspended'} successfully.`,
  };
}

export async function updateAdminUserAction(id: string, formData: {
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role_id?: string;
}) {
  const caller = await getCallerAuthority();
  if (!caller) {
    return { success: false, error: 'Unauthorized: Active administrator session required.' };
  }

  if (id === caller.userId) {
    return { success: false, error: 'Please update your own profile through the My Profile page.' };
  }

  const targetAdmin = await getAdminProfileById(id);
  if (targetAdmin && targetAdmin.role_rank >= caller.roleRank && !caller.isSuperAdmin) {
    return { success: false, error: 'Unauthorized: You cannot modify an administrator with equal or higher authority.' };
  }

  const adminDb = await getAdminSupabase();

  // Phone number validation: strictly 11 digits, no letters
  if (formData.phone && formData.phone.trim()) {
    const rawPhone = formData.phone.trim();
    if (/[a-zA-Z]/.test(rawPhone)) {
      return { success: false, error: 'Phone number cannot contain letters or alphabets.' };
    }
    const digitsOnly = rawPhone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
      return { success: false, error: 'Phone number must be exactly 11 digits (e.g. 08144326123).' };
    }
  }

  if (formData.role_id) {
    const { data: assignedRole } = await adminDb.from('roles').select('name').eq('id', formData.role_id).single();
    if (assignedRole?.name) {
      const assignedRank = getRoleRankByName(assignedRole.name);
      if (assignedRank > caller.roleRank && !caller.isSuperAdmin) {
        return { success: false, error: 'Unauthorized: You cannot assign a role with higher authority than your own.' };
      }
    }
  }

  const { error } = await adminDb
    .from('profiles')
    .update({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  if (formData.role_id) {
    await adminDb.from('user_roles').upsert({
      user_id: id,
      role_id: formData.role_id,
    });
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await adminDb.auth.admin.updateUserById(id, {
      user_metadata: {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
      },
    }).catch(() => {});
  }

  revalidatePath('/admin/admins');
  revalidatePath('/admin/admins', 'page');
  revalidatePath('/admin/admins', 'layout');
  return { success: true, message: 'Admin profile updated successfully.' };
}

export async function updateMyProfileAction(formData: {
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}) {
  const caller = await getCallerAuthority();
  if (!caller) {
    return { success: false, error: 'Unauthorized: Session expired or invalid user context.' };
  }

  const adminDb = await getAdminSupabase();

  if (formData.phone && formData.phone.trim()) {
    const rawPhone = formData.phone.trim();
    if (/[a-zA-Z]/.test(rawPhone)) {
      return { success: false, error: 'Phone number cannot contain letters or alphabets.' };
    }
    const digitsOnly = rawPhone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
      return { success: false, error: 'Phone number must be exactly 11 digits (e.g. 08144326123).' };
    }
  }

  const { error } = await adminDb
    .from('profiles')
    .update({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', caller.userId);

  if (error) return { success: false, error: error.message };

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await adminDb.auth.admin.updateUserById(caller.userId, {
      user_metadata: {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
      },
    }).catch(() => {});
  }

  revalidatePath('/admin/profile');
  revalidatePath('/admin/admins');
  revalidatePath('/admin/admins', 'layout');
  return { success: true, message: 'Your profile has been updated successfully.' };
}

// ==========================================
// Notification Actions
// ==========================================

export async function createNotificationAction(formData: {
  title: string;
  message: string;
  type?: string;
}) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase.from('notifications').insert({
    title: formData.title.trim(),
    message: formData.message.trim(),
    type: formData.type || 'general',
    target_type: 'all',
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/notifications');
  return { success: true, message: 'Announcement notification broadcasted successfully.' };
}

// ==========================================
// Instrument Actions (Create, Update, Delete)
// ==========================================

export async function createInstrumentAction(formData: {
  name: string;
  category?: string;
  description?: string;
  sort_order?: number;
}) {
  const supabase = await getAdminSupabase();

  if (!formData.name.trim()) {
    return { success: false, error: 'Instrument name is required.' };
  }

  const slug = formData.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let desc = formData.description?.trim() || '';
  if (formData.category?.trim() && !desc.includes('[') && !desc.includes(']')) {
    desc = `[${formData.category.trim()}] ${desc}`.trim();
  }

  // 1. Try insert with category column
  let { error } = await supabase.from('instruments').insert({
    name: formData.name.trim(),
    slug,
    category: formData.category?.trim() || 'General',
    description: desc || null,
    sort_order: Number(formData.sort_order) || 0,
    is_active: true,
  });

  // 2. Fallback if category column does not exist in Supabase schema cache
  if (error && (error.message?.includes('category') || error.code === 'PGRST204')) {
    const retry = await supabase.from('instruments').insert({
      name: formData.name.trim(),
      slug,
      description: desc || null,
      sort_order: Number(formData.sort_order) || 0,
      is_active: true,
    });
    error = retry.error;
  }

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/instruments');
  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  revalidatePath('/');
  return { success: true, message: `Instrument "${formData.name.trim()}" added successfully!` };
}

export async function updateInstrumentAction(
  id: string,
  formData: {
    name: string;
    category?: string;
    description?: string;
    sort_order?: number;
    is_active?: boolean;
  }
) {
  const supabase = await getAdminSupabase();

  if (!formData.name.trim()) {
    return { success: false, error: 'Instrument name is required.' };
  }

  const slug = formData.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let desc = formData.description?.trim() || '';
  if (formData.category?.trim() && !desc.includes('[') && !desc.includes(']')) {
    desc = `[${formData.category.trim()}] ${desc}`.trim();
  }

  // 1. Try update with category column
  let { error } = await supabase
    .from('instruments')
    .update({
      name: formData.name.trim(),
      slug,
      category: formData.category?.trim() || 'General',
      description: desc || null,
      sort_order: Number(formData.sort_order) || 0,
      is_active: formData.is_active ?? true,
    })
    .eq('id', id);

  // 2. Fallback if category column does not exist in Supabase schema cache
  if (error && (error.message?.includes('category') || error.code === 'PGRST204')) {
    const retry = await supabase
      .from('instruments')
      .update({
        name: formData.name.trim(),
        slug,
        description: desc || null,
        sort_order: Number(formData.sort_order) || 0,
        is_active: formData.is_active ?? true,
      })
      .eq('id', id);
    error = retry.error;
  }

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/instruments');
  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  revalidatePath('/');
  return { success: true, message: `Instrument "${formData.name.trim()}" updated successfully!` };
}

export async function deleteInstrumentAction(id: string) {
  const supabase = await getAdminSupabase();

  const { error } = await supabase.from('instruments').delete().eq('id', id);

  if (error) {
    if (error.code === '23503') {
      return {
        success: false,
        error: 'Cannot delete instrument because courses or enrollments are currently assigned to it.',
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/instruments');
  revalidatePath('/admin/courses');
  revalidatePath('/programs');
  revalidatePath('/');
  return { success: true, message: 'Instrument deleted successfully.' };
}

