
// Main export file for pension parameters
export { SUBSCRIPTION_OPTIONS, DEFAULT_PENSION_PARAMETERS } from './constants';
export type { PensionParametersConfig, AssetProjectionParameters } from './types';
export { hasActiveSubscription } from './subscription';
export { 
  getAssetProjectionParameters, 
  calculateWeightedPortfolioReturn 
} from './calculations';

import { PensionParametersConfig } from './types';
import { hasActiveSubscription } from './subscription';

// Get pension parameters based on subscription status - SINGLE SOURCE OF TRUTH
export const getPensionParameters = (): PensionParametersConfig => {
  const isPremium = hasActiveSubscription();
  // Inline defaults (previously DEFAULT_PENSION_PARAMETERS) to remove deprecated constant
  const defaults: Omit<PensionParametersConfig, 'isCustomizable'> = {
    salaryInflation: 0.02,
    pensionIncomeTarget: 0.5,
    pensionIncomeInflation: 0.02,
    taxFreeCash: 0.25,
    legacyPlan: 1.0,
    growthRateAccumulation: 0.05,
    growthRateDrawdown: 0.04,
    providerCharges: 0.005,
    advisorFee: 0.0,
    autoEnrollmentEmployeeRate: 0.05,
    autoEnrollmentEmployerRate: 0.03,
    autoEnrollmentPensionablePayRate: 0.85,
    drawdownRate: 0.035,
    apfMaturityMultiplier: 1.582,
    apfGrowthMultiplier: 25,
    personalAllowance: 12570,
    basicRateBand: 50270,
    higherRateBand: 125140,
    additionalRateBand: 150000,
    basicRateIncomeTax: 0.2,
    higherRateIncomeTax: 0.4,
    additionalRateIncomeTax: 0.45,
    niPrimaryThreshold: 1048,
    niUpperEarningsLimit: 4189,
    niBasicRate: 0.12,
    niReducedRate: 0.02,
    statePensionWeekly: 230.25,
    affordabilityThreshold: 0.04,
    buomDiscountRate: 0.5,
    retirementAge: 67,
    workingDaysPerYear: 260,
    isaRateEnhancedMember: 98.0,
    isaRateStandardMember: 109,
    annualAllowance: 60000,
    aeUpperLimit: 50270,
    maxChartAge: 90,
  };

  return {
    ...defaults,
    isCustomizable: isPremium,
  };
};
