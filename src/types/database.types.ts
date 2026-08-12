// ==========================================
// THB Music Academy - Database Types
// ==========================================

// Enums
export type UserType = 'admin' | 'student' | 'instructor';
export type StudentStatus = 'registered' | 'pending_enrollment' | 'active' | 'inactive';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'suspended';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethod = 'bank_transfer' | 'paystack' | 'cash' | 'other';
export type EventStatus = 'draft' | 'published';
export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type NotificationType = 'general' | 'registration' | 'enrollment' | 'payment_submitted' | 'payment_approved' | 'payment_rejected' | 'schedule_change' | 'schedule_cancelled' | 'account_recovery' | 'system';
export type NotificationTargetType = 'all' | 'selected' | 'course';

// Row interfaces
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  user_type: UserType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  sub_permissions: string[];
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  granted: boolean;
  config: Record<string, boolean>;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by: string | null;
}

export interface Instrument {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  profile_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  specializations: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string | null;
  capacity: number | null;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  musical_experience: string | null;
  status: StudentStatus;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  instrument_id: string;
  instructor_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  detailed_content: string | null;
  level: CourseLevel;
  duration: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  who_can_join: string | null;
  what_you_learn: string | null;
  faqs: CourseFAQ[];
  schedule_info: string | null;
  status: CourseStatus;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  instructor_id: string | null;
  venue_id: string | null;
  status: EnrollmentStatus;
  enrollment_date: string;
  activation_date: string | null;
  price_at_enrollment: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  enrollment_id: string | null;
  course_id: string;
  instructor_id: string | null;
  venue_id: string | null;
  student_id: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  enrollment_id: string;
  amount: number;
  currency: string;
  account_name: string | null;
  payment_method: PaymentMethod;
  proof_url: string | null;
  status: PaymentStatus;
  submitted_at: string;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  transaction_reference: string | null;
  gateway_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  detailed_content: string | null;
  banner_url: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  venue_id: string | null;
  venue_name: string | null;
  venue_address: string | null;
  status: EventStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_system: boolean;
  target_type: NotificationTargetType;
  target_course_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface NotificationRecipient {
  id: string;
  notification_id: string;
  student_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface WebsiteSettings {
  id: string;
  logo_url: string | null;
  favicon_url: string | null;
  academy_name: string;
  academy_short_name: string;
  tagline: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  business_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  default_instructor_id: string | null;
  default_venue_id: string | null;
  default_seo_title: string | null;
  default_seo_description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface WebsiteContent {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  metadata: Record<string, unknown>;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface UrlRedirect {
  id: string;
  old_path: string;
  new_path: string;
  status_code: number;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// Insert types (for creating new records)
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type RoleInsert = Omit<Role, 'id' | 'created_at' | 'updated_at'>;
export type InstrumentInsert = Omit<Instrument, 'id' | 'created_at' | 'updated_at'>;
export type InstructorInsert = Omit<Instructor, 'id' | 'created_at' | 'updated_at'>;
export type VenueInsert = Omit<Venue, 'id' | 'created_at' | 'updated_at'>;
export type StudentInsert = Omit<Student, 'id' | 'created_at' | 'updated_at' | 'last_activity_at'>;
export type CourseInsert = Omit<Course, 'id' | 'created_at' | 'updated_at'>;
export type EnrollmentInsert = Omit<Enrollment, 'id' | 'created_at' | 'updated_at'>;
export type ScheduleInsert = Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;
export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>;

// Update types (all fields optional)
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
export type RoleUpdate = Partial<Omit<Role, 'id' | 'created_at'>>;
export type InstrumentUpdate = Partial<Omit<Instrument, 'id' | 'created_at'>>;
export type InstructorUpdate = Partial<Omit<Instructor, 'id' | 'created_at'>>;
export type VenueUpdate = Partial<Omit<Venue, 'id' | 'created_at'>>;
export type StudentUpdate = Partial<Omit<Student, 'id' | 'created_at'>>;
export type CourseUpdate = Partial<Omit<Course, 'id' | 'created_at'>>;
export type EnrollmentUpdate = Partial<Omit<Enrollment, 'id' | 'created_at'>>;
export type ScheduleUpdate = Partial<Omit<Schedule, 'id' | 'created_at'>>;
export type PaymentUpdate = Partial<Omit<Payment, 'id' | 'created_at'>>;
export type EventUpdate = Partial<Omit<Event, 'id' | 'created_at'>>;

// Extended types with relations
export interface CourseWithRelations extends Course {
  instrument?: Instrument;
  instructor?: Instructor;
}

export interface EnrollmentWithRelations extends Enrollment {
  student?: Student & { profile?: Profile };
  course?: CourseWithRelations;
  instructor?: Instructor;
  venue?: Venue;
}

export interface PaymentWithRelations extends Payment {
  student?: Student & { profile?: Profile };
  enrollment?: EnrollmentWithRelations;
  verified_by_profile?: Profile;
}

export interface ScheduleWithRelations extends Schedule {
  enrollment?: Enrollment;
  course?: Course;
  instructor?: Instructor;
  venue?: Venue;
  student?: Student & { profile?: Profile };
}

export interface NotificationWithReadStatus extends Notification {
  is_read?: boolean;
  read_at?: string | null;
}
