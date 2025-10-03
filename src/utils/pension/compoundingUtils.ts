
// Universal compounding utility - re-exports all functionality for backward compatibility
export { compoundingCore } from './compoundingCore';
export { calculateUnifiedBUOMValues } from './unifiedBuomCalculations';
export { calculateDashboardMetrics } from './dashboardCalculations';
export { calculateUKTax, calculateAffordability } from './taxCalculations';
export type { TaxCalculationResult } from './taxCalculations';
export type { UnifiedBUOMCalculations } from './unifiedBuomCalculations';

// Re-export core functions for backward compatibility
import { compoundingCore } from './compoundingCore';
import { calculateUnifiedBUOMValues } from './unifiedBuomCalculations';
import { calculateDashboardMetrics } from './dashboardCalculations';
import { calculateUKTax, calculateAffordability } from './taxCalculations';

// Create a unified object that includes all functions for backward compatibility
export const compoundingCalculator = {
  // Core calculation methods from compoundingCore
  compoundMonthly: compoundingCore.compoundMonthly.bind(compoundingCore),
  applyAnnualInflation: compoundingCore.applyAnnualInflation.bind(compoundingCore),
  applyAdvisorFee: compoundingCore.applyAdvisorFee.bind(compoundingCore),
  escalatingMonthlyContributions: compoundingCore.escalatingMonthlyContributions.bind(compoundingCore),
  calculateMonthlyAEContribution: compoundingCore.calculateMonthlyAEContribution.bind(compoundingCore),
  calculateAge: compoundingCore.calculateAge.bind(compoundingCore),
  getCurrentStatePension: compoundingCore.getCurrentStatePension.bind(compoundingCore),
  getStatePensionAtRetirement: compoundingCore.getStatePensionAtRetirement.bind(compoundingCore),
  
  // Core properties (getters)
  get monthlyGrowthRate() { return compoundingCore.monthlyGrowthRate; },
  get monthlyDrawdownGrowthRate() { return compoundingCore.monthlyDrawdownGrowthRate; },
  get monthlyProviderCharges() { return compoundingCore.monthlyProviderCharges; },
  get annualAdvisorFee() { return compoundingCore.annualAdvisorFee; },
  get annualSalaryInflation() { return compoundingCore.annualSalaryInflation; },
  get annualPensionIncomeInflation() { return compoundingCore.annualPensionIncomeInflation; },
  get netMonthlyGrowthRate() { return compoundingCore.netMonthlyGrowthRate; },
  get netMonthlyDrawdownRate() { return compoundingCore.netMonthlyDrawdownRate; },
  
  // Higher level calculation functions
  calculateUnifiedBUOMValues,
  calculateDashboardMetrics,
  calculateUKTax,
  calculateAffordability,
  
  // Legacy function aliases for backward compatibility
  getMonthlyGrowthRate: () => compoundingCore.monthlyGrowthRate,
  getNetMonthlyGrowthRate: () => compoundingCore.netMonthlyGrowthRate,
  applyMonthlyCompounding: (value: number, months: number, isDrawdownPhase?: boolean) => 
    compoundingCore.compoundMonthly(value, months, isDrawdownPhase),
  
  // Parameters access
  params: compoundingCore.params
};

// Also export the core params for direct access
export const params = compoundingCore.params;
