import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { getPensionParameters } from '@/utils/pensionParameters';
import { calculateDynamicAEContributions } from '@/utils/pension/aeContributionCalculations';
import { calculateAge, calculateDaysUntilPension, calculateRemainingPayDays, calculateYearsUntilPension } from '@/utils/pensionCalculations';
// SFMResolver is not used here; PRF-2041 is the source of truth for retirement age

export interface MyBOUMRetirementCalculations {
  // Chart data for PensionShortfallPieChart (SFM-CAL-4126, 4127, 4121)
  existingPlanValueTodayAtRetirement: number;
  existingPlanFutureContributions: number;
  shortfall: number;
  
  // Chart data for CostComparisonChart (SFM-CAL-4128, 4129, 4122, 4131)
  monthlyFundingCost: number;
  buomMonthlyCost: number;
  totalStandardCost: number;
  totalBUOMCost: number;
  
  // Additional metrics
  fundingProgress: number;
  currentProjection: number;
  requiredCapital: number;
  capitalShortfall: number;
  
  // Loading state
  isLoading: boolean;
}

export function useMyBOUMRetirementCalculations(): MyBOUMRetirementCalculations {
  const { profile } = useProfile();
  const { assets, isLoading: isLoadingAssets } = useNetAssetValue();

  return useMemo(() => {
    // Return loading state if data is not ready
    if (!profile?.date_of_birth || isLoadingAssets) {
      return {
        existingPlanValueTodayAtRetirement: 0,
        existingPlanFutureContributions: 0,
        shortfall: 0,
        monthlyFundingCost: 0,
        buomMonthlyCost: 0,
        totalStandardCost: 0,
        totalBUOMCost: 0,
        fundingProgress: 0,
        currentProjection: 0,
        requiredCapital: 0,
        capitalShortfall: 0,
        isLoading: true,
      };
    }

    // Prefer PRF (Profile) value for retirement age, fallback to parameter settings (no localStorage)
    const baseParams = getPensionParameters();
    const retirementAge = (profile.retirement_age ?? baseParams.retirementAge) as number;
    const toDecimal = (v: number) => (v <= 1 ? v : v / 100);
    const pensionIncomeTarget = toDecimal(baseParams.pensionIncomeTarget);
    const growthRate = toDecimal(baseParams.growthRateAccumulation);
    const inflationRate = toDecimal(baseParams.pensionIncomeInflation);
    const drawdownRate = toDecimal(baseParams.drawdownRate);
    const providerCharges = toDecimal(baseParams.providerCharges);
    const buomDiscountRate = toDecimal(baseParams.buomDiscountRate);
    
    // Calculate current age
    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    
    // Calculate existing pension value from assets
    const existingPensionValue = assets?.filter(asset => 
      asset.category?.name?.toLowerCase().includes('pension') ||
      asset.name?.toLowerCase().includes('pension')
    ).reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;

    // Sanitize annual salary and Profile object to match expected types
    const annualSalarySafe = typeof profile.annual_salary === 'number' ? profile.annual_salary : 0;
    const sanitizedProfile = {
      annual_salary: annualSalarySafe,
      pension_contribution_employee: profile?.pension_contribution_employee ?? undefined,
      pension_contribution_employer: profile?.pension_contribution_employer ?? undefined,
    } as const;

    // Use unified calculation engine for dynamic calculations
    const unifiedResults = calculateUnifiedPensionMetrics(
      currentAge,
      annualSalarySafe,
      existingPensionValue,
      false, // isEnhancedMember
      assets || [],
      sanitizedProfile
    );

    // Calculate chart values using unified results and SFM parameters
    // Calculate precise months until retirement using calendar month difference (regulated standard)
    const { years: yrsUntil, months: mosUntil } = calculateYearsUntilPension(new Date(profile.date_of_birth));
    const monthsToRetirement = Math.max(0, (yrsUntil * 12) + mosUntil);
    const yearsToRetirement = Math.max(0, monthsToRetirement / 12);
    const grossMonthlyRate = Math.pow(1 + growthRate, 1/12) - 1;
    const chargesMonthlyRate = Math.pow(1 + providerCharges, 1/12) - 1;
    const netMonthlyRate = grossMonthlyRate - chargesMonthlyRate;
    
    // SFM-CAL-4126: Existing Fund Value at Retirement (existing pension grown to retirement)
    const existingPlanValueTodayAtRetirement = monthsToRetirement > 0
      ? existingPensionValue * Math.pow(1 + netMonthlyRate, Math.max(0, monthsToRetirement))
      : existingPensionValue;
    
    // SFM-CAL-4127: Existing Plan Future Contributions (AE contributions value at retirement)
    // Use dynamic AE contributions with monthly escalation and growth to retirement
    const dynamicAE = calculateDynamicAEContributions(annualSalarySafe, Math.max(0, yearsToRetirement));
    const existingPlanFutureContributions = dynamicAE.totalFutureValue;
    
    // SFM-CAL-4121: Shortfall at Retirement
    const shortfall = unifiedResults.currentCapitalShortfall;
    
    // Calculate monthly funding costs
    // SFM-CAL-4128: Monthly funding cost for existing plan
    const monthlyFundingCost = monthsToRetirement > 0 ? 
      shortfall / (monthsToRetirement * Math.pow(1 + netMonthlyRate, monthsToRetirement / 2)) : 0;
    
    // SFM-CAL-4129: BUOM monthly cost (using dynamic BUOM discount rate)
    const buomMonthlyCost = monthlyFundingCost * (1 - buomDiscountRate);
    
    // SFM-CAL-4122: Total standard cost (annual)
    const totalStandardCost = monthlyFundingCost * 12;
    
    // SFM-CAL-4131: Total BUOM cost (annual)
    const totalBUOMCost = buomMonthlyCost * 12;
    
    // Calculate additional metrics
    const currentProjection = existingPlanValueTodayAtRetirement + existingPlanFutureContributions;
    const requiredCapital = unifiedResults.requiredCapital;
    const capitalShortfall = Math.max(0, requiredCapital - currentProjection);
    const fundingProgress = requiredCapital > 0 ? Math.min(100, (currentProjection / requiredCapital) * 100) : 0;

    // Console logging removed per policy: no console-based logic in Main App

    return {
      existingPlanValueTodayAtRetirement: Math.round(existingPlanValueTodayAtRetirement),
      existingPlanFutureContributions: Math.round(existingPlanFutureContributions),
      shortfall: Math.round(shortfall),
      monthlyFundingCost: Math.round(monthlyFundingCost),
      buomMonthlyCost: Math.round(buomMonthlyCost),
      totalStandardCost: Math.round(totalStandardCost),
      totalBUOMCost: Math.round(totalBUOMCost),
      fundingProgress: Math.round(fundingProgress),
      currentProjection: Math.round(currentProjection),
      requiredCapital: Math.round(requiredCapital),
      capitalShortfall: Math.round(capitalShortfall),
      isLoading: false,
    };
  }, [profile, assets, isLoadingAssets]);
}