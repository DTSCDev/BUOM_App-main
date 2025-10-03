import { SFMCalculationContext } from '../types';

/**
 * Calculate progress-related values for SFM codes
 * Currently handles SFM-029: Top Up Contributions Paid
 */
export function calculateProgressValues(
  sfmId: string, 
  context: SFMCalculationContext, 
  resolver: (id: string) => number
): number {
  const id = sfmId.replace('SFM-', '');
  
  // SFM-029: Top Up Contributions Paid
  if (id === '029') {
    // Calculate the total top-up contributions needed to close the shortfall
    const capitalShortfall = resolver('SFM-028'); // Capital Shortfall
    
    if (capitalShortfall <= 0) {
      return 0; // No shortfall, no top-up needed
    }
    
    // Calculate years to retirement
    const currentAge = context.currentAge;
    const retirementAge = 67; // Standard retirement age
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    
    if (yearsToRetirement <= 0) {
      return capitalShortfall; // Already at retirement, need full amount now
    }
    
    // Calculate required monthly contribution to close shortfall
    // Using compound interest formula: FV = PMT * [((1 + r)^n - 1) / r]
    // Rearranged to: PMT = FV * r / ((1 + r)^n - 1)
    
    const annualGrowthRate = 0.045; // 4.5% annual growth
    const monthlyGrowthRate = annualGrowthRate / 12;
    const totalMonths = yearsToRetirement * 12;
    
    let monthlyTopUpRequired: number;
    
    if (monthlyGrowthRate === 0) {
      // No growth case
      monthlyTopUpRequired = capitalShortfall / totalMonths;
    } else {
      // With growth
      const growthFactor = Math.pow(1 + monthlyGrowthRate, totalMonths);
      monthlyTopUpRequired = capitalShortfall * monthlyGrowthRate / (growthFactor - 1);
    }
    
    // Total contributions paid over the period
    const totalTopUpContributions = monthlyTopUpRequired * totalMonths;
    
    return Math.round(totalTopUpContributions);
  }
  
  console.warn(`🚨 Progress calculation not implemented for ${sfmId}`);
  return 0;
}