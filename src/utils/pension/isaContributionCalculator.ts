
import { getPensionParameters } from '../pensionParameters';
import { ISA_CALCULATION_CONSTANTS } from './isaConstants';
import { calculateAPFMaturityBasedISA } from './apfMaturityISACalculator';

export const calculateISAContributions = (month: number, apfSponsorships?: any[]) => {
  const params = getPensionParameters();
  const annualInflationRate = params.pensionIncomeInflation; // 2% p.a.
  
  let year1ISAMonthly = 0;
  let year2ISAMonthly = 0;
  let year3ISAMonthly = 0;
  
  // FIXED: Only use APF-based calculation if we have actual sponsorship data
  if (apfSponsorships && apfSponsorships.length > 0) {
    const isaMaturityResult = calculateAPFMaturityBasedISA(apfSponsorships);
    
    console.log(`=== DYNAMIC ISA CONTRIBUTIONS (Month ${month}) ===`);
    console.log(`Using ${apfSponsorships.length} actual sponsorships (not hardcoded 3)`);
    console.log(`Base ISA rates: Year 1: £${isaMaturityResult.year1MonthlyISA.toLocaleString()}, Year 2: £${isaMaturityResult.year2MonthlyISA.toLocaleString()}, Year 3: £${isaMaturityResult.year3MonthlyISA.toLocaleString()}`);
    
    // FIXED: Only apply ISA contributions for years that actually have sponsorships
    const actualSponsorshipsCount = apfSponsorships.length;
    
    // DYNAMIC: Calculate ISA contributions based on actual sponsorship count
    const sponsorshipISAData = [];
    
    // Process each actual sponsorship dynamically
    for (let trancheIndex = 0; trancheIndex < actualSponsorshipsCount; trancheIndex++) {
      const trancheStartMonth = ISA_CALCULATION_CONSTANTS.FIRST_TRANCHE_START + (trancheIndex * ISA_CALCULATION_CONSTANTS.TRANCHE_START_OFFSET);
      const trancheEndMonth = trancheStartMonth + ISA_CALCULATION_CONSTANTS.CONTRIBUTION_MONTHS_PER_TRANCHE - 1;
      
      if (month >= trancheStartMonth && month <= trancheEndMonth) {
        const inflationYears = Math.floor((month - trancheStartMonth) / 12);
        const escalationYears = Math.max(0, inflationYears);
        
        // Get the appropriate ISA monthly amount for this tranche
        let trancheISAMonthly = 0;
        if (trancheIndex === 0) {
          trancheISAMonthly = isaMaturityResult.year1MonthlyISA;
        } else if (trancheIndex === 1) {
          trancheISAMonthly = isaMaturityResult.year2MonthlyISA;
        } else if (trancheIndex === 2) {
          trancheISAMonthly = isaMaturityResult.year3MonthlyISA;
        }
        
        const adjustedISAAmount = trancheISAMonthly * Math.pow(1 + annualInflationRate, escalationYears);
        sponsorshipISAData.push({
          tranche: trancheIndex + 1,
          isaMonthly: adjustedISAAmount
        });
      }
    }
    
    // Map to legacy variable names for backward compatibility
    year1ISAMonthly = sponsorshipISAData.find(s => s.tranche === 1)?.isaMonthly || 0;
    year2ISAMonthly = sponsorshipISAData.find(s => s.tranche === 2)?.isaMonthly || 0;
    year3ISAMonthly = sponsorshipISAData.find(s => s.tranche === 3)?.isaMonthly || 0;
    
    console.log(`Month ${month} ISA contributions: Year 1: £${year1ISAMonthly.toLocaleString()}, Year 2: £${year2ISAMonthly.toLocaleString()}, Year 3: £${year3ISAMonthly.toLocaleString()}`);
    console.log(`Based on ${actualSponsorshipsCount} actual sponsorships`);
    
  } else {
    // NO FALLBACK LOGIC - Dashboard should ONLY use SFM codes
    console.log(`🚨🚨🚨 NO APF DATA - DASHBOARD SHOULD NOT USE THIS FUNCTION!`);
    console.log(`🚨🚨🚨 Use SFM codes directly instead of fallback calculations!`);
    return {
      year1ISAMonthly: 0,
      year2ISAMonthly: 0,
      year3ISAMonthly: 0,
      totalISAMonthly: 0
    };
  }
  
  return {
    year1ISAMonthly,
    year2ISAMonthly,
    year3ISAMonthly,
    totalISAMonthly: year1ISAMonthly + year2ISAMonthly + year3ISAMonthly
  };
};
