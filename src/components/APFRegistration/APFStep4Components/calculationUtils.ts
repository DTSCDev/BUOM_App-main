import { calculateAge } from "@/utils/pensionCalculations";
import { systemFields } from '@/data/systemFields';

// Define proper interfaces to replace 'any' types
interface Profile {
  annual_salary?: number;
  date_of_birth?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  paye_tax_code?: string;
  is_director?: boolean;
  has_controlling_shares?: boolean;
}

interface Asset {
  category?: {
    name?: string;
  };
  name?: string;
  value?: number;
}

// Helper function to get SFM values - migrated from useSFMResolver to direct systemFields access
const getSFMValue = (sfmCode: string): number => {
  const field = systemFields.find(f => f.sfmId === sfmCode);
  return field ? parseFloat(field.outputValue) || 0 : 0;
};

export const calculateCurrentAge = (profile: Profile): number => {
  // Use ONLY SFM codes - NO FALLBACKS
  const currentAge = getSFMValue('SFM-PRF-2004'); // Profile Current Age from completed profile
  console.log('APFStep4 - Using SFM current age:', currentAge);
  return currentAge;
};

export const calculateExistingPensionValue = (assets: Asset[]): number => {
  try {
    if (!assets || !Array.isArray(assets)) {
      console.log('APFStep4 - No assets available, using 0');
      return 0;
    }
    const pensionValue = assets.filter(asset => {
      if (!asset || !asset.category) return false;
      return asset.category?.name?.toLowerCase().includes('pension') ||
             asset.name?.toLowerCase().includes('pension');
    }).reduce((sum, asset) => sum + (asset.value || 0), 0);
    console.log('APFStep4 - Calculated pension value:', pensionValue);
    return pensionValue;
  } catch (error) {
    console.error('APFStep4 - Error calculating pension value:', error);
    return 0;
  }
};