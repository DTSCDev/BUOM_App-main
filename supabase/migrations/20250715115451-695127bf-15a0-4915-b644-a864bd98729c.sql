-- Create admin users and permissions system
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_level TEXT NOT NULL DEFAULT 'viewer', -- 'super_admin', 'admin', 'manager', 'viewer'
  departments TEXT[] DEFAULT '{}', -- ['pension', 'lending', 'property', 'advice', 'fund_admin']
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admin_users(id),
  UNIQUE(user_id)
);

-- Create member management tracking
CREATE TABLE public.member_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  original_value TEXT,
  override_value TEXT NOT NULL,
  reason TEXT,
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin audit trail
CREATE TABLE public.admin_audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id),
  action_type TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'override'
  entity_type TEXT NOT NULL, -- 'member', 'calculation', 'lending', 'property', etc.
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lending management
CREATE TABLE public.lending_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id),
  application_type TEXT NOT NULL, -- 'corporate_sme', 'personal', 'property_self_build', 'property_commercial'
  loan_amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'in_review'
  risk_grade TEXT, -- 'A', 'B', 'C', 'D', 'E'
  interest_rate NUMERIC,
  term_months INTEGER,
  security_details JSONB DEFAULT '{}',
  credit_score INTEGER,
  ltv_ratio NUMERIC, -- Loan to Value for property
  assigned_advisor UUID REFERENCES public.professional_advisors(id),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property development tracking
CREATE TABLE public.property_developments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id),
  lending_application_id UUID REFERENCES public.lending_applications(id),
  development_type TEXT NOT NULL, -- 'self_build', 'commercial', 'residential'
  property_address TEXT NOT NULL,
  total_development_cost NUMERIC NOT NULL,
  current_valuation NUMERIC,
  completion_percentage NUMERIC DEFAULT 0,
  planning_permission_status TEXT DEFAULT 'pending',
  construction_start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  project_manager TEXT,
  contractor_details JSONB DEFAULT '{}',
  milestone_payments JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fund administration tracking
CREATE TABLE public.fund_administration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id),
  fund_type TEXT NOT NULL, -- 'pension', 'investment', 'sipp', 'ssas'
  fund_value NUMERIC NOT NULL,
  management_fee_percentage NUMERIC DEFAULT 1.0,
  performance_fee_percentage NUMERIC DEFAULT 0,
  last_valuation_date DATE,
  next_review_date DATE,
  custodian TEXT,
  investment_strategy TEXT,
  risk_profile TEXT, -- 'conservative', 'moderate', 'aggressive'
  benchmark_index TEXT,
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_administration ENABLE ROW LEVEL SECURITY;

-- Create admin authentication policies
CREATE POLICY "Admins can view admin users" ON public.admin_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() AND au.is_active = true
  )
);

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() AND au.admin_level = 'super_admin' AND au.is_active = true
  )
);

-- Create member override policies
CREATE POLICY "Admins can view overrides" ON public.member_overrides
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() AND au.is_active = true
  )
);

CREATE POLICY "Admins can create overrides" ON public.member_overrides
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() AND au.is_active = true
  )
);

-- Create audit trail policies
CREATE POLICY "Admins can view audit trail" ON public.admin_audit_trail
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() AND au.is_active = true
  )
);

CREATE POLICY "System can insert audit trail" ON public.admin_audit_trail
FOR INSERT WITH CHECK (true);

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION public.has_admin_permission(
  p_user_id UUID,
  p_permission TEXT,
  p_department TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users au
    WHERE au.user_id = p_user_id 
    AND au.is_active = true
    AND (
      au.admin_level IN ('super_admin', 'admin') 
      OR (au.permissions->p_permission)::boolean = true
      OR (p_department IS NULL OR p_department = ANY(au.departments))
    )
  );
END;
$$;

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_user_id UUID,
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.admin_audit_trail (
    admin_user_id,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    p_admin_user_id,
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_details
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_overrides_updated_at
BEFORE UPDATE ON public.member_overrides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lending_applications_updated_at
BEFORE UPDATE ON public.lending_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_developments_updated_at
BEFORE UPDATE ON public.property_developments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fund_administration_updated_at
BEFORE UPDATE ON public.fund_administration
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();