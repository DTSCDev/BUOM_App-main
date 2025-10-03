// EXACT SPECIFICATION TEST: 5% Gross, 0.5% charges, 2% inflation, 21 years, 252 months
const params = {
  annualGrowthRate: 0.05, // 5% GROSS (as specified)
  annualProviderCharges: 0.005, // 0.5% charges (as specified)
  annualSalaryInflation: 0.02, // 2% inflation (as specified)
  employeeContributionRate: 0.05, // 5% employee
  employerContributionRate: 0.03, // 3% employer
  pensionablePayPercentage: 0.85, // 85% pensionable
  currentSalary: 60000, // £60,000 (as specified)
  currentAge: 42,
  startAge: 21
};

const historicalYears = params.currentAge - params.startAge; // 21 years (as specified)
const totalMonths = historicalYears * 12; // 252 months (as specified)

console.log(`=== EXACT SPECIFICATION TEST ===`);
console.log(`Historical years: ${historicalYears}`);
console.log(`Total months: ${totalMonths}`);

// Calculate monthly rates exactly as specified
const grossMonthlyRate = Math.pow(1 + params.annualGrowthRate, 1/12) - 1;
const chargesMonthlyRate = Math.pow(1 + params.annualProviderCharges, 1/12) - 1;
const netMonthlyRate = grossMonthlyRate - chargesMonthlyRate;

console.log(`Gross annual rate: ${(params.annualGrowthRate * 100).toFixed(1)}%`);
console.log(`Charges annual rate: ${(params.annualProviderCharges * 100).toFixed(1)}%`);
console.log(`Net annual rate: ${((Math.pow(1 + netMonthlyRate, 12) - 1) * 100).toFixed(2)}%`);
console.log(`Net monthly rate: ${(netMonthlyRate * 100).toFixed(4)}%`);

// REVERSE ENGINEER: £60k salary back 21 years with 2% inflation
const salaryAtAge21 = params.currentSalary / Math.pow(1 + params.annualSalaryInflation, historicalYears);
console.log(`Current salary: £${params.currentSalary.toLocaleString()}`);
console.log(`Salary at age 21 (reverse engineered): £${salaryAtAge21.toFixed(2)}`);

let totalContributions = 0;
let totalCurrentValue = 0;

// TEST 1: ANNUAL CONTRIBUTIONS (current method)
console.log(`\n=== TEST 1: ANNUAL CONTRIBUTIONS ===`);
let totalContributions1 = 0;
let totalCurrentValue1 = 0;

for (let year = 0; year < historicalYears; year++) {
  const salaryInYear = salaryAtAge21 * Math.pow(1 + params.annualSalaryInflation, year);
  const pensionableEarnings = salaryInYear * params.pensionablePayPercentage;
  const totalRate = params.employeeContributionRate + params.employerContributionRate;
  const annualContribution = pensionableEarnings * totalRate;
  
  totalContributions1 += annualContribution;
  
  const yearsOfGrowth = historicalYears - year - 1;
  const monthsOfGrowth = yearsOfGrowth * 12;
  
  if (monthsOfGrowth > 0) {
    const grownContribution = annualContribution * Math.pow(1 + netMonthlyRate, monthsOfGrowth);
    totalCurrentValue1 += grownContribution;
  } else {
    totalCurrentValue1 += annualContribution;
  }
}

console.log(`Annual method: £${Math.round(totalCurrentValue1).toLocaleString()}`);

// TEST 2: MONTHLY CONTRIBUTIONS (252 contributions)
console.log(`\n=== TEST 2: MONTHLY CONTRIBUTIONS (252 contributions) ===`);
let totalContributions2 = 0;
let totalCurrentValue2 = 0;

const monthlySalaryInflation = Math.pow(1 + params.annualSalaryInflation, 1/12) - 1;

for (let month = 0; month < totalMonths; month++) {
  // Calculate salary for this month (escalating monthly)
  const salaryInMonth = salaryAtAge21 * Math.pow(1 + monthlySalaryInflation, month);
  const pensionableEarnings = salaryInMonth * params.pensionablePayPercentage;
  const totalRate = params.employeeContributionRate + params.employerContributionRate;
  const monthlyContribution = (pensionableEarnings * totalRate) / 12;
  
  totalContributions2 += monthlyContribution;
  
  const monthsOfGrowth = totalMonths - month - 1;
  
  if (monthsOfGrowth > 0) {
    const grownContribution = monthlyContribution * Math.pow(1 + netMonthlyRate, monthsOfGrowth);
    totalCurrentValue2 += grownContribution;
  } else {
    totalCurrentValue2 += monthlyContribution;
  }
}

console.log(`Monthly method: £${Math.round(totalCurrentValue2).toLocaleString()}`);

// TEST 3: DIFFERENT GROWTH CALCULATION
console.log(`\n=== TEST 3: DIFFERENT GROWTH TIMING ===`);
let totalContributions3 = 0;
let totalCurrentValue3 = 0;

for (let year = 0; year < historicalYears; year++) {
  const salaryInYear = salaryAtAge21 * Math.pow(1 + params.annualSalaryInflation, year);
  const pensionableEarnings = salaryInYear * params.pensionablePayPercentage;
  const totalRate = params.employeeContributionRate + params.employerContributionRate;
  const annualContribution = pensionableEarnings * totalRate;
  
  totalContributions3 += annualContribution;
  
  // Try: full years of growth (not minus 1)
  const yearsOfGrowth = historicalYears - year;
  const monthsOfGrowth = yearsOfGrowth * 12;
  
  const grownContribution = annualContribution * Math.pow(1 + netMonthlyRate, monthsOfGrowth);
  totalCurrentValue3 += grownContribution;
}

console.log(`Full growth method: £${Math.round(totalCurrentValue3).toLocaleString()}`);

// Set the main values for final output
totalContributions = totalContributions1;
totalCurrentValue = totalCurrentValue1;

console.log(`\n=== FINAL RESULTS WITH EXACT SPECIFICATION ===`);
console.log(`Total historical contributions: £${Math.round(totalContributions).toLocaleString()}`);
console.log(`Current existing fund value: £${Math.round(totalCurrentValue).toLocaleString()}`);
console.log(`Expected value: £109,233`);
console.log(`Difference: £${Math.round(totalCurrentValue - 109233).toLocaleString()}`);

console.log(`\n=== PARAMETERS USED ===`);
console.log(`- Gross annual growth: ${params.annualGrowthRate * 100}%`);
console.log(`- Annual charges: ${params.annualProviderCharges * 100}%`);
console.log(`- Net annual growth: ${((Math.pow(1 + netMonthlyRate, 12) - 1) * 100).toFixed(2)}%`);
console.log(`- Salary inflation: ${params.annualSalaryInflation * 100}%`);
console.log(`- Pensionable pay: ${params.pensionablePayPercentage * 100}%`);
console.log(`- Total contribution rate: ${(params.employeeContributionRate + params.employerContributionRate) * 100}%`);
console.log(`- Historical years: ${historicalYears}`);
console.log(`- Monthly compounding periods: ${totalMonths}`);

// Check if this matches £109,233
if (Math.abs(totalCurrentValue - 109233) < 1000) {
  console.log(`\n✅ SUCCESS: Result is within £1,000 of expected value!`);
} else {
  console.log(`\n❌ MISMATCH: Result differs by £${Math.abs(Math.round(totalCurrentValue - 109233)).toLocaleString()}`);
}