
export interface APFSponsorshipBreakdown {
  year: number;
  age: number;
  sponsorshipAmount: number;
  taxYear: string;
  monthsToMaturity: number;
  maturityValue: number;
  isaMonthlyRequired: number;
  isaAnnualRequired: number;
  maturityAge: number;
  salaryExchangeConstrained?: boolean;
  constraintReason?: string;
}

export interface BUOMCalculationResult {
  yearlyData: YearlyProjectionData[];
  apfSponsorships: APFSponsorshipBreakdown[];
  totalAPFFunding: number;
  totalMaturityValue: number;
  totalISARequired: number;
  currentCapitalShortfall: number;
  projectedShortfallEliminated: boolean;
  // Additional properties for report compatibility
  payslipComparison?: PayslipComparison;
  totalAPFSponsorship?: number; // Alias for totalAPFFunding
  totalAPFMaturityValue?: number; // Alias for totalMaturityValue
  totalISAMonthlyRequired?: number;
  capitalShortfall?: number; // Alias for currentCapitalShortfall
  meetsShortfall?: boolean; // Alias for projectedShortfallEliminated
  proposedAPFFunding?: number;
  proposedISAMonthlyValue?: number;
}

export interface YearlyProjectionData {
  age: number;
  year: number;
  capitalShortfall: number;
  apfAssetValue: number;
  isaValue: number;
  buomTotalValue: number;
  sponsorshipThisYear?: APFSponsorshipBreakdown;
}

export interface BUOMYearlyCalculation {
  age: number;
  year: number;
  salaryWithInflation: number;
  statePensionToday: number;
  finalSalaryIncome: number;
  targetIncome: number;
  incomeShortfall: number;
  requiredLumpSum: number;
  existingPlanValue: number;
  existingPlanIncome: number;
  capitalShortfall: number;
  apfAssetValue: number;
  isaValue: number;
  buomTotalValue: number;
  netPayWithAE: number;
  netPayWithoutAE: number;
  availableForISA: number;
  isAPFActiveYear: boolean;
  apfMaturityReduction: number;
  aeContributionThisYear: number;
  cumulativeAEContributions: number;
}

export interface PayslipDetails {
  grossPay: number;
  pensionContribution: number;
  employerContribution: number;
  totalContribution: number;
  grossPayAfterPension: number;
  incomeTax: number;
  nationalInsurance: number;
  netPay: number;
}

export interface PayslipComparison {
  beforeAPF: PayslipDetails;
  duringAPF: PayslipDetails;
  difference: {
    pensionSavings: number;
    netPayIncrease: number;
    availableForISA: number;
  };
}
