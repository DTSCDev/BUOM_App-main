import React from 'react';
import { calculateEnhancedTax, EmploymentDetails } from '@/utils/pension/enhancedTaxCalculations';
import DetailedPensionContributions from './DetailedPensionContributions';
import AffordabilityHeader from './AffordabilityChecker/AffordabilityHeader';
import AffordabilityAlert from './AffordabilityChecker/AffordabilityAlert';
import FundingOptionsCard from './AffordabilityChecker/FundingOptionsCard';
import PLSAStandardsSection from './AffordabilityChecker/PLSAStandardsSection';
import { PensionCalculationResults } from '@/types/pension';

interface AffordabilityCheckerProps {
  monthlyFundingCost: number;
  results: PensionCalculationResults;
  onChangeTab: (tab: string) => void;
}

/**
 * Calculate escalating monthly payment (PMT) with annual contribution increases
 * This maintains the inflation element for both salary and contributions
 */
function calculateInflationAdjustedPMT(
  targetAmount: number,
  totalMonths: number,
  annualGrowthRate: number = 0.045, // 4.5% net growth (5% gross - 0.5% fees)
  annualInflationRate: number = 0.02  // 2% inflation
): number {
  if (totalMonths <= 0 || targetAmount <= 0) return 0;
  
  const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1/12) - 1;
  const monthlyInflationRate = Math.pow(1 + annualInflationRate, 1/12) - 1;
  const effectiveRate = monthlyGrowthRate - monthlyInflationRate;
  
  console.log(`🔍 INFLATION-ADJUSTED PMT CALCULATION:`, {
    targetAmount: targetAmount.toLocaleString(),
    totalMonths,
    annualGrowthRate: (annualGrowthRate * 100).toFixed(1) + '%',
    annualInflationRate: (annualInflationRate * 100).toFixed(1) + '%',
    monthlyGrowthRate: (monthlyGrowthRate * 12 * 100).toFixed(2) + '%',
    monthlyInflationRate: (monthlyInflationRate * 12 * 100).toFixed(2) + '%',
    effectiveRate: (effectiveRate * 12 * 100).toFixed(2) + '%'
  });
  
  if (Math.abs(effectiveRate) < 0.000001) {
    // When growth rate equals inflation rate, use simple formula
    const result = targetAmount / totalMonths;
    console.log(`📊 SIMPLE PMT (rates equal): £${result.toLocaleString()}`);
    return result;
  }
  
  // Standard escalating PMT formula with inflation adjustment
  const numerator = targetAmount * effectiveRate;
  const denominator = Math.pow(1 + monthlyGrowthRate, totalMonths) - Math.pow(1 + monthlyInflationRate, totalMonths);
  const result = numerator / denominator;
  
  console.log(`📊 INFLATION-ADJUSTED PMT RESULT:`, {
    numerator: numerator.toLocaleString(),
    denominator: denominator.toLocaleString(),
    result: result.toLocaleString(),
    expectedAround405: 'Should be around £405 with inflation-adjusted contributions'
  });
  
  return result;
}

