import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { getPensionParameters } from '@/utils/pensionParameters';
import { calculateDynamicAEContributions } from '@/utils/pension/aeContributionCalculations';
import { calculateAge, calculateDaysUntilPension, calculateRemainingPayDays } from '@/utils/pensionCalculations';
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

    // Prefer PRF (Profile) value for retirement age, fallback to parameter settings
    const baseParams = getPensionParameters();
    const savedParamsRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('retirement-calculator-parameters') : null;
    const savedParams = (() => {
      try { return savedParamsRaw ? JSON.parse(savedParamsRaw) : null; } catch { return null; }
    })();

    const retirementAge = (profile.retirement_age ?? savedParams?.selectedRetirementAge ?? baseParams.retirementAge) as number;
    const pensionIncomeTarget = (savedParams?.pensionIncomeTarget ?? (baseParams.pensionIncomeTarget * 100)) / 100; // % to decimal
    const growthRate = (savedParams?.growthRate ?? (baseParams.growthRateAccumulation * 100)) / 100; // % to decimal
    const inflationRate = (savedParams?.inflationRate ?? (baseParams.pensionIncomeInflation * 100)) / 100; // % to decimal
    const drawdownRate = (savedParams?.drawdownRate ?? (baseParams.drawdownRate * 100)) / 100; // % to decimal
    const providerCharges = (savedParams?.providerCharges ?? (baseParams.providerCharges * 100)) / 100; // % to decimal
    const buomDiscountRate = (savedParams?.buomDiscountRate ?? (baseParams.buomDiscountRate * 100)) / 100; // % to decimal
    
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
    // Calculate precise months until retirement (Free Calculator style)
    const daysUntilPension = calculateDaysUntilPension(new Date(profile.date_of_birth), retirementAge);
    const monthsToRetirement = calculateRemainingPayDays(daysUntilPension);
    const yearsToRetirement = Math.max(0, monthsToRetirement / 12);
    const netGrowthRate = growthRate - providerCharges;
    
    // SFM-CAL-4126: Existing Fund Value at Retirement (existing pension grown to retirement)
    const existingPlanValueTodayAtRetirement = existingPensionValue * Math.pow(1 + (netGrowthRate / 12), Math.max(0, monthsToRetirement));
    
    // SFM-CAL-4127: Existing Plan Future Contributions (AE contributions value at retirement)
    // Use dynamic AE contributions with monthly escalation and growth to retirement
    const dynamicAE = calculateDynamicAEContributions(annualSalarySafe, Math.max(0, yearsToRetirement));
    const existingPlanFutureContributions = dynamicAE.totalFutureValue;
    
    // SFM-CAL-4121: Shortfall at Retirement
    const shortfall = unifiedResults.currentCapitalShortfall;
    
    // Calculate monthly funding costs
    // SFM-CAL-4128: Monthly funding cost for existing plan
    const monthlyFundingCost = monthsToRetirement > 0 ? 
      shortfall / (monthsToRetirement * Math.pow(1 + netGrowthRate / 12, monthsToRetirement / 2)) : 0;
    
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

    console.log('🔧 MY BOUM DYNAMIC CALCULATIONS (SFM-BASED):', {
      currentAge,
      yearsToRetirement,
      existingPensionValue: existingPensionValue.toLocaleString(),
      existingPlanValueTodayAtRetirement: existingPlanValueTodayAtRetirement.toLocaleString(),
      existingPlanFutureContributions: existingPlanFutureContributions.toLocaleString(),
      shortfall: shortfall.toLocaleString(),
      monthlyFundingCost: monthlyFundingCost.toLocaleString(),
      buomMonthlyCost: buomMonthlyCost.toLocaleString(),
      fundingProgress: fundingProgress.toFixed(1) + '%',
      sfmParameters: {
        'SFM-CAL-4405 (Retirement Age)': retirementAge,
        'SFM-CAL-4406 (Pension Income Target %)': (pensionIncomeTarget * 100).toFixed(1),
        'SFM-CAL-4401 (Growth Rate %)': (growthRate * 100).toFixed(1),
        'SFM-CAL-4402 (Inflation Rate %)': (inflationRate * 100).toFixed(1),
        'SFM-CAL-4404 (Drawdown Rate %)': (drawdownRate * 100).toFixed(1),
        'SFM-CAL-4403 (Provider Charges %)': (providerCharges * 100).toFixed(1),
        'SFM-CAL-4462 (BUOM Discount Rate %)': (buomDiscountRate * 100).toFixed(1),
      }
    });

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