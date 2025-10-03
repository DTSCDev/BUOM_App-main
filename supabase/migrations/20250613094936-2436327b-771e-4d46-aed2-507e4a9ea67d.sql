
-- Fix RLS policies for the free-rs-calculator table to allow anonymous submissions
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts to free-rs-calculator" ON public."free-rs-calculator";
DROP POLICY IF EXISTS "Allow service role to manage free-rs-calculator" ON public."free-rs-calculator";

-- Create a policy that allows anonymous users to insert their funding eligibility data
CREATE POLICY "Allow anonymous users to submit funding eligibility" 
ON public."free-rs-calculator"
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create a policy that allows service role to manage all data
CREATE POLICY "Allow service role full access to free-rs-calculator" 
ON public."free-rs-calculator"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled on the table
ALTER TABLE public."free-rs-calculator" ENABLE ROW LEVEL SECURITY;
