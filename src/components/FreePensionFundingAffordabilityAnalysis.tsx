import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FreePensionCalculationResults } from '@/components/FreeCalculatorResults';
import { formatCurrency } from '@/utils/formatUtils';
import { useFreeCentralisedCalculations } from '@/hooks/useFreeCentralisedCalculations';

interface FreePensionFundingAffordabilityAnalysisProps {
  results: FreePensionCalculationResults;
  onChangeTab: (tab: string) => void;
}

const FreePensionFundingAffordabilityAnalysis: React.FC<FreePensionFundingAffordabilityAnalysisProps> = ({
  results,
  onChangeTab
}) => {
  // Use the centralized calculations hook
  const calculationResults = useFreeCentralisedCalculations(results);
  
  // Calculate all required SFM values
  const monthlyGrossPay = results.annualSalary / 12; // SFM-112
  const pensionableEarnings = monthlyGrossPay * 0.85; // SFM-113 (85% of gross pay)
  const employeeContribution = pensionableEarnings * 0.05; // SFM-114 (5% AE contribution)
  
  // Calculate net pay (simplified calculation using 25% for tax/NI)
  const taxAndNI = monthlyGrossPay * 0.25;
  const monthlyTakeHomePay = monthlyGrossPay - taxAndNI - employeeContribution; // SFM-103
  
  // Get monthly funding cost from calculated results (SFM-012)
  const monthlyFundingCost = calculationResults.pensionFunding.monthlyFundingCost || 0;
  
  // SFM-104: Standard Monthly Funding Cost + Top Up Cost (SFM-012 + SFM-114)
  const totalFundingCost = employeeContribution + monthlyFundingCost;
  
  // SFM-105: Affordability Percentage of Take Home Pay
  const affordabilityPercentage = (totalFundingCost / monthlyTakeHomePay) * 100;
  
  // SFM-106: BUOM Monthly Funding Cost (50% discount)
  const buomMonthlyCost = totalFundingCost * 0.5;
  
  // SFM-107: BUOM Affordability Percentage of Take Home Pay
  const buomAffordabilityPercentage = (buomMonthlyCost / monthlyTakeHomePay) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#4FF456]">
          Pension Funding Affordability Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Clean, consistent styling for all metrics */}
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-700">Monthly Take Home Pay</span>
          <div className="text-right">
            <span className="text-xl font-semibold">{formatCurrency(monthlyTakeHomePay)}</span>
            <div className="text-[8px] text-muted-foreground">SFM-103</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-700">Standard Monthly Funding Cost + Top Up Cost</span>
          <div className="text-right">
            <span className="text-xl font-semibold">{formatCurrency(totalFundingCost)}</span>
            <div className="text-sm text-gray-600">= {formatCurrency(employeeContribution)} + {formatCurrency(monthlyFundingCost)}</div>
            <div className="text-[8px] text-muted-foreground">SFM-104</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-700">% of Take Home Pay</span>
          <div className="text-right">
            <span className="text-xl font-semibold">{affordabilityPercentage.toFixed(1)}%</span>
            <div className="text-[8px] text-muted-foreground">SFM-105</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-green-700">BUOM Monthly Funding Cost</span>
          <div className="text-right">
            <span className="text-xl font-semibold text-green-700">{formatCurrency(buomMonthlyCost)}</span>
            <div className="text-[8px] text-muted-foreground">SFM-106</div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-green-700">% of Take Home Pay</span>
          <div className="text-right">
            <span className="text-xl font-semibold text-green-700">{buomAffordabilityPercentage.toFixed(1)}%</span>
            <div className="text-[8px] text-muted-foreground">SFM-107</div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg mt-6" style={{ borderColor: '#4FF456' }}>
          <p className="text-gray-700">
            BUOM members have access to our unique Advanced Pension Funding platform, which could help you reduce your overall Contribution Cost from {formatCurrency(totalFundingCost)} to {formatCurrency(buomMonthlyCost)} (subject to receiving bespoke Chartered Financial Advice).
          </p>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={() => onChangeTab("funding-eligibility")}
            className="w-full text-gray-700"
            style={{ backgroundColor: '#4FF456' }}
          >
            Check My Funding Eligibility →
          </Button>
          <div className="text-[8px] text-muted-foreground mt-1 text-center">SFM-108</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreePensionFundingAffordabilityAnalysis;