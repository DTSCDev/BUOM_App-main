
import { calculateUKTax } from "@/utils/pension/taxCalculations";

export interface PayslipDetails {
  grossPay: number;
  pensionContribution: number;
  employerContribution: number;
  totalContribution: number;
  grossPayAfterPension: number;
  incomeTax: number;
  nationalInsurance: number;
  netPay: number;
}

export interface PayslipComparison {
  before: PayslipDetails;
  after: PayslipDetails;
  inblLoanAmount: number;
  netPayDifference: number;
  npgAmount: number; // Net Pay Guarantee - equals net pay lost from salary sacrifice
  nrsrFee: number;
  totalINBLPrincipal: number;
}

export function usePayslipCalculations() {
  const calculatePayslipComparison = (
    annualSalary: number,
    apfContribution: number
  ): PayslipComparison => {
    const monthlySalary = annualSalary / 12;
    const monthlyAPFContribution = apfContribution / 12;
    
    // Before APF: Normal payslip with Auto Enrollment
    const beforeAPF = calculateUKTax(monthlySalary);
    
    // After APF: Salary sacrifice APF contribution (no AE pension)
    // Calculate gross pay after APF salary sacrifice
    const grossPayAfterAPF = monthlySalary - monthlyAPFContribution;
    
    // Calculate tax on reduced gross pay (APF is salary sacrifice, so reduces taxable income)
    const afterAPFBase = calculateUKTax(grossPayAfterAPF);
    
    // Override pension contribution to 0 since APF replaces AE during sponsorship years
    const afterAPF: PayslipDetails = {
      ...afterAPFBase,
      pensionContribution: 0,
      employerContribution: 0,
      totalContribution: 0,
      grossPayAfterPension: grossPayAfterAPF // Already reduced by APF
    };
    
    // NPG (Net Pay Guarantee) - equals net pay lost from salary sacrifice
    const netPayDifference = beforeAPF.netPay - afterAPF.netPay;
    const npgAmount = netPayDifference; // This is the net pay lost that needs to be guaranteed
    
    // FIXED: NRSR Fee calculation - 25% of NPG (20 years × 1.25% p.a.)
    const nrsrFee = npgAmount * 0.25; // 25% of NPG amount
    
    // FIXED: Total INBL Principal = NPG + NRSR Fee
    const totalINBLPrincipal = npgAmount + nrsrFee;
    
    return {
      before: beforeAPF,
      after: afterAPF,
      inblLoanAmount: npgAmount, // Keep this for backward compatibility
      netPayDifference,
      npgAmount, // Net Pay Guarantee - equals net pay lost from salary sacrifice
      nrsrFee, // Now correctly 25% of NPG
      totalINBLPrincipal // Now correctly NPG + NRSR Fee
    };
  };

  return { calculatePayslipComparison };
}
