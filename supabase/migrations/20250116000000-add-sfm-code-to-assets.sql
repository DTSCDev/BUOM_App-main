-- Add sfm_code column to assets table
ALTER TABLE public.assets 
ADD COLUMN IF NOT EXISTS sfm_code TEXT;

-- Create index for better performance on sfm_code lookups
CREATE INDEX IF NOT EXISTS idx_assets_sfm_code ON public.assets(sfm_code);

-- Add comment for documentation
COMMENT ON COLUMN public.assets.sfm_code IS 'SFM (Statement of Financial Management) code for asset categorization';