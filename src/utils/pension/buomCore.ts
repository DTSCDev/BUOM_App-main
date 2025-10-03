import { calculateUnlimitedAPFSponsorships } from './apfSponsorshipCalculations';
import { calculatePayslipComparison } from './payslipCalculations';
import { generateYearlyBUOMData } from './buomYearlyDataGenerator';
import { calculateUnifiedPensionMetrics } from './unifiedCalculationEngine';
import { 
  BUOMCalculationResult
} from './buomTypes';

export const calculateBUOMPlan = (
  currentAge: number,
  annualSalary: number,
  existingPensionValue: number = 0,
  finalSalaryIncome: number = 0,
  otherIncome: number = 0,
  isEnhancedMember: boolean = false
): BUOMCalculationResult => {
  console.log('=== BUOM CALCULATION START - USING DYNAMIC DATES ===');
  console.log(`Current year: ${new Date().getFullYear()}`);
  
  // Use the corrected unified calculation engine
  const unifiedResult = calculateUnifiedPensionMetrics(
    currentAge,
    annualSalary,
    existingPensionValue,
    isEnhancedMember
  );
  
  // Calculate APF Sponsorships without 5-year limit - use retirement shortfall
  const apfSponsorships = calculateUnlimitedAPFSponsorships(
    currentAge, 
    unifiedResult.currentCapitalShortfall, 
    annualSalary,
    isEnhancedMember
  );
  const activeAPFYears = apfSponsorships.map(s => s.year);
  
  console.log('=== APF SPONSORSHIPS WITH DYNAMIC DATES ===');
  apfSponsorships.forEach((sponsorship, index) => {
    console.log(`Sponsorship ${index + 1}: Year ${sponsorship.year} (${sponsorship.taxYear}), Age ${sponsorship.age}`);
  });
  
  // Calculate Net Pay Impact (AE contributions cease during APF years)
  const payslipComparison = calculatePayslipComparison(annualSalary);
  
  // Generate yearly projections using the corrected unified engine results
  const yearlyData = generateYearlyBUOMData(
    currentAge,
    annualSalary,
    existingPensionValue,
    unifiedResult.yearsToRetirement,
    apfSponsorships,
    payslipComparison
  );
  
  // Update yearly data with final salary and other income
  yearlyData.forEach(year => {
    year.finalSalaryIncome = finalSalaryIncome;
    year.incomeShortfall = Math.max(0, year.targetIncome - (year.age >= 67 ? year.statePensionToday : 0) - finalSalaryIncome - otherIncome);
  });
  
  // Check if plan eliminates shortfall by retirement
  const finalYear = yearlyData[yearlyData.length - 1];
  const totalMaturityValue = apfSponsorships.reduce((sum, s) => sum + s.maturityValue, 0);
  const meetsShortfall = (totalMaturityValue + unifiedResult.totalProjectedAssets) >= unifiedResult.requiredCapital;
  
  console.log('=== BUOM CORE RESULTS - USING DYNAMIC DATES ===');
  console.log(`Total projected assets (unified): £${unifiedResult.totalProjectedAssets.toLocaleString()}`);
  console.log(`AE future contributions (unified): £${unifiedResult.totalFutureAEContributions.toLocaleString()}`);
  console.log(`Capital shortfall: £${unifiedResult.currentCapitalShortfall.toLocaleString()}`);
  
  return {
    yearlyData,
    apfSponsorships,
    totalAPFFunding: apfSponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0),
    totalMaturityValue: totalMaturityValue,
    totalISARequired: apfSponsorships.reduce((sum, s) => sum + s.isaAnnualRequired, 0),
    currentCapitalShortfall: unifiedResult.currentCapitalShortfall,
    projectedShortfallEliminated: meetsShortfall
  };
};
