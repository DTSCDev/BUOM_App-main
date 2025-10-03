import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatUtils';
import { FreePensionCalculationResults } from '../FreeCalculatorResults';
import { useFreeCentralisedCalculations } from '@/hooks/useFreeCentralisedCalculations';

interface FreePensionProjectionAnalysisProps {
  results: FreePensionCalculationResults;
  existingPlanFutureContributions: number;     // SFM-024 + SFM-025 = SFM-034
  totalTopUpContributions: number;             // SFM-029: Top Up Contributions from SFM-012 to retirement
  pensionShortfallTarget: number;              // SFM-031: Expected Shortfall Target
}

const FreePensionProjectionAnalysis: React.FC<FreePensionProjectionAnalysisProps> = ({
  results,
  existingPlanFutureContributions,
  totalTopUpContributions,
  pensionShortfallTarget
}) => {
  // Use the centralized calculations hook
  const calculationResults = useFreeCentralisedCalculations(results);
  
  // Use the calculated values from the hook
  const historicalContributions = calculationResults.coreInputs.historicalContributions;  // SFM-021
  const existingPensionValue = results.existingPensionValue;         // SFM-003
  const growthFromExisting = calculationResults.projectionAnalysis.existingPensionGrowth; // SFM-023
  const futureAEContributions = calculationResults.projectionAnalysis.futureAEContributions;       // SFM-024
  const futureAEGrowth = calculationResults.projectionAnalysis.futureAEGrowth;                     // SFM-025
  const totalProjectedValue = calculationResults.pensionFunding.totalProjectedPensionPot;     // SFM-026
  const requiredCapital = calculationResults.pensionFunding.requiredCapital;                  // SFM-027
  const capitalShortfall = calculationResults.pensionFunding.capitalShortfall;                // SFM-028
  const equivalentIncomeShortfall = calculationResults.projectionAnalysis.equivalentIncomeShortfall; // SFM-045

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
          
          <div className="space-y-2">
            <div className="flex justify-between font-medium text-lg">
              <span>Total Projected Pension Value</span>
              <span>{formatCurrency(totalProjectedValue)}</span>
            </div>
            <div className="flex justify-end">
              <div className="text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-026
              </div>
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

          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Equivalent Income Shortfall</span>
            <span className="font-medium text-lg text-[#9333EA]">{formatCurrency(equivalentIncomeShortfall)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-045
            </div>
          </div>
        </div>

        {/* Top Up Contribution Analysis Section - Nested within main card */}
  <div className="p-4 rounded-lg border" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456' }}>
          <h3 className="font-semibold mb-3 text-gray-700">Top Up Contribution Analysis</h3>
          
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between relative pb-6">
              <span>Top Up Contributions Paid:</span>
              <span className="font-medium text-gray-700">{formatCurrency(calculationResults.topUpAnalysis.topUpContributionsPaid)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-029
              </div>
            </div>
            
            <div className="flex justify-between relative pb-6">
              <span>Top Up Investment Growth:</span>
              <span className="font-medium text-gray-700">{formatCurrency(calculationResults.topUpAnalysis.topUpInvestmentGrowth)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-030
              </div>
            </div>
            
            <div className="flex justify-between relative pb-6">
              <span>Shortfall Target:</span>
              <span className="font-medium text-[#9333EA]">{formatCurrency(calculationResults.topUpAnalysis.topUpContributionsValue)}</span>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                SFM-031
              </div>
            </div>
            
            <div className="flex justify-between relative pb-6">
              <span>Effective Growth Rate:</span>
              <span className="font-medium text-gray-700">{calculationResults.topUpAnalysis.effectiveGrowthRate.toFixed(1)}%</span>
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

export default FreePensionProjectionAnalysis;