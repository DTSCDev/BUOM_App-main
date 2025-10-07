
import { compoundingCore } from './compoundingCore';
import { calculateDynamicAEContributions } from './aeContributionCalculations';
import { calculateAge } from '@/utils/pensionCalculations';

export interface PensionShortfallResult {
  currentAge: number;
  yearsUntilRetirement: number;
  targetIncomeToday: number;
  targetIncomeAtRetirement: number;
  existingPlanIncomeAtRetirement: number;
  statePensionAtRetirement: number;
  currentCapitalShortfall: number;
  monthlyTopUpRequired: number;
  retirementProgressPercentage: number;
}

/**
 * Calculate escalating monthly payment (PMT) with annual contribution increases
 * This is the correct formula for contributions that escalate with inflation
 */
export function calculateEscalatingPMT(
  targetAmount: number,
  totalMonths: number,
  monthlyGrowthRate: number,
  annualEscalationRate: number
): number {
  if (totalMonths <= 0 || targetAmount <= 0) return 0;
  
  const monthlyEscalationRate = Math.pow(1 + annualEscalationRate, 1/12) - 1;
  const effectiveRate = monthlyGrowthRate - monthlyEscalationRate;
  
  console.log(`🔍 ESCALATING PMT CALCULATION DEBUG:`, {
    targetAmount: targetAmount.toLocaleString(),
    totalMonths,
    monthlyGrowthRate: (monthlyGrowthRate * 12 * 100).toFixed(2) + '%',
    annualEscalationRate: (annualEscalationRate * 100).toFixed(1) + '%',
    monthlyEscalationRate: (monthlyEscalationRate * 12 * 100).toFixed(2) + '%',
    effectiveRate: (effectiveRate * 12 * 100).toFixed(2) + '%'
  });
  
  if (Math.abs(effectiveRate) < 0.000001) {
    // When growth rate equals escalation rate, use simple formula
    const result = targetAmount / totalMonths;
    console.log(`📊 SIMPLE PMT (rates equal): £${result.toLocaleString()}`);
    return result;
  }
  
  // Standard escalating PMT formula
  const numerator = targetAmount * effectiveRate;
  const denominator = Math.pow(1 + monthlyGrowthRate, totalMonths) - Math.pow(1 + monthlyEscalationRate, totalMonths);
  const result = numerator / denominator;
  
  console.log(`📊 ESCALATING PMT RESULT:`, {
    numerator: numerator.toLocaleString(),
    denominator: denominator.toLocaleString(),
    result: result.toLocaleString(),
    expectedAround190: 'Should be around £190 with escalating contributions'
  });
  
  return result;
}

export function calculatePensionShortfall(
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number
): PensionShortfallResult {
  console.log('🎯 PENSION SHORTFALL - USING ESCALATING PMT WITH 2% INFLATION:', {
    currentAge,
    annualSalary: annualSalary.toLocaleString(),
    existingPensionValue: existingPensionValue.toLocaleString()
  });

  // Calculate years until pension age (67)
  const yearsUntilRetirement = Math.max(0, compoundingCore.params.retirementAge - currentAge);
  const monthsUntilRetirement = yearsUntilRetirement * 12;

  // Calculate target income using centralized parameter (not hardcoded 50%)
  const targetIncomeToday = annualSalary * compoundingCore.params.pensionIncomeTarget;
  const targetIncomeAtRetirement = compoundingCore.applyAnnualInflation(
    targetIncomeToday, 
    yearsUntilRetirement, 
    'pension'
  );

  // Project existing pension value to retirement
  const projectedExistingPlan = compoundingCore.compoundMonthly(existingPensionValue, monthsUntilRetirement);

  // Calculate future AE contributions
  const aeContributions = calculateDynamicAEContributions(annualSalary, yearsUntilRetirement);

  // Calculate total projected assets INCLUDING AE contributions
  const totalProjectedAssets = projectedExistingPlan + aeContributions.totalFutureValue;

  // Calculate existing plan income at retirement (3.5% drawdown)
  const existingPlanIncomeAtRetirement = totalProjectedAssets * compoundingCore.params.drawdownRate;

  // Calculate state pension at retirement
  const statePensionAtRetirement = compoundingCore.getStatePensionAtRetirement(yearsUntilRetirement);

  // Calculate shortfall - Target minus state pension minus existing plan income
  const netTargetIncome = targetIncomeAtRetirement - statePensionAtRetirement;
  const incomeShortfall = Math.max(0, netTargetIncome - existingPlanIncomeAtRetirement);
  const currentCapitalShortfall = incomeShortfall / compoundingCore.params.drawdownRate;

  // Calculate progress percentage
  const retirementProgressPercentage = Math.min((existingPlanIncomeAtRetirement / netTargetIncome) * 100, 100);

  // Calculate monthly top-up using ESCALATING PMT formula with 2% inflation
  const monthlyRate = compoundingCore.netMonthlyGrowthRate; // 4.5% net growth rate
  const escalationRate = compoundingCore.params.salaryInflation; // 2% annual inflation
  const totalMonths = yearsUntilRetirement * 12;

  console.log(`🔍 PENSION SHORTFALL PARAMETERS:`, {
    pensionIncomeTarget: (compoundingCore.params.pensionIncomeTarget * 100).toFixed(1) + '%',
    salaryInflation: (compoundingCore.params.salaryInflation * 100).toFixed(1) + '%',
    netMonthlyGrowthRate: (monthlyRate * 12 * 100).toFixed(2) + '%',
    shortfall: currentCapitalShortfall.toLocaleString(),
    totalMonths
  });

  const monthlyTopUpRequired = currentCapitalShortfall > 0 ? 
    calculateEscalatingPMT(currentCapitalShortfall, totalMonths, monthlyRate, escalationRate) : 0;

  console.log('🎯 PENSION SHORTFALL RESULTS WITH ESCALATING PMT:', {
    yearsUntilRetirement,
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
    monthlyTopUpRequired: monthlyTopUpRequired.toLocaleString() + ' (with 2% escalation)',
    retirementProgressPercentage: retirementProgressPercentage.toFixed(1) + '%'
  });

  return {
    currentAge,
    yearsUntilRetirement,
    targetIncomeToday,
    targetIncomeAtRetirement,
    existingPlanIncomeAtRetirement,
    statePensionAtRetirement,
    currentCapitalShortfall,
    monthlyTopUpRequired,
    retirementProgressPercentage
  };
}
