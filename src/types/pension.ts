export interface PensionCalculationResults {
  currentAge: number;
  ageYears: number;
  ageMonths: number;
  daysUntilPension: number;
  yearsUntilPensionFormatted: string;
  annualSalary: number;
  existingPensionValue: number;
  yearsUntilPension: number | { years: number; months: number };
  targetIncome: number;
  existingPlanIncome: number;
  apfTargetIncome: number;
  requiredIncome: number;
  requiredIncomeAfterInflation: number;
  finalSalaryIncome?: number;
  otherIncome?: number;
  monthlyFundingCost?: number;
  requiredCapital: number;
  currentCapitalShortfall: number;
  proposedAPFFunding: number;
  proposedISAMonthlyValue: number;
  totalProjectedAssets: number;
  // New fields for custom contributions
  useCustomContributions?: boolean;
  customEmployeeContribution?: number;
  customEmployerContribution?: number;
}