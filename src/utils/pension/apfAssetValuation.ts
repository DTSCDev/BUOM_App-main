
// APF Asset Valuation based on 4-stage pricing system with post-maturity growth

import { getPensionParameters } from '../pensionParameters';

export interface APFPricePoint {
  monthStart: number;
  monthEnd: number;
  multiplier: number;
  description: string;
}

export const APF_PRICE_POINTS: APFPricePoint[] = [
  {
    monthStart: 1,
    monthEnd: 120,
    multiplier: 1.00,
    description: "Opening Price (1.0x)"
  },
  {
    monthStart: 121,
    monthEnd: 180,
    multiplier: 1.25,
    description: "10yr Mid Point Value (1.25x)"
  },
  {
    monthStart: 181,
    monthEnd: 240,
    multiplier: 1.375,
    description: "15yr Mid Point Value (1.375x)"
  },
  {
    monthStart: 241,
    monthEnd: 252,
    multiplier: 1.582,
    description: "20yr Maturity Value (1.582x)"
  }
];

export const calculateAPFAssetValue = (
  sponsorshipAmount: number,
  monthsElapsed: number,
  currentAge?: number
): number => {
  // Ensure we have a valid sponsorship amount
  if (sponsorshipAmount <= 0) return 0;
  
  // FIXED: Ensure minimum 1.0x multiplier for early stages
  if (monthsElapsed <= 0) return sponsorshipAmount * 1.0;
  
  const params = getPensionParameters();
  
  // Find the appropriate price point for the given month
  const pricePoint = APF_PRICE_POINTS.find(
    point => monthsElapsed >= point.monthStart && monthsElapsed <= point.monthEnd
  );
  
  let baseValue: number;
  
  if (!pricePoint) {
    // After maturity (month 252+), continue growing with parameters
    baseValue = sponsorshipAmount * params.apfMaturityMultiplier;
    
    // Calculate months post-maturity
    const monthsPostMaturity = monthsElapsed - 252;
    
    if (monthsPostMaturity > 0 && currentAge !== undefined) {
      // Apply appropriate growth rate based on age
      const isPostRetirement = currentAge >= params.retirementAge;
      const monthlyGrowthRate = isPostRetirement 
        ? (params.growthRateDrawdown - params.providerCharges) / 12
        : (params.growthRateAccumulation - params.providerCharges) / 12;
      
      // Compound the base maturity value for post-maturity growth
      baseValue = baseValue * Math.pow(1 + monthlyGrowthRate, monthsPostMaturity);
    }
    
    return baseValue;
  }
  
  // FIXED: Return exact multiplier for the pricing stage
  const calculatedValue = sponsorshipAmount * pricePoint.multiplier;
  
  console.log(`APF Asset Valuation: £${sponsorshipAmount.toLocaleString()} * ${pricePoint.multiplier}x = £${calculatedValue.toLocaleString()} (${pricePoint.description})`);
  
  return calculatedValue;
};

export const getAPFPriceMultiplier = (monthsElapsed: number): number => {
  const pricePoint = APF_PRICE_POINTS.find(
    point => monthsElapsed >= point.monthStart && monthsElapsed <= point.monthEnd
  );
  
  const params = getPensionParameters();
  return pricePoint ? pricePoint.multiplier : params.apfMaturityMultiplier;
};
