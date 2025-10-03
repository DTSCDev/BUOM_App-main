
// Extended pension parameters (for free users) - Single source of truth for ALL calculations
// 
// *** IMPORTANT: STATE PENSION VALUES MUST BE REVIEWED ANNUALLY ***
// Last updated: May 2025 with £230.25/week (£11,973 annually)
// Next review due: May 2026
//
// *** GROWTH RATE CORRECTED: 5% gross - 0.5% fees = 4.5% net ***
// *** DRAWDOWN RATE CORRECTED: 4% gross - 0.5% fees = 3.5% net (static fund) ***
// *** INFLATION UNIFIED: Single 2% rate for ALL calculations ***
//
export const DEFAULT_PENSION_PARAMETERS = {
  salaryInflation: 0.02, // UNIFIED: 2% per year for ALL inflation calculations
  pensionIncomeTarget: 0.5, // 50% of salary
  pensionIncomeInflation: 0.02, // UNIFIED: Same as salary inflation (2%)
  taxFreeCash: 0.25, // 25% of fund value
  legacyPlan: 1.0, // 100% of fund value to beneficiaries
  growthRateAccumulation: 0.05, // 5% p.a. gross (results in 4.5% net after fees)
  growthRateDrawdown: 0.04, // CORRECTED: 4% p.a. gross (results in 3.5% net after fees - static fund)
  providerCharges: 0.005, // 0.5% p.a. of fund value
  advisorFee: 0.00, // 0% p.a. of fund value
  
  // AUTO-ENROLLMENT PARAMETERS (Single source of truth)
  autoEnrollmentEmployeeRate: 0.05, // 5% employee contribution
  autoEnrollmentEmployerRate: 0.03, // 3% employer contribution
  autoEnrollmentPensionablePayRate: 0.85, // 85% of total pay (excludes overtime/bonuses)
  
  // DRAWDOWN AND BUOM PARAMETERS - FIXED: No more hardcoded values
  drawdownRate: 0.035, // 3.5% annual drawdown
  apfMaturityMultiplier: 1.582, // APF maturity multiplier (was hardcoded in multiple places)
  apfGrowthMultiplier: 25, // APF growth multiplier (was hardcoded as 25)
  
  // UK TAX PARAMETERS (2025/2026 tax year) - FIXED: No more hardcoded tax values
  personalAllowance: 12570, // Annual personal allowance
  basicRateBand: 50270, // Annual basic rate upper limit
  higherRateBand: 125140, // Annual higher rate upper limit
  additionalRateBand: 150000, // Additional rate threshold
  basicRateIncomeTax: 0.2, // 20% basic rate
  higherRateIncomeTax: 0.4, // 40% higher rate
  additionalRateIncomeTax: 0.45, // 45% additional rate
  
  // NATIONAL INSURANCE PARAMETERS - FIXED: No more hardcoded NI values
  niPrimaryThreshold: 1048, // Monthly primary threshold
  niUpperEarningsLimit: 4189, // Monthly upper earnings limit
  niBasicRate: 0.12, // 12% basic rate
  niReducedRate: 0.02, // 2% above upper earnings limit
  
  // STATE PENSION PARAMETERS - UPDATED MAY 2025
  statePensionWeekly: 230.25, // £230.25 per week for 2025
  
  // AFFORDABILITY PARAMETERS - REALISTIC: Based on actual affordability, not industry wishful thinking
  affordabilityThreshold: 0.04, // 4% of net pay considered affordable (twice current AE contribution)
  buomDiscountRate: 0.5, // 50% savings with BUOM approach
  
  // DASHBOARD CALCULATION PARAMETERS - FIXED: No more hardcoded ages/days
  retirementAge: 67, // State pension age
  workingDaysPerYear: 260, // Average working days per year
  
  // ISA AND APF PARAMETERS - FIXED: Changed back to £98.00 per month per £100k APF maturity
  isaRateEnhancedMember: 98.00, // £98.00 per month per £100k APF maturity for enhanced members
  isaRateStandardMember: 109, // £109 per month per £100k APF maturity (standard)
  
  // PENSION ALLOWANCE PARAMETERS - UPDATED: Correct 2025/26 annual allowance
  annualAllowance: 60000, // FIXED: Annual pension allowance for 2025/26
  aeUpperLimit: 50270, // Auto-enrollment upper limit
  
  // CHART PARAMETERS - REMOVED: chartInflationRate (now uses salaryInflation)
  maxChartAge: 90, // Maximum age to show on charts
};

// Subscription pricing details
export const SUBSCRIPTION_OPTIONS = {
  monthly: {
    price: 15.00,
    savings: 0,
  },
  annual: {
    price: 100.00,
    savings: 44.00,
  },
  lifetime: {
    price: 350.00,
    savings: 3150.00,
  }
};
