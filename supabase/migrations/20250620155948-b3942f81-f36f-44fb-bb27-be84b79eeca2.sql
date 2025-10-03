
-- Add new fields to members table for PAYE and Director functionality
ALTER TABLE public.members 
ADD COLUMN paye_tax_code text DEFAULT '1257L',
ADD COLUMN is_director boolean DEFAULT false,
ADD COLUMN has_controlling_shares boolean DEFAULT false,
ADD COLUMN director_nic_election text CHECK (director_nic_election IN ('annual', 'monthly')) DEFAULT 'annual';

-- Add comments for clarity
COMMENT ON COLUMN public.members.paye_tax_code IS 'PAYE tax code e.g. 1257L, BR, D0, NT';
COMMENT ON COLUMN public.members.is_director IS 'Whether the member is a company director';
COMMENT ON COLUMN public.members.has_controlling_shares IS 'Whether director has >50% controlling shares';
COMMENT ON COLUMN public.members.director_nic_election IS 'NIC calculation method for directors: annual or monthly';
