import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreePensionCalculationResults } from '../FreeCalculatorResults';
import { useFreeCentralisedCalculations } from '@/hooks/useFreeCentralisedCalculations';

// Free Calculator specific utility functions - standalone, no dependencies
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface FreePensionTimelineProps {
  results: FreePensionCalculationResults;
}

export function FreePensionTimeline({
  results
}: FreePensionTimelineProps) {
  // Use the centralized calculations hook
  const calculationResults = useFreeCentralisedCalculations(results);
  
  const yearsUntilPension = calculationResults.keyMetrics.timeToRetirement;
  const paydaysRemaining = calculationResults.keyMetrics.paydaysRemaining; // Use proper monthly paydays calculation
  const daysUntilPension = calculationResults.keyMetrics.daysToRetirement;

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: '#4FF456' }}>
          Pension Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">Timeline calculations for your retirement planning</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Income Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Target Income Today</h4>
            <div className="text-xl font-semibold text-blue-600">
              {formatCurrency(calculationResults.pensionTimeline.targetIncomeToday)}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                50% of current annual salary
              </p>
              <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-013
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Target Income at Retirement</h4>
            <div className="text-xl font-semibold text-green-600">
              {formatCurrency(calculationResults.pensionTimeline.targetIncomeAtRetirement)}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Target income adjusted for inflation
              </p>
              <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-014
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Existing Plan Projected Income</h4>
            <div className="text-xl font-semibold text-blue-600">
              {formatCurrency(calculationResults.pensionTimeline.existingPlanProjectedIncome)}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Projected income (inc. State Pension)
              </p>
              <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-044
              </div>
            </div>
          </div>
        </div>

        {/* State Pension Details Section - Nested within main card */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            State Pension Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">State Pension Today</h4>
              <div className="text-xl font-semibold text-blue-600">
                {formatCurrency(calculationResults.statePension.statePensionToday)}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Current state pension value
                </p>
                <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                  SFM-015
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">State Pension at Retirement</h4>
              <div className="text-xl font-semibold text-green-600">
                {formatCurrency(calculationResults.statePension.statePensionAtRetirement)}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  State pension adjusted for inflation
                </p>
                <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                  SFM-016
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Section - Nested within main card */}
  <div className="p-4 rounded-lg border" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456' }}>
          <h3 className="font-semibold text-gray-700 mb-3">Key Metrics</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between relative pb-6">
              <span>Current Age</span>
              <span className="font-medium">{calculationResults.keyMetrics.currentAge} years 0 months</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-017
              </div>
            </div>
            <div className="flex justify-between relative pb-6">
              <span>Time to Retirement</span>
              <span className="font-medium">{Math.floor(yearsUntilPension)} years {Math.round((yearsUntilPension % 1) * 12).toString().padStart(2, '0')} months</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-018
              </div>
            </div>
            <div className="flex justify-between relative pb-6">
              <span>Days Until Pension</span>
              <span className="font-medium">{daysUntilPension.toLocaleString()}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-019
              </div>
            </div>
            <div className="flex justify-between relative pb-6">
              <span>Paydays Remaining</span>
              <span className="font-medium">{paydaysRemaining.toLocaleString()}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-020
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreePensionTimeline;