import { getPensionParameters } from '../pensionParameters';
import { 
  SalaryExchangeConstraint, 
  SalaryExchangeValidationResult, 
  ValidationContext 
} from './salaryExchange/constraintTypes';
import { TaxCodeConstraints } from './salaryExchange/taxCodeConstraints';
import { NICConstraints } from './salaryExchange/nicConstraints';
import { DirectorConstraints } from './salaryExchange/directorConstraints';

// Re-export types for backward compatibility
export type { 
  SalaryExchangeConstraint, 
  SalaryExchangeValidationResult 
} from './salaryExchange/constraintTypes';

export class SalaryExchangeValidator {
  private params = getPensionParameters();

  // Main validation method - NET PAY GUARANTEE protects against minimum wage issues
  validateSalaryExchange(
    annualSalary: number,
    proposedSacrifice: number,
    taxCode: string = '1257L',
    isDirector: boolean = false,
    hasControllingShares: boolean = false
  ): SalaryExchangeValidationResult {
    console.log('=== SALARY EXCHANGE VALIDATION (NO MINIMUM WAGE PROTECTION) ===');
    console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
    console.log(`Proposed sacrifice: £${proposedSacrifice.toLocaleString()}`);
    console.log(`Tax code: ${taxCode}`);
    console.log(`Is director: ${isDirector}`);
    console.log(`Has controlling shares: ${hasControllingShares}`);
    console.log('NOTE: Net Pay Guarantee protects against minimum wage issues');
    
    const constraints: SalaryExchangeConstraint[] = [];
    const warnings: string[] = [];
    
    // Check tax code constraints
    const taxCodeConstraint = TaxCodeConstraints.getTaxCodeLimit(taxCode, annualSalary);
    if (taxCodeConstraint) {
      constraints.push(taxCodeConstraint);
    }
    
    // Check NIC threshold - CRITICAL: Keeps State Pension Credits protection
    const nicConstraint = NICConstraints.getNICThresholdConstraint(annualSalary, proposedSacrifice);
    if (nicConstraint) {
      constraints.push(nicConstraint);
    }
    
    // Check director constraints
    const directorConstraint = DirectorConstraints.getDirectorConstraint(isDirector, hasControllingShares, annualSalary);
    if (directorConstraint) {
      constraints.push(directorConstraint);
    }
    
    // Find the most restrictive constraint
    const validConstraints = constraints.filter(c => !c.isBlocked);
    const mostRestrictiveAmount = validConstraints.length > 0 
      ? Math.min(...validConstraints.map(c => c.maxAnnualAmount))
      : proposedSacrifice;
    
    const feasibleAmount = Math.min(proposedSacrifice, mostRestrictiveAmount);
    const isConstrained = feasibleAmount < proposedSacrifice;
    
    // Add tax code warnings
    warnings.push(...TaxCodeConstraints.generateTaxCodeWarnings(taxCode));
    
    console.log(`Feasible amount after constraints: £${feasibleAmount.toLocaleString()}`);
    console.log(`Is constrained: ${isConstrained}`);
    console.log(`Active constraints: ${constraints.length}`);
    console.log('MINIMUM WAGE PROTECTION: Removed - Net Pay Guarantee provides protection');
    
    return {
      feasibleAmount,
      isConstrained,
      constraints,
      warnings
    };
  }

  // Helper method to get the primary constraint reason
  getPrimaryConstraintReason(constraints: SalaryExchangeConstraint[]): string {
    if (constraints.length === 0) return 'No constraints applied';
    
    // Priority order: blocked > tax code > director > NIC (minimum wage removed)
    const priorityOrder = ['tax_code', 'director_protection', 'nic_threshold'];
    
    for (const priority of priorityOrder) {
      const constraint = constraints.find(c => c.constraintType === priority);
      if (constraint) {
        return constraint.reason;
      }
    }
    
    return constraints[0].reason;
  }
}

export const salaryExchangeValidator = new SalaryExchangeValidator();
