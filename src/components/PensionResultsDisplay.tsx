import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { PensionCalculationResults } from '@/types/pension';
import { getCurrentStatePension, calculateInflatedValue } from '@/utils/pension/salaryCalculations';
import { calculatePensionBreakdown } from '@/utils/pension/projectionCalculations';
import { getPensionParameters } from '@/utils/pensionParameters';
import { chartDataFixer } from '@/utils/chartDataFixer';
import { hasActiveSubscription } from '@/utils/pensionParameters/subscription';
import PensionCharts from './PensionCharts/PensionCharts';
import FreePensionFundingOptionsCard from './PensionResults/FreePensionFundingOptionsCard';
import FreePensionTimeline from './PensionResults/FreePensionTimeline';
import PensionProjectionAnalysis from './PensionResults/PensionProjectionAnalysis';

interface PensionResultsDisplayProps {
  results: PensionCalculationResults | null;
  onChangeTab: (tab: string) => void;
}

const PensionResultsDisplay = ({ results, onChangeTab }: PensionResultsDisplayProps) => {
  // Financial assistance CTA should only show for non-subscribed members
  const [showFinancialAssistanceCTA, setShowFinancialAssistanceCTA] = React.useState<boolean>(true);
  const [hasSubscription, setHasSubscription] = React.useState<boolean>(false);

  // Check subscription status in useEffect to avoid Hook violations
  React.useEffect(() => {
    const subscriptionStatus = hasActiveSubscription();
    setHasSubscription(subscriptionStatus);
    setShowFinancialAssistanceCTA(!subscriptionStatus);
  }, []);
  
  if (!results) return null;
  
  // Handle both object and number types for yearsUntilPension
  const yearsUntilPensionNumber = typeof results.yearsUntilPension === 'object' 
    ? results.yearsUntilPension.years + (results.yearsUntilPension.months / 12)
    : Number(results.yearsUntilPension);
  
  const params = getPensionParameters();
  
  // FIXED: Use the new chartDataFixer for consistent calculations
  const calculationInputs = {
    currentAge: results.currentAge,
    annualSalary: results.annualSalary,
    existingPensionValue: results.existingPensionValue,
    yearsToRetirement: yearsUntilPensionNumber
  };
  
  // Generate calculation summary for validation
  const calculationSummary = chartDataFixer.generateCalculationSummary(calculationInputs);
  
  if (!calculationSummary.valid) {
    console.error('CALCULATION VALIDATION ERRORS:', calculationSummary.errors);
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-4">Calculation Error</h2>
        <p className="text-red-700 mb-4">
          There were issues with the calculation inputs. Please check your data and try again.
        </p>
        <ul className="text-red-600 text-sm list-disc list-inside">
          {calculationSummary.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  console.log('=== FIXED CALCULATION SUMMARY ===');
  console.log(calculationSummary.summary);
  
  // Calculate State Pension details using Parameters
  const currentStatePension = getCurrentStatePension() * 52;
  const statePensionAtRetirement = calculateInflatedValue(currentStatePension, yearsUntilPensionNumber, 'pension');
// Removed unused variable statePensionLumpSumEquivalent
// Removed unused variable statePensionLumpSumAtRetirement
  
  const netIncomeTargetAtRetirement = results.requiredIncomeAfterInflation - statePensionAtRetirement - (results.finalSalaryIncome || 0) - (results.otherIncome || 0);
  const requiredCapitalAfterOtherIncome = Math.max(0, netIncomeTargetAtRetirement / params.drawdownRate);
  
  // Calculate pension breakdown with proper shortfall target
  const pensionBreakdown = calculatePensionBreakdown(
    results.annualSalary,
    yearsUntilPensionNumber,
    results.existingPensionValue,
    requiredCapitalAfterOtherIncome // Use actual required capital for shortfall calculations
  );
  
  // Calculate total projected value including all sources (same as PensionProjectionCard)
  const existingPlanValueTodayAtRetirement = pensionBreakdown.existingFund.valueAtRetirement;
  const existingPlanFutureContributions = pensionBreakdown.flatAE.valueAtRetirement;
  const totalProjectedValue = existingPlanValueTodayAtRetirement + existingPlanFutureContributions;
  
  // Use the same values as PensionProjectionCard
  const sfm005 = totalProjectedValue; // Current Projection
  const sfm006 = requiredCapitalAfterOtherIncome; // Required Capital
  const shortfall = Math.max(0, sfm006 - sfm005); // Capital Shortfall
  
  // Progress Percentage: (Current Projection / Required Capital) * 100
  const progressPercentage = sfm006 > 0 ? Math.round((sfm005 / sfm006) * 100) : 0;
  
  // Monthly funding cost
  const correctedMonthlyFundingCost = pensionBreakdown.topUp.monthlyYear1;
  
  // Total standard cost for PensionProjectionCard
  const totalStandardCost = pensionBreakdown.topUp.totalContributions;
    
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* REMOVED: Calculation validation popup card */}
      
      <FreePensionFundingOptionsCard
        projectedPensionPot={sfm005}
        monthlyFundingCost={correctedMonthlyFundingCost}
        progressPercentage={progressPercentage}
        correctedRequiredCapital={sfm006}
        shortfall={shortfall}
        showFinancialAssistanceCTA={showFinancialAssistanceCTA && !hasSubscription}
        annualSalary={results.annualSalary}
        onChangeTab={onChangeTab}
        onDismissFinancialCTA={() => setShowFinancialAssistanceCTA(false)}
      />
      
      {hasSubscription ? (
        <PensionCharts 
          projectedPensionPot={sfm005}
          existingPensionValue={results.existingPensionValue}
          existingPlanValueTodayAtRetirement={pensionBreakdown.existingFund.valueAtRetirement}
          existingPlanFutureContributions={pensionBreakdown.flatAE.valueAtRetirement}
          shortfall={shortfall}
          monthlyFundingCost={correctedMonthlyFundingCost}
          totalStandardCost={totalStandardCost}
          annualSalary={results.annualSalary}
          yearsToRetirement={yearsUntilPensionNumber}
          onChangeTab={onChangeTab} 
        />
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Subscription Required</h3>
          <p className="text-gray-600 mb-4">
            Access to pension charts and detailed analysis requires an active subscription.
          </p>
          <Button 
            onClick={() => onChangeTab('subscription')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Access Charts
          </Button>
        </div>
      )}
  
      {/* Premium Content - Subscription Required */}
      {hasSubscription ? (
        <div className="grid gap-6 md:grid-cols-2">
          <FreePensionTimeline
            results={{
              dateOfBirth: new Date(new Date().getFullYear() - results.currentAge, 0, 1).toISOString().split('T')[0],
              annualSalary: results.annualSalary,
              existingPensionValue: results.existingPensionValue,
              finalSalaryIncome: results.finalSalaryIncome || 0,
              otherIncome: results.otherIncome || 0
            }}
          />

          <PensionProjectionAnalysis
            results={results}
            existingPlanValueTodayAtRetirement={pensionBreakdown.existingFund.valueAtRetirement}
            existingPlanFutureContributions={pensionBreakdown.flatAE.valueAtRetirement}
            requiredCapitalAfterOtherIncome={requiredCapitalAfterOtherIncome}
            totalStandardCost={totalStandardCost}
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Locked Premium Content Cards */}
          <Card className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70 rounded-lg z-10 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
                <p className="text-sm opacity-90 mb-4">
                  Unlock detailed pension timeline analysis with retirement milestones and projections
                </p>
                <Button 
                  onClick={() => onChangeTab('subscription')}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="opacity-30">Pension Timeline</CardTitle>
            </CardHeader>
            <CardContent className="opacity-30">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-32 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
  
          <Card className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70 rounded-lg z-10 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
                <p className="text-sm opacity-90 mb-4">
                  Access comprehensive projection analysis with growth calculations and contribution breakdowns
                </p>
                <Button 
                  onClick={() => onChangeTab('subscription')}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="opacity-30">Pension Projection Analysis</CardTitle>
            </CardHeader>
            <CardContent className="opacity-30">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
                <div className="h-32 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PensionResultsDisplay;
