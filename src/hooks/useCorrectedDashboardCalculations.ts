import { useMemo } from 'react';
import { useProfile } from './useProfile';
import { useNetAssetValue } from './useNetAssetValue';
import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { calculateAge } from '@/utils/pensionCalculations';
import { Asset as UnifiedAsset, Profile as UnifiedProfile } from '@/utils/systemFields/types';

export function useCorrectedDashboardCalculations() {
  const { profile, isLoading: profileLoading } = useProfile();
  const { assets, isLoading: navLoading } = useNetAssetValue();

  return useMemo(() => {
    const isLoading = profileLoading || navLoading;
    if (!profile || !profile.date_of_birth || !profile.annual_salary) {
      return {
        currentSalary: 0,
        futureSalary: 0,
        targetIncomeAtRetirement: 0,
        existingPlanIncomeAtRetirement: 0,
        apfTargetIncome: 0,
        isaTargetMonthly: 0,
        isaValueToday: 0,
        retirementProgressPercentage: 0,
        repaymentProgressPercentage: 0,
        capitalShortfall: 0,
        shortfall: 0,
        isLoading
      };
    }

    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    const existingPensionValue = (assets || [])
      .filter(a => (a.category?.name?.toLowerCase().includes('pension') || a.name?.toLowerCase().includes('pension')))
      .reduce((sum, a) => sum + (a.value || 0), 0);

    // Map NAV assets to unified engine asset type
    const assetsForUnified: UnifiedAsset[] = (assets || []).map(a => ({
      name: a.name,
      category: { name: a.category?.name },
      value: a.value,
    }));

    // Minimal unified profile typing
    const unifiedProfile: UnifiedProfile = {
      annual_salary: profile.annual_salary,
    };

    const unified = calculateUnifiedPensionMetrics(
      currentAge,
      profile.annual_salary,
      existingPensionValue,
      false,
      assetsForUnified,
      unifiedProfile
    );

    return {
      currentSalary: profile.annual_salary,
      futureSalary: profile.annual_salary, // keep simple; params handle future in engine outputs
      targetIncomeAtRetirement: unified.targetIncomeAtRetirement,
      existingPlanIncomeAtRetirement: unified.existingPlanIncomeAtRetirement,
      apfTargetIncome: unified.apfTargetIncome,
      isaTargetMonthly: unified.isaTargetMonthly,
      isaValueToday: unified.isaValueToday,
      retirementProgressPercentage: unified.retirementProgressPercentage,
      repaymentProgressPercentage: unified.repaymentProgressPercentage,
      capitalShortfall: unified.currentCapitalShortfall,
      shortfall: unified.currentCapitalShortfall,
      isLoading: false
    };
  }, [profile, assets, profileLoading, navLoading]);
}