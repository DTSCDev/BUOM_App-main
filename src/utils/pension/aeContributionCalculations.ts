import { compoundingCalculator } from './compoundingUtils';
import { calculateAnnualContribution } from './salaryCalculations';
import { calculateExistingPensionValue } from './existingPensionCalculations';

// *** FIXED: Calculate TOTAL AE contributions with corrected historical methodology ***
export const calculateTotalAEContributions = (
  annualSalary: number,
  currentAge: number,
  yearsUntilPension: number
): { 
  historicalContributions: number;
  futureContributions: number; 
  totalContributions: number; 
  futureValue: number;
  historicalYears: number;
  futureYears: number;
} => {
  
  // Calculate historical period (age 21 to current age)
  const historicalYears = Math.max(0, currentAge - 21);
  const futureYears = yearsUntilPension;
  
  // CORRECTED: Use the fixed existing pension calculation for historical contributions
  const { totalContributions: historicalContributions } = calculateExistingPensionValue(annualSalary, currentAge);
  
  console.log('=== CORRECTED HISTORICAL AE CONTRIBUTIONS ===');
  console.log(`Current salary: £${annualSalary.toLocaleString()}`);
  console.log(`Current age: ${currentAge}`);
  console.log(`Historical years (age 21 to ${currentAge}): ${historicalYears}`);
  console.log(`Historical contributions (corrected): £${historicalContributions.toLocaleString()}`);
  console.log('=== END HISTORICAL CALCULATION ===');
  
  // FUTURE CONTRIBUTIONS (current age to retirement)
  const futureAECalc = calculateDynamicAEContributions(annualSalary, yearsUntilPension);
  const futureContributions = futureAECalc.totalContributions;
  
  // TOTAL CONTRIBUTIONS = Historical + Future
  const totalContributions = historicalContributions + futureContributions;
  
  return {
    historicalContributions,
    futureContributions,
    totalContributions,
    futureValue: futureAECalc.totalFutureValue,
    historicalYears,
    futureYears
  };
};

// *** ACTUAL AE contributions based on real salary and timeline ***
export const calculateDynamicAEContributions = (
  annualSalary: number,
  yearsUntilPension: number
): { totalContributions: number; totalFutureValue: number } => {
  if (yearsUntilPension <= 0) return { totalContributions: 0, totalFutureValue: 0 };
  
  // Calculate ACTUAL monthly AE contribution from salary
  const annualAEContribution = calculateAnnualContribution(annualSalary);
  const monthlyAEContribution = annualAEContribution / 12;
  const totalMonths = yearsUntilPension * 12;
  
  console.log('=== DYNAMIC AE CONTRIBUTIONS (SALARY-BASED) ===');
  console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
  console.log(`Annual AE contribution: £${annualAEContribution.toLocaleString()}`);
  console.log(`Monthly AE contribution: £${monthlyAEContribution.toLocaleString()}`);
  console.log(`Total months until pension: ${totalMonths}`);
  
  // Calculate escalating contributions with salary inflation
  const result = compoundingCalculator.escalatingMonthlyContributions(monthlyAEContribution, totalMonths);
  
  console.log(`Total contributions (with inflation): £${result.totalContributions.toLocaleString()}`);
  console.log(`Future value (with growth): £${result.futureValue.toLocaleString()}`);
  
  return {
    totalContributions: result.totalContributions,
    totalFutureValue: result.futureValue
  };
};

// *** DEPRECATED: Keep old function for backward compatibility but mark as deprecated ***
export const calculateFlatAEContributions = (
  yearsUntilPension: number
): { totalContributions: number; totalFutureValue: number } => {
  console.warn('calculateFlatAEContributions is DEPRECATED due to regulatory compliance. Use calculateDynamicAEContributions instead.');
  
  if (yearsUntilPension <= 0) return { totalContributions: 0, totalFutureValue: 0 };
  
  // FIXED: Use proper growth calculation instead of simple multiplication
  const monthlyAEContribution = 340;
  const totalMonths = 300; // Fixed at exactly 300 months
  
  // Calculate total contributions (flat amount)
  const totalContributions = monthlyAEContribution * totalMonths; // £102,000
  
  // FIXED: Apply proper compound growth using the core compounding function
  let futureValue = 0;
  
  for (let month = 1; month <= totalMonths; month++) {
    // Calculate how many months this contribution will grow
    const monthsOfGrowth = totalMonths - month;
    
    // Apply compound growth to each monthly contribution
    const contributionFutureValue = compoundingCalculator.compoundMonthly(monthlyAEContribution, monthsOfGrowth);
    futureValue += contributionFutureValue;
  }
  
  console.log('=== DEPRECATED FLAT AE CONTRIBUTIONS (HARDCODED) ===');
  console.log(`Monthly contribution: £${monthlyAEContribution}`);
  console.log(`Total months: ${totalMonths}`);
  console.log(`Total contributions: £${totalContributions.toLocaleString()}`);
  console.log(`Future value (with 4.5% growth): £${Math.round(futureValue).toLocaleString()}`);
  
  return {
    totalContributions,
    totalFutureValue: Math.round(futureValue)
  };
};

// *** DEPRECATED: Keep for backward compatibility but mark as deprecated ***
export const calculateFutureAEContributions = (
  annualSalary: number,
  yearsUntilPension: number
): { totalContributions: number; totalFutureValue: number } => {
  console.warn('calculateFutureAEContributions is deprecated. Use calculateDynamicAEContributions instead.');
  return calculateDynamicAEContributions(annualSalary, yearsUntilPension);
};
