
// Stub implementation to preserve APF Registration functionality
import { getPensionParameters } from '@/utils/pensionParameters';
import { Asset, Profile } from '@/utils/systemFields/types';

export interface UnifiedCalculationResult {
  currentCapitalShortfall: number;
  proposedAPFFunding: number;
  feasibleAPFFunding: number;
  salaryExchangeReasonForLimit: string;
  retirementProgressPercentage: number;
  targetIncomeAtRetirement: number;
  existingPlanIncomeAtRetirement: number;
  apfTargetIncome: number;
  isaTargetMonthly: number;
  isaValueToday: number;
  repaymentProgressPercentage: number;
  statePensionAtRetirement: number;
  yearsToRetirement: number;
  requiredCapital: number;
  projectedExistingPlan: number;
  totalFutureAEContributions: number;
  statePensionLumpSum: number;
  totalProjectedAssets: number;
  capitalShortfallToday: number;
  existingPlanIncome: number;
  targetIncomeToday: number;
}

// Helper function to identify ISA assets
function calculateISAValueToday(assets: Asset[]): number {
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
  
  console.log(`🔧 ISA VALUE CALCULATION:`);
  console.log(`  Found ${isaAssets.length} ISA assets`);
  console.log(`  Total ISA value: £${totalISAValue.toLocaleString()}`);
  
  return totalISAValue;
}

// Helper function to calculate Auto-Enrollment contributions
function calculateTotalFutureAEContributions(
  annualSalary: number, 
  currentAge: number, 
  profile: Profile
): number {
  const yearsToRetirement = Math.max(0, 67 - currentAge);
  
  // Get contribution rates from profile or use defaults
  const employeeRate = (profile?.pension_contribution_employee || 5) / 100; // Default 5%
  const employerRate = (profile?.pension_contribution_employer || 3) / 100; // Default 3%
  const totalContributionRate = employeeRate + employerRate;
  
  // Calculate annual AE contributions
  const annualAEContributions = annualSalary * totalContributionRate;
  
  // Project total future contributions with salary growth
  const params = getPensionParameters();
  let totalFutureContributions = 0;
  
  for (let year = 1; year <= yearsToRetirement; year++) {
    const inflatedSalary = annualSalary * Math.pow(1 + params.salaryInflation, year);
    const yearlyContribution = inflatedSalary * totalContributionRate;
    totalFutureContributions += yearlyContribution;
  }
  
  console.log(`🔧 AE CONTRIBUTION CALCULATION:`);
  console.log(`  Employee rate: ${employeeRate * 100}%`);
  console.log(`  Employer rate: ${employerRate * 100}%`);
  console.log(`  Total rate: ${totalContributionRate * 100}%`);
  console.log(`  Annual contributions: £${annualAEContributions.toLocaleString()}`);
  console.log(`  Years to retirement: ${yearsToRetirement}`);
  console.log(`  Total future AE contributions: £${totalFutureContributions.toLocaleString()}`);
  
  return totalFutureContributions;
}

