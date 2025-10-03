
import { normalizeToAnnualSalary } from './pensionCalculations';

/**
 * Utility functions to ensure data consistency between monthly and annual salary inputs
 */

/**
 * Verifies that monthly and annual inputs produce the same normalized annual salary
 * @param monthlySalary The monthly salary value
 * @param annualSalary The annual salary value that should be equivalent
 * @returns Boolean indicating whether the values are consistent
 */
export const verifySalaryConsistency = (monthlySalary: number, annualSalary: number): boolean => {
  const normalizedFromMonthly = normalizeToAnnualSalary(monthlySalary, true);
  const normalizedFromAnnual = normalizeToAnnualSalary(annualSalary, false);
  
  // Allow for small floating point differences (less than £1)
  return Math.abs(normalizedFromMonthly - normalizedFromAnnual) < 1;
};

/**
 * Logs validation of salary equivalence to the console
 * @param monthlySalary The monthly salary to test
 */
export const logSalaryConsistencyCheck = (monthlySalary: number): void => {
  const annualEquivalent = monthlySalary * 12;
  const isConsistent = verifySalaryConsistency(monthlySalary, annualEquivalent);
  
  console.log(`Consistency check for £${monthlySalary}/month vs £${annualEquivalent}/year: ${isConsistent ? 'PASS' : 'FAIL'}`);
  
  if (!isConsistent) {
    console.warn(`Normalized values should match but don't:`);
    console.warn(`Monthly (£${monthlySalary}) normalized to annual: £${normalizeToAnnualSalary(monthlySalary, true)}`);
    console.warn(`Annual (£${annualEquivalent}) normalized: £${normalizeToAnnualSalary(annualEquivalent, false)}`);
  }
};
