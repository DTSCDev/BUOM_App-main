
import { usePayslipCalculations } from '@/hooks/usePayslipCalculations';
import { APFSponsorshipBreakdown } from './buomTypes';

export interface DynamicINBLData {
  inblAmounts: number[];
  npgAmounts: number[];
  nrsrFees: number[];
  sponsorshipCount: number;
}

export interface DynamicINBLBalanceResult {
  inblBalances: number[];
  totalINBLBalance: number;
}

export const calculateDynamicINBLData = (
  annualSalary: number,
  sponsorships: APFSponsorshipBreakdown[]
): DynamicINBLData => {
  const { calculatePayslipComparison } = usePayslipCalculations();
  
  console.log(`=== DYNAMIC INBL CALCULATION (${sponsorships.length} sponsorships) ===`);
  
  const inblAmounts: number[] = [];
  const npgAmounts: number[] = [];
  const nrsrFees: number[] = [];

  // Calculate INBL amounts based on ALL actual sponsorship data (not hardcoded 3)
  sponsorships.forEach((sponsorship, index) => {
    const payslipComparison = calculatePayslipComparison(annualSalary, sponsorship.sponsorshipAmount);
    
    // Get annual amounts (payslip comparison returns monthly values)
    const annualNPG = payslipComparison.npgAmount * 12;
    const annualNRSR = payslipComparison.nrsrFee * 12;
    const annualINBL = payslipComparison.totalINBLPrincipal * 12;
    
    inblAmounts.push(annualINBL);
    npgAmounts.push(annualNPG);
    nrsrFees.push(annualNRSR);
    
    console.log(`Year ${index + 1}: INBL £${annualINBL.toLocaleString()}, NPG £${annualNPG.toLocaleString()}, NRSR £${annualNRSR.toLocaleString()}`);
  });

  console.log(`Dynamic INBL calculation complete for ${sponsorships.length} years`);

  return {
    inblAmounts,
    npgAmounts,
    nrsrFees,
    sponsorshipCount: sponsorships.length
  };
};

export const calculateDynamicINBLBalances = (
  month: number,
  inblData: DynamicINBLData
): DynamicINBLBalanceResult => {
  const inblBalances: number[] = [];
  
  // Dynamic calculation for any number of sponsorship years
  for (let yearIndex = 0; yearIndex < inblData.sponsorshipCount; yearIndex++) {
    const startMonth = 1 + (yearIndex * 12); // Year 1: month 1, Year 2: month 13, etc.
    const endMonth = 241 + (yearIndex * 12); // Year 1: repaid at 241, Year 2: at 253, etc.
    
    let currentINBL = 0;
    
    // INBL is drawn from start month and repaid at end month
    if (month >= startMonth && month <= endMonth) {
      currentINBL = inblData.inblAmounts[yearIndex] || 0;
    }
    
    inblBalances.push(currentINBL);
  }
  
  const totalINBLBalance = inblBalances.reduce((sum, balance) => sum + balance, 0);
  
  return {
    inblBalances,
    totalINBLBalance
  };
};
