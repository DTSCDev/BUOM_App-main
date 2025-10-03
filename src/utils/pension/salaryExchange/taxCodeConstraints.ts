
import { SalaryExchangeConstraint } from './constraintTypes';

export class TaxCodeConstraints {
  // Tax code specific limits
  static getTaxCodeLimit(taxCode: string, annualSalary: number): SalaryExchangeConstraint | null {
    const upperTaxCode = taxCode.toUpperCase();
    
    // 1257L standard tax code - most common constraint
    if (upperTaxCode === '1257L') {
      return {
        maxAnnualAmount: 47430, // Standard limit for 1257L
        constraintType: 'tax_code',
        reason: '1257L tax code limit',
        isBlocked: false
      };
    }
    
    // Emergency tax codes - highly restrictive
    if (['BR', 'D0', 'D1', 'D2'].includes(upperTaxCode)) {
      return {
        maxAnnualAmount: Math.min(6000, annualSalary * 0.1), // Very conservative limit
        constraintType: 'tax_code',
        reason: `Emergency tax code ${upperTaxCode} - limited sacrifice allowed`,
        isBlocked: false
      };
    }
    
    // K codes - debt being collected
    if (upperTaxCode.startsWith('K')) {
      return {
        maxAnnualAmount: Math.min(12000, annualSalary * 0.15), // Reduced limit
        constraintType: 'tax_code',
        reason: `K tax code - debt recovery in progress`,
        isBlocked: false
      };
    }
    
    // Higher rate codes (starting with numbers > 1257)
    const numericPart = parseInt(upperTaxCode.replace(/[^0-9]/g, ''));
    if (numericPart > 1257) {
      const higherLimit = Math.min(60000, annualSalary * 0.4); // Higher earners can sacrifice more
      return {
        maxAnnualAmount: higherLimit,
        constraintType: 'tax_code',
        reason: `Higher rate tax code ${upperTaxCode}`,
        isBlocked: false
      };
    }
    
    return null;
  }

  // Generate warnings for problematic tax codes
  static generateTaxCodeWarnings(taxCode: string): string[] {
    const warnings: string[] = [];
    const upperTaxCode = taxCode.toUpperCase();
    
    if (['BR', 'D0', 'D1', 'D2'].includes(upperTaxCode)) {
      warnings.push(`Emergency tax code ${taxCode} detected - salary sacrifice may be limited`);
    }
    
    if (upperTaxCode.startsWith('K')) {
      warnings.push('K tax code indicates HMRC debt recovery - sacrifice amount restricted');
    }
    
    return warnings;
  }
}
