import { APFSponsorshipBreakdown } from './buomTypes';
import { getPensionParameters } from '../pensionParameters';
import { compoundingCore } from './compoundingCore';
import { salaryExchangeValidator } from './salaryExchangeValidation';

export const calculateUnlimitedAPFSponsorships = (
  currentAge: number,
  maturityValueRequired: number,
  annualSalary: number,
  isEnhancedMember: boolean = true,
  profile?: any
): APFSponsorshipBreakdown[] => {
  const params = getPensionParameters();
  const sponsorships: APFSponsorshipBreakdown[] = [];
  
  console.log('=== APF SPONSORSHIP CALCULATIONS - FIXED TERMINATION LOGIC ===');
  console.log(`Maturity value required: £${maturityValueRequired.toLocaleString()}`);
  console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
  console.log(`Enhanced Member: ${isEnhancedMember}`);
  
  // Input validation
  if (isNaN(maturityValueRequired) || isNaN(annualSalary) || maturityValueRequired <= 0) {
    console.warn('Invalid inputs for APF sponsorship calculation');
    return [];
  }
  
  // Extract profile information for constraints
  const taxCode = profile?.paye_tax_code || '1257L';
  const isDirector = profile?.is_director || false;
  const hasControllingShares = profile?.has_controlling_shares || false;
  
  console.log(`Tax code: ${taxCode}, Is director: ${isDirector}`);
  
  // FIXED: Pro-rata ISA calculation based on actual maturity value
  const calculateSimpleISAMonthly = (maturityValue: number): number => {
    // Pro-rata calculation: (maturity value / £100k) * £98.00
    const baseISARate = params.isaRateEnhancedMember; // £98.00
    return (maturityValue / 100000) * baseISARate;
  };
  
  // Apply salary exchange constraints
  const maxAnnualAllowance = params.annualAllowance;
  
  let cumulativeMaturityValue = 0;
  let year = 1;
  
  // Use current year instead of hardcoded year
  const currentYear = new Date().getFullYear();
  
  console.log(`Starting APF calculations for current year: ${currentYear}`);
  console.log(`Target maturity value: £${maturityValueRequired.toLocaleString()}`);
  
  // HARD LIMIT: Never more than 2 years regardless of target
  while (cumulativeMaturityValue < maturityValueRequired && year <= 2) {
    console.log(`\n--- YEAR ${year} CALCULATION ---`);
    console.log(`Cumulative maturity value so far: £${cumulativeMaturityValue.toLocaleString()}`);
    console.log(`Target maturity value: £${maturityValueRequired.toLocaleString()}`);
    
    // Calculate what we still need in maturity value
    const remainingMaturityNeeded = maturityValueRequired - cumulativeMaturityValue;
    const remainingFundingNeeded = remainingMaturityNeeded / params.apfMaturityMultiplier;
    
    console.log(`Remaining maturity needed: £${remainingMaturityNeeded.toLocaleString()}`);
    console.log(`Remaining funding needed: £${remainingFundingNeeded.toLocaleString()}`);
    
    // FIXED: Calculate target sponsorship amount based on what's actually needed
    let targetSponsorshipAmount;
    
    if (year <= 2) {
      // For first 2 years, respect annual allowance limit but don't exceed what's needed
      targetSponsorshipAmount = Math.min(remainingFundingNeeded, maxAnnualAllowance);
    } else {
      // For subsequent years, use exactly what's needed (no more)
      targetSponsorshipAmount = remainingFundingNeeded;
    }
    
    console.log(`Target sponsorship for Year ${year}: £${targetSponsorshipAmount.toLocaleString()}`);
    
    // Apply salary exchange validation
    const validationResult = salaryExchangeValidator.validateSalaryExchange(
      annualSalary,
      targetSponsorshipAmount,
      taxCode,
      isDirector,
      hasControllingShares
    );
    
    const feasibleSponsorshipAmount = validationResult.feasibleAmount;
    const isConstrained = validationResult.isConstrained;
    const constraintReason = salaryExchangeValidator.getPrimaryConstraintReason(validationResult.constraints);
    
    console.log(`Feasible amount: £${feasibleSponsorshipAmount.toLocaleString()}`);
    console.log(`Constrained: ${isConstrained}, Reason: ${constraintReason}`);
    
    // Ensure we don't create zero sponsorships
    if (feasibleSponsorshipAmount <= 0.01) {
      console.log(`Breaking: Feasible sponsorship amount too low`);
      break;
    }
    
    const roundedSponsorshipAmount = Math.round(feasibleSponsorshipAmount * 100) / 100;
    const maturityValue = roundedSponsorshipAmount * params.apfMaturityMultiplier;
    
    // FIXED: Check if this sponsorship would exceed our target
    const potentialCumulativeMaturity = cumulativeMaturityValue + maturityValue;
    
    if (potentialCumulativeMaturity > maturityValueRequired) {
      // We need a partial sponsorship for the final year
      const exactMaturityNeeded = maturityValueRequired - cumulativeMaturityValue;
      const exactFundingNeeded = exactMaturityNeeded / params.apfMaturityMultiplier;
      
      console.log(`🚨 PARTIAL YEAR ${year} NEEDED: Exact funding needed: £${exactFundingNeeded.toLocaleString()}`);
      console.log(`🚨 PARTIAL YEAR ${year}: Target remaining: £${exactMaturityNeeded.toLocaleString()}`);
      console.log(`🚨 PARTIAL YEAR ${year}: Would have been full amount: £${feasibleSponsorshipAmount.toLocaleString()}`);
      
      // Apply validation to the partial amount
      const partialValidationResult = salaryExchangeValidator.validateSalaryExchange(
        annualSalary,
        exactFundingNeeded,
        taxCode,
        isDirector,
        hasControllingShares
      );
      
      const partialFeasibleAmount = partialValidationResult.feasibleAmount;
      const partialMaturityValue = partialFeasibleAmount * params.apfMaturityMultiplier;
      
      console.log(`🚨 PARTIAL YEAR ${year}: Final partial amount: £${partialFeasibleAmount.toLocaleString()}`);
      console.log(`🚨 PARTIAL YEAR ${year}: Partial maturity: £${partialMaturityValue.toLocaleString()}`);
      
      // Age calculation using actual current age
      const ageAtSponsorship = currentAge + (year - 1);
      const maturityAge = ageAtSponsorship + 21;
      
      // Calculate tax year properly
      const sponsorshipYear = currentYear + year - 1;
      const taxYear = `${sponsorshipYear}/${String(sponsorshipYear + 1).slice(-2)}`;
      
      // Get ISA requirements for this year using actual maturity value
      const isaMonthlyRequired = calculateSimpleISAMonthly(partialMaturityValue);
      const isaAnnualRequired = isaMonthlyRequired * 12;
      
      console.log(`Creating PARTIAL sponsorship: Year ${year}, Amount: £${partialFeasibleAmount.toLocaleString()}`);
      console.log(`Partial maturity value: £${partialMaturityValue.toLocaleString()}`);
      
      sponsorships.push({
        year,
        age: ageAtSponsorship,
        sponsorshipAmount: Math.round(partialFeasibleAmount * 100) / 100,
        taxYear,
        monthsToMaturity: 252,
        maturityValue: partialMaturityValue,
        isaMonthlyRequired,
        isaAnnualRequired,
        maturityAge,
        salaryExchangeConstrained: partialValidationResult.isConstrained,
        constraintReason: salaryExchangeValidator.getPrimaryConstraintReason(partialValidationResult.constraints)
      });
      
      // Update cumulative and break - we've met our target
      cumulativeMaturityValue += partialMaturityValue;
      console.log(`FINAL CUMULATIVE MATURITY: £${cumulativeMaturityValue.toLocaleString()}`);
      break;
    }
    
    // Update cumulative maturity value for full sponsorship
    cumulativeMaturityValue += maturityValue;
    
    // Age calculation using actual current age
    const ageAtSponsorship = currentAge + (year - 1);
    const maturityAge = ageAtSponsorship + 21;
    
    // Calculate tax year properly
    const sponsorshipYear = currentYear + year - 1;
    const taxYear = `${sponsorshipYear}/${String(sponsorshipYear + 1).slice(-2)}`;
    
    // Get ISA requirements for this year using actual maturity value
    const isaMonthlyRequired = calculateSimpleISAMonthly(maturityValue);
    const isaAnnualRequired = isaMonthlyRequired * 12;
    
    console.log(`Creating FULL sponsorship: Year ${year}, Age ${ageAtSponsorship}, Tax Year ${taxYear}`);
    console.log(`Sponsorship amount: £${roundedSponsorshipAmount.toLocaleString()}`);
    console.log(`Maturity value: £${maturityValue.toLocaleString()}`);
    console.log(`Cumulative maturity after this year: £${cumulativeMaturityValue.toLocaleString()}`);
    
    sponsorships.push({
      year,
      age: ageAtSponsorship,
      sponsorshipAmount: roundedSponsorshipAmount,
      taxYear,
      monthsToMaturity: 252,
      maturityValue,
      isaMonthlyRequired,
      isaAnnualRequired,
      maturityAge,
      salaryExchangeConstrained: isConstrained,
      constraintReason
    });
    
    // FIXED: Check if we've met the maturity value target after this full sponsorship
    if (cumulativeMaturityValue >= maturityValueRequired) {
      console.log(`TARGET ACHIEVED: Cumulative maturity value £${cumulativeMaturityValue.toLocaleString()} meets target £${maturityValueRequired.toLocaleString()}`);
      break;
    }
    
    year++;
  }
  
  console.log(`\n=== FINAL APF SPONSORSHIP RESULTS (FIXED LOGIC) ===`);
  console.log(`Total sponsorships created: ${sponsorships.length}`);
  
  const totalInitialFunding = sponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0);
  const totalMaturityValue = sponsorships.reduce((sum, s) => sum + s.maturityValue, 0);
  
  console.log(`Total initial funding distributed: £${totalInitialFunding.toLocaleString()}`);
  console.log(`Total maturity value: £${totalMaturityValue.toLocaleString()}`);
  console.log(`Target maturity value was: £${maturityValueRequired.toLocaleString()}`);
  console.log(`Difference: £${Math.abs(totalMaturityValue - maturityValueRequired).toLocaleString()}`);
  console.log(`SUCCESS: Only ${sponsorships.length} sponsorships needed (no unused years)`);
  
  return sponsorships;
};

