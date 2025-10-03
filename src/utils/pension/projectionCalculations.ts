// Main projection calculations file - re-exports all functionality for backward compatibility

// Existing pension calculations
export {
  calculateExistingPensionValue,
  calculateProjectedPensionPot
} from './existingPensionCalculations';

// Auto Enrollment contribution calculations
export {
  calculateDynamicAEContributions,
  calculateFlatAEContributions,
  calculateFutureAEContributions
} from './aeContributionCalculations';

// Top-up contribution calculations
export {
  calculateTopUpContributions,
  calculateMonthlyFundingCost
} from './topUpCalculations';

// Comprehensive pension breakdown
export {
  calculatePensionBreakdown
} from './pensionBreakdownCalculations';

// Legacy/backward compatibility functions
export {
  calculateRequiredRetirementIncome,
  calculateRequiredCapital,
  calculateAdjustedRequiredIncome,
  calculateShortfall
} from './legacyCalculations';
