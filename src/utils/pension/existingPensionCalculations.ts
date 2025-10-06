
import { compoundingCalculator } from './compoundingUtils';
import { getAutoEnrollmentRates } from './salaryCalculations';
import { calculateDynamicAEContributions } from './aeContributionCalculations';

// Calculate existing pension fund value and contributions based on CORRECT backwards methodology
export const calculateExistingPensionValue = (annualSalary: number, currentAge: number): { fundValue: number; totalContributions: number } => {
  // Minimum age for any pension contributions is 21 years
  if (currentAge <= 21) return { fundValue: 0, totalContributions: 0 };
  
  const aeContributionRate = getAutoEnrollmentRates().totalPercentage / 100;
  const yearsOfContributions = currentAge - 21;
  
  // FIXED: Calculate starting salary when user was 21 (working backwards from current salary)
  const startingSalaryAt21 = annualSalary / Math.pow(1 + compoundingCalculator.annualSalaryInflation, yearsOfContributions);
  
  let totalPot = 0;
  let totalContributions = 0;
  
  console.log(`=== CORRECTED EXISTING PENSION CALCULATION (AGE: ${currentAge}) ===`);
  console.log(`Current salary: £${annualSalary.toLocaleString()}`);
  console.log(`Starting salary at age 21: £${startingSalaryAt21.toLocaleString()}`);
  console.log(`Years of contributions: ${yearsOfContributions}`);
  
  // Calculate year-by-year contributions with proper inflation and growth
  for (let year = 0; year < yearsOfContributions; year++) {
    // Calculate salary for this specific year (inflating from starting salary)
    const yearSalary = startingSalaryAt21 * Math.pow(1 + compoundingCalculator.annualSalaryInflation, year);
    
    // Calculate contribution for that year (8% of 85% pensionable pay)
    const yearContribution = yearSalary * aeContributionRate * 0.85; // Apply pensionable pay factor
    totalContributions += yearContribution;
    
    // Apply compound growth for remaining years until today
    const yearsOfGrowth = yearsOfContributions - year - 1;
    const monthsOfGrowth = yearsOfGrowth * 12;
    
    if (monthsOfGrowth > 0) {
      const grownContribution = compoundingCalculator.compoundMonthly(yearContribution, monthsOfGrowth);
      totalPot += grownContribution;
    } else {
      totalPot += yearContribution;
    }
    
    if (year === 0) {
      console.log(`First year (age 21) salary: £${yearSalary.toLocaleString()}, contribution: £${yearContribution.toLocaleString()}`);
    }
  }
  
  console.log(`Total contributions over ${yearsOfContributions} years: £${totalContributions.toLocaleString()}`);
  console.log(`Total fund value with growth: £${totalPot.toLocaleString()}`);
  console.log(`Contribution to growth ratio: ${((totalContributions / totalPot) * 100).toFixed(1)}:${((1 - totalContributions / totalPot) * 100).toFixed(1)}`);
  
  return { 
    fundValue: Math.round(totalPot), 
    totalContributions: Math.round(totalContributions) 
  };
};

// Calculate projected pension pot at retirement using DYNAMIC calculations
export const calculateProjectedPensionPot = (
  annualSalary: number,
  yearsUntilPension: number,
  existingPensionValue: number = 0,
  currentAge: number
): number => {
  if (yearsUntilPension <= 0) return existingPensionValue;
  
  // Use the corrected existing pension value calculation
  const { fundValue: correctedExistingValue } = calculateExistingPensionValue(annualSalary, currentAge);
  
  // Equation 1: Existing pension value grown to retirement
  const monthsUntilPension = yearsUntilPension * 12;
  const existingPensionAtRetirement = compoundingCalculator.compoundMonthly(correctedExistingValue, monthsUntilPension);
  
  // Equation 2: DYNAMIC AE contributions based on actual salary
  const { totalFutureValue: dynamicAEValue } = calculateDynamicAEContributions(annualSalary, yearsUntilPension);
  
  console.log(`=== PROJECTED PENSION POT (AGE: ${currentAge}) ===`);
  console.log(`Corrected existing pension at retirement: £${existingPensionAtRetirement.toLocaleString()}`);
  console.log(`Future AE contributions value: £${dynamicAEValue.toLocaleString()}`);
  console.log(`Total projected: £${(existingPensionAtRetirement + dynamicAEValue).toLocaleString()}`);
  
  return Math.round(existingPensionAtRetirement + dynamicAEValue);
};
