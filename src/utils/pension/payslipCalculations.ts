
import { PayslipComparison, PayslipDetails } from './buomTypes';
import { calculateEnhancedTax, EmploymentDetails } from './enhancedTaxCalculations';

export const calculatePayslipComparison = (
  annualSalary: number,
  employmentDetails?: EmploymentDetails
): PayslipComparison => {
  const monthlyGross = annualSalary / 12;
  
  // Default employment details if not provided
  const defaultEmploymentDetails: EmploymentDetails = {
    isDirector: false,
    hasControllingShares: false,
    directorNicElection: 'annual',
    payeTaxCode: '1257L'
  };
  
  const empDetails = employmentDetails || defaultEmploymentDetails;
  
  // Before APF: With Auto Enrollment pension contribution (Net Pay Arrangement)
  const beforeAPFTax = calculateEnhancedTax(monthlyGross, empDetails, 0.05); // 5% AE rate
  const beforeAPF: PayslipDetails = {
    grossPay: beforeAPFTax.grossPay,
    pensionContribution: beforeAPFTax.pensionContribution,
    employerContribution: beforeAPFTax.employerContribution,
    totalContribution: beforeAPFTax.totalContribution,
    grossPayAfterPension: beforeAPFTax.grossPayAfterPension,
    incomeTax: beforeAPFTax.incomeTax,
    nationalInsurance: beforeAPFTax.nationalInsurance,
    netPay: beforeAPFTax.netPay
  };
  
  // During APF: Without Auto Enrollment (pension contribution = 0)
  const duringAPFTax = calculateEnhancedTax(monthlyGross, empDetails, 0); // No AE during APF
  const duringAPF: PayslipDetails = {
    grossPay: duringAPFTax.grossPay,
    pensionContribution: duringAPFTax.pensionContribution,
    employerContribution: duringAPFTax.employerContribution,
    totalContribution: duringAPFTax.totalContribution,
    grossPayAfterPension: duringAPFTax.grossPayAfterPension,
    incomeTax: duringAPFTax.incomeTax,
    nationalInsurance: duringAPFTax.nationalInsurance,
    netPay: duringAPFTax.netPay
  };
  
  return {
    beforeAPF,
    duringAPF,
    difference: {
      pensionSavings: beforeAPF.pensionContribution,
      netPayIncrease: duringAPF.netPay - beforeAPF.netPay,
      availableForISA: beforeAPF.pensionContribution // This amount becomes available for ISA
    }
  };
};
