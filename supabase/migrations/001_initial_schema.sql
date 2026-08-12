-- ==========================================
-- THB Music Academy CMS - Initial Schema
-- ==========================================

-- 1. Helper Functions

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Core Tables

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'student', 'instructor')) DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  sub_permissions JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}'::jsonb,
  UNIQUE(role_id, permission_id)
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, role_id)
);

CREATE TABLE public.instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bio TEXT,
  image_url TEXT,
  specializations TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Lagos',
  state TEXT NOT NULL DEFAULT 'Lagos',
  country TEXT NOT NULL DEFAULT 'Nigeria',
  description TEXT,
  capacity INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  musical_experience TEXT,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'pending_enrollment', 'active', 'inactive')),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id),
  instructor_id UUID REFERENCES public.instructors(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  detailed_content TEXT,
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  duration TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  image_url TEXT,
  who_can_join TEXT,
  what_you_learn TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  schedule_info TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  instructor_id UUID REFERENCES public.instructors(id),
  venue_id UUID REFERENCES public.venues(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'suspended')),
  enrollment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  activation_date TIMESTAMPTZ,
  price_at_enrollment NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.enrollments(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  instructor_id UUID REFERENCES public.instructors(id),
  venue_id UUID REFERENCES public.venues(id),
  student_id UUID REFERENCES public.students(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id),
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  account_name TEXT,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'paystack', 'cash', 'other')),
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  transaction_reference TEXT,
  gateway_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  detailed_content TEXT,
  banner_url TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  venue_id UUID REFERENCES public.venues(id),
  venue_name TEXT,
  venue_address TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'registration', 'enrollment', 'payment_submitted', 'payment_approved', 'payment_rejected', 'schedule_change', 'schedule_cancelled', 'account_recovery', 'system')),
  is_system BOOLEAN NOT NULL DEFAULT false,
  target_type TEXT NOT NULL DEFAULT 'all' CHECK (target_type IN ('all', 'selected', 'course')),
  target_course_id UUID REFERENCES public.courses(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  favicon_url TEXT,
  academy_name TEXT NOT NULL DEFAULT 'Triumphant Harmony Brass',
  academy_short_name TEXT NOT NULL DEFAULT 'THB',
  tagline TEXT DEFAULT 'The sound of victory, The heart of harmony.',
  address TEXT,
  city TEXT DEFAULT 'Lagos',
  state TEXT DEFAULT 'Lagos',
  country TEXT DEFAULT 'Nigeria',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  business_hours TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  default_instructor_id UUID REFERENCES public.instructors(id),
  default_venue_id UUID REFERENCES public.venues(id),
  default_seo_title TEXT,
  default_seo_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE public.website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE public.url_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_path TEXT NOT NULL UNIQUE,
  new_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 3. Indexes

CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_instrument ON public.courses(instrument_id);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_status_date ON public.events(status, date);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_payments_student ON public.payments(student_id);
CREATE INDEX idx_payments_enrollment ON public.payments(enrollment_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_schedules_date ON public.schedules(date);
CREATE INDEX idx_schedules_student ON public.schedules(student_id);
CREATE INDEX idx_schedules_instructor ON public.schedules(instructor_id);
CREATE INDEX idx_notification_recipients_student ON public.notification_recipients(student_id);
CREATE INDEX idx_notification_recipients_unread ON public.notification_recipients(student_id, is_read);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role_id);
CREATE INDEX idx_students_profile ON public.students(profile_id);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_url_redirects_old_path ON public.url_redirects(old_path);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);


-- 4. Triggers

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.instruments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.website_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.website_content FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 5. RLS Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Permission helper functions (created after tables exist)
CREATE OR REPLACE FUNCTION public.has_permission(user_uuid UUID, perm_code TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_uuid
      AND p.code = perm_code
      AND rp.granted = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND user_type = 'admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_student(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND user_type = 'student' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- profiles
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin(auth.uid()));

-- students
CREATE POLICY "Students can read their own" ON public.students FOR SELECT USING (profile_id = auth.uid() OR has_permission(auth.uid(), 'manage_students'));
CREATE POLICY "Students can update limited fields" ON public.students FOR UPDATE USING (profile_id = auth.uid() OR has_permission(auth.uid(), 'manage_students'));
CREATE POLICY "Admins can insert students" ON public.students FOR INSERT WITH CHECK (profile_id = auth.uid() OR has_permission(auth.uid(), 'manage_students') OR is_admin(auth.uid()));

