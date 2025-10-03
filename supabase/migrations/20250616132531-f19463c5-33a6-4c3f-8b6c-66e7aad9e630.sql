
-- Add company_address column to professional_advisors table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'professional_advisors' 
        AND column_name = 'company_address'
    ) THEN
        ALTER TABLE public.professional_advisors 
        ADD COLUMN company_address text;
    END IF;
END $$;
