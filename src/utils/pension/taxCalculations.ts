
import { getPensionParameters } from '../pensionParameters';

// Tax calculation result interface
export interface TaxCalculationResult {
  grossPay: number;
  pensionContribution: number;
  employerContribution: number;
  totalContribution: number;
  grossPayAfterPension: number;
  incomeTax: number;
  nationalInsurance: number;
  netPay: number;
}

// Re-export the UnifiedBUOMCalculations type from unifiedBuomCalculations for compatibility
export type { UnifiedBUOMCalculations } from './unifiedBuomCalculations';

/**
 * Calculate UK tax using Parameters - replaces all hardcoded tax calculations
 */
export function calculateUKTax(monthlyGross: number): TaxCalculationResult {
  const params = getPensionParameters();
  
  // Step 1: Calculate pension contributions using Parameters
  const pensionableEarnings = monthlyGross * params.autoEnrollmentPensionablePayRate;
  const employeePensionContribution = pensionableEarnings * params.autoEnrollmentEmployeeRate;
  const employerPensionContribution = pensionableEarnings * params.autoEnrollmentEmployerRate;
  const totalPensionContribution = employeePensionContribution + employerPensionContribution;
  
  // Step 2: Calculate gross pay after pension deduction (Net Pay Arrangement)
  const grossPayAfterPension = monthlyGross - employeePensionContribution;
  
  // Step 3: Calculate annual values for income tax (tax is calculated annually)
  const annualGrossAfterPension = grossPayAfterPension * 12;
  
  // Step 4: Calculate income tax using Parameters
  let annualIncomeTax = 0;
  let remainingIncome = annualGrossAfterPension;
  
  // Personal allowance (0% tax)
  if (remainingIncome > params.personalAllowance) {
    remainingIncome -= params.personalAllowance;
    
    // Basic rate band
    const basicRateTaxable = Math.min(remainingIncome, params.basicRateBand - params.personalAllowance);
    if (basicRateTaxable > 0) {
      annualIncomeTax += basicRateTaxable * params.basicRateIncomeTax;
      remainingIncome -= basicRateTaxable;
    }
    
    // Higher rate band
    if (remainingIncome > 0) {
      const higherRateTaxable = Math.min(remainingIncome, params.higherRateBand - params.basicRateBand);
      if (higherRateTaxable > 0) {
        annualIncomeTax += higherRateTaxable * params.higherRateIncomeTax;
        remainingIncome -= higherRateTaxable;
      }
      
      // Additional rate band
      if (remainingIncome > 0) {
        annualIncomeTax += remainingIncome * params.additionalRateIncomeTax;
      }
    }
  }
  
  // Step 5: Calculate National Insurance using Parameters
  let monthlyNI = 0;
  let remainingMonthlyIncome = grossPayAfterPension;
  
  // Below primary threshold (0% NI)
  if (remainingMonthlyIncome > params.niPrimaryThreshold) {
    remainingMonthlyIncome -= params.niPrimaryThreshold;
    
    // Primary threshold to upper earnings limit
    const basicNITaxable = Math.min(remainingMonthlyIncome, params.niUpperEarningsLimit - params.niPrimaryThreshold);
    if (basicNITaxable > 0) {
      monthlyNI += basicNITaxable * params.niBasicRate;
      remainingMonthlyIncome -= basicNITaxable;
    }
    
    // Above upper earnings limit
    if (remainingMonthlyIncome > 0) {
      monthlyNI += remainingMonthlyIncome * params.niReducedRate;
    }
  }
  
  const monthlyIncomeTax = annualIncomeTax / 12;
  const monthlyNetPay = grossPayAfterPension - monthlyIncomeTax - monthlyNI;
  
  return {
    grossPay: monthlyGross,
    pensionContribution: employeePensionContribution,
    employerContribution: employerPensionContribution,
    totalContribution: totalPensionContribution,
    grossPayAfterPension: grossPayAfterPension,
    incomeTax: monthlyIncomeTax,
    nationalInsurance: monthlyNI,
    netPay: monthlyNetPay
  };
}

/**
 * Calculate affordability metrics using Parameters
 */
export function calculateAffordability(annualSalary: number, monthlyFundingCost: number): {
  isAffordable: boolean;
  affordabilityPercentage: number;
  buomCost: number;
  buomAffordabilityPercentage: number;
  taxResult: TaxCalculationResult;
} {
  const params = getPensionParameters();
  const monthlySalary = annualSalary / 12;
  const taxResult = calculateUKTax(monthlySalary);
  
  const affordabilityPercentage = monthlyFundingCost / taxResult.netPay * 100;
  const isAffordable = affordabilityPercentage <= (params.affordabilityThreshold * 100);
  
  const buomCost = monthlyFundingCost * params.buomDiscountRate;
  const buomAffordabilityPercentage = buomCost / taxResult.netPay * 100;
  
  return {
    isAffordable,
    affordabilityPercentage,
    buomCost,
    buomAffordabilityPercentage,
    taxResult
  };
}