-- courses
CREATE POLICY "Anyone can read published courses" ON public.courses FOR SELECT USING (status = 'published' OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_courses'));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (has_permission(auth.uid(), 'manage_courses'));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (has_permission(auth.uid(), 'manage_courses'));

-- events
CREATE POLICY "Anyone can read published events" ON public.events FOR SELECT USING (status = 'published' OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_events'));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (has_permission(auth.uid(), 'manage_events'));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (has_permission(auth.uid(), 'manage_events'));

-- instruments
CREATE POLICY "Anyone can read active instruments" ON public.instruments FOR SELECT USING (is_active = true OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert instruments" ON public.instruments FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_instruments'));
CREATE POLICY "Admins can update instruments" ON public.instruments FOR UPDATE USING (has_permission(auth.uid(), 'manage_instruments'));
CREATE POLICY "Admins can delete instruments" ON public.instruments FOR DELETE USING (has_permission(auth.uid(), 'manage_instruments'));

-- instructors
CREATE POLICY "Anyone can read active instructors" ON public.instructors FOR SELECT USING (is_active = true OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert instructors" ON public.instructors FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_instructors'));
CREATE POLICY "Admins can update instructors" ON public.instructors FOR UPDATE USING (has_permission(auth.uid(), 'manage_instructors'));
CREATE POLICY "Admins can delete instructors" ON public.instructors FOR DELETE USING (has_permission(auth.uid(), 'manage_instructors'));

-- venues
CREATE POLICY "Authenticated users can read active venues" ON public.venues FOR SELECT USING ((auth.role() = 'authenticated' AND is_active = true) OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert venues" ON public.venues FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_venues'));
CREATE POLICY "Admins can update venues" ON public.venues FOR UPDATE USING (has_permission(auth.uid(), 'manage_venues'));
CREATE POLICY "Admins can delete venues" ON public.venues FOR DELETE USING (has_permission(auth.uid(), 'manage_venues'));

-- enrollments
CREATE POLICY "Students can read their own enrollments" ON public.enrollments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR has_permission(auth.uid(), 'manage_enrollments')
);
CREATE POLICY "Students can create their own enrollments" ON public.enrollments FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR has_permission(auth.uid(), 'manage_enrollments') OR is_admin(auth.uid())
);
CREATE POLICY "Admins can update enrollments" ON public.enrollments FOR UPDATE USING (has_permission(auth.uid(), 'manage_enrollments'));
CREATE POLICY "Admins can delete enrollments" ON public.enrollments FOR DELETE USING (has_permission(auth.uid(), 'manage_enrollments'));

-- payments
CREATE POLICY "Students can read their own payments" ON public.payments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR has_permission(auth.uid(), 'manage_payments')
);
CREATE POLICY "Students can create their own payments" ON public.payments FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);
CREATE POLICY "Admins can update payments" ON public.payments FOR UPDATE USING (has_permission(auth.uid(), 'manage_payments'));

-- schedules
CREATE POLICY "Students can read their own schedules" ON public.schedules FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR has_permission(auth.uid(), 'manage_schedules')
);
CREATE POLICY "Admins can insert schedules" ON public.schedules FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_schedules'));
CREATE POLICY "Admins can update schedules" ON public.schedules FOR UPDATE USING (has_permission(auth.uid(), 'manage_schedules'));
CREATE POLICY "Admins can delete schedules" ON public.schedules FOR DELETE USING (has_permission(auth.uid(), 'manage_schedules'));

-- notifications
CREATE POLICY "Students can read their own notifications" ON public.notifications FOR SELECT USING (
  id IN (SELECT notification_id FROM public.notification_recipients WHERE student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())) OR has_permission(auth.uid(), 'manage_notifications')
);
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_notifications'));
CREATE POLICY "Admins can update notifications" ON public.notifications FOR UPDATE USING (has_permission(auth.uid(), 'manage_notifications'));
CREATE POLICY "Admins can delete notifications" ON public.notifications FOR DELETE USING (has_permission(auth.uid(), 'manage_notifications'));

-- notification_recipients
CREATE POLICY "Students can read their own recipients" ON public.notification_recipients FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR has_permission(auth.uid(), 'manage_notifications')
);
CREATE POLICY "Students can update their own read status" ON public.notification_recipients FOR UPDATE USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);
CREATE POLICY "Admins can insert recipients" ON public.notification_recipients FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_notifications'));
CREATE POLICY "Admins can delete recipients" ON public.notification_recipients FOR DELETE USING (has_permission(auth.uid(), 'manage_notifications'));

-- website_settings & website_content
CREATE POLICY "Anyone can read settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can read content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.website_settings FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert settings" ON public.website_settings FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update content" ON public.website_content FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert content" ON public.website_content FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- roles / permissions / role_permissions / user_roles
CREATE POLICY "Admins can read roles" ON public.roles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can read permissions" ON public.permissions FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can read role_permissions" ON public.role_permissions FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can read user_roles" ON public.user_roles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Auth admins can manage roles" ON public.roles FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_authorization'));
CREATE POLICY "Auth admins can update roles" ON public.roles FOR UPDATE USING (has_permission(auth.uid(), 'manage_authorization'));
CREATE POLICY "Auth admins can delete roles" ON public.roles FOR DELETE USING (has_permission(auth.uid(), 'manage_authorization'));
CREATE POLICY "Auth admins can manage role_permissions" ON public.role_permissions FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_authorization'));
CREATE POLICY "Auth admins can update role_permissions" ON public.role_permissions FOR UPDATE USING (has_permission(auth.uid(), 'manage_authorization'));
CREATE POLICY "Auth admins can delete role_permissions" ON public.role_permissions FOR DELETE USING (has_permission(auth.uid(), 'manage_authorization'));
CREATE POLICY "Auth admins can manage user_roles" ON public.user_roles FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_authorization') OR has_permission(auth.uid(), 'manage_admins'));
CREATE POLICY "Auth admins can update user_roles" ON public.user_roles FOR UPDATE USING (has_permission(auth.uid(), 'manage_authorization') OR has_permission(auth.uid(), 'manage_admins'));
CREATE POLICY "Auth admins can delete user_roles" ON public.user_roles FOR DELETE USING (has_permission(auth.uid(), 'manage_authorization') OR has_permission(auth.uid(), 'manage_admins'));

-- url_redirects
CREATE POLICY "Anyone can read url_redirects" ON public.url_redirects FOR SELECT USING (true);
CREATE POLICY "Admins can insert url_redirects" ON public.url_redirects FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update url_redirects" ON public.url_redirects FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete url_redirects" ON public.url_redirects FOR DELETE USING (is_admin(auth.uid()));

-- audit_logs
CREATE POLICY "Users can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can read audit logs" ON public.audit_logs FOR SELECT USING (is_admin(auth.uid()));


-- 6. Seed Data

-- Permissions
INSERT INTO public.permissions (code, name, description, module, sub_permissions) VALUES
('manage_admins', 'Manage Admins', 'Create, edit, and manage administrator accounts', 'admins', '["view","add","edit","delete"]'),
('manage_students', 'Manage Students', 'View and manage student records', 'students', '["view","add","edit","delete"]'),
('manage_instructors', 'Manage Instructors', 'Manage instructor profiles and assignments', 'instructors', '["view","add","edit","delete"]'),
('manage_instruments', 'Manage Instruments', 'Add, edit, and manage instrument categories', 'instruments', '["view","add","edit","delete"]'),
('manage_courses', 'Manage Courses', 'Create and manage course/program offerings', 'courses', '["view","add","edit","delete"]'),
('manage_enrollments', 'Manage Enrollments', 'Process and manage student enrollments', 'enrollments', '["view","add","edit","delete"]'),
('manage_schedules', 'Manage Schedules', 'Create and manage class schedules', 'schedules', '["view","add","edit","delete"]'),
('manage_venues', 'Manage Venues', 'Manage academy venues and locations', 'venues', '["view","add","edit","delete"]'),
('manage_payments', 'Manage Payments', 'Review and process payment records', 'payments', '["view","add","edit","delete"]'),
('manage_notifications', 'Manage Notifications', 'Send and manage notifications', 'notifications', '["view","add","edit","delete"]'),
('manage_events', 'Manage Events', 'Create and manage academy events', 'events', '["view","add","edit","delete"]'),
('manage_authorization', 'Manage Authorization', 'Manage roles and permissions', 'authorization', '["view","add","edit","delete"]');

-- Roles
INSERT INTO public.roles (name, description, is_system) VALUES
('Super Admin', 'Full system access. Cannot be deleted or modified by other admins.', true),
('Admin', 'Administrative access with configurable permissions.', false),
('Staff', 'Limited staff access for day-to-day operations.', false);

-- Super Admin gets all permissions
INSERT INTO public.role_permissions (role_id, permission_id, granted, config)
SELECT r.id, p.id, true, '{"view":true,"add":true,"edit":true,"delete":true}'::jsonb
FROM public.roles r, public.permissions p
WHERE r.name = 'Super Admin';

-- Admin gets all except authorization and admin management
INSERT INTO public.role_permissions (role_id, permission_id, granted, config)
SELECT r.id, p.id, true, '{"view":true,"add":true,"edit":true,"delete":true}'::jsonb
FROM public.roles r, public.permissions p
WHERE r.name = 'Admin' AND p.code NOT IN ('manage_authorization', 'manage_admins');

-- Staff gets view-only on key modules
INSERT INTO public.role_permissions (role_id, permission_id, granted, config)
SELECT r.id, p.id, true, '{"view":true,"add":false,"edit":false,"delete":false}'::jsonb
FROM public.roles r, public.permissions p
WHERE r.name = 'Staff' AND p.code IN ('manage_students', 'manage_courses', 'manage_enrollments', 'manage_schedules', 'manage_payments');

-- Default Venue
INSERT INTO public.venues (name, address, city, state, country, is_active, is_default) VALUES
('Olorunsogo Baptist Church', '9/11, Olorunsogo Baptist Church, Ijaye Ojokoro', 'Lagos', 'Lagos', 'Nigeria', true, true);

-- Website Settings
INSERT INTO public.website_settings (
  academy_name, academy_short_name, tagline,
  address, city, state, country,
  phone, whatsapp, business_hours,
  default_seo_title, default_seo_description
) VALUES (
  'Triumphant Harmony Brass', 'THB', 'The sound of victory, The heart of harmony.',
  '9/11, Olorunsogo Baptist Church, Ijaye Ojokoro', 'Lagos', 'Lagos', 'Nigeria',
  '070 3859 5356', '0807 756 6475', 'Monday - Friday',
  'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
  'Learn music at Triumphant Harmony Brass (THB), a premier music academy in Lagos, Nigeria. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, and voice.'
);

-- Website Content Sections
INSERT INTO public.website_content (section_key, title, subtitle, content, cta_text, cta_url, metadata) VALUES
('hero', 'Master the Art of Music', 'Professional music training at Lagos'' premier brass & music academy', 'Discover your musical potential at Triumphant Harmony Brass. From keyboard to trumpet, guitar to saxophone — we provide expert instruction for students of all levels.', 'Start Your Musical Journey', '/register', '{}'::jsonb),
('about', 'About Triumphant Harmony Brass', NULL, 'Triumphant Harmony Brass (THB) is a music learning academy based in Lagos, Nigeria, dedicated to nurturing musical talent and building the next generation of skilled musicians.', NULL, NULL, '{}'::jsonb),
('founder', 'Meet Our Founder', NULL, NULL, NULL, NULL, '{"name": "Taiwo Toyinbo", "title": "Founder & Music Director", "bio": ""}'::jsonb),
('why_choose', 'Why Choose THB', NULL, NULL, NULL, NULL, '{"reasons": []}'::jsonb),
('enrollment_steps', 'How Enrollment Works', NULL, NULL, NULL, NULL, '{"steps": [{"title": "Create Account", "description": "Register on our platform with your details"}, {"title": "Choose a Program", "description": "Browse our courses and select the right one for you"}, {"title": "Make Payment", "description": "Complete payment via bank transfer"}, {"title": "Start Learning", "description": "Begin your musical journey with expert instructors"}]}'::jsonb),
('homepage_seo', NULL, NULL, NULL, NULL, NULL, '{"title": "Triumphant Harmony Brass | Music Academy in Lagos, Nigeria", "description": "Learn music at Triumphant Harmony Brass (THB), a premier music academy in Lagos, Nigeria. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, and voice."}'::jsonb);


-- Storage buckets (run separately in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('public-assets', 'public-assets', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
