
// Re-export all APF calculation functions
export { calculateCoreAPFValues } from './coreAPFCalculations';
export { calculateSponsorshipValues } from './sponsorshipCalculations';
export { calculateINBLValues } from './inblCalculations';
export { calculateBUOMTableValues } from './buomTableCalculations';

import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { SFMCalculationContext } from '../../types';
import { calculateCoreAPFValues } from './coreAPFCalculations';
import { calculateSponsorshipValues } from './sponsorshipCalculations';
import { calculateINBLValues } from './inblCalculations';
import { calculateBUOMTableValues } from './buomTableCalculations';

export function calculateAPFValues(sfmId: string, context: SFMCalculationContext, resolveSFM: (id: string) => number): number {
  // Use unified calculation engine to get retirement shortfall with assets data
  const unifiedResult = calculateUnifiedPensionMetrics(
    context.currentAge,
    context.profile.annual_salary || 0,
    context.existingPensionValue,
    false, // isEnhancedMember
    context.assets,
    context.profile
  );
  
  // SFM-145 is the APF starting point - UPDATED FROM 045 TO 145
  const retirementShortfall = unifiedResult.currentCapitalShortfall;

  // Route to appropriate calculation module
  if (sfmId === 'SFM-144' || sfmId === 'SFM-145' || sfmId === 'SFM-146') { // NEW CORE APF CODES
    return calculateCoreAPFValues(sfmId, context, resolveSFM);
  }
  
  // UPDATED ALL CODES FROM 04x TO 14x SERIES
  if (sfmId.startsWith('SFM-147-') || sfmId.startsWith('SFM-148-') || sfmId.startsWith('SFM-150-')) {
    return calculateSponsorshipValues(sfmId, context, retirementShortfall);
  }
  
  if (sfmId.startsWith('SFM-151-') || sfmId.startsWith('SFM-152-') || sfmId.startsWith('SFM-153-')) {
    return calculateINBLValues(sfmId, context, retirementShortfall);
  }
  
  if (sfmId.startsWith('SFM-166-') || sfmId.startsWith('SFM-169-') || sfmId.startsWith('SFM-172-')) {
    return calculateBUOMTableValues(sfmId, context, retirementShortfall);
  }

  // ISA Contributions - Years 1-10 (SFM-154-X) - UPDATED FROM 054 TO 154
  if (sfmId.startsWith('SFM-154-')) {
    const isaYear = parseInt(sfmId.split('-')[2]);
    console.log(`DEBUG ${sfmId}: ISA calculation for year ${isaYear}`);
    
    // Use the ISA monthly target from SFM-030A for a more accurate calculation
    const isaMonthlyTarget = resolveSFM('SFM-030A') || 73; // Fallback to £73
    const yearMultiplier = isaYear <= 3 ? 1 : 0.5; // Lower amounts for later years
    const isaMonthly = isaMonthlyTarget * yearMultiplier;
    
    console.log(`${sfmId}: ISA contributions for year ${isaYear}: £${isaMonthly.toLocaleString()} monthly (based on SFM-030A: £${isaMonthlyTarget})`);
    return Math.round(isaMonthly);
  }

  return 0;
}
