
-- Add new columns to professional_advisors table for regulatory compliance
ALTER TABLE public.professional_advisors 
ADD COLUMN fca_number text,
ADD COLUMN sra_number text,
ADD COLUMN professional_body_number text,
ADD COLUMN professional_body_name text,
ADD COLUMN verification_status text DEFAULT 'pending',
ADD COLUMN verification_date timestamp with time zone,
ADD COLUMN subscription_status text DEFAULT 'invited',
ADD COLUMN practice_review_completed boolean DEFAULT false,
ADD COLUMN practice_review_date timestamp with time zone,
ADD COLUMN vulnerable_clients_identified boolean DEFAULT false,
ADD COLUMN first_contact_attempt timestamp with time zone,
ADD COLUMN last_contact_attempt timestamp with time zone,
ADD COLUMN contact_attempts_count integer DEFAULT 0,
ADD COLUMN audit_notes text;

-- Create audit trail table for professional advisor interactions
CREATE TABLE public.professional_advisor_audit_trail (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id uuid NOT NULL REFERENCES public.professional_advisors(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_description text,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text,
  ip_address text,
  additional_data jsonb
);

-- Enable RLS on audit trail table
ALTER TABLE public.professional_advisor_audit_trail ENABLE ROW LEVEL SECURITY;

-- Create policies for audit trail
CREATE POLICY "Users can view their advisor audit trails" 
  ON public.professional_advisor_audit_trail 
  FOR SELECT 
  USING (member_id = auth.uid());

CREATE POLICY "Users can insert their advisor audit trails" 
  ON public.professional_advisor_audit_trail 
  FOR INSERT 
  WITH CHECK (member_id = auth.uid());

-- Add trigger to update updated_at column on professional_advisors
DROP TRIGGER IF EXISTS update_professional_advisors_updated_at ON public.professional_advisors;
CREATE TRIGGER update_professional_advisors_updated_at
  BEFORE UPDATE ON public.professional_advisors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log advisor interactions
CREATE OR REPLACE FUNCTION public.log_advisor_interaction(
  p_advisor_id uuid,
  p_member_id uuid,
  p_action_type text,
  p_action_description text DEFAULT NULL,
  p_additional_data jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO public.professional_advisor_audit_trail (
    advisor_id,
    member_id,
    action_type,
    action_description,
    additional_data
  ) VALUES (
    p_advisor_id,
    p_member_id,
    p_action_type,
    p_action_description,
    p_additional_data
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;
