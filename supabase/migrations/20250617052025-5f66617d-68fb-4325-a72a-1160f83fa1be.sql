
-- Create legacy_planning table
CREATE TABLE public.legacy_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  planning_type TEXT NOT NULL CHECK (planning_type IN ('will_not_arranged', 'will_testament', 'power_of_attorney', 'expression_of_wish', 'digital_will_provider')),
  provider_name TEXT,
  provider_contact TEXT,
  document_date DATE,
  review_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.legacy_planning ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own legacy planning items" 
  ON public.legacy_planning 
  FOR SELECT 
  USING (auth.uid() = member_id);

CREATE POLICY "Users can create their own legacy planning items" 
  ON public.legacy_planning 
  FOR INSERT 
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own legacy planning items" 
  ON public.legacy_planning 
  FOR UPDATE 
  USING (auth.uid() = member_id);

CREATE POLICY "Users can delete their own legacy planning items" 
  ON public.legacy_planning 
  FOR DELETE 
  USING (auth.uid() = member_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_legacy_planning_updated_at
  BEFORE UPDATE ON public.legacy_planning
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
