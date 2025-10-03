-- BUOM Database Optimization Migration
-- Consolidates redundant tables and prepares for Power Of Ten Challenge ecosystem

-- ===============================================
-- PART 1: DATA CONSOLIDATION
-- ===============================================

-- Drop redundant placeholder tables
DROP TABLE IF EXISTS public."buom-technology-hub";
DROP TABLE IF EXISTS public."my-buom-app";

-- Consolidate employee data into members table (add missing fields)
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS employer_id uuid REFERENCES public.employers(id),
ADD COLUMN IF NOT EXISTS scheme_id uuid REFERENCES public.pension_schemes(id),
ADD COLUMN IF NOT EXISTS existing_pension_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_salary_income numeric,
ADD COLUMN IF NOT EXISTS other_income numeric,
ADD COLUMN IF NOT EXISTS buom_membership_id text UNIQUE;

-- Migrate any existing employee data to members table (if employees table exists)
-- This would need to be run manually to preserve data integrity

-- ===============================================
-- PART 2: POWER OF TEN CHALLENGE INFRASTRUCTURE
-- ===============================================

-- Professional service sectors for the 10 experts
CREATE TABLE public.professional_sectors (
  id serial PRIMARY KEY,
  sector_name text NOT NULL,
  sector_description text,
  sector_icon text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the 10 key sectors
INSERT INTO public.professional_sectors (sector_name, sector_description, display_order) VALUES
('Accountants', 'Tax, accounting, and financial compliance experts', 1),
('Legal Advisors', 'Legal counsel and regulatory compliance', 2),
('Regulated Advisors', 'Loans, investments, and insurance specialists', 3),
('Pension & Finance Providers', 'Retirement planning and investment management', 4),
('Energy Advisors', 'Energy efficiency and renewable solutions', 5),
('Trust & Legacy Planning', 'Estate planning and long-term care', 6),
('Construction', 'Property development and renovation', 7),
('Employee Benefit Experts', 'Workplace benefits and compensation', 8),
('Business Strategy', 'Marketing, sales, and business development', 9),
('Technology & AI', 'Digital transformation and AI solutions', 10);

-- Time Tokens system
CREATE TABLE public.time_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  token_type text NOT NULL DEFAULT 'referral', -- 'referral', 'bonus', 'spent', 'earned'
  token_amount integer NOT NULL DEFAULT 1,
  source_type text, -- 'power_of_ten', 'professional_service', 'bonus'
  source_id uuid, -- References the source record
  description text,
  is_redeemed boolean DEFAULT false,
  redeemed_at timestamp with time zone,
  redeemed_for text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);

-- Power of Ten Challenge tracking
CREATE TABLE public.power_of_ten_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiator_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  challenge_name text NOT NULL,
  challenge_description text,
  target_referrals integer DEFAULT 10,
  current_referrals integer DEFAULT 0,
  status text DEFAULT 'active', -- 'active', 'completed', 'expired'
  reward_tokens integer DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  expires_at timestamp with time zone
);

-- Referral tracking
CREATE TABLE public.referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  referred_member_id uuid REFERENCES public.members(id) ON DELETE SET NULL,
  referred_email text NOT NULL,
  referred_name text,
  challenge_id uuid REFERENCES public.power_of_ten_challenges(id) ON DELETE SET NULL,
  status text DEFAULT 'pending', -- 'pending', 'completed', 'expired'
  tokens_earned integer DEFAULT 1,
  referred_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  notes text
);

-- ===============================================
-- PART 3: PROFESSIONAL SERVICES MARKETPLACE
-- ===============================================