export const calculateAPFValue = (sponsorshipAmount: number, monthsElapsed: number, currentAge?: number): number => {
  if (sponsorshipAmount <= 0) return 0;
  
  const params = getPensionParameters();
  
  // 4-stage APF pricing with post-maturity growth using parameters
  if (monthsElapsed <= 120) return sponsorshipAmount * 1.00;
  if (monthsElapsed <= 180) return sponsorshipAmount * 1.25;
  if (monthsElapsed <= 240) return sponsorshipAmount * 1.375;
  if (monthsElapsed <= 252) return sponsorshipAmount * params.apfMaturityMultiplier;
  
  // Post-maturity growth using parameters
  let baseValue = sponsorshipAmount * params.apfMaturityMultiplier;
  const monthsPostMaturity = monthsElapsed - 252;
  
  if (monthsPostMaturity > 0 && currentAge !== undefined) {
    const isPostRetirement = currentAge >= params.retirementAge;
    const monthlyGrowthRate = isPostRetirement 
      ? (params.growthRateDrawdown - params.providerCharges) / 12
      : (params.growthRateAccumulation - params.providerCharges) / 12;
    
    baseValue = baseValue * Math.pow(1 + monthlyGrowthRate, monthsPostMaturity);
  }
  
  return baseValue;
};

