
import { PensionCalculationResults } from '@/types/pension';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { formatCurrency } from '@/utils/pensionCalculations';
import SFMCodeBadge from '@/components/SystemFields/SFMCodeBadge';

interface PensionTimelineCardProps {
  results: PensionCalculationResults;
  currentStatePension: number;
  statePensionAtRetirement: number;
}

const PensionTimelineCard: React.FC<PensionTimelineCardProps> = ({
  results,
  currentStatePension,
  statePensionAtRetirement
}) => {
  // Calculate paydays remaining
  const yearsUntilPension = typeof results.yearsUntilPension === 'object' 
    ? results.yearsUntilPension.years + (results.yearsUntilPension.months / 12)
    : results.yearsUntilPension;
  const paydaysRemaining = Math.round(yearsUntilPension * 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pension Timeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          Timeline calculations for your retirement planning
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Target Income Today</h4>
            <div>
              <div className="text-xl font-semibold text-blue-600">
                {formatCurrency(results.targetIncome)}
              </div>
              <SFMCodeBadge sfmId="SFM-013" />
            </div>
            <p className="text-sm text-gray-600">
              50% of current annual salary
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Target Income at Retirement</h4>
            <div>
              <div className="text-xl font-semibold text-green-600">
                {formatCurrency(results.requiredIncomeAfterInflation)}
              </div>
              <SFMCodeBadge sfmId="SFM-014" />
            </div>
            <p className="text-sm text-gray-600">
              Target income adjusted for inflation
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Target className="h-4 w-4" />
                State Pension Details
              </h4>
              
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">State Pension Today</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(currentStatePension)}</span>
                    <SFMCodeBadge sfmId="SFM-015" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">State Pension at Retirement</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(statePensionAtRetirement)}</span>
                    <SFMCodeBadge sfmId="SFM-016" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {((results.finalSalaryIncome ?? 0) > 0 || (results.otherIncome ?? 0) > 0) && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Other Income Sources</h4>
              <div className="space-y-2">
                {(results.finalSalaryIncome ?? 0) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Final Salary / DB Pension</span>
                    <span className="font-medium">{formatCurrency(results.finalSalaryIncome ?? 0)}</span>
                  </div>
                )}
                {(results.otherIncome ?? 0) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Other Income</span>
                    <span className="font-medium">{formatCurrency(results.otherIncome ?? 0)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="font-medium text-blue-800 mb-2">Key Metrics</h5>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between relative pb-8">
                <span className="text-blue-700">Current Age:</span>
                <span className="font-medium">{results.ageYears} years {results.ageMonths} months</span>
                <div className="absolute bottom-1 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                  SFM-017
                </div>
              </div>
              <div className="flex justify-between relative pb-8">
                <span className="text-blue-700">Time to Retirement:</span>
                <span className="font-medium">{results.yearsUntilPensionFormatted}</span>
                <div className="absolute bottom-1 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                  SFM-018
                </div>
              </div>
              <div className="flex justify-between relative pb-8">
                <span className="text-blue-700">Days Until Pension:</span>
                <span className="font-medium">{Math.round(results.daysUntilPension).toLocaleString()}</span>
                <div className="absolute bottom-1 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                  SFM-019
                </div>
              </div>
              <div className="flex justify-between relative pb-8">
                <span className="text-blue-700">Paydays Remaining:</span>
                <span className="font-medium">{paydaysRemaining.toLocaleString()}</span>
                <div className="absolute bottom-1 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                  SFM-020
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PensionTimelineCard;
