
// Enhanced parameters interface with granular asset-level customization
export interface PensionParametersConfig {
  salaryInflation: number;
  pensionIncomeTarget: number;
  pensionIncomeInflation: number;
  taxFreeCash: number;
  legacyPlan: number;
  growthRateAccumulation: number;
  growthRateDrawdown: number;
  providerCharges: number;
  advisorFee: number;
  
  // Auto-Enrollment parameters
  autoEnrollmentEmployeeRate: number;
  autoEnrollmentEmployerRate: number;
  autoEnrollmentPensionablePayRate: number;
  
  // Drawdown and BUOM parameters
  drawdownRate: number;
  apfMaturityMultiplier: number;
  apfGrowthMultiplier: number;
  
  // UK Tax parameters
  personalAllowance: number;
  basicRateBand: number;
  higherRateBand: number;
  additionalRateBand: number;
  basicRateIncomeTax: number;
  higherRateIncomeTax: number;
  additionalRateIncomeTax: number;
  
  // National Insurance parameters
  niPrimaryThreshold: number;
  niUpperEarningsLimit: number;
  niBasicRate: number;
  niReducedRate: number;
  
  // State pension parameters
  statePensionWeekly: number;
  
  // Affordability parameters
  affordabilityThreshold: number;
  buomDiscountRate: number;
  
  // Dashboard parameters
  retirementAge: number;
  workingDaysPerYear: number;
  
  // ISA and APF parameters
  isaRateEnhancedMember: number;
  isaRateStandardMember: number;
  
  // Pension allowance parameters
  annualAllowance: number;
  aeUpperLimit: number;
  
  // Chart parameters - REMOVED: chartInflationRate (now uses salaryInflation)
  maxChartAge: number;
  
  isCustomizable: boolean;
}

// Asset-level customization interface for premium users
export interface AssetProjectionParameters {
  assetId: string;
  customGrowthRate?: number; // Override default growth rate
  customProviderCharges?: number; // Override default fees
  customAdvisorFee?: number; // Asset-specific advisor fee
  riskProfile?: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  assetClass?: 'cash' | 'bonds' | 'equity' | 'property' | 'alternative' | 'pension';
}
