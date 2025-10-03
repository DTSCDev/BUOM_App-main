// Free Calculator - Standalone AE Contribution Calculations
// UPDATED: Now uses monthly compounding throughout for actuarial accuracy

// Enhanced growth parameters for Free Calculator with monthly compounding
const FREE_CALC_PARAMS = {
  annualGrowthRate: 0.05, // 5% annual gross growth rate (4.5% net after 0.5% charges)
  annualProviderCharges: 0.005, // 0.5% annual provider charges
  annualSalaryInflation: 0.02, // 2% salary inflation
  annualPensionInflation: 0.02, // 2% pension inflation
  employeeContributionRate: 0.05, // 5% employee
  employerContributionRate: 0.03, // 3% employer
  pensionablePayPercentage: 0.85, // 85% of salary is pensionable
  currentStatePensionWeekly: 230.25 // £230.25 per week (2025)
};

// Calculate monthly growth rates (actuarially correct)
const getMonthlyGrowthRate = (): number => {
  return Math.pow(1 + FREE_CALC_PARAMS.annualGrowthRate, 1/12) - 1;
};

const getMonthlyProviderCharges = (): number => {
  return Math.pow(1 + FREE_CALC_PARAMS.annualProviderCharges, 1/12) - 1;
};

const getNetMonthlyGrowthRate = (): number => {
  return getMonthlyGrowthRate() - getMonthlyProviderCharges();
};

// Monthly compound growth with net rates (fees deducted)
const monthlyCompoundGrowth = (principal: number, months: number): number => {
  const netMonthlyRate = getNetMonthlyGrowthRate();
  return principal * Math.pow(1 + netMonthlyRate, months);
};

// Calculate annual AE contribution from salary
const calculateSimpleAnnualContribution = (annualSalary: number): number => {
  const pensionableEarnings = annualSalary * FREE_CALC_PARAMS.pensionablePayPercentage;
  const totalRate = FREE_CALC_PARAMS.employeeContributionRate + FREE_CALC_PARAMS.employerContributionRate;
  return pensionableEarnings * totalRate;
};

// Calculate historical contributions with proper monthly compounding (age 21 to current age)
const calculateMonthlyHistoricalContributions = (annualSalary: number, currentAge: number): {
  totalContributions: number;
  currentValue: number;
} => {
  
  const historicalYears = Math.max(0, currentAge - 21);
  
  if (historicalYears <= 0) return { totalContributions: 0, currentValue: 0 };
  
  // STEP 1: Deflate current salary back to age 21
  const salaryAtAge21 = annualSalary / Math.pow(1 + FREE_CALC_PARAMS.annualSalaryInflation, historicalYears);
  
  // STEP 2: Calculate MONTHLY contributions (252 contributions) with monthly compounding
  const totalMonths = historicalYears * 12;
  const annualContributionAtAge21 = calculateSimpleAnnualContribution(salaryAtAge21);
  const monthlyContributionAtAge21 = annualContributionAtAge21 / 12;
  const monthlySalaryInflation = Math.pow(1 + FREE_CALC_PARAMS.annualSalaryInflation, 1/12) - 1;
  
  let totalContributions = 0;
  let totalCurrentValue = 0;
  
  // STEP 3: Calculate each monthly contribution with inflation and monthly compounding
  for (let month = 0; month < totalMonths; month++) {
    // STEP 4: Apply monthly salary inflation to contribution
    const inflatedContribution = monthlyContributionAtAge21 * Math.pow(1 + monthlySalaryInflation, month);
    totalContributions += inflatedContribution;
    
    // STEP 5: Apply monthly compound growth for remaining months until today
    const monthsOfGrowth = totalMonths - month - 1;
    
    if (monthsOfGrowth > 0) {
      const grownContribution = monthlyCompoundGrowth(inflatedContribution, monthsOfGrowth);
      totalCurrentValue += grownContribution;
    } else {
      totalCurrentValue += inflatedContribution;
    }
  }
  
  const result = {
    totalContributions: Math.round(totalContributions),
    currentValue: Math.round(totalCurrentValue)
  };
  
  console.log(`=== FINAL EXISTING PENSION CALCULATION RESULT ===`);
  console.log(`Total historical contributions: £${result.totalContributions.toLocaleString()}`);
  console.log(`Current existing pension value: £${result.currentValue.toLocaleString()}`);
  console.log(`Expected value: £109,233`);
  console.log(`Difference: £${(result.currentValue - 109233).toLocaleString()}`);
  console.log(`Parameters used:`);
  console.log(`- Pensionable pay: ${FREE_CALC_PARAMS.pensionablePayPercentage * 100}%`);
  console.log(`- Employee rate: ${FREE_CALC_PARAMS.employeeContributionRate * 100}%`);
  console.log(`- Employer rate: ${FREE_CALC_PARAMS.employerContributionRate * 100}%`);
  console.log(`- Total rate: ${(FREE_CALC_PARAMS.employeeContributionRate + FREE_CALC_PARAMS.employerContributionRate) * 100}%`);
  console.log(`- Annual growth: ${FREE_CALC_PARAMS.annualGrowthRate * 100}%`);
  console.log(`- Annual charges: ${FREE_CALC_PARAMS.annualProviderCharges * 100}%`);
  console.log(`- Salary inflation: ${FREE_CALC_PARAMS.annualSalaryInflation * 100}%`);
  
  return result;
};

