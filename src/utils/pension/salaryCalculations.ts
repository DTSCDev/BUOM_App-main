
import { compoundingCalculator } from './compoundingUtils';

// Auto Enrollment Rules based on UK's DWP standards - Pensionable Pay Method (Set 2 & 3)
interface AutoEnrollmentContribution {
  employeePercentage: number;
  employerPercentage: number;
  totalPercentage: number;
  pensionablePayPercentage: number;
}

export const getAutoEnrollmentRates = (): AutoEnrollmentContribution => {
  // Pensionable Pay Method (Set 2 & 3) - Most common as cheapest for employers
  return {
    employeePercentage: 5, // 5% employee contribution
    employerPercentage: 3, // 3% employer contribution
    totalPercentage: 8, // Total 8%
    pensionablePayPercentage: 85, // 85% of total pay (excludes overtime/bonuses)
  };
};

// Get current UK state pension amount (weekly) - UPDATED MAY 2025
export const getCurrentStatePension = (): number => {
  // Full new State Pension from May 2025 - CORRECTED VALUE
  return 230.25; // £230.25 per week for 2025 (was £221.20)
};

// Get state pension at retirement (adjusted for inflation using Parameters)
export const getStatePensionAtRetirement = (yearsUntilRetirement: number): number => {
  const weeklyStatePension = getCurrentStatePension();
  const annualStatePension = weeklyStatePension * 52;
  
  // Use Parameters for pension inflation
  return compoundingCalculator.applyAnnualInflation(annualStatePension, yearsUntilRetirement, 'pension');
};

// Calculate annual pension contribution based on salary using Pensionable Pay Method
export const calculateAnnualContribution = (annualSalary: number): number => {
  const rates = getAutoEnrollmentRates();
  // Apply pensionable pay percentage first, then total contribution rate
  const pensionableEarnings = (annualSalary * rates.pensionablePayPercentage) / 100;
  return (pensionableEarnings * rates.totalPercentage) / 100;
};

// Calculate future value with inflation using Parameters
export const calculateInflatedValue = (presentValue: number, years: number, inflationType: 'salary' | 'pension'): number => {
  return Math.round(compoundingCalculator.applyAnnualInflation(presentValue, years, inflationType));
};

// Normalize salary to annual value for consistent calculations
export const normalizeToAnnualSalary = (salary: number, isMonthly: boolean): number => {
  return isMonthly ? salary * 12 : salary;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
