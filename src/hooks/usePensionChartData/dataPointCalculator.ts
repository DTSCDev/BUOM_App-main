
import { calculateAPFAssetValue } from "@/utils/pension/apfAssetValuation";
import { ChartDataPoint } from './chartDataGenerator';
import { APFSponsorshipBreakdown } from '@/utils/pension/buomTypes';

export function calculateDataPoint(
  age: number,
  currentAge: number,
  targetIncomeToday: number,
  existingPensionValue: number,
  annualSalary: number,
  totalAPFFunding: number,
  apfSponsorships: APFSponsorshipBreakdown[],
  isaTimeline: any,
  params: any
): ChartDataPoint {
  const yearsFromCurrent = age - currentAge;
  
  // SIMPLIFIED CAPITAL SHORTFALL TODAY CALCULATION
  // Target capital based on TODAY's target income using 3.5% drawdown
  const targetCapitalRequired = targetIncomeToday / params.drawdownRate;
  
  // Calculate grown existing pension value for this age
  const yearsToThisAge = Math.max(0, yearsFromCurrent);
  const grownExistingValue = existingPensionValue * Math.pow(1 + (params.growthRateAccumulation - params.providerCharges), yearsToThisAge);
  
  // Base capital shortfall = Target Capital - Grown Existing Pension (SIMPLE FORMULA)
  let capitalShortfall = targetCapitalRequired - grownExistingValue;
  
  // Apply State Pension benefit reduction ONLY from age 67+
  if (age >= 67) {
    const statePensionCapitalValue = (params.statePensionWeekly * 52) / params.drawdownRate;
    capitalShortfall = Math.max(0, capitalShortfall - statePensionCapitalValue);
  }
  
  // Apply APF maturity reductions ONLY when sponsorships have actually matured (21+ years)
  apfSponsorships.forEach(sponsorship => {
    const yearsFromSponsorship = age - sponsorship.age;
    if (yearsFromSponsorship >= 21) {
      // This sponsorship has matured - apply the maturity value reduction
      const maturityValue = sponsorship.maturityValue || 0;
      capitalShortfall = Math.max(0, capitalShortfall - maturityValue);
    }
  });
  
  // Ensure capital shortfall is never negative
  capitalShortfall = Math.max(0, capitalShortfall);
  
  // For past data (age < currentAge), use simple historical calculation
  if (age < currentAge) {
    capitalShortfall = Math.max(0, targetCapitalRequired - existingPensionValue);
  }
  
  // ISA timeline indexing (use 0 for past data)
  const isaDataIndex = Math.max(0, Math.min(yearsFromCurrent * 12, isaTimeline.timeline.length - 1));
  const isaEntry = isaTimeline.timeline[isaDataIndex];
  const isaValue = age >= currentAge ? (isaEntry?.isaCumulativeValue || 0) : 0;
  const inblBalance = age >= currentAge ? (isaEntry?.totalINBLBalance || 0) : 0;
  
  // Calculate APF asset values for visualization (NOT included in shortfall calculation)
  let apfAssetValue = 0;
  if (age >= currentAge && totalAPFFunding > 0) {
    apfSponsorships.forEach(sponsorship => {
      if (age >= sponsorship.age) {
        const monthsSinceSponsorship = Math.max(1, (age - sponsorship.age) * 12 + 1);
        const sponsorshipValue = calculateAPFAssetValue(
          sponsorship.sponsorshipAmount,
          monthsSinceSponsorship, 
          age
        );
        
        if (!isNaN(sponsorshipValue)) {
          apfAssetValue += sponsorshipValue;
        }
      }
    });
  }
  
  // Ensure apfAssetValue is never NaN
  apfAssetValue = isNaN(apfAssetValue) ? 0 : apfAssetValue;
  
  // Calculate BUOM total value (for visualization only)
  const buomTotalValue = apfAssetValue + isaValue;
  
  // Log the correct calculation for current age
  if (age === currentAge) {
    console.log(`=== SIMPLIFIED CAPITAL SHORTFALL TODAY (Age ${age}) ===`);
    console.log(`Target income today: £${targetIncomeToday.toLocaleString()}`);
    console.log(`Target capital required: £${targetCapitalRequired.toLocaleString()}`);
    console.log(`Existing pension value: £${existingPensionValue.toLocaleString()}`);
    console.log(`Capital shortfall today: £${capitalShortfall.toLocaleString()}`);
    console.log(`Formula: ${targetCapitalRequired.toLocaleString()} - ${grownExistingValue.toLocaleString()} = ${capitalShortfall.toLocaleString()}`);
  }
  
  return {
    age,
    capitalShortfall,
    apfAssetValue,
    isaValue,
    buomTotalValue,
    targetValue: targetCapitalRequired,
    existingPlanValue: grownExistingValue,
    inblBalance: -inblBalance // Negative for visualization
  };
}
