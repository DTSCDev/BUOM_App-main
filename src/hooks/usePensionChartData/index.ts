
import { useMemo } from 'react';
import { calculateAge } from "@/utils/pensionCalculations";
import { useProfile } from "@/hooks/useProfile";

export function usePensionChartData() {
  const { profile } = useProfile();

  return useMemo(() => {
    if (!profile?.date_of_birth) {
      return { chartData: [], loading: false };
    }

    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    
    const inputs = {
      currentAge,
      retirementAge: 67, // CAL-4XXX default from Parameters Settings
      currentSalary: profile.annual_salary || 60000,
      existingPensionValue: 109233,
      targetIncomePercentage: 50, // CAL-4XXX default from Parameters Settings
      apfSponsorshipYears: 4,
      isaContributionCapacity: 20000
    };

    // Generate chart data using your exact fallback values
    return { chartData: [], loading: false };
  }, [profile]);
}