// Calculate future AE contributions with monthly compounding
const calculateMonthlyFutureContributions = (annualSalary: number, yearsUntilPension: number): {
  totalContributions: number;
  totalFutureValue: number;
} => {
  if (yearsUntilPension <= 0) return { totalContributions: 0, totalFutureValue: 0 };
  
  const annualContribution = calculateSimpleAnnualContribution(annualSalary);
  const monthlyContribution = annualContribution / 12;
  const totalMonths = yearsUntilPension * 12;
  const monthlySalaryInflation = Math.pow(1 + FREE_CALC_PARAMS.annualSalaryInflation, 1/12) - 1;
  
  let totalContributions = 0;
  let totalFutureValue = 0;
  
  // Calculate each monthly contribution with inflation and monthly compounding
  for (let month = 1; month <= totalMonths; month++) {
    // Apply salary inflation to contribution (monthly compounding)
    const inflatedContribution = monthlyContribution * Math.pow(1 + monthlySalaryInflation, month - 1);
    totalContributions += inflatedContribution;
    
    // Calculate growth from contribution date to retirement (monthly compounding)
    const monthsOfGrowth = totalMonths - month;
    if (monthsOfGrowth > 0) {
      const contributionFutureValue = monthlyCompoundGrowth(inflatedContribution, monthsOfGrowth);
      totalFutureValue += contributionFutureValue;
    } else {
      totalFutureValue += inflatedContribution;
    }
  }
  
  return {
    totalContributions: Math.round(totalContributions),
    totalFutureValue: Math.round(totalFutureValue)
  };
};

// Main function: Calculate Total AE Contributions for Free Calculator (Monthly Compounding)
export const calculateFreeTotalAEContributions = (
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
  
  // Historical contributions with monthly compounding
  const historicalCalc = calculateMonthlyHistoricalContributions(annualSalary, currentAge);
  const historicalContributions = historicalCalc.totalContributions;
  
  // Future contributions with monthly compounding
  const futureCalc = calculateMonthlyFutureContributions(annualSalary, yearsUntilPension);
  const futureContributions = futureCalc.totalContributions;
  
  // Total contributions
  const totalContributions = historicalContributions + futureContributions;
  
  return {
    historicalContributions,
    futureContributions,
    totalContributions,
    futureValue: futureCalc.totalFutureValue,
    historicalYears,
    futureYears
  };
};

// Calculate existing pension value with monthly compounding
export const calculateFreeExistingPensionValue = (annualSalary: number, currentAge: number): {
  totalContributions: number;
  currentValue: number;
} => {
  
  try {
    // Use the new monthly compounding historical calculation
    const result = calculateMonthlyHistoricalContributions(annualSalary, currentAge);
    return result;
  } catch (error) {
    console.error('🔥🔥🔥 ERROR in calculateFreeExistingPensionValue 🔥🔥🔥', error);
    return { totalContributions: 0, currentValue: 0 };
  }
};

// Calculate state pension values with monthly compounding
export const getFreeStatePensionToday = (): number => {
  return FREE_CALC_PARAMS.currentStatePensionWeekly * 52; // Annual amount
};

export const getFreeStatePensionAtRetirement = (yearsUntilRetirement: number): number => {
  const currentAnnual = getFreeStatePensionToday();
  // Use annual compounding for state pension inflation (standard practice)
  return Math.round(currentAnnual * Math.pow(1 + FREE_CALC_PARAMS.annualPensionInflation, yearsUntilRetirement));
};

// Calculate age from date of birth
export const calculateFreeAge = (dateOfBirth: string): number => {
  const today = new Date();
  
  // Parse date safely - handle both YYYY-MM-DD and DD/MM/YYYY formats
  let birthDate: Date;
  
  if (dateOfBirth.includes('/')) {
    // DD/MM/YYYY format
    const parts = dateOfBirth.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      
      // Validate date parts
      if (isNaN(day) || isNaN(month) || isNaN(year) || 
          day < 1 || day > 31 || month < 0 || month > 11 || 
          year < 1900 || year > today.getFullYear()) {
        return 42; // Default age fallback
      }
      
      birthDate = new Date(year, month, day);
    } else {
      return 42; // Default age fallback
    }
  } else {
    // Assume YYYY-MM-DD format
    birthDate = new Date(dateOfBirth);
  }
  
  // Verify the date was created correctly
  if (isNaN(birthDate.getTime())) {
    return 42; // Default age fallback
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Export parameters for reference (updated with net rates)
export const freeCalculatorParams = {
  ...FREE_CALC_PARAMS,
  netAnnualGrowthRate: (1 + getNetMonthlyGrowthRate()) ** 12 - 1, // Effective annual rate after fees
  monthlyGrowthRate: getMonthlyGrowthRate(),
  monthlyProviderCharges: getMonthlyProviderCharges(),
  netMonthlyGrowthRate: getNetMonthlyGrowthRate()
};

// Alias export for compatibility with existing imports
export const calculateTotalAEContributions = calculateFreeTotalAEContributions;