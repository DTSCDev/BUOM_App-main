import { SFMCalculationContext } from '../types';
import { calculateTopUpContributions } from '@/utils/pension/topUpCalculations';

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

    // Years to retirement
    const currentAge = context.currentAge;
    const retirementAge = 67; // Standard retirement age
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    if (yearsToRetirement <= 0) {
      return capitalShortfall; // Already at retirement, need full amount now
    }

    // Use escalating PMT with effective monthly rates and salary inflation
    const { totalTopUpContributions } = calculateTopUpContributions(capitalShortfall, yearsToRetirement);
    return Math.round(totalTopUpContributions);
  }
  
  console.warn(`🚨 Progress calculation not implemented for ${sfmId}`);
  return 0;
}