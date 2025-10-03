
-- Add employment details fields to members table
ALTER TABLE public.members 
ADD COLUMN employment_type text CHECK (employment_type IN ('paye_employee', 'self_employed', 'business_owner')),
ADD COLUMN employer_name text,
ADD COLUMN employer_address text,
ADD COLUMN trading_name text,
ADD COLUMN company_number text,
ADD COLUMN business_address text,
ADD COLUMN works_from_home boolean DEFAULT false;
