
import { calculateIncomeTax } from './enhancedTax/incomeTaxCalculator';
import { calculateEmployeeNIC, calculateDirectorNIC } from './enhancedTax/nicCalculator';
import { validateSalaryExchangeConstraints } from './enhancedTax/salaryExchangeValidator';
import { MIN_NIC_MONTHLY } from './enhancedTax/taxThresholds';

// Re-export from the new modules
export { parsePAYETaxCode } from './enhancedTax/taxCodeParser';
export { validateSalaryExchangeConstraints } from './enhancedTax/salaryExchangeValidator';

export interface EnhancedTaxResult {
  grossPay: number;
  pensionContribution: number;
  employerContribution: number;
  totalContribution: number;
  grossPayAfterPension: number;
  incomeTax: number;
  nationalInsurance: number;
  netPay: number;
  employmentType: 'paye_employee' | 'director';
  payeTaxCode: string;
  nicCalculationMethod: 'monthly' | 'annual';
  hasNicProtection: boolean;
  minNicContribution: number;
}

export interface EmploymentDetails {
  isDirector: boolean;
  hasControllingShares: boolean;
  directorNicElection: 'annual' | 'monthly';
  payeTaxCode: string;
}

export function calculateEnhancedTax(
  monthlyGross: number,
  employmentDetails: EmploymentDetails,
  pensionContributionRate: number = 0.05 // 5% default AE rate
): EnhancedTaxResult {
  const annualGross = monthlyGross * 12;
  const pensionContribution = monthlyGross * pensionContributionRate;
  const employerContribution = pensionContribution * 0.6; // 3% employer match
  const totalContribution = pensionContribution + employerContribution;
  const grossPayAfterPension = monthlyGross - pensionContribution;

  // Calculate income tax
  const annualIncomeTax = calculateIncomeTax(annualGross, pensionContribution, employmentDetails.payeTaxCode);
  const monthlyIncomeTax = annualIncomeTax / 12;

  // Calculate NIC based on employment type
  let monthlyNIC: number;
  let nicCalculationMethod: 'monthly' | 'annual';
  let hasNicProtection = false;

  if (employmentDetails.isDirector) {
    const annualNIC = calculateDirectorNIC(
      annualGross, 
      pensionContribution * 12, 
      employmentDetails.hasControllingShares,
      employmentDetails.directorNicElection
    );
    monthlyNIC = annualNIC / 12;
    nicCalculationMethod = 'annual';
    hasNicProtection = employmentDetails.hasControllingShares;
  } else {
    monthlyNIC = calculateEmployeeNIC(monthlyGross, pensionContribution);
    nicCalculationMethod = 'monthly';
  }

  const netPay = grossPayAfterPension - monthlyIncomeTax - monthlyNIC;

  return {
    grossPay: monthlyGross,
    pensionContribution,
    employerContribution,
    totalContribution,
    grossPayAfterPension,
    incomeTax: monthlyIncomeTax,
    nationalInsurance: monthlyNIC,
    netPay,
    employmentType: employmentDetails.isDirector ? 'director' : 'paye_employee',
    payeTaxCode: employmentDetails.payeTaxCode,
    nicCalculationMethod,
    hasNicProtection,
    minNicContribution: MIN_NIC_MONTHLY
  };
}
