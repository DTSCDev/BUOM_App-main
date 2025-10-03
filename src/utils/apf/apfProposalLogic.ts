/**
 * APF Proposal Logic for SFM-APF-42XX Series
 * Calculates APF sponsorship requirements and generates proposal data
 */

export interface APFProposalData {
  shortfallAmount: number;
  minimumYears: number;
  optimizedYears: number;
  proposedYears: string;
  maxContribution: number;
  optimizedContribution: number;
  maturityMultiplier: number;
  maxMaturityValue: number;
  optimizedMaturityValue: number;
  sponsorshipStructure: APFSponsorshipYear[];
}

export interface APFSponsorshipYear {
  year: number;
  sfmCode: string;
  type: 'M' | 'P'; // M = Maximum, P = Partial
  contribution: number;
  maturityValue: number;
}

// Constants
const APF_MATURITY_MULTIPLIER = 1.582;
const MAX_ANNUAL_PENSION_ALLOWANCE = 60000;
const PERSONAL_TAX_ALLOWANCE_1257L = 12570; // 2023/24 tax year
const OPTIMIZED_CONTRIBUTION = 47430; // £60,000 - £12,570

/**
 * Calculate APF proposal based on shortfall amount
 */
export const calculateAPFProposal = (shortfallAmount: number): APFProposalData => {
  // Calculate maximum contribution scenario
  const maxMaturityValue = MAX_ANNUAL_PENSION_ALLOWANCE * APF_MATURITY_MULTIPLIER;
  const minimumYears = Math.ceil(shortfallAmount / maxMaturityValue);
  
  // Calculate optimized contribution scenario (tax efficient)
  const optimizedMaturityValue = OPTIMIZED_CONTRIBUTION * APF_MATURITY_MULTIPLIER;
  const optimizedYearsRaw = shortfallAmount / optimizedMaturityValue;
  const optimizedYears = Math.ceil(optimizedYearsRaw + 1); // Add 1 year margin
  
  // Generate sponsorship structure
  const sponsorshipStructure = generateSponsorshipStructure(shortfallAmount, optimizedYears);
  
  return {
    shortfallAmount,
    minimumYears,
    optimizedYears,
    proposedYears: `${minimumYears} - ${optimizedYears} years`,
    maxContribution: MAX_ANNUAL_PENSION_ALLOWANCE,
    optimizedContribution: OPTIMIZED_CONTRIBUTION,
    maturityMultiplier: APF_MATURITY_MULTIPLIER,
    maxMaturityValue,
    optimizedMaturityValue,
    sponsorshipStructure
  };
};

/**
 * Generate APF sponsorship structure with SFM codes
 */
export const generateSponsorshipStructure = (
  shortfallAmount: number, 
  totalYears: number
): APFSponsorshipYear[] => {
  const structure: APFSponsorshipYear[] = [];
  let remainingShortfall = shortfallAmount;
  
  for (let year = 1; year <= totalYears; year++) {
    const isLastYear = year === totalYears;
    const yearCode = (4200 + year).toString();
    
    if (isLastYear && remainingShortfall < OPTIMIZED_CONTRIBUTION * APF_MATURITY_MULTIPLIER) {
      // Partial year - calculate exact amount needed
      const requiredContribution = remainingShortfall / APF_MATURITY_MULTIPLIER;
      structure.push({
        year,
        sfmCode: `SFM-APF-${yearCode}-P`,
        type: 'P',
        contribution: Math.round(requiredContribution),
        maturityValue: Math.round(remainingShortfall)
      });
      remainingShortfall = 0;
    } else {
      // Maximum year
      const maturityValue = OPTIMIZED_CONTRIBUTION * APF_MATURITY_MULTIPLIER;
      structure.push({
        year,
        sfmCode: `SFM-APF-${yearCode}-M`,
        type: 'M',
        contribution: OPTIMIZED_CONTRIBUTION,
        maturityValue: Math.round(maturityValue)
      });
      remainingShortfall -= maturityValue;
    }
  }
  
  return structure;
};

/**
 * Generate APF summary codes for SFM-APF-4200-X series
 */
export const generateAPFSummaryCodes = (proposalData: APFProposalData) => {
  const totalInitialContributions = proposalData.sponsorshipStructure.reduce(
    (sum, year) => sum + year.contribution, 0
  );
  const totalMaturityValue = proposalData.sponsorshipStructure.reduce(
    (sum, year) => sum + year.maturityValue, 0
  );
  
  return {
    'SFM-APF-4200-1': totalInitialContributions, // Total APF Initial Contributions
    'SFM-APF-4200-2': totalMaturityValue, // Total APF Maturity Value
    'SFM-APF-4200-3': 0, // Total INBL Principal Balance (to be calculated)
    'SFM-APF-4200-4': 0, // Total Monthly ISA Repayment Plan (to be calculated)
    'SFM-APF-4200-5': 0, // Total Time Token Reward (to be calculated)
    'SFM-APF-4200-6': null, // Unallocated
    'SFM-APF-4200-7': null, // Unallocated
    'SFM-APF-4200-8': null, // Unallocated
    'SFM-APF-4200-9': null, // Unallocated
  };
};

/**
 * Get APF proposal display text for UI
 */
export const getAPFProposalDisplayText = (proposalData: APFProposalData): string => {
  const maxYears = proposalData.sponsorshipStructure.filter(y => y.type === 'M').length;
  const hasPartialYear = proposalData.sponsorshipStructure.some(y => y.type === 'P');
  
  if (hasPartialYear) {
    return `${maxYears} full sponsorship years and a partial year ${maxYears + 1}`;
  } else {
    return `${maxYears} full sponsorship years`;
  }
};

/**
 * Validate APF proposal against system constraints
 */
export const validateAPFProposal = (proposalData: APFProposalData): boolean => {
  // Maximum 10 years of sponsorship allowed
  if (proposalData.sponsorshipStructure.length > 10) {
    return false;
  }
  
  // Each contribution must be within allowable limits
  for (const year of proposalData.sponsorshipStructure) {
    if (year.contribution > MAX_ANNUAL_PENSION_ALLOWANCE || year.contribution < 0) {
      return false;
    }
  }
  
  return true;
};