// Enhanced function with assets and profile data
export function calculateUnifiedPensionMetrics(
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  isEnhancedMember: boolean = false,
  assets: Asset[] = [],
  profile: Profile = {} as Profile
): UnifiedCalculationResult {
  const params = getPensionParameters();
  
  // Calculate years until pension age (67)
  const yearsUntilPension = Math.max(0, 67 - currentAge);
  
  // FIXED: Use proper pension income target parameter (50%) instead of hardcoded 66.67%
  const targetIncomeAtRetirement = annualSalary * params.pensionIncomeTarget;
  console.log(`🔧 UNIFIED ENGINE: Target income = £${annualSalary.toLocaleString()} × ${params.pensionIncomeTarget} = £${targetIncomeAtRetirement.toLocaleString()}`);
  
  // Project existing pension value to retirement
  const projectedExistingPlan = existingPensionValue * Math.pow(1.05, yearsUntilPension);
  
  // Calculate existing plan income at retirement (4% drawdown)
  const existingPlanIncomeAtRetirement = projectedExistingPlan * 0.04;
  
  // Calculate state pension at retirement using proper inflation from parameters
  const currentStatePension = params.statePensionWeekly * 52; // £11,973
  const statePensionAtRetirement = currentStatePension * Math.pow(1 + params.salaryInflation, yearsUntilPension);
  
  // FIXED: Calculate state pension lump sum (25% of state pension capital value)
  const statePensionCapitalValue = statePensionAtRetirement / 0.04;
  const statePensionLumpSum = statePensionCapitalValue * 0.25;
  
  // Calculate total projected income
  const totalProjectedIncome = existingPlanIncomeAtRetirement + statePensionAtRetirement;
  
  // Calculate shortfall
  const incomeShortfall = Math.max(0, targetIncomeAtRetirement - totalProjectedIncome);
  const currentCapitalShortfall = incomeShortfall / 0.04;
  
  // FIXED: Calculate ISA target monthly based on capital shortfall
  // Using the enhanced rate: £98 per £100k of shortfall (monthly)
  const isaTargetMonthly = currentCapitalShortfall > 0 ? 
    Math.round((currentCapitalShortfall / 100000) * 98) : 0;
  
  // FIXED: Get actual ISA value from assets
  const isaValueToday = calculateISAValueToday(assets);
  
  // FIXED: Calculate ISA repayment progress percentage
  const isaTargetAnnual = isaTargetMonthly * 12;
  const repaymentProgressPercentage = isaTargetAnnual > 0 ? 
    Math.min(100, (isaValueToday / isaTargetAnnual) * 100) : 0;
  
  // FIXED: Calculate total future AE contributions
  const totalFutureAEContributions = calculateTotalFutureAEContributions(
    annualSalary, 
    currentAge, 
    profile
  );
  
  // FIXED: Calculate total projected assets including AE contributions
  const totalProjectedAssets = existingPensionValue + totalFutureAEContributions + isaValueToday;
  
  console.log(`🎯 UNIFIED ENGINE CALCULATION (ENHANCED):`, {
    currentAge,
    yearsUntilPension,
    annualSalary: annualSalary.toLocaleString(),
    targetIncomeAtRetirement: targetIncomeAtRetirement.toLocaleString(),
    existingPensionValue: existingPensionValue.toLocaleString(),
    projectedExistingPlan: projectedExistingPlan.toLocaleString(),
    existingPlanIncomeAtRetirement: existingPlanIncomeAtRetirement.toLocaleString(),
    statePensionAtRetirement: statePensionAtRetirement.toLocaleString(),
    statePensionLumpSum: statePensionLumpSum.toLocaleString(),
    totalProjectedIncome: totalProjectedIncome.toLocaleString(),
    incomeShortfall: incomeShortfall.toLocaleString(),
    currentCapitalShortfall: currentCapitalShortfall.toLocaleString(),
    isaTargetMonthly: isaTargetMonthly.toLocaleString(),
    isaValueToday: isaValueToday.toLocaleString(),
    repaymentProgressPercentage: repaymentProgressPercentage.toFixed(1) + '%',
    totalFutureAEContributions: totalFutureAEContributions.toLocaleString(),
    totalProjectedAssets: totalProjectedAssets.toLocaleString(),
    pensionIncomeTarget: params.pensionIncomeTarget
  });
  
  return {
    currentCapitalShortfall,
    proposedAPFFunding: currentCapitalShortfall * 0.8,
    feasibleAPFFunding: Math.min(currentCapitalShortfall * 0.8, annualSalary * 0.4),
    salaryExchangeReasonForLimit: "Tax constraints",
    retirementProgressPercentage: (totalProjectedIncome / targetIncomeAtRetirement) * 100,
    targetIncomeAtRetirement,
    existingPlanIncomeAtRetirement,
    apfTargetIncome: incomeShortfall,
    isaTargetMonthly, // FIXED: Now calculated based on shortfall
    isaValueToday, // FIXED: Now from actual assets
    repaymentProgressPercentage, // FIXED: Now calculated based on ISA progress
    statePensionAtRetirement,
    yearsToRetirement: yearsUntilPension,
    requiredCapital: targetIncomeAtRetirement / 0.04,
    projectedExistingPlan: existingPensionValue,
    totalFutureAEContributions, // FIXED: Now calculated based on profile
    statePensionLumpSum, // FIXED: Now calculated from state pension
    totalProjectedAssets, // FIXED: Now includes all asset types
    capitalShortfallToday: currentCapitalShortfall,
    existingPlanIncome: existingPlanIncomeAtRetirement,
    targetIncomeToday: annualSalary * params.pensionIncomeTarget
  };
}

// Backward compatibility function for existing callers
export function calculateUnifiedPensionMetricsLegacy(
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  isEnhancedMember: boolean = false
): UnifiedCalculationResult {
  return calculateUnifiedPensionMetrics(
    currentAge,
    annualSalary,
    existingPensionValue,
    isEnhancedMember,
    [], // empty assets
    {} // empty profile
  );
}