/**
 * FIXED: Calculate APF sponsorships based on user's ACTUAL shortfall need
 * This function respects the user's actual funding requirement rather than generating unlimited sponsorships
 */
export const calculateActualSponsorshipsFromShortfall = (
  currentAge: number,
  annualSalary: number,
  userShortfallAmount: number, // The actual shortfall need (e.g., £129,942)
  isEnhancedMember: boolean = true,
  profile?: any
): APFSponsorshipBreakdown[] => {
  const params = getPensionParameters();
  const sponsorships: APFSponsorshipBreakdown[] = [];
  
  console.log('=== ACTUAL SHORTFALL-BASED SPONSORSHIP CALCULATION ===');
  console.log(`User's actual shortfall amount: £${userShortfallAmount.toLocaleString()}`);
  console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
  console.log(`Enhanced Member: ${isEnhancedMember}`);
  
  // Input validation
  if (isNaN(userShortfallAmount) || isNaN(annualSalary) || userShortfallAmount <= 0) {
    console.warn('Invalid inputs for actual shortfall sponsorship calculation');
    return [];
  }

  // Extract profile information for constraints
  const taxCode = profile?.paye_tax_code || '1257L';
  const isDirector = profile?.is_director || false;
  const hasControllingShares = profile?.has_controlling_shares || false;

  // FIXED: Calculate pro-rata ISA based on actual APF maturity value
  const calculateProRataISAMonthly = (maturityValue: number): number => {
    // £98 per £100k of APF Maturity Value (as mentioned by user)
    const baseISARate = 98.00; // User specified this rate
    return (maturityValue / 100000) * baseISARate;
  };

  // Apply salary exchange constraints
  const maxAnnualAllowance = params.annualAllowance;
  
  let remainingShortfall = userShortfallAmount;
  let year = 1;
  
  // Use current year instead of hardcoded year
  const currentYear = new Date().getFullYear();
  
  console.log(`Starting actual shortfall sponsorship calculations for current year: ${currentYear}`);
  console.log(`Total shortfall to fund: £${userShortfallAmount.toLocaleString()}`);
  
  // HARD LIMIT: Never more than 2 years regardless of shortfall
  while (remainingShortfall > 0.01 && year <= 2) {
    console.log(`\n--- YEAR ${year} ACTUAL SHORTFALL CALCULATION ---`);
    console.log(`Remaining shortfall to fund: £${remainingShortfall.toLocaleString()}`);
    
    // Calculate target sponsorship amount based on remaining shortfall
    let targetSponsorshipAmount = Math.min(remainingShortfall, maxAnnualAllowance);
    
    console.log(`Target sponsorship for Year ${year}: £${targetSponsorshipAmount.toLocaleString()}`);
    
    // Apply salary exchange validation
    const validationResult = salaryExchangeValidator.validateSalaryExchange(
      annualSalary,
      targetSponsorshipAmount,
      taxCode,
      isDirector,
      hasControllingShares
    );
    
    const feasibleSponsorshipAmount = validationResult.feasibleAmount;
    const isConstrained = validationResult.isConstrained;
    const constraintReason = salaryExchangeValidator.getPrimaryConstraintReason(validationResult.constraints);
    
    console.log(`Feasible amount: £${feasibleSponsorshipAmount.toLocaleString()}`);
    console.log(`Constrained: ${isConstrained}, Reason: ${constraintReason}`);
    
    // Ensure we don't create zero sponsorships
    if (feasibleSponsorshipAmount <= 0.01) {
      console.log(`Breaking: Feasible sponsorship amount too low`);
      break;
    }
    
    const roundedSponsorshipAmount = Math.round(feasibleSponsorshipAmount * 100) / 100;
    const maturityValue = roundedSponsorshipAmount * params.apfMaturityMultiplier;
    
    // Update remaining shortfall
    remainingShortfall -= roundedSponsorshipAmount;
    
    // Age calculation using actual current age
    const ageAtSponsorship = currentAge + (year - 1);
    const maturityAge = ageAtSponsorship + 21;
    
    // Calculate tax year properly
    const sponsorshipYear = currentYear + year - 1;
    const taxYear = `${sponsorshipYear}/${String(sponsorshipYear + 1).slice(-2)}`;
    
    // Get ISA requirements using pro-rata calculation (£98 per £100k of APF Maturity)
    const isaMonthlyRequired = calculateProRataISAMonthly(maturityValue);
    const isaAnnualRequired = isaMonthlyRequired * 12;
    
    console.log(`Creating ACTUAL SHORTFALL sponsorship: Year ${year}, Age ${ageAtSponsorship}, Tax Year ${taxYear}`);
    console.log(`Sponsorship amount: £${roundedSponsorshipAmount.toLocaleString()}`);
    console.log(`Maturity value: £${maturityValue.toLocaleString()}`);
    console.log(`ISA monthly (pro-rata): £${isaMonthlyRequired.toLocaleString()}`);
    console.log(`Remaining shortfall after this year: £${remainingShortfall.toLocaleString()}`);
    
    sponsorships.push({
      year,
      age: ageAtSponsorship,
      sponsorshipAmount: roundedSponsorshipAmount,
      taxYear,
      monthsToMaturity: 252,
      maturityValue,
      isaMonthlyRequired,
      isaAnnualRequired,
      maturityAge,
      salaryExchangeConstrained: isConstrained,
      constraintReason
    });
    
    // FIXED: Stop when shortfall is fully funded
    if (remainingShortfall <= 0.01) {
      console.log(`SHORTFALL FULLY FUNDED: All £${userShortfallAmount.toLocaleString()} has been addressed`);
      break;
    }
    
    year++;
  }
  
  console.log(`\n=== ACTUAL SHORTFALL SPONSORSHIP RESULTS ===`);
  console.log(`Total sponsorships created: ${sponsorships.length}`);
  
  const totalInitialFunding = sponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0);
  const totalMaturityValue = sponsorships.reduce((sum, s) => sum + s.maturityValue, 0);
  const shortfallRemainingUnfunded = Math.max(0, userShortfallAmount - totalInitialFunding);
  
  console.log(`Total initial funding distributed: £${totalInitialFunding.toLocaleString()}`);
  console.log(`Total maturity value: £${totalMaturityValue.toLocaleString()}`);
  console.log(`User's shortfall requirement was: £${userShortfallAmount.toLocaleString()}`);
  console.log(`Shortfall remaining unfunded: £${shortfallRemainingUnfunded.toLocaleString()}`);
  console.log(`SUCCESS: ${sponsorships.length} sponsorships address user's actual shortfall (no fugazi unlimited years)`);
  
  return sponsorships;
};
