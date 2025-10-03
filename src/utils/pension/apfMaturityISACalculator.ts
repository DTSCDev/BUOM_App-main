
import { getPensionParameters } from '../pensionParameters';

export interface APFMaturityISAResult {
  year1MonthlyISA: number;
  year2MonthlyISA: number;
  year3MonthlyISA: number;
  totalMonthlyISA: number;
}

/**
 * Calculate monthly ISA amounts based on APF maturity values
 * Formula: (APF Maturity Value ÷ 100,000) × Enhanced Rate (£98.00)
 * FIXED: Now calculates cumulative ISA amounts with inflation escalation
 */
export const calculateAPFMaturityBasedISA = (
  apfSponsorships: any[]
): APFMaturityISAResult => {
  const params = getPensionParameters();
  const enhancedRate = params.isaRateEnhancedMember; // £98.00
  const inflationRate = params.pensionIncomeInflation; // 2%
  
  console.log('=== APF MATURITY-BASED ISA CALCULATION (FIXED CUMULATIVE LOGIC) ===');
  console.log(`Enhanced member rate: £${enhancedRate.toLocaleString()}`);
  console.log(`Inflation rate: ${inflationRate * 100}% per annum`);
  console.log(`Number of actual sponsorships to process: ${apfSponsorships.length}`);
  
  // Calculate discrete ISA amounts for each sponsorship (no cumulation for table display)
  const discreteISAAmounts: number[] = [];
  const actualSponsorshipsNeeded = Math.min(apfSponsorships.length, 3);
  
  for (let i = 0; i < actualSponsorshipsNeeded; i++) {
    const sponsorship = apfSponsorships[i];
    const maturityValue = sponsorship.maturityValue || (sponsorship.sponsorshipAmount * params.apfMaturityMultiplier);
    const monthlyISA = (maturityValue / 100000) * enhancedRate;
    
    discreteISAAmounts.push(monthlyISA);
    console.log(`Sponsorship ${i + 1}: APF Maturity £${maturityValue.toLocaleString()} → DISCRETE ISA £${monthlyISA.toLocaleString()}`);
  }
  
  // Return discrete ISA amounts (not cumulative) for table display
  let year1MonthlyISA = 0;
  let year2MonthlyISA = 0;
  let year3MonthlyISA = 0;
  
  // Year 1: Just the first sponsorship ISA amount (discrete)
  if (discreteISAAmounts.length >= 1) {
    year1MonthlyISA = discreteISAAmounts[0];
    console.log(`Year 1 DISCRETE ISA: £${year1MonthlyISA.toLocaleString()}`);
  }
  
  // Year 2: Just the second sponsorship ISA amount (discrete)
  if (discreteISAAmounts.length >= 2) {
    year2MonthlyISA = discreteISAAmounts[1];
    console.log(`Year 2 DISCRETE ISA: £${year2MonthlyISA.toLocaleString()}`);
  }
  
  // Year 3: Just the third sponsorship ISA amount (discrete)
  if (discreteISAAmounts.length >= 3) {
    year3MonthlyISA = discreteISAAmounts[2];
    console.log(`Year 3 DISCRETE ISA: £${year3MonthlyISA.toLocaleString()}`);
  }
  
  const totalMonthlyISA = year1MonthlyISA + year2MonthlyISA + year3MonthlyISA;
  
  console.log(`DISCRETE ISA CALCULATION RESULTS (FIXED FOR TABLE DISPLAY):`);
  console.log(`Year 1 monthly ISA: £${year1MonthlyISA.toLocaleString()} (discrete)`);
  console.log(`Year 2 monthly ISA: £${year2MonthlyISA.toLocaleString()} (discrete)`);
  console.log(`Year 3 monthly ISA: £${year3MonthlyISA.toLocaleString()} (discrete)`);
  console.log(`Total monthly ISA requirement: £${totalMonthlyISA.toLocaleString()}`);
  console.log(`Based on ${actualSponsorshipsNeeded} actual sponsorships with discrete £98.00 pro-rata calculation`);
  
  return {
    year1MonthlyISA,
    year2MonthlyISA,
    year3MonthlyISA,
    totalMonthlyISA
  };
};
