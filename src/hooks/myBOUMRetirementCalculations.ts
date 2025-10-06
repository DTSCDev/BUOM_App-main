import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { compoundingCalculator } from '@/utils/pension/compoundingUtils';
import { calculateDynamicAEContributions } from '@/utils/pension/aeContributionCalculations';
import { calculateAge } from '@/utils/pensionCalculations';
import { SFMResolver } from '@/utils/systemFields/sfmResolver';

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

    // Create SFM resolver with real user data for dynamic parameter loading
    const profileRecord = profile as unknown as Record<string, unknown>;
    const assetsRecord = (assets || []).map(asset => asset as unknown as Record<string, unknown>);
    const resolver = new SFMResolver(profileRecord, assetsRecord);

    // Load parameter values using SFM resolver (CAL-44XX series for Main App)
    const retirementAge = resolver.resolveSFM('SFM-CAL-4405'); // Retirement Age
    const pensionIncomeTarget = resolver.resolveSFM('SFM-CAL-4406') / 100; // Pension Income Target (convert % to decimal)
    const growthRate = resolver.resolveSFM('SFM-CAL-4401') / 100; // Annual Growth Rate
    const inflationRate = resolver.resolveSFM('SFM-CAL-4402') / 100; // Annual Inflation Rate
    const drawdownRate = resolver.resolveSFM('SFM-CAL-4404') / 100; // Drawdown Rate
    const providerCharges = resolver.resolveSFM('SFM-CAL-4403') / 100; // Provider Charges
    const buomDiscountRate = resolver.resolveSFM('SFM-CAL-4462') / 100; // BUOM Discount Rate
    
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
    const yearsToRetirement = retirementAge - currentAge;
    const netGrowthRate = growthRate - providerCharges;
    
    // SFM-CAL-4126: Existing Fund Value at Retirement (existing pension grown to retirement)
    const existingPlanValueTodayAtRetirement = compoundingCalculator.compoundMonthly(existingPensionValue, Math.max(0, yearsToRetirement * 12));
    
    // SFM-CAL-4127: Existing Plan Future Contributions (AE contributions value at retirement)
    // Use dynamic AE contributions with monthly escalation and growth to retirement
    const dynamicAE = calculateDynamicAEContributions(annualSalarySafe, Math.max(0, yearsToRetirement));
    const existingPlanFutureContributions = dynamicAE.totalFutureValue;
    
    // SFM-CAL-4121: Shortfall at Retirement
    const shortfall = unifiedResults.currentCapitalShortfall;
    
    // Calculate monthly funding costs
    const monthsToRetirement = yearsToRetirement * 12;
    
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