
export interface SalaryExchangeConstraint {
  maxAnnualAmount: number;
  constraintType: 'tax_code' | 'nic_threshold' | 'director_protection';
  reason: string;
  isBlocked: boolean;
}

export interface SalaryExchangeValidationResult {
  feasibleAmount: number;
  isConstrained: boolean;
  constraints: SalaryExchangeConstraint[];
  warnings: string[];
}

export interface ValidationContext {
  annualSalary: number;
  proposedSacrifice: number;
  taxCode: string;
  isDirector: boolean;
  hasControllingShares: boolean;
}
