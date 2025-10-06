
import { useMemo } from 'react';
import { calculateAge } from "@/utils/pensionCalculations";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";

export function usePensionChartData() {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();

  return useMemo(() => {
    if (!profile?.date_of_birth) {
      return { chartData: [], loading: false };
    }

    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    
    // Derive existing pension value strictly from Net Asset Value
    const existingPensionValue = (assets || [])
      .filter(asset => 
        asset?.category?.name?.toLowerCase().includes('pension') ||
        asset?.name?.toLowerCase().includes('pension')
      )
      .reduce((sum, asset) => sum + (asset.value || 0), 0);

    // TODO: Generate chart data using myBUOMCalculator and page-based SFM sources
    return { chartData: [], loading: false };
  }, [profile, assets]);
}
