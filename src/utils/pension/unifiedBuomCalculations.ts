
import { compoundingCore } from './compoundingCore';
import { calculateDynamicAEContributions } from './aeContributionCalculations';
import { Asset } from '@/types/NetAssetValue';

export interface UnifiedBUOMCalculations {
  currentSalary: number;
  futureSalary: number;
  targetIncomeAtRetirement: number;
  existingPlanIncomeAtRetirement: number;
  apfTargetIncome: number;
  isaTargetMonthly: number;
  isaValueToday: number;
  retirementProgressPercentage: number;
  repaymentProgressPercentage: number;
  targetIncome: number;
  existingPlanIncome: number;
  requiredCapital: number;
  currentCapitalShortfall: number;
  proposedAPFFunding: number;
  proposedISAMonthlyValue: number;
  totalProjectedAssets: number;
}

// Helper function to identify ISA assets
function calculateISAValueFromAssets(assets: Asset[]): number {
  if (!assets || assets.length === 0) return 0;
  
  const isaAssets = assets.filter(asset => {
    const assetName = asset.name?.toLowerCase() || '';
    const categoryName = asset.category?.name?.toLowerCase() || '';
    
    // Check for ISA in category name
    if (categoryName.includes('isa') || categoryName.includes('cash & isa')) {
      return true;
    }
    
    // Check for ISA in asset name
    if (assetName.includes('isa')) {
      return true;
    }
    
    return false;
  });
  
  const totalISAValue = isaAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  
  console.log(`🔧 BUOM ISA VALUE CALCULATION:`);
  console.log(`  Found ${isaAssets.length} ISA assets`);
  console.log(`  Total ISA value: £${totalISAValue.toLocaleString()}`);
  
  return totalISAValue;
}

// Enhanced function with assets data
export function calculateUnifiedBUOMValues(
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  isEnhancedMember: boolean = false,
  assets: Asset[] = []
): UnifiedBUOMCalculations {
  console.log('🎯 UNIFIED BUOM CALCULATION - ENHANCED WITH ASSETS:', {
    currentAge,
    annualSalary: annualSalary.toLocaleString(),
    existingPensionValue: existingPensionValue.toLocaleString(),
    isEnhancedMember,
    assetsCount: assets?.length || 0
  });

  // Calculate years until pension age (67)
  const yearsUntilPension = Math.max(0, compoundingCore.params.retirementAge - currentAge);
  const monthsUntilPension = yearsUntilPension * 12;
  
  // FIXED: Calculate target income at retirement - 50% replacement ratio inflated to retirement
  const targetIncomeToday = annualSalary * 0.5; // 50% replacement ratio
  const targetIncomeAtRetirement = compoundingCore.applyAnnualInflation(
    targetIncomeToday, 
    yearsUntilPension, 
    'pension'
  );
  
  // Project existing pension value to retirement
  const projectedExistingPlan = compoundingCore.compoundMonthly(existingPensionValue, monthsUntilPension);
  
  // Calculate future AE contributions
  const aeContributions = calculateDynamicAEContributions(annualSalary, yearsUntilPension);
  
  // Calculate total projected assets INCLUDING AE contributions
  const totalProjectedAssets = projectedExistingPlan + aeContributions.totalFutureValue;
  
  // Calculate existing plan income at retirement (3.5% drawdown)
  const existingPlanIncomeAtRetirement = totalProjectedAssets * compoundingCore.params.drawdownRate;
  
  // Calculate state pension at retirement
  const statePensionAtRetirement = compoundingCore.getStatePensionAtRetirement(yearsUntilPension);
  
  // FIXED: Calculate shortfall - Target minus state pension minus existing plan income
  const netTargetIncome = targetIncomeAtRetirement - statePensionAtRetirement;
  const incomeShortfall = Math.max(0, netTargetIncome - existingPlanIncomeAtRetirement);
  const currentCapitalShortfall = incomeShortfall / compoundingCore.params.drawdownRate;
  
  // Calculate required capital for target income
  const requiredCapital = netTargetIncome / compoundingCore.params.drawdownRate;
  
  // Calculate progress percentage based on net target
  const retirementProgressPercentage = Math.min((existingPlanIncomeAtRetirement / netTargetIncome) * 100, 100);
  
  // Calculate proper monthly top-up using PMT formula for compound growth
  // This calculates the monthly payment needed to accumulate the shortfall over time
  const monthlyRate = compoundingCore.netMonthlyGrowthRate;
  const totalMonths = yearsUntilPension * 12;
  
  console.log(`🔍 AFFORDABILITY DEBUG - Monthly Rate Check:`, {
    netMonthlyGrowthRate: monthlyRate,
    expectedNetRate: 0.045/12,
    grossRate: compoundingCore.params.growthRateAccumulation/12,
    shortfall: currentCapitalShortfall,
    totalMonths
  });
  
  const proposedISAMonthlyValue = currentCapitalShortfall > 0 ? 
    (currentCapitalShortfall * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1) : 0;
  
  console.log(`🔍 DETAILED PMT CALCULATION DEBUG:`, {
    shortfall: currentCapitalShortfall,
    monthlyRate: monthlyRate,
    monthlyRatePercent: (monthlyRate * 12 * 100).toFixed(2) + '%',
    totalMonths,
    denominator: Math.pow(1 + monthlyRate, totalMonths) - 1,
    result: proposedISAMonthlyValue,
    expectedAround190: 'Should be around £190 with 4.5% net rate'
  });
  
  // Calculate proposed funding amounts
  const proposedAPFFunding = Math.min(currentCapitalShortfall * 0.8, annualSalary * 0.4);
  
  // FIXED: Get actual ISA value from assets
  const isaValueToday = calculateISAValueFromAssets(assets);
  
  // FIXED: Calculate ISA repayment progress percentage
  const isaTargetAnnual = proposedISAMonthlyValue * 12;
  const repaymentProgressPercentage = isaTargetAnnual > 0 ? 
    Math.min(100, (isaValueToday / isaTargetAnnual) * 100) : 0;
  
  console.log('🎯 ENHANCED UNIFIED BUOM RESULTS:', {
    yearsUntilPension,
    targetIncomeToday: targetIncomeToday.toLocaleString(),
    targetIncomeAtRetirement: targetIncomeAtRetirement.toLocaleString(),
    statePensionAtRetirement: statePensionAtRetirement.toLocaleString(),
    netTargetIncome: netTargetIncome.toLocaleString(),
    projectedExistingPlan: projectedExistingPlan.toLocaleString(),
    aeContributionsFutureValue: aeContributions.totalFutureValue.toLocaleString(),
    totalProjectedAssets: totalProjectedAssets.toLocaleString(),
    existingPlanIncomeAtRetirement: existingPlanIncomeAtRetirement.toLocaleString(),
    incomeShortfall: incomeShortfall.toLocaleString(),
    currentCapitalShortfall: currentCapitalShortfall.toLocaleString(),
    monthlyTopUp: proposedISAMonthlyValue.toLocaleString(),
    isaValueToday: isaValueToday.toLocaleString(),
    repaymentProgressPercentage: repaymentProgressPercentage.toFixed(1) + '%',
    retirementProgressPercentage: retirementProgressPercentage.toFixed(1) + '%'
  });
  
  return {
    currentSalary: annualSalary,
    futureSalary: compoundingCore.applyAnnualInflation(annualSalary, yearsUntilPension, 'salary'),
    targetIncomeAtRetirement,
    existingPlanIncomeAtRetirement,
    apfTargetIncome: incomeShortfall,
    isaTargetMonthly: proposedISAMonthlyValue,
    isaValueToday, // FIXED: Now from actual assets
    retirementProgressPercentage,
    repaymentProgressPercentage, // FIXED: Now calculated based on ISA progress
    targetIncome: targetIncomeToday, // FIXED: Use today's value (£30,000) not retirement value (£49,218)
    existingPlanIncome: existingPlanIncomeAtRetirement,
    requiredCapital,
    currentCapitalShortfall,
    proposedAPFFunding,
    proposedISAMonthlyValue,
    totalProjectedAssets
  };
}

// Backward compatibility function for existing callers
export function calculateUnifiedBUOMValuesLegacy(
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  isEnhancedMember: boolean = false
): UnifiedBUOMCalculations {
  return calculateUnifiedBUOMValues(
    currentAge,
    annualSalary,
    existingPensionValue,
    isEnhancedMember,
    [] // empty assets
  );
}
