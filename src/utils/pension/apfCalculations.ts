
import { getPensionParameters } from '../pensionParameters';

// Calculate Advanced Pension Funding (APF) years - FIXED: Use parameters
export const calculateAdvancedPensionFundingYears = (
  shortfall: number
): { minYears: number; maxYears: number } => {
  const params = getPensionParameters();
  
  // FIXED: Use parameters instead of hardcoded £94,800
  const aeContribution = params.aeUpperLimit * (params.autoEnrollmentEmployeeRate + params.autoEnrollmentEmployerRate);
  const availableAllowance = params.annualAllowance - aeContribution;
  const annualFundingAmount = availableAllowance;
  
  // Calculate the years required based on parameter-driven annual funding amount
  const exactYears = shortfall / annualFundingAmount;
  
  // Round to first whole digit for minimum years
  const minYears = Math.floor(exactYears);
  
  // Add 2 years for maximum years
  const maxYears = minYears + 2;
  
  return { minYears, maxYears };
};

// Calculate "Best Use Of Money" (BUOM) monthly cost - FIXED: Use parameters
export const calculateBUOMCost = (standardMonthlyCost: number): number => {
  const params = getPensionParameters();
  return Math.round(standardMonthlyCost * params.buomDiscountRate);
};

// Calculate APF funding using carry forward rules - FIXED: Use parameters
export const calculateCarryForwardAPF = (
  annualSalary: number,
  shortfall: number,
  currentTaxYear: string = '2025/26'
): {
  totalAPFValue: number;
  totalMaturityValue: number;
  fundingBreakdown: Array<{
    taxYear: string;
    contribution: number;
    maturityValue: number;
  }>;
  remainingShortfall: number;
} => {
  const params = getPensionParameters();
  
  // FIXED: Use parameters instead of hardcoded values
  const aeRate = params.autoEnrollmentEmployeeRate + params.autoEnrollmentEmployerRate;
  const aeContribution = params.aeUpperLimit * aeRate;
  const apfGrowthMultiplier = params.apfMaturityMultiplier;
  const headroomBuffer = 10000; // This could also be a parameter if needed
  
  // Historical allowances - could be moved to parameters if needed
  const PENSION_ALLOWANCE_HISTORY = {
    '2025/26': params.annualAllowance,
    '2024/25': params.annualAllowance,
    '2023/24': params.annualAllowance,
    '2022/23': 40000,
    '2021/22': 40000,
    '2020/21': 40000,
  };
  
  // Current year allowance after AE contribution
  const currentYearAllowance = PENSION_ALLOWANCE_HISTORY[currentTaxYear] - aeContribution;
  
  // Calculate carry forward capacity (salary minus current year allowance, with buffer)
  const carryForwardCapacity = Math.max(0, annualSalary - PENSION_ALLOWANCE_HISTORY[currentTaxYear] - headroomBuffer);
  
  const fundingBreakdown = [];
  let totalAPFValue = 0;
  let usedCarryForward = 0;
  
  // Start with current year
  const currentYearAPF = Math.min(currentYearAllowance, shortfall / apfGrowthMultiplier);
  if (currentYearAPF > 0) {
    fundingBreakdown.push({
      taxYear: currentTaxYear,
      contribution: currentYearAPF,
      maturityValue: currentYearAPF * apfGrowthMultiplier
    });
    totalAPFValue += currentYearAPF;
  }
  
  // Calculate remaining shortfall after current year
  let remainingShortfall = shortfall - (currentYearAPF * apfGrowthMultiplier);
  
  // Use carry forward for previous years if needed and capacity available
  const taxYears = ['2024/25', '2023/24', '2022/23'];
  
  for (const taxYear of taxYears) {
    if (remainingShortfall <= 0 || usedCarryForward >= carryForwardCapacity) break;
    
    const yearAllowance = PENSION_ALLOWANCE_HISTORY[taxYear] - aeContribution;
    const availableCarryForward = Math.min(yearAllowance, carryForwardCapacity - usedCarryForward);
    const neededAPF = remainingShortfall / apfGrowthMultiplier;
    const yearAPF = Math.min(availableCarryForward, neededAPF);
    
    if (yearAPF > 0) {
      fundingBreakdown.push({
        taxYear,
        contribution: yearAPF,
        maturityValue: yearAPF * apfGrowthMultiplier
      });
      totalAPFValue += yearAPF;
      usedCarryForward += yearAPF;
      remainingShortfall -= (yearAPF * apfGrowthMultiplier);
    }
  }
  
  const totalMaturityValue = totalAPFValue * apfGrowthMultiplier;
  
  return {
    totalAPFValue,
    totalMaturityValue,
    fundingBreakdown,
    remainingShortfall: Math.max(0, remainingShortfall)
  };
};
