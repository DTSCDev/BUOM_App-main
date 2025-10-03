
-- Create professional_advisors table to store advisor data
CREATE TABLE public.professional_advisors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  sector text NOT NULL,
  company_name text,
  membership_body text,
  email text NOT NULL,
  contact_number text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on professional_advisors table
ALTER TABLE public.professional_advisors ENABLE ROW LEVEL SECURITY;

-- Create policies for professional_advisors
CREATE POLICY "Users can view their own advisors" 
  ON public.professional_advisors 
  FOR SELECT 
  USING (member_id = auth.uid());

CREATE POLICY "Users can insert their own advisors" 
  ON public.professional_advisors 
  FOR INSERT 
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Users can update their own advisors" 
  ON public.professional_advisors 
  FOR UPDATE 
  USING (member_id = auth.uid());

CREATE POLICY "Users can delete their own advisors" 
  ON public.professional_advisors 
  FOR DELETE 
  USING (member_id = auth.uid());

-- Create trigger to update updated_at column
CREATE TRIGGER update_professional_advisors_updated_at
  BEFORE UPDATE ON public.professional_advisors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
