// Main pension calculations file - re-exports all functionality for backward compatibility

// Age and time calculations
export {
  calculateDaysUntilPension,
  calculateRemainingPayDays,
  calculateAge,
  calculateYearsUntilPension,
  formatYearsAndMonths
} from './pension/ageCalculations';

// Salary and contribution calculations
export {
  getAutoEnrollmentRates,
  getCurrentStatePension,
  getStatePensionAtRetirement,
  calculateAnnualContribution,
  calculateInflatedValue,
  normalizeToAnnualSalary,
  formatCurrency
} from './pension/salaryCalculations';

// Pension projections and requirements
export {
  calculateExistingPensionValue,
  calculateProjectedPensionPot,
  calculateRequiredRetirementIncome,
  calculateRequiredCapital,
  calculateAdjustedRequiredIncome,
  calculateShortfall,
  calculateMonthlyFundingCost
} from './pension/projectionCalculations';

// Advanced Pension Funding calculations
export {
  calculateAdvancedPensionFundingYears,
  calculateBUOMCost,
  calculateCarryForwardAPF
} from './pension/apfCalculations';

// Validation utilities
export {
  isSalaryWithinLimits,
  isAgeWithinLimits,
  generateBUOMMembershipNumber
} from './pension/validationUtils';

// Keep the DEFAULT_PENSION_PARAMETERS import for backward compatibility
export { DEFAULT_PENSION_PARAMETERS } from './pensionParameters';
