import React from 'react';
import FreePensionFundingAnalysis from './FreePensionFundingAnalysis';
import FreePensionCharts from './PensionCharts/FreePensionCharts';
import FreePensionTimeline from './PensionResults/FreePensionTimeline';
import FreePensionProjectionAnalysis from './PensionResults/FreePensionProjectionAnalysis';
import { useFreeCentralisedCalculations } from '@/hooks/useFreeCentralisedCalculations';

// FREE CALCULATOR INPUTS: Only SFM-001 to SFM-007 basic inputs
// All other calculations will be performed internally using fixed assumptions
export interface FreePensionCalculationResults {
  dateOfBirth: string;                   // SFM-001: Date of Birth Input
  annualSalary: number;                  // SFM-002: Annual Salary Input
  existingPensionValue: number;          // SFM-003: Existing Pension Value Input
  finalSalaryIncome: number;             // SFM-006: Final Salary Income Input
  otherIncome: number;                   // SFM-007: Other Income Input
}

// FREE CALCULATOR RESULTS: Receives only basic inputs and calculates everything internally
interface FreeCalculatorResultsProps {
  results: FreePensionCalculationResults; // Only SFM-001 to SFM-007 inputs
  onChangeTab?: (tab: string) => void;
}

const FreeCalculatorResults: React.FC<FreeCalculatorResultsProps> = ({ 
  results,
  onChangeTab
}) => {

  // Use the centralized calculations hook with the basic inputs
  // All calculations are performed internally using fixed assumptions
  const calculationResults = useFreeCentralisedCalculations({
    annualSalary: results.annualSalary,
    existingPensionValue: results.existingPensionValue,
    finalSalaryIncome: results.finalSalaryIncome,
    otherIncome: results.otherIncome,
    dateOfBirth: results.dateOfBirth
  });

  const handleTabChange = (tab: string) => {
    if (onChangeTab) {
      onChangeTab(tab);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Pension Funding Analysis Card - Using calculated values */}
      <FreePensionFundingAnalysis
        progressPercentage={calculationResults.pensionFunding.fundingProgress}        // SFM-008
        totalProjectedPensionPot={calculationResults.pensionFunding.totalProjectedPensionPot}  // SFM-009
        requiredCapital={calculationResults.pensionFunding.requiredCapital}              // SFM-010
        capitalShortfall={calculationResults.pensionFunding.capitalShortfall}            // SFM-011
        monthlyFundingCost={calculationResults.pensionFunding.monthlyFundingCost}        // SFM-012
        affordabilityPercentage={calculationResults.affordability.affordabilityPercentage} // SFM-105
        currentAge={calculationResults.keyMetrics.currentAge}                        // SFM-017
        annualSalary={results.annualSalary}                    // SFM-002
        existingPensionValue={results.existingPensionValue}      // SFM-003
        retirementAge={calculationResults.keyMetrics.retirementAge}                    // SFM-005
        monthlyAECont={calculationResults.coreInputs.monthlyAEContributions}                    // SFM-004
        onChangeTab={handleTabChange}
      />
      
      {/* 2. Pension Charts - Using calculated values */}
      <FreePensionCharts
        existingPlanValueTodayAtRetirement={calculationResults.chartElements.existingPlanValueTodayAtRetirement}  // SFM-033
        existingPlanFutureContributions={calculationResults.chartElements.existingPlanFutureContributions}        // SFM-034
        shortfall={calculationResults.chartElements.shortfallAtRetirement}                                         // SFM-035
        monthlyFundingCost={calculationResults.pensionFunding.monthlyFundingCost}             // SFM-012
        totalStandardCost={calculationResults.chartElements.existingPlanTotalTopUp}           // SFM-038
        targetIncomeToday={calculationResults.pensionTimeline.targetIncomeToday}               // SFM-013
        existingPensionValue={results.existingPensionValue}         // SFM-003
        currentAge={calculationResults.keyMetrics.currentAge}                             // SFM-017
        retirementAge={calculationResults.keyMetrics.retirementAge}                       // SFM-005
        onChangeTab={handleTabChange}
      />
      
      {/* 3. Side-by-side layout for Timeline and Projection Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side - Pension Timeline */}
        <FreePensionTimeline
          results={results}  // Pass the basic inputs, component will calculate internally
        />
        
        {/* Right side - Pension Projection Analysis */}
        <FreePensionProjectionAnalysis
          results={results}
          existingPlanFutureContributions={calculationResults.projectionAnalysis.futureAEContributions + calculationResults.projectionAnalysis.futureAEGrowth}
          totalTopUpContributions={calculationResults.topUpAnalysis.topUpContributionsPaid}
          pensionShortfallTarget={calculationResults.topUpAnalysis.topUpContributionsValue}
        />
      </div>
    </div>
  );
};

export default FreeCalculatorResults;
