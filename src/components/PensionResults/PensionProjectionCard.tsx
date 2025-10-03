import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatUtils';
import { PensionCalculationResults } from '@/types/pension';
import { calculateTotalAEContributions } from '@/utils/pension/aeContributionCalculations';

interface PensionProjectionCardProps {
  results: PensionCalculationResults;
  existingPlanValueTodayAtRetirement: number;
  existingPlanFutureContributions: number;
  requiredCapitalAfterOtherIncome: number;
  totalStandardCost: number;
}

const PensionProjectionCard: React.FC<PensionProjectionCardProps> = ({
  results,
  existingPlanValueTodayAtRetirement,
  existingPlanFutureContributions,
  requiredCapitalAfterOtherIncome,
  totalStandardCost
}) => {
  // Calculate current age for total AE contributions
  const currentAge = results.ageYears;
  const yearsUntilPension = typeof results.yearsUntilPension === 'object' 
    ? results.yearsUntilPension.years + (results.yearsUntilPension.months / 12)
    : results.yearsUntilPension;

  // Calculate values directly without SFM resolver
  const aeContributions = calculateTotalAEContributions(
    results.annualSalary,
    currentAge,
    yearsUntilPension
  );

  const historicalContributions = aeContributions.historicalContributions;
  const existingPensionValue = results.existingPensionValue;
  const growthFromExisting = existingPlanValueTodayAtRetirement - results.existingPensionValue;
  const futureAEContributions = aeContributions.futureContributions;
  const futureAEGrowth = existingPlanFutureContributions - futureAEContributions;
  const totalProjectedValue = existingPlanValueTodayAtRetirement + existingPlanFutureContributions;
  const requiredCapital = requiredCapitalAfterOtherIncome;
  const capitalShortfall = Math.max(0, requiredCapitalAfterOtherIncome - totalProjectedValue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pension Projection Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown of your pension projections
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Estimated Historical Contributions</span>
            <span className="font-medium">{formatCurrency(historicalContributions)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-021
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Estimated Existing Pension Fund Value</span>
            <span className="font-medium">{formatCurrency(existingPensionValue)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-022
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Future Growth on Existing Fund Value</span>
            <span className="font-medium text-green-600">+{formatCurrency(growthFromExisting)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-023
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Future AE Contributions</span>
            <span className="font-medium">{formatCurrency(futureAEContributions)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-024
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Future AE Contributions Growth</span>
            <span className="font-medium text-green-600">+{formatCurrency(futureAEGrowth)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-025
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium relative pr-16">
            <span>Total Projected Pension Value</span>
            <span className="text-lg">{formatCurrency(totalProjectedValue)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
              SFM-026
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Required Capital</span>
            <span className="font-medium text-lg">{formatCurrency(requiredCapital)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-027
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Capital Shortfall</span>
            <span className="font-medium text-lg text-[#9333EA]">{formatCurrency(capitalShortfall)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-028
            </div>
          </div>
        </div>

        <Separator />

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md relative">
          <h4 className="font-medium mb-2">Top Up Contribution Analysis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between relative pb-6">
              <span>Top Up Contributions Paid:</span>
              <span className="font-medium text-green-600">{formatCurrency(totalStandardCost)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-029
              </div>
            </div>
            <div className="flex justify-between relative pb-6">
              <span>Top Up Investment Growth:</span>
              <span className="font-medium text-green-600">{formatCurrency(Math.max(0, (results.currentCapitalShortfall || 0) - totalStandardCost))}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-030
              </div>
            </div>
            <div className="flex justify-between relative pb-6">
              <span>Shortfall Target:</span>
              <span className="font-medium text-[#9333EA]">{formatCurrency(results.currentCapitalShortfall || 0)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-031
              </div>
            </div>
            <div className="flex justify-between relative pb-6">
              <span>Effective Growth Rate:</span>
              <span className="font-medium">
                {(() => {
                  const topUpInvestmentGrowth = Math.max(0, (results.currentCapitalShortfall || 0) - totalStandardCost);
                  const effectiveGrowthRate = totalStandardCost > 0 
                    ? ((topUpInvestmentGrowth / totalStandardCost) * 100)
                    : 0;
                  return effectiveGrowthRate.toFixed(1);
                })()}%
              </span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-032
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PensionProjectionCard;
