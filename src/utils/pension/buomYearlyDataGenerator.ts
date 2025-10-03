import { compoundingCalculator } from './compoundingUtils';
import { getPensionParameters } from '../pensionParameters';
import { getCurrentStatePension } from './salaryCalculations';
import { BUOMYearlyCalculation, APFSponsorshipBreakdown } from './buomTypes';
import { calculateAPFValue } from './apfSponsorshipCalculations';

export const generateYearlyBUOMData = (
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number,
  yearsToRetirement: number,
  apfSponsorships: APFSponsorshipBreakdown[],
  payslipComparison: any
): BUOMYearlyCalculation[] => {
  const { drawdownRate } = getPensionParameters();
  const activeAPFYears = apfSponsorships.map(s => s.year);
  
  const yearlyData: BUOMYearlyCalculation[] = [];
  let cumulativeShortfallReduction = 0;
  let cumulativeAEContributions = 0;
  
  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = currentAge + year;
    const isAPFActiveYear = activeAPFYears.includes(year + 1);
    
    // Check for APF maturities this year
    let apfMaturityReduction = 0;
    apfSponsorships.forEach(sponsorship => {
      if (age === sponsorship.maturityAge) {
        apfMaturityReduction += sponsorship.maturityValue;
      }
    });
    
    cumulativeShortfallReduction += apfMaturityReduction;
    
    // Calculate AE contributions for this year using Parameters
    let yearAEContribution = 0;
    if (year > 0 && !isAPFActiveYear) {
      const inflatedSalary = compoundingCalculator.applyAnnualInflation(annualSalary, year, 'salary');
      const pensionableEarnings = inflatedSalary * 0.85; // 85% pensionable pay
      yearAEContribution = pensionableEarnings * 0.08; // 8% total contribution
      
      const monthsOfGrowth = (yearsToRetirement - year) * 12;
      cumulativeAEContributions += compoundingCalculator.compoundMonthly(yearAEContribution, monthsOfGrowth);
    }
    
    // Inflated values for this year using Parameters
    const salaryWithInflation = compoundingCalculator.applyAnnualInflation(annualSalary, year, 'salary');
    const statePensionToday = compoundingCalculator.applyAnnualInflation(getCurrentStatePension() * 52, year, 'pension');
    const targetIncome = salaryWithInflation * compoundingCalculator.params.pensionIncomeTarget;
    
    // Existing plan progression with Parameters-based growth
    const monthsElapsed = year * 12;
    const existingPlanValue = compoundingCalculator.compoundMonthly(existingPensionValue, monthsElapsed);
    const existingPlanIncome = existingPlanValue * drawdownRate;
    
    // Calculate APF asset value (accruing but not reducing shortfall until maturity)
    let apfAssetValue = 0;
    apfSponsorships.forEach(sponsorship => {
      if (age >= currentAge + sponsorship.year) {
        const monthsElapsed = Math.max(0, (age - (currentAge + sponsorship.year)) * 12);
        apfAssetValue += calculateAPFValue(sponsorship.sponsorshipAmount, monthsElapsed);
      }
    });
    
    // Calculate ISA values
    const isaValue = calculateISAValue(age, currentAge, apfSponsorships);
    
    // Calculate capital shortfall
    const currentCapitalShortfall = calculateCapitalShortfall(
      age,
      targetIncome,
      drawdownRate,
      existingPlanValue,
      cumulativeAEContributions,
      cumulativeShortfallReduction,
      statePensionToday
    );
    
    // BUOM total value - Only APF + ISA (excludes existing plan)
    const buomTotalValue = apfAssetValue + isaValue;
    
    yearlyData.push({
      age,
      year,
      salaryWithInflation,
      statePensionToday,
      finalSalaryIncome: 0, // Set from calling function if needed
      targetIncome,
      incomeShortfall: Math.max(0, targetIncome - (age >= 67 ? statePensionToday : 0)),
      requiredLumpSum: targetIncome / drawdownRate,
      existingPlanValue,
      existingPlanIncome,
      capitalShortfall: currentCapitalShortfall,
      apfAssetValue,
      isaValue,
      buomTotalValue,
      netPayWithAE: payslipComparison.beforeAPF.netPay,
      netPayWithoutAE: payslipComparison.duringAPF.netPay,
      availableForISA: payslipComparison.difference.availableForISA,
      isAPFActiveYear,
      apfMaturityReduction,
      aeContributionThisYear: yearAEContribution,
      cumulativeAEContributions
    });
  }
  
  return yearlyData;
};

const calculateISAValue = (
  age: number,
  currentAge: number,
  apfSponsorships: APFSponsorshipBreakdown[]
): number => {
  let isaValue = 0;
  
  apfSponsorships.forEach(sponsorship => {
    const sponsorshipStartAge = currentAge + sponsorship.year;
    const sponsorshipMaturityAge = sponsorship.maturityAge;
    
    // FIXED: ISA contributions start immediately from current age, not sponsorship start age
    if (age >= currentAge && age < sponsorshipMaturityAge) {
      // Calculate months accumulated from current age (not sponsorship start age)
      let monthsAccumulated = 0;
      
      if (age === currentAge) {
        // FIXED: For current year, start from July (next payday) - 6 months remaining in year
        monthsAccumulated = Math.max(0, 6); // July to December = 6 months
      } else if (age < sponsorshipStartAge) {
        // Before sponsorship starts but ISA contributions continue
        monthsAccumulated = (age - currentAge) * 12 + 6; // Full years plus partial current year
      } else {
        // After sponsorship starts
        monthsAccumulated = (age - currentAge) * 12 + 6; // Full years plus partial current year
      }
      
      if (monthsAccumulated > 0) {
        const monthlyISA = sponsorship.isaMonthlyRequired;
        const { futureValue } = compoundingCalculator.escalatingMonthlyContributions(monthlyISA, monthsAccumulated);
        isaValue += futureValue;
      }
    }
  });
  
  return isaValue;
};

const calculateCapitalShortfall = (
  age: number,
  targetIncome: number,
  drawdownRate: number,
  existingPlanValue: number,
  cumulativeAEContributions: number,
  cumulativeShortfallReduction: number,
  statePensionToday: number
): number => {
  // FIXED: Capital shortfall calculation for protection planning
  // Use TODAY's protection shortfall logic that increases gradually until state pension kicks in
  let currentCapitalShortfall: number;
  
  if (age < 67) {
    // Before state pension age - use protection shortfall (no state pension deduction)
    const baseProtectionShortfall = (targetIncome / drawdownRate) - existingPlanValue - cumulativeAEContributions;
    currentCapitalShortfall = Math.max(0, baseProtectionShortfall - cumulativeShortfallReduction);
  } else {
    // At/after state pension age - deduct state pension value
    const statePensionCapitalValue = statePensionToday / drawdownRate;
    const baseRetirementShortfall = (targetIncome / drawdownRate) - existingPlanValue - cumulativeAEContributions - statePensionCapitalValue;
    currentCapitalShortfall = Math.max(0, baseRetirementShortfall - cumulativeShortfallReduction);
  }
  
  return currentCapitalShortfall;
};
