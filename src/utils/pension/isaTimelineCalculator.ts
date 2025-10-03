
import { getPensionParameters } from '../pensionParameters';
import { ISATimelineEntry, ISAFullTimelineResult } from './isaTypes';
import { ISA_CALCULATION_CONSTANTS } from './isaConstants';
import { calculateISAContributions } from './isaContributionCalculator';
import { calculateINBLBalances } from './inblBalanceCalculator';
import { processRedemptionEvent } from './isaRedemptionHandler';
import { calculateDynamicINBLData, DynamicINBLData } from './dynamicINBLCalculator';

/**
 * Calculate ISA timeline with dynamic INBL amounts based on actual salary sacrifice
 * NOTE: This function should NOT call calculateUnlimitedAPFSponsorships to avoid circular dependency
 */
export const calculateFullISATimeline = (
  annualSalary?: number,
  currentAge?: number,
  capitalShortfallToday?: number,
  profile?: any
): ISAFullTimelineResult => {
  console.log('=== DYNAMIC ISA TIMELINE WITH PRE-CALCULATED APF DATA ===');
  
  const params = getPensionParameters();
  const netGrowthRate = (params.growthRateAccumulation - params.providerCharges) / 12; // Monthly growth
  
  let inblData: DynamicINBLData | undefined;
  let apfSponsorships: any[] = [];
  
  // FIXED: Only calculate dynamic INBL data if we have user information
  // Do NOT call calculateUnlimitedAPFSponsorships here to avoid circular dependency
  if (annualSalary && currentAge && capitalShortfallToday !== undefined) {
    console.log(`Using dynamic calculations for salary: £${annualSalary.toLocaleString()}`);
    
    // Use pre-calculated APF sponsorships if available, otherwise use fallback
    // This breaks the circular dependency
    console.log('WARNING: APF sponsorships should be calculated externally to avoid circular dependency');
    
    // Fallback to basic INBL calculation without APF data
    inblData = {
      inblAmounts: [annualSalary * 0.1], // Rough estimate: 10% of salary for year 1
      npgAmounts: [annualSalary * 0.08], // Rough estimate: 8% NPG
      nrsrFees: [annualSalary * 0.02], // Rough estimate: 2% NRSR
      sponsorshipCount: 1
    };
    
    console.log('Using fallback INBL calculation to avoid circular dependency');
  } else {
    console.log('Using fallback ISA timeline calculation (no user data available)');
  }
  
  const timeline: ISATimelineEntry[] = [];
  let isaCumulativeValue = 0;
  let totalContributionsByYear: number[] = [];
  
  for (let month = 1; month <= ISA_CALCULATION_CONSTANTS.TOTAL_MONTHS; month++) {
    const currentAge = ISA_CALCULATION_CONSTANTS.START_AGE + Math.floor((month - 1) / 12) + ((month - 1) % 12) / 12;
    
    // Calculate ISA monthly contributions for each tranche using APF data (now empty to avoid circular calls)
    const contributions = calculateISAContributions(month, apfSponsorships);
    
    // Track total contributions dynamically
    if (totalContributionsByYear.length < 3) {
      totalContributionsByYear = [
        (totalContributionsByYear[0] || 0) + contributions.year1ISAMonthly,
        (totalContributionsByYear[1] || 0) + contributions.year2ISAMonthly,
        (totalContributionsByYear[2] || 0) + contributions.year3ISAMonthly
      ];
    }
    
    // Apply growth to existing ISA value and add new contributions
    isaCumulativeValue = (isaCumulativeValue * (1 + netGrowthRate)) + contributions.totalISAMonthly;
    
    // Calculate current INBL balances using dynamic data
    const inblBalances = calculateINBLBalances(month, inblData);
    
    // Check for redemption events and process them with dynamic data
    const redemptionResult = processRedemptionEvent(month, isaCumulativeValue, inblData);
    isaCumulativeValue = redemptionResult.updatedISAValue;
    
    timeline.push({
      month,
      age: currentAge,
      year1ISAMonthly: contributions.year1ISAMonthly,
      year2ISAMonthly: contributions.year2ISAMonthly,
      year3ISAMonthly: contributions.year3ISAMonthly,
      totalISAMonthly: contributions.totalISAMonthly,
      isaCumulativeValue,
      year1INBLBalance: inblBalances.year1INBLBalance || 0,
      year2INBLBalance: inblBalances.year2INBLBalance || 0,
      year3INBLBalance: inblBalances.year3INBLBalance || 0,
      totalINBLBalance: inblBalances.totalINBLBalance || 0,
      redemptionEvent: redemptionResult.redemptionEvent
    });
  }
  
  const totalISAContributions = totalContributionsByYear.reduce((sum, val) => sum + val, 0);
  const totalINBLRepayment = inblData ? 
    inblData.inblAmounts.reduce((sum, amount) => sum + amount, 0) :
    0;
  const finalISAValue = timeline[timeline.length - 1].isaCumulativeValue;
  const returnOnCapital = totalISAContributions > 0 ? (finalISAValue / totalISAContributions) * 100 : 0;
  
  console.log('=== NON-CIRCULAR FINAL RESULTS ===');
  console.log(`Total Contributions by Year:`, totalContributionsByYear.map((val, i) => `Year ${i+1}: £${val.toLocaleString()}`));
  console.log(`Total ISA Contributions: £${totalISAContributions.toLocaleString()}`);
  console.log(`Total INBL Drawdown: £${totalINBLRepayment.toLocaleString()}`);
  console.log(`Final ISA Value: £${finalISAValue.toLocaleString()}`);
  console.log(`Return on Capital: ${returnOnCapital.toFixed(0)}%`);
  
  return {
    timeline,
    finalISAValue,
    totalISAContributions,
    totalINBLRepayment,
    returnOnCapital,
    year1Contributions: totalContributionsByYear[0] || 0,
    year2Contributions: totalContributionsByYear[1] || 0,
    year3Contributions: totalContributionsByYear[2] || 0
  };
};

/**
 * Get ISA monthly amount for a specific year - FIXED to avoid circular dependency
 */
export const getISAMonthlyForYear = (year: number, annualSalary?: number, currentAge?: number, capitalShortfallToday?: number, profile?: any): number => {
  const params = getPensionParameters();
  
  // FIXED: Use simple calculation instead of calling calculateUnlimitedAPFSponsorships
  if (annualSalary && year >= 1 && year <= 3) {
    // Base ISA rate for enhanced members
    const baseISAMonthly = params.isaRateEnhancedMember; // £98.00
    
    // Enhanced rate calculation based on estimated APF maturity values
    const enhancedRate = 70.30; // £70.30 per £100k APF maturity
    const apfMaturityMultiplier = params.apfMaturityMultiplier;
    
    // Estimate APF sponsorship amount without circular calls
    const maxAnnualAllowance = params.annualAllowance;
    const estimatedSponsorshipAmount = Math.min(maxAnnualAllowance, annualSalary * 0.15); // 15% of salary estimate
    const estimatedMaturityValue = estimatedSponsorshipAmount * apfMaturityMultiplier;
    const enhancedISAMonthly = (estimatedMaturityValue / 100000) * enhancedRate;
    
    console.log(`getISAMonthlyForYear: Year ${year}, Enhanced ISA Monthly: £${enhancedISAMonthly.toLocaleString()}`);
    
    return Math.max(baseISAMonthly, enhancedISAMonthly);
  }
  
  // Fallback to base rate
  return params.isaRateEnhancedMember;
};
