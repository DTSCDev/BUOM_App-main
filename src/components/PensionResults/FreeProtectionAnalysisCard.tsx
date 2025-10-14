import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { PensionCalculationResults } from '@/types/pension';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';

interface FreeProtectionAnalysisCardProps {
  results: PensionCalculationResults;
}

const FreeProtectionAnalysisCard: React.FC<FreeProtectionAnalysisCardProps> = ({ results }) => {
  // Direct calculations following the exact logic you specified
  
  // Parameters
  const inflationRate = 0.02; // 2% inflation
  const netGrowthRate = 0.045; // 4.5% net growth
  const drawdownRate = 0.035; // 3.5% drawdown rate
  const monthlyAEContribution = 340; // £340/month AE contribution
  
  // SFM-042: Lump Sum Cost of Target Income Today
  const lumpSumCostTargetIncome = results.targetIncome / drawdownRate;
  
  // SFM-043: Estimated Life Cover Need Today
  const estimatedLifeCoverNeedToday = Math.max(0, lumpSumCostTargetIncome - results.existingPensionValue);
  
  // Year 1 Projections
  const targetIncomeYear1 = results.targetIncome * (1 + inflationRate);
  const lumpSumCostYear1 = targetIncomeYear1 / drawdownRate;
  const existingFundValueYear1 = results.existingPensionValue * (1 + netGrowthRate);
  const aeContributionYear1 = monthlyAEContribution * 12; // Annual AE contribution
  const aeContributionFundValueYear1 = aeContributionYear1 * (1 + netGrowthRate);
  const estimatedLifeCoverNeedYear1 = Math.max(0, lumpSumCostYear1 - existingFundValueYear1 - aeContributionFundValueYear1);
  
  // Year 2 Projections
  const targetIncomeYear2 = targetIncomeYear1 * (1 + inflationRate);
  const lumpSumCostYear2 = targetIncomeYear2 / drawdownRate;
  const existingFundValueYear2 = existingFundValueYear1 * (1 + netGrowthRate);
  const aeContributionYear2 = aeContributionYear1 * (1 + inflationRate); // AE contributions increase by inflation
  const aeContributionFundValueYear2 = (aeContributionFundValueYear1 + aeContributionYear2) * (1 + netGrowthRate);
  const estimatedLifeCoverNeedYear2 = Math.max(0, lumpSumCostYear2 - existingFundValueYear2 - aeContributionFundValueYear2);
  
  // Protection status based on coverage
  const protectionRatio = results.existingPensionValue / lumpSumCostTargetIncome;
  const isWellProtected = protectionRatio >= 0.8;
  const isPartiallyProtected = protectionRatio >= 0.4;
  
  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader className="bg-red-600 border-b border-red-200">
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5" />
          Protection Analysis
        </CardTitle>
        <p className="text-sm text-red-100">
          Analysis of your life cover needs based on target income requirements
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Protection Status Indicator */}
        <div className={`p-4 rounded-lg border-2 ${
          isWellProtected 
            ? 'bg-green-100 border-green-300 text-green-800'
            : isPartiallyProtected 
            ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
            : 'bg-red-100 border-red-300 text-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isWellProtected ? (
              <Shield className="h-5 w-5 text-green-600" />
            ) : isPartiallyProtected ? (
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-semibold">
              {isWellProtected 
                ? 'Well Protected' 
                : isPartiallyProtected 
                ? 'Partially Protected'
                : 'Protection Gap Identified'
              }
            </span>
          </div>
          <p className="text-sm">
            {isWellProtected 
              ? 'Your existing pension provides good protection for your target income needs.'
              : isPartiallyProtected 
              ? 'Your existing pension provides some protection, but additional life cover may be beneficial.'
              : 'Significant protection gap identified. Additional life cover strongly recommended.'
            }
          </p>
        </div>

        {/* Key Protection Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Lump Sum Cost of Target Income Today</span>
            <span className="font-medium">{formatCurrency(lumpSumCostTargetIncome)}</span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-042
            </div>
          </div>
          
          <div className="flex justify-between relative pb-6">
            <span className="text-muted-foreground">Estimated Life Cover Need Today</span>
            <span className={`font-medium ${
              estimatedLifeCoverNeedToday > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {estimatedLifeCoverNeedToday > 0 
                ? formatCurrency(estimatedLifeCoverNeedToday)
                : 'Fully Covered'
              }
            </span>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-043
            </div>
          </div>
        </div>

        {/* Future Projections */}
        <div className="bg-white border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-600 mb-3">Future Protection Projections</h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-medium text-red-600">Today</p>
                <p className="text-xs text-gray-600">Target Income: {formatCurrency(results.targetIncome)}</p>
                <p className="text-xs text-gray-600">Life Cover Need:</p>
                <p className="font-semibold">{formatCurrency(estimatedLifeCoverNeedToday)}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-red-600">Year 1</p>
                <p className="text-xs text-gray-600">Target Income: {formatCurrency(targetIncomeYear1)}</p>
                <p className="text-xs text-gray-600">Life Cover Need:</p>
                <p className="font-semibold">{formatCurrency(estimatedLifeCoverNeedYear1)}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-red-600">Year 2</p>
                <p className="text-xs text-gray-600">Target Income: {formatCurrency(targetIncomeYear2)}</p>
                <p className="text-xs text-gray-600">Life Cover Need:</p>
                <p className="font-semibold">{formatCurrency(estimatedLifeCoverNeedYear2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Calculation Breakdown */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-600 mb-2">Calculation Breakdown (Year 1 Example)</h4>
          <ul className="list-disc list-outside pl-6 space-y-2 text-sm text-red-700">
            <li>Target Income (2% inflation): <strong>{formatCurrency(targetIncomeYear1)}</strong></li>
            <li>Gross Lump Sum Cost (÷ 3.5%): <strong>{formatCurrency(lumpSumCostYear1)}</strong></li>
            <li>Less: Existing Fund Value (4.5% growth): <strong>-{formatCurrency(existingFundValueYear1)}</strong></li>
            <li>Less: New AE Contribution Fund Value: <strong>-{formatCurrency(aeContributionFundValueYear1)}</strong></li>
            <li className="border-t border-red-300 pt-2 font-semibold">Year 1 Life Cover Need: <strong>{formatCurrency(estimatedLifeCoverNeedYear1)}</strong></li>
          </ul>
        </div>

        {/* Calculation Note */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
          <strong>Calculation Method:</strong> Uses 2% inflation on target income, 4.5% net growth on existing pension, 
          £340/month AE contributions (increasing by inflation), and 3.5% drawdown rate. 
          Life cover need = Lump sum cost - Existing fund value - AE contribution fund value.
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeProtectionAnalysisCard;