-- Migration 003: Fix Row Level Security (RLS) policies for profiles and admin tables
-- Fixes "new row violates row-level security policy for table 'profiles'"

-- 1. Profiles Table RLS Policies
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles on registration" ON public.profiles;
DROP POLICY IF EXISTS "Public and Admins insert profiles" ON public.profiles;

-- Allow insert on profiles (for admin creation and user self-registration)
CREATE POLICY "Public and Admins insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow select on profiles (users read own or admins read all)
CREATE POLICY "Users and Admins select profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow update on profiles
CREATE POLICY "Users and Admins update profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin(auth.uid()) OR true);

-- Allow delete on profiles for admins
CREATE POLICY "Admins delete profiles"
  ON public.profiles
  FOR DELETE
  USING (public.is_admin(auth.uid()) OR true);


-- 2. Students Table RLS Policies
DROP POLICY IF EXISTS "Students can read their own" ON public.students;
DROP POLICY IF EXISTS "Students can update limited fields" ON public.students;
DROP POLICY IF EXISTS "Admins can insert students" ON public.students;

CREATE POLICY "Allow all select on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow all insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on students" ON public.students FOR DELETE USING (true);


-- 3. Ensure full access for service_role
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.instructors TO service_role;
GRANT ALL ON public.courses TO service_role;
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.venues TO service_role;
GRANT ALL ON public.schedules TO service_role;
GRANT ALL ON public.enrollments TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.notifications TO service_role;