const AffordabilityChecker: React.FC<AffordabilityCheckerProps> = ({
  monthlyFundingCost,
  results,
  onChangeTab
}) => {
  // Remove: const { profile } = useProfile(); - Not needed for Free Calculator

  // If no results available, show error state
  if (!results) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-orange-600 mb-2">Calculation Required</h3>
          <p className="text-sm text-gray-600">
            Please complete the pension calculation first to view affordability analysis.
          </p>
        </div>
      </div>
    );
  }

  // Use results data directly
  const currentAge = results.currentAge;
  const yearsUntilPension = typeof results.yearsUntilPension === 'object' 
    ? results.yearsUntilPension.years + (results.yearsUntilPension.months / 12)
    : results.yearsUntilPension;

  console.log(`=== INFLATION-ADJUSTED AFFORDABILITY CALCULATION ===`);
  console.log(`Current age: ${currentAge}, Years to retirement: ${yearsUntilPension}`);
  console.log(`Target income: £${results.targetIncome.toLocaleString()}`);
  console.log(`Existing plan income: £${results.existingPlanIncome.toLocaleString()}`);
  console.log(`Capital shortfall: £${results.currentCapitalShortfall.toLocaleString()}`);

  // Calculate AE contribution using 85% pensionable pay method - USE RESULTS.ANNUALSALARY (SFM-002)
  const monthlyGross = results.annualSalary / 12;
  const pensionableEarnings = monthlyGross * 0.85;
  const aeEmployeeContribution = pensionableEarnings * 0.05;
  
  // Calculate inflation-adjusted monthly top-up using escalating PMT formula
  const monthsUntilRetirement = yearsUntilPension * 12;
  const inflationAdjustedTopUp = calculateInflationAdjustedPMT(
    results.currentCapitalShortfall,
    monthsUntilRetirement,
    0.045, // 4.5% net growth rate (5% gross - 0.5% fees)
    0.02   // 2% inflation rate
  );
  
  // Use the passed monthlyFundingCost as fallback if calculation returns 0
  const effectiveTopUpContribution = inflationAdjustedTopUp > 0 ? inflationAdjustedTopUp : monthlyFundingCost;
  
  const totalFundingCost = aeEmployeeContribution + effectiveTopUpContribution;
  
  // Calculate total contributions over the period (for £131k validation)
  const totalContributionsOverPeriod = inflationAdjustedTopUp * monthsUntilRetirement;
  
  console.log('=== INFLATION-ADJUSTED AFFORDABILITY RESULTS ===');
  console.log(`AE Employee contribution: £${aeEmployeeContribution.toLocaleString()}`);
  console.log(`Inflation-adjusted monthly top-up: £${inflationAdjustedTopUp.toLocaleString()}`);
  console.log(`Total funding cost: £${totalFundingCost.toLocaleString()}`);
  console.log(`Total contributions over ${yearsUntilPension} years: £${(totalContributionsOverPeriod / 1000).toFixed(0)}k`);
  
  // Calculate net pay using enhanced tax calculations - FIXED FOR FREE CALCULATOR
  const employmentDetails: EmploymentDetails = {
    isDirector: false, // Fixed for Free Calculator
    hasControllingShares: false, // Fixed for Free Calculator  
    directorNicElection: 'annual', // Fixed for Free Calculator
    payeTaxCode: '1257L' // FIXED: Always use generic tax code for Free Calculator
  };
  const taxResult = calculateEnhancedTax(monthlyGross, employmentDetails, 0.05);
  const calculatedNetPay = taxResult?.netPay || 0;
  
  if (!taxResult || typeof taxResult.netPay !== 'number') {
    console.error('Invalid tax calculation result:', taxResult);
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Tax Calculation Error</h3>
          <p className="text-sm text-gray-600">
            Unable to calculate tax information. Please check the salary values and try again.
          </p>
        </div>
      </div>
    );
  }

  // Calculate affordability metrics using inflation-adjusted values
  const affordabilityPercentage = (totalFundingCost / calculatedNetPay) * 100;
  const isAffordable = affordabilityPercentage <= 4;
  
  // Calculate BUOM cost as exactly 50% of total funding cost
  const buomCost = Math.round(totalFundingCost * 0.5);
  const buomAffordabilityPercentage = (buomCost / calculatedNetPay) * 100;

  console.log('=== FINAL INFLATION-ADJUSTED AFFORDABILITY ===');
  console.log(`Monthly net pay: £${calculatedNetPay.toLocaleString()}`);
  console.log(`Total Funding Cost: £${totalFundingCost.toLocaleString()}`);
  console.log(`Affordability: ${affordabilityPercentage.toFixed(1)}% (threshold: 4%)`);
  console.log(`Is affordable: ${isAffordable ? 'YES' : 'NO - Eligible for Advanced Pension Funding'}`);
  console.log(`BUOM cost (50% reduction): £${buomCost.toLocaleString()}`);
  console.log(`BUOM affordability: ${buomAffordabilityPercentage.toFixed(1)}%`);

  return (
    <div className="space-y-6">
      <AffordabilityHeader />
      
      <AffordabilityAlert 
        isAffordable={isAffordable}
        monthlyFundingCost={Math.round(effectiveTopUpContribution)}
        affordabilityPercentage={affordabilityPercentage}
        onChangeTab={onChangeTab}
      />
      
      <FundingOptionsCard
        taxResult={taxResult}
        affordabilityPercentage={affordabilityPercentage}
        buomCost={buomCost}
        buomAffordabilityPercentage={buomAffordabilityPercentage}
        aeContribution={Math.round(aeEmployeeContribution)}
        topUpContribution={Math.round(effectiveTopUpContribution)}
        onChangeTab={onChangeTab}
      />
      
      <DetailedPensionContributions 
        pensionContribution={Math.round(aeEmployeeContribution)}
        grossPay={monthlyGross}
      />
      
      <PLSAStandardsSection />
    </div>
  );
};

export default AffordabilityChecker;
