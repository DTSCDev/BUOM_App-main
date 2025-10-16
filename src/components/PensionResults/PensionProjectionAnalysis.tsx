import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatUtils';
import { PensionCalculationResults } from '@/types/pension';
import { calculateTotalAEContributions } from '@/utils/pension/aeContributionCalculations';
import { getPensionParameters } from '@/utils/pensionParameters';

interface PensionProjectionAnalysisProps {
  results: PensionCalculationResults;
  existingPlanValueTodayAtRetirement: number;
  existingPlanFutureContributions: number;
  requiredCapitalAfterOtherIncome: number;
  totalStandardCost: number;
}

const PensionProjectionAnalysis: React.FC<PensionProjectionAnalysisProps> = ({
  results,
  existingPlanValueTodayAtRetirement,
  existingPlanFutureContributions,
  requiredCapitalAfterOtherIncome,
  totalStandardCost
}) => {
  const params = getPensionParameters();

  const currentAge = results.currentAge ?? results.ageYears;
  const yearsUntilPension = typeof results.yearsUntilPension === 'object'
    ? results.yearsUntilPension.years + (results.yearsUntilPension.months / 12)
    : Number(results.yearsUntilPension);

  const ae = calculateTotalAEContributions(
    results.annualSalary,
    currentAge,
    yearsUntilPension
  );

  const historicalContributions = ae.historicalContributions; // SFM-CAL-4114
  const existingPensionValue = results.existingPensionValue; // SFM-CAL-4115
  const growthFromExisting = existingPlanValueTodayAtRetirement - existingPensionValue; // SFM-CAL-4116
  const futureAEContributions = ae.futureContributions; // SFM-CAL-4117
  const futureAEGrowth = Math.max(0, existingPlanFutureContributions - futureAEContributions); // SFM-CAL-4118

  const totalProjectedValue = existingPlanValueTodayAtRetirement + existingPlanFutureContributions; // SFM-CAL-4119
  const requiredCapital = requiredCapitalAfterOtherIncome; // SFM-CAL-4120
  const capitalShortfall = Math.max(0, requiredCapital - totalProjectedValue); // SFM-CAL-4121
  const equivalentIncomeShortfall = capitalShortfall * params.drawdownRate; // SFM-CAL-4133

  const topUpContributionsPaid = totalStandardCost; // SFM-CAL-4122
  const topUpInvestmentGrowth = Math.max(0, capitalShortfall - topUpContributionsPaid); // SFM-CAL-4123
  const topUpTotalFundValue = topUpContributionsPaid + topUpInvestmentGrowth; // SFM-CAL-4124
  const effectiveGrowthRate = topUpContributionsPaid > 0
    ? ((topUpInvestmentGrowth / topUpContributionsPaid) * 100)
    : 0; // SFM-CAL-4125

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: '#4FF456' }}>Pension Projection Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown of your pension projections
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Projection Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Estimated Historical Contributions</span>
            <span className="font-medium">{formatCurrency(historicalContributions)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4114
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Estimated Existing Pension Fund Value</span>
            <span className="font-medium">{formatCurrency(existingPensionValue)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4115
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Future Growth on Existing Fund Value</span>
            <span className="font-medium text-green-600">+{formatCurrency(growthFromExisting)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4116
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Future AE Contributions</span>
            <span className="font-medium">{formatCurrency(futureAEContributions)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4117
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Future AE Contributions Growth</span>
            <span className="font-medium text-green-600">+{formatCurrency(futureAEGrowth)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4118
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between font-medium text-lg">
              <span>Total Projected Pension Value</span>
              <span>{formatCurrency(totalProjectedValue)}</span>
            </div>
            <div className="flex justify-end">
              <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-CAL-4119
              </div>
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Required Capital</span>
            <span className="font-medium text-lg">{formatCurrency(requiredCapital)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4120
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Capital Shortfall</span>
            <span className="font-medium text-lg text-[#9333EA]">{formatCurrency(capitalShortfall)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4121
            </div>
          </div>

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Equivalent Income Shortfall</span>
            <span className="font-medium text-lg text-[#9333EA]">{formatCurrency(equivalentIncomeShortfall)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-CAL-4133
            </div>
          </div>
        </div>

        {/* Top Up Contribution Analysis Section - Nested within main card */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456' }}>
          <h3 className="font-semibold mb-3 text-gray-700">Top Up Contribution Analysis</h3>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between relative pb-6">
              <span>Top Up Contributions Paid:</span>
              <span className="font-medium text-gray-700">{formatCurrency(topUpContributionsPaid)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-CAL-4122
              </div>
            </div>

            <div className="flex justify-between relative pb-6">
              <span>Top Up Investment Growth:</span>
              <span className="font-medium text-gray-700">{formatCurrency(topUpInvestmentGrowth)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-CAL-4123
              </div>
            </div>

            <div className="flex justify-between relative pb-6">
              <span>Top Up Final Value:</span>
              <span className="font-medium text-[#9333EA]">{formatCurrency(topUpTotalFundValue)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-CAL-4124
              </div>
            </div>

            <div className="flex justify-between relative pb-6">
              <span>Effective Growth Rate:</span>
              <span className="font-medium text-gray-700">{effectiveGrowthRate.toFixed(1)}%</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-CAL-4125
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PensionProjectionAnalysis;