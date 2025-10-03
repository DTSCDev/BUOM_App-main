import { calculateUnlimitedAPFSponsorships, calculateAPFValue } from './apfSponsorshipCalculations';
import { BUOMCalculationResult, YearlyProjectionData } from './buomTypes';
import { getPensionParameters } from '../pensionParameters';
import { compoundingCore } from './compoundingCore';

export type { BUOMCalculationResult } from './buomTypes';

export function calculateBUOMPlan(
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  existingISAValue: number = 0,
  existingGeneralSavings: number = 0,
  isEnhancedMember: boolean = false
): BUOMCalculationResult {
  const params = getPensionParameters();
  
  // Calculate target income and required capital
  const targetIncomeToday = annualSalary * params.pensionIncomeTarget;
  const requiredCapitalToday = targetIncomeToday / params.drawdownRate;
  const currentCapitalShortfall = Math.max(0, requiredCapitalToday - existingPensionValue);
  
  console.log('=== BUOM PLAN CALCULATION - WITH SALARY EXCHANGE CONSTRAINTS ===');
  console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
  console.log(`Current capital shortfall: £${currentCapitalShortfall.toLocaleString()}`);
  
  // FIXED: Pass annual salary to sponsorship calculations
  const apfSponsorships = calculateUnlimitedAPFSponsorships(
    currentAge,
    currentCapitalShortfall,
    annualSalary,
    isEnhancedMember
  );
  
  // Calculate totals
  const totalAPFFunding = apfSponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0);
  const totalMaturityValue = apfSponsorships.reduce((sum, s) => sum + s.maturityValue, 0);
  const totalISARequired = apfSponsorships.reduce((sum, s) => sum + s.isaAnnualRequired, 0);
  
  // Generate yearly projection data
  const yearlyData: YearlyProjectionData[] = [];
  const retirementAge = params.retirementAge;
  const maxAge = Math.min(Math.max(...apfSponsorships.map(s => s.maturityAge)) + 2, params.maxChartAge);
  
  for (let year = 0; year <= (maxAge - currentAge); year++) {
    const age = currentAge + year;
    
    // Calculate APF asset values at this age
    let totalAPFValue = 0;
    apfSponsorships.forEach(sponsorship => {
      const monthsElapsed = Math.max(0, (age - sponsorship.age) * 12);
      const apfValue = calculateAPFValue(sponsorship.sponsorshipAmount, monthsElapsed, age);
      totalAPFValue += apfValue;
    });
    
    // Calculate ISA value (simplified projection)
    const yearsOfISAContributions = Math.max(0, year);
    const averageISAContribution = totalISARequired / apfSponsorships.length;
    const isaValue = existingISAValue + (averageISAContribution * yearsOfISAContributions);
    
    // Calculate remaining shortfall
    const totalValue = totalAPFValue + isaValue;
    const inflatedTargetCapital = requiredCapitalToday * Math.pow(1 + params.pensionIncomeInflation, year);
    const capitalShortfall = Math.max(0, inflatedTargetCapital - totalValue - existingPensionValue);
    
    yearlyData.push({
      age,
      year,
      capitalShortfall,
      apfAssetValue: totalAPFValue,
      isaValue,
      buomTotalValue: totalValue,
      sponsorshipThisYear: apfSponsorships.find(s => s.age === age)
    });
  }
  
  return {
    yearlyData,
    apfSponsorships,
    totalAPFFunding,
    totalMaturityValue,
    totalISARequired,
    currentCapitalShortfall,
    projectedShortfallEliminated: yearlyData[yearlyData.length - 1]?.capitalShortfall === 0
  };
}
