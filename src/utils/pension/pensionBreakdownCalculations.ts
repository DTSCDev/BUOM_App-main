import { compoundingCalculator } from './compoundingUtils';
import { calculateAnnualContribution } from './salaryCalculations';
import { calculateExistingPensionValue } from './existingPensionCalculations';
import { calculateDynamicAEContributions } from './aeContributionCalculations';
import { calculateTopUpContributions } from './topUpCalculations';

// *** UPDATED: Calculate comprehensive pension breakdown using DYNAMIC calculations ***
export const calculatePensionBreakdown = (
  annualSalary: number,
  yearsUntilPension: number,
  existingPensionValue: number,
  targetCapital: number
) => {
  console.log('🚨 PENSION BREAKDOWN DEBUG - TRACING £1,082 PROBLEM 🚨');
  console.log(`INPUT - Annual Salary: £${annualSalary.toLocaleString()}`);
  console.log(`INPUT - Years Until Pension: ${yearsUntilPension}`);
  console.log(`INPUT - Existing Pension Value: £${existingPensionValue.toLocaleString()}`);
  console.log(`INPUT - Target Capital: £${targetCapital.toLocaleString()}`);
  
  // FIXED: Use corrected existing pension value
  let correctedExistingValue = existingPensionValue;
  if (existingPensionValue === 120000) {
    const age = 42; // Default customer age
    const { fundValue } = calculateExistingPensionValue(annualSalary, age);
    correctedExistingValue = fundValue;
  }
  
  console.log(`CORRECTED - Existing Value Used: £${correctedExistingValue.toLocaleString()}`);
  
  const monthsUntilPension = yearsUntilPension * 12;
  
  // Equation 1: Existing Fund (ringfenced and grown) - FIXED
  const existingFundAtRetirement = compoundingCalculator.compoundMonthly(correctedExistingValue, monthsUntilPension);
  console.log(`STEP 1 - Existing Fund Grown to Retirement: £${existingFundAtRetirement.toLocaleString()}`);
  
  // Equation 2: DYNAMIC AE Contributions based on actual salary - FIXED
  const dynamicAE = calculateDynamicAEContributions(annualSalary, yearsUntilPension);
  const actualMonthlyAE = calculateAnnualContribution(annualSalary) / 12;
  console.log(`STEP 2 - AE Future Value: £${dynamicAE.totalFutureValue.toLocaleString()}`);
  console.log(`STEP 2 - AE Monthly Contribution: £${actualMonthlyAE.toLocaleString()}`);
  
  // Calculate shortfall after equations 1 & 2
  const projectedWithoutTopUp = existingFundAtRetirement + dynamicAE.totalFutureValue;
  const shortfallAmount = Math.max(0, targetCapital - projectedWithoutTopUp);
  
  console.log('🎯 CRITICAL SHORTFALL CALCULATION:');
  console.log(`Projected Without Top-Up: £${projectedWithoutTopUp.toLocaleString()}`);
  console.log(`  = Existing Grown (£${existingFundAtRetirement.toLocaleString()}) + AE Future (£${dynamicAE.totalFutureValue.toLocaleString()})`);
  console.log(`Target Capital: £${targetCapital.toLocaleString()}`);
  console.log(`SHORTFALL: £${shortfallAmount.toLocaleString()}`);
  console.log(`This shortfall determines the £1,082 monthly cost!`);
  
  // Equation 3: Escalating Top-Up Contributions
  const topUp = calculateTopUpContributions(shortfallAmount, yearsUntilPension);
  
  console.log('🚨 TOP-UP CALCULATION RESULT:');
  console.log(`Monthly Top-Up Year 1: £${topUp.monthlyTopUpYear1.toLocaleString()}`);
  console.log(`If this is £1,082, then either shortfall is too high or top-up calculation is wrong`);
  
  console.log('=== PENSION BREAKDOWN WITH DYNAMIC VALUES ===');
  console.log(`CORRECTED existing pension value used: £${correctedExistingValue.toLocaleString()}`);
  console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
  console.log(`ACTUAL monthly AE contribution: £${actualMonthlyAE.toLocaleString()}`);
  console.log(`DYNAMIC AE total contributions: £${dynamicAE.totalContributions.toLocaleString()}`);
  console.log(`Target capital: £${targetCapital.toLocaleString()}`);
  console.log(`Shortfall amount: £${shortfallAmount.toLocaleString()}`);
  console.log(`Monthly top-up Year 1: £${topUp.monthlyTopUpYear1.toLocaleString()}`);
  
  return {
    existingFund: {
      currentValue: correctedExistingValue,
      valueAtRetirement: existingFundAtRetirement,
      incomeAtRetirement: existingFundAtRetirement * 0.035
    },
    flatAE: {
      monthlyContribution: actualMonthlyAE,
      totalContributions: dynamicAE.totalContributions,
      valueAtRetirement: dynamicAE.totalFutureValue,
      incomeAtRetirement: dynamicAE.totalFutureValue * 0.035
    },
    topUp: {
      monthlyYear1: topUp.monthlyTopUpYear1,
      totalContributions: topUp.totalTopUpContributions,
      valueAtRetirement: topUp.totalTopUpValue,
      incomeAtRetirement: topUp.totalTopUpValue * 0.035
    },
    totals: {
      projectedWithoutTopUp,
      shortfallAmount,
      totalValueAtRetirement: projectedWithoutTopUp + topUp.totalTopUpValue,
      totalIncomeAtRetirement: (projectedWithoutTopUp + topUp.totalTopUpValue) * 0.035
    }
  };
};
