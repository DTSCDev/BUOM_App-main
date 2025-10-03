-- Completely remove RLS on admin_users to fix recursion
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create simple policies that don't create recursion
CREATE POLICY "Authenticated users can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage admin users" 
ON public.admin_users 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Now create the first admin user for b2b@buom.app
-- First, get the user_id from auth.users (if the user exists)
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Try to find the user ID for b2b@buom.app
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'b2b@buom.app' 
    LIMIT 1;
    
    -- If user exists, create admin record
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.admin_users (
            user_id, 
            admin_level, 
            departments, 
            is_active
        ) VALUES (
            target_user_id,
            'super_admin',
            ARRAY['lending', 'corporate_sme', 'personal', 'pension', 'fund_admin', 'property', 'development'],
            true
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;