-- Update professional_advisors to support the 10 sectors
ALTER TABLE public.professional_advisors
ADD COLUMN IF NOT EXISTS sector_id integer REFERENCES public.professional_sectors(id),
ADD COLUMN IF NOT EXISTS service_areas text[], -- Array of specific services offered
ADD COLUMN IF NOT EXISTS time_token_rate integer DEFAULT 1, -- Tokens per hour/service
ADD COLUMN IF NOT EXISTS availability_hours text, -- JSON string of availability
ADD COLUMN IF NOT EXISTS max_clients_per_month integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS current_client_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS service_rating numeric DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS buom_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Services offered by professionals
CREATE TABLE public.professional_services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id uuid NOT NULL REFERENCES public.professional_advisors(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  service_description text,
  service_type text NOT NULL, -- 'consultation', 'review', 'planning', 'implementation'
  token_cost integer NOT NULL DEFAULT 1,
  duration_minutes integer DEFAULT 60,
  max_participants integer DEFAULT 1,
  is_group_service boolean DEFAULT false,
  prerequisites text,
  deliverables text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Service bookings and redemptions
CREATE TABLE public.service_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.professional_services(id) ON DELETE CASCADE,
  advisor_id uuid NOT NULL REFERENCES public.professional_advisors(id) ON DELETE CASCADE,
  booking_date timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL,
  tokens_used integer NOT NULL,
  booking_status text DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
  meeting_link text,
  meeting_notes text,
  member_rating integer, -- 1-5 stars
  member_feedback text,
  advisor_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ===============================================
-- PART 4: BUOM AI INTEGRATION PREPARATION
-- ===============================================

-- Organization types for BUOM AI
CREATE TABLE public.organization_types (
  id serial PRIMARY KEY,
  type_name text NOT NULL,
  description text,
  is_active boolean DEFAULT true
);

INSERT INTO public.organization_types (type_name, description) VALUES
('Employer', 'Companies and organizations with employees'),
('Startup', 'Early-stage companies and entrepreneurs'),
('NGO', 'Non-governmental organizations'),
('Charity', 'Registered charitable organizations'),
('Non-Profit', 'Non-profit organizations'),
('Government', 'Government agencies and departments');

-- Organizations table for BUOM AI
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name text NOT NULL,
  organization_type_id integer REFERENCES public.organization_types(id),
  registration_number text,
  contact_person_id uuid REFERENCES public.members(id),
  address text,
  postcode text,
  phone text,
  email text,
  website text,
  employee_count integer,
  annual_revenue numeric,
  buom_ai_subscription text DEFAULT 'trial', -- 'trial', 'basic', 'premium', 'enterprise'
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Link members to organizations
CREATE TABLE public.member_organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role text NOT NULL, -- 'employee', 'admin', 'owner', 'advisor'
  department text,
  job_title text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(member_id, organization_id)
);

-- ===============================================
-- PART 5: 3PPS FRAMEWORK INFRASTRUCTURE
-- ===============================================

-- Asset owner categories for 3PPS Framework
CREATE TABLE public.asset_owner_categories (
  id serial PRIMARY KEY,
  category_name text NOT NULL,
  min_asset_value numeric,
  description text,
  framework_requirements text,
  is_active boolean DEFAULT true
);

-- 3PPS Framework participants
CREATE TABLE public.framework_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  category_id integer REFERENCES public.asset_owner_categories(id),
  verified_assets numeric,
  commitment_amount numeric,
  commitment_duration_months integer,
  framework_status text DEFAULT 'pending', -- 'pending', 'verified', 'active', 'completed'
  verification_date timestamp with time zone,
  smart_contract_address text,
  tokenization_details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ===============================================
-- PART 6: ENHANCED TRACKING & ANALYTICS
-- ===============================================

-- Member activity tracking
CREATE TABLE public.member_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- 'calculation', 'referral', 'service_booking', 'token_redemption'
  activity_description text,
  activity_data jsonb,
  tokens_earned integer DEFAULT 0,
  tokens_spent integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- System configurations
