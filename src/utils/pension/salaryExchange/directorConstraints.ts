
import { SalaryExchangeConstraint } from './constraintTypes';

export class DirectorConstraints {
  // Director specific protections
  static getDirectorConstraint(
    isDirector: boolean, 
    hasControllingShares: boolean, 
    annualSalary: number
  ): SalaryExchangeConstraint | null {
    if (!isDirector) return null;
    
    // Directors with controlling shares face additional restrictions
    if (hasControllingShares) {
      const maxSacrifice = Math.min(30000, annualSalary * 0.25); // More conservative for controlling directors
      return {
        maxAnnualAmount: maxSacrifice,
        constraintType: 'director_protection',
        reason: 'Controlling director - enhanced restrictions',
        isBlocked: false
      };
    }
    
    // Regular directors
    const maxSacrifice = Math.min(45000, annualSalary * 0.35);
    return {
      maxAnnualAmount: maxSacrifice,
      constraintType: 'director_protection',
      reason: 'Director employment protection',
      isBlocked: false
    };
  }
}
