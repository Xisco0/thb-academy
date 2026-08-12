-- Seed Default Admin Account: Francis Bamirin
-- Email: francisbamirin45@gmail.com
-- Password: Olaski61
-- Role: Super Admin

DO $$
DECLARE
  new_admin_id UUID := 'a1b2c3d4-e5f6-7890-abcd-1234567890ab'::UUID;
  super_admin_role_id UUID;
BEGIN
  -- Insert into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'francisbamirin45@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      role, aud
    ) VALUES (
      new_admin_id,
      '00000000-0000-0000-0000-000000000000'::UUID,
      'francisbamirin45@gmail.com',
      crypt('Olaski61', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"first_name": "Francis", "last_name": "Bamirin", "phone": "08144326123", "user_type": "admin"}'::jsonb,
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, user_type, is_active)
  SELECT
    id, email,
    'Francis', 'Bamirin', '08144326123', 'admin', true
  FROM auth.users
  WHERE email = 'francisbamirin45@gmail.com'
  ON CONFLICT (id) DO UPDATE SET
    first_name = 'Francis',
    last_name = 'Bamirin',
    phone = '08144326123',
    user_type = 'admin';

  -- Get Super Admin Role ID
  SELECT id INTO super_admin_role_id FROM public.roles WHERE name = 'Super Admin' LIMIT 1;

  -- Assign Super Admin role
  IF super_admin_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    SELECT p.id, super_admin_role_id
    FROM public.profiles p
    WHERE p.email = 'francisbamirin45@gmail.com'
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
END $$;