CREATE TABLE public.system_configurations (
  id serial PRIMARY KEY,
  config_key text NOT NULL UNIQUE,
  config_value text NOT NULL,
  config_type text DEFAULT 'string', -- 'string', 'integer', 'boolean', 'json'
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default system configurations
INSERT INTO public.system_configurations (config_key, config_value, config_type, description) VALUES
('default_referral_tokens', '1', 'integer', 'Default tokens earned per referral'),
('power_of_ten_target', '10', 'integer', 'Target referrals for Power of Ten Challenge'),
('token_expiry_months', '12', 'integer', 'Months before tokens expire'),
('max_tokens_per_member', '100', 'integer', 'Maximum tokens a member can hold'),
('apf_default_rate', '19.9', 'string', 'Default APF rate percentage'),
('debt_priority_threshold', '10', 'string', 'Debt interest rate threshold for priority repayment');

-- ===============================================
-- PART 7: ENABLE RLS AND CREATE POLICIES
-- ===============================================

-- Enable RLS on all new tables
ALTER TABLE public.time_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_of_ten_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.framework_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for member-owned data
CREATE POLICY "Members can view their own tokens" ON public.time_tokens FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Members can view their own challenges" ON public.power_of_ten_challenges FOR SELECT USING (initiator_id = auth.uid());
CREATE POLICY "Members can view their own referrals" ON public.referrals FOR SELECT USING (referrer_id = auth.uid());
CREATE POLICY "Members can view their own bookings" ON public.service_bookings FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Members can view their own activities" ON public.member_activities FOR SELECT USING (member_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_time_tokens_member_id ON public.time_tokens(member_id);
CREATE INDEX idx_time_tokens_is_redeemed ON public.time_tokens(is_redeemed);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_service_bookings_member_id ON public.service_bookings(member_id);
CREATE INDEX idx_service_bookings_advisor_id ON public.service_bookings(advisor_id);
CREATE INDEX idx_service_bookings_booking_date ON public.service_bookings(booking_date);
CREATE INDEX idx_member_activities_member_id ON public.member_activities(member_id);
CREATE INDEX idx_member_activities_activity_type ON public.member_activities(activity_type);

-- ===============================================
-- PART 8: UTILITY FUNCTIONS
-- ===============================================

-- Function to calculate member's token balance
CREATE OR REPLACE FUNCTION public.calculate_member_token_balance(member_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token_balance integer;
BEGIN
  SELECT 
    COALESCE(SUM(CASE WHEN token_type IN ('referral', 'bonus', 'earned') THEN token_amount ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN token_type = 'spent' THEN token_amount ELSE 0 END), 0)
  INTO token_balance
  FROM public.time_tokens
  WHERE member_id = member_uuid 
    AND (expires_at IS NULL OR expires_at > now())
    AND NOT is_redeemed;
    
  RETURN COALESCE(token_balance, 0);
END;
$$;

-- Function to award tokens for referral
CREATE OR REPLACE FUNCTION public.award_referral_tokens(
  referrer_uuid uuid,
  referred_email text,
  challenge_uuid uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referral_id uuid;
  token_amount integer;
BEGIN
  -- Get default token amount
  SELECT config_value::integer INTO token_amount
  FROM public.system_configurations
  WHERE config_key = 'default_referral_tokens';
  
  -- Create referral record
  INSERT INTO public.referrals (referrer_id, referred_email, challenge_id, tokens_earned)
  VALUES (referrer_uuid, referred_email, challenge_uuid, token_amount)
  RETURNING id INTO referral_id;
  
  -- Award tokens
  INSERT INTO public.time_tokens (member_id, token_type, token_amount, source_type, source_id, description)
  VALUES (
    referrer_uuid, 
    'referral', 
    token_amount, 
    'power_of_ten', 
    referral_id,
    'Referral reward for ' || referred_email
  );
  
  -- Log activity
  INSERT INTO public.member_activities (member_id, activity_type, activity_description, tokens_earned)
  VALUES (
    referrer_uuid,
    'referral',
    'Referred ' || referred_email,
    token_amount
  );
  
  RETURN referral_id;
END;
$$;

-- Function to check if member can afford service
CREATE OR REPLACE FUNCTION public.can_afford_service(
  member_uuid uuid,
  service_uuid uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_balance integer;
  service_cost integer;
BEGIN
  -- Get member's token balance
  SELECT public.calculate_member_token_balance(member_uuid) INTO member_balance;
  
  -- Get service cost
  SELECT token_cost INTO service_cost
  FROM public.professional_services
  WHERE id = service_uuid;
  
  RETURN member_balance >= service_cost;
END;
$$;

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables with updated_at columns
CREATE TRIGGER update_professional_services_updated_at
  BEFORE UPDATE ON public.professional_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_bookings_updated_at
  BEFORE UPDATE ON public.service_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_framework_participants_updated_at
  BEFORE UPDATE ON public.framework_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_configurations_updated_at
  BEFORE UPDATE ON public.system_configurations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();