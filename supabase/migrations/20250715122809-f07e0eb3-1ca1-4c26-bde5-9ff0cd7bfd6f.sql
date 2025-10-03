-- Fix infinite recursion in admin_users RLS policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Create a security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.check_admin_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users au
    WHERE au.user_id = p_user_id 
    AND au.is_active = true
  );
END;
$$;

-- Create new policies using the security definer function
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (public.check_admin_access(auth.uid()));

CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.admin_users au
    WHERE au.user_id = auth.uid() 
    AND au.admin_level = 'super_admin'
    AND au.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.admin_users au
    WHERE au.user_id = auth.uid() 
    AND au.admin_level = 'super_admin'
    AND au.is_active = true
  )
);