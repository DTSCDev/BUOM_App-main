
import { SalaryExchangeConstraint } from './constraintTypes';

export class NICConstraints {
  // National Insurance threshold protection - CRITICAL: Protects State Pension Credits
  static getNICThresholdConstraint(annualSalary: number, proposedSacrifice: number): SalaryExchangeConstraint | null {
    const nicLowerThreshold = 12570; // 2024/25 rate - protects State Pension Credits
    const salaryAfterSacrifice = annualSalary - proposedSacrifice;
    
    if (salaryAfterSacrifice < nicLowerThreshold) {
      const maxSacrifice = Math.max(0, annualSalary - nicLowerThreshold);
      return {
        maxAnnualAmount: maxSacrifice,
        constraintType: 'nic_threshold',
        reason: 'National Insurance threshold protection (State Pension Credits)',
        isBlocked: maxSacrifice <= 0
      };
    }
    
    return null;
  }
}
