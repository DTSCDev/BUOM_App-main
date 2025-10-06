
import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { calculateUnlimitedAPFSponsorships } from '@/utils/pension/apfSponsorshipCalculations';
import { calculateDynamicINBLData } from '@/utils/pension/dynamicINBLCalculator';
import { SFMCalculationContext } from '../../types';

export function calculateCoreAPFValues(sfmId: string, context: SFMCalculationContext, resolveSFM?: (id: string) => number): number {
  console.log('=== CORE APF CALCULATIONS - CHECKING INPUT DATA ===');
  console.log(`Current age: ${context.currentAge}`);
  console.log(`Annual salary: £${(context.profile.annual_salary || 0).toLocaleString()}`);
  console.log(`CRITICAL: Existing pension value from context: £${context.existingPensionValue.toLocaleString()}`);
  
  // Use unified calculation engine for ALL APF calculations with assets data
  const unifiedResult = calculateUnifiedPensionMetrics(
    context.currentAge,
    context.profile.annual_salary || 0,
    context.existingPensionValue,
    false, // isEnhancedMember
    context.assets,
    context.profile
  );
  
  // Use retirement shortfall calculation, NOT capital shortfall today
  const drawdownRate = resolveSFM ? resolveSFM('SFM-022') : 0.0035; // Get drawdown rate from SFM-022
  const retirementShortfall = unifiedResult.apfTargetIncome / drawdownRate;
  console.log(`🎯 FIXED APF LOGIC: Starting with retirement shortfall: £${retirementShortfall.toLocaleString()}`);
  console.log(`🎯 FIXED APF LOGIC: Using drawdown rate (SFM-022): ${(drawdownRate * 100).toFixed(2)}%`);
  console.log(`🎯 NOT using capital shortfall today (life cover): £${unifiedResult.capitalShortfallToday.toLocaleString()}`);
  
  const sponsorships = calculateUnlimitedAPFSponsorships(
    context.currentAge,
    retirementShortfall, // FIXED: Use retirement shortfall, not capital shortfall today
    context.profile.annual_salary || 0,
    true, // Enhanced member
    context.profile
  );

  switch (sfmId) {

    // SFM-144: Total APF Funding - UPDATED FROM 044 TO 144
    case "SFM-144": {
      const totalAPFFunding = sponsorships.reduce((total, sponsorship) => total + sponsorship.sponsorshipAmount, 0);
      console.log(`🔍 SFM-144: Total APF Funding: £${totalAPFFunding.toLocaleString()}`);
      return totalAPFFunding;
    }

    // SFM-145: Total Maturity Target - Copy SFM-007 (APF Starting Point) - UPDATED FROM 045 TO 145
    case "SFM-145": {
      const sfm007Value = resolveSFM ? resolveSFM('SFM-007') : 0; // Estimated Shortfall
      console.log(`🔍 SFM-145 DEBUG: resolveSFM function available: ${!!resolveSFM}`);
      console.log(`🔍 SFM-145 DEBUG: SFM-007 value retrieved: £${sfm007Value.toLocaleString()}`);
      console.log(`🔍 SFM-145: APF Starting Point copying SFM-007 value: £${sfm007Value.toLocaleString()}`);
      return sfm007Value;
    }

    // SFM-146: Total INBL Principal - UPDATED FROM 046 TO 146
    case "SFM-146": {
      // Calculate total INBL principal from all sponsorships using dynamic INBL data
      const inblData = calculateDynamicINBLData(context.profile.annual_salary || 0, sponsorships);
      const totalINBLPrincipal = inblData.inblAmounts.reduce((total: number, amount: number) => total + amount, 0);
      console.log(`🔍 SFM-146: Total INBL Principal: £${totalINBLPrincipal.toLocaleString()}`);
      return totalINBLPrincipal;
    }

    default:
      return 0;
  }
}
