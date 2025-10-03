
import { NIC_THRESHOLDS } from './taxThresholds';
import { parsePAYETaxCode } from './taxCodeParser';
import { EmploymentDetails } from '../enhancedTaxCalculations';

export interface SalaryExchangeValidationResult {
  isValid: boolean;
  warnings: string[];
  maxAllowed: number;
}

export function validateSalaryExchangeConstraints(
  currentGross: number,
  proposedSalaryExchange: number,
  employmentDetails: EmploymentDetails
): SalaryExchangeValidationResult {
  const warnings: string[] = [];
  const newGross = currentGross - proposedSalaryExchange;
  
  // Minimum wage check (approximate)
  const minimumWage = 2100; // ~£25k annually / 12
  if (newGross < minimumWage) {
    warnings.push('Salary exchange would reduce pay below minimum wage');
  }

  // NIC protection for directors with controlling shares
  if (employmentDetails.isDirector && employmentDetails.hasControllingShares) {
    const maxExchange = currentGross - (NIC_THRESHOLDS.director.annualLowerThreshold / 12) - 100; // £100 buffer
    if (proposedSalaryExchange > maxExchange) {
      warnings.push('Salary exchange would reduce NIC below minimum required for benefit entitlements');
    }
  }

  // PAYE tax code specific warnings
  const { specialCode } = parsePAYETaxCode(employmentDetails.payeTaxCode);
  if (specialCode === 'BR' || specialCode === 'D0' || specialCode === 'D1') {
    warnings.push(`Tax code ${employmentDetails.payeTaxCode} may result in higher tax on remaining salary`);
  }

  const isValid = warnings.length === 0;
  const maxAllowed = employmentDetails.isDirector && employmentDetails.hasControllingShares 
    ? currentGross - (NIC_THRESHOLDS.director.annualLowerThreshold / 12) - 100
    : currentGross - minimumWage;

  return { isValid, warnings, maxAllowed };
}
