
import { compoundingCalculator } from './compoundingUtils';
import { getPensionParameters } from '../pensionParameters';
import { calculateInflatedValue, getCurrentStatePension } from './salaryCalculations';
import { calculateFutureAEContributions } from './projectionCalculations';

export const calculateCoreBUOMValues = (
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  isEnhancedMember: boolean
) => {
  const { drawdownRate } = getPensionParameters();
  const retirementAge = 67;
  const yearsToRetirement = retirementAge - currentAge;
  
  console.log('=== CORE BUOM CALCULATIONS ===');
  console.log(`Growth rate from Parameters: ${(compoundingCalculator.monthlyGrowthRate * 12 * 100).toFixed(1)}%`);
  console.log(`Provider charges from Parameters: ${(compoundingCalculator.monthlyProviderCharges * 12 * 100).toFixed(1)}%`);
  console.log(`Drawdown rate from Parameters: ${(drawdownRate * 100).toFixed(1)}%`);
  
  // USE UNIFIED CALCULATIONS - Single source of truth for core values
  const unifiedCalculations = compoundingCalculator.calculateUnifiedBUOMValues(
    currentAge,
    annualSalary,
    existingPensionValue,
    isEnhancedMember
  );
  
  // Extract unified values - FIXED: Use retirement shortfall for APF calculations
  const {
    currentCapitalShortfall: retirementCapitalShortfall,
    proposedAPFFunding,
    proposedISAMonthlyValue,
    targetIncome: targetIncomeToday,
    existingPlanIncome,
    requiredCapital: requiredCapitalToday
  } = unifiedCalculations;
  
  console.log(`Using retirement capital shortfall for APF: £${retirementCapitalShortfall.toLocaleString()}`);
  console.log(`Using unified APF funding: £${proposedAPFFunding.toLocaleString()}`);
  console.log(`Using unified ISA monthly: £${proposedISAMonthlyValue.toLocaleString()}`);
  
  // Future values at retirement using Parameters inflation rates
  const futureTargetIncome = compoundingCalculator.applyAnnualInflation(targetIncomeToday, yearsToRetirement, 'salary');
  const futureStatePension = compoundingCalculator.applyAnnualInflation(getCurrentStatePension() * 52, yearsToRetirement, 'pension');
  const futureRequiredCapital = compoundingCalculator.applyAnnualInflation(requiredCapitalToday, yearsToRetirement, 'salary');
  
  // Project existing pension value at retirement using Parameters growth
  const monthsToRetirement = yearsToRetirement * 12;
  const projectedExistingPlan = compoundingCalculator.compoundMonthly(existingPensionValue, monthsToRetirement);
  
  // Calculate AE contributions using Parameters-based escalating methodology
  const { totalFutureValue: totalFutureAEContributions, totalContributions: totalAEContributionsPaidIn } = 
    calculateFutureAEContributions(annualSalary, yearsToRetirement);
  
  // Total projected pension assets at retirement (existing + future AE contributions)
  const totalProjectedAssets = projectedExistingPlan + totalFutureAEContributions;
  
  // Calculate APF Target Income using unified calculation
  const existingPlanIncomeAtRetirement = projectedExistingPlan * drawdownRate;
  const apfTargetIncome = Math.max(0, futureTargetIncome - existingPlanIncomeAtRetirement - futureStatePension);
  
  console.log(`APF Target Income: £${apfTargetIncome.toLocaleString()}`);
  
  return {
    retirementCapitalShortfall,
    proposedAPFFunding,
    proposedISAMonthlyValue,
    targetIncomeToday,
    existingPlanIncome,
    requiredCapitalToday,
    futureTargetIncome,
    futureStatePension,
    futureRequiredCapital,
    projectedExistingPlan,
    totalFutureAEContributions,
    totalProjectedAssets,
    apfTargetIncome,
    yearsToRetirement,
    monthsToRetirement
  };
};
