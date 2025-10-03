import { calculateFullISATimeline } from "@/utils/pension/isaTimelineCalculator";
import { getPensionParameters } from "@/utils/pensionParameters";

export const calculateISAContributions = (
  apfSponsorships: any[],
  annualSalary: number,
  currentAge: number,
  capitalShortfall: number,
  profile: any
): number => {
  let totalISAContributions = 0;
  
  try {
    console.log('APFStep4 - Calculating total ISA contributions from APF sponsorships...');
    console.log('APFStep4 - DEBUG: APF sponsorships count:', apfSponsorships?.length || 0);
    console.log('APFStep4 - DEBUG: Capital shortfall:', capitalShortfall);
    
    if (apfSponsorships && apfSponsorships.length > 0) {
      totalISAContributions = calculateAPFBasedISAContributions(apfSponsorships);
    } else {
      totalISAContributions = calculateFallbackISAContributions(
        annualSalary,
        currentAge,
        capitalShortfall,
        profile
      );
    }
    
    // Final validation
    if (isNaN(totalISAContributions) || totalISAContributions < 0) {
      console.warn('APFStep4 - Invalid ISA contributions calculated, setting to 0');
      totalISAContributions = 0;
    }
    
  } catch (error) {
    console.error('APFStep4 - Error calculating ISA timeline:', error);
    totalISAContributions = 0;
  }
  
  return totalISAContributions;
};

const calculateAPFBasedISAContributions = (apfSponsorships: any[]): number => {
  const params = getPensionParameters();
  const enhancedRate = params.isaRateEnhancedMember; // £98.00
  const inflationRate = params.pensionIncomeInflation; // 2%
  
  console.log('APFStep4 - Using APF-based ISA calculation...');
  console.log('APFStep4 - DEBUG: Enhanced rate:', enhancedRate, 'Inflation rate:', inflationRate);
  
  // Validate parameters
  if (!enhancedRate || !inflationRate) {
    console.error('APFStep4 - Invalid pension parameters:', { enhancedRate, inflationRate });
    throw new Error('Invalid pension parameters');
  }
  
  // Calculate ISA contributions for each sponsorship year
  let year1Total = 0;
  let year2Total = 0; 
  let year3Total = 0;
  
  // Calculate discrete ISA amounts for each sponsorship
  for (let i = 0; i < Math.min(apfSponsorships.length, 3); i++) {
    const sponsorship = apfSponsorships[i];
    console.log(`APFStep4 - DEBUG: Processing sponsorship ${i + 1}:`, sponsorship);
    
    const maturityValue = sponsorship.maturityValue || (sponsorship.sponsorshipAmount * params.apfMaturityMultiplier);
    const monthlyISA = (maturityValue / 100000) * enhancedRate;
    
    console.log(`APFStep4 - DEBUG: Year ${i + 1} - Maturity: £${maturityValue.toLocaleString()}, Monthly ISA: £${monthlyISA.toLocaleString()}`);
    
    // Calculate total contributions over 240 months with inflation
    let yearTotal = 0;
    for (let month = 1; month <= 240; month++) {
      const inflationYears = Math.floor((month - 1) / 12);
      const escalationYears = Math.max(0, inflationYears);
      const inflatedISA = monthlyISA * Math.pow(1 + inflationRate, escalationYears);
      yearTotal += inflatedISA;
    }
    
    if (i === 0) year1Total = yearTotal;
    if (i === 1) year2Total = yearTotal; 
    if (i === 2) year3Total = yearTotal;
    
    console.log(`APFStep4 - Year ${i + 1}: Monthly ISA £${monthlyISA.toLocaleString()}, Total over 240 months: £${yearTotal.toLocaleString()}`);
  }
  
  const total = year1Total + year2Total + year3Total;
  console.log('APFStep4 - FINAL: Total ISA contributions calculated from APF data:', total);
  
  return total;
};

const calculateFallbackISAContributions = (
  annualSalary: number,
  currentAge: number,
  capitalShortfall: number,
  profile: any
): number => {
  console.log('APFStep4 - Using fallback ISA calculation...');
  console.log('APFStep4 - DEBUG: Fallback params:', {
    annualSalary,
    currentAge,
    capitalShortfall,
    hasProfile: !!profile
  });
  
  if (capitalShortfall > 0) {
    const isaTimeline = calculateFullISATimeline(
      annualSalary,
      currentAge,
      capitalShortfall,
      profile
    );
    const total = isaTimeline?.totalISAContributions || 0;
    console.log('APFStep4 - Fallback ISA timeline calculated:', { totalISAContributions: total });
    return total;
  } else {
    console.log('APFStep4 - No capital shortfall, ISA contributions set to 0');
    return 0;
  }
};