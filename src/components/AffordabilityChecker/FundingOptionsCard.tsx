import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/pensionCalculations';
import { EnhancedTaxResult } from '@/utils/pension/enhancedTaxCalculations';

interface FundingOptionsCardProps {
  taxResult: EnhancedTaxResult;
  affordabilityPercentage: number;
  buomCost: number;
  buomAffordabilityPercentage: number;
  aeContribution: number; // AE Employee Contribution (£213)
  topUpContribution: number; // Monthly Top Up Contribution (£405)
  onChangeTab: (tab: string) => void;
}

const FundingOptionsCard: React.FC<FundingOptionsCardProps> = ({
  taxResult,
  affordabilityPercentage,
  buomCost,
  buomAffordabilityPercentage,
  aeContribution,
  topUpContribution,
  onChangeTab
}) => {
  // Calculate total funding cost (SFM-104)
  const totalFundingCost = aeContribution + topUpContribution;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pension Funding Affordability Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SFM-101 Alert */}
        {topUpContribution > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-md text-sm border border-orange-200">
            <p className="font-medium text-orange-800 dark:text-orange-200">
              Your estimated Top Up of {formatCurrency(topUpContribution)} may not be Affordable
            </p>
            <p className="text-orange-700 dark:text-orange-300 mt-1">
              Your estimated Top Up of {formatCurrency(topUpContribution)} is a lot more than you currently pay. 
              This sudden increase may not be Affordable or Suitable given the Cost of Living Crisis. 
              You are therefore eligible to be considered for Expert Financial Assistance using Advanced Pension Funding.
            </p>
            <div className="text-[8px] text-muted-foreground mt-2">SFM-101</div>
          </div>
        )}
        
        {/* SFM-103 - Monthly Take Home Pay */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monthly Take Home Pay</span>
          <div className="text-right">
            <span className="font-medium">{formatCurrency(taxResult.netPay)}</span>
            <div className="text-[8px] text-muted-foreground">SFM-103</div>
          </div>
        </div>
        
        <Separator />
        
        {/* SFM-104 - Standard Monthly Funding Cost + Top Up Cost */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Standard Monthly Funding Cost + Top Up Cost</span>
          <div className="text-right">
            <div className="font-medium">
              {formatCurrency(aeContribution)} + {formatCurrency(topUpContribution)}
            </div>
            <div className="text-sm text-muted-foreground">= {formatCurrency(totalFundingCost)}</div>
            <div className="text-[8px] text-muted-foreground">SFM-104</div>
          </div>
        </div>
        
        {/* SFM-105 - % of Take Home Pay */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">% of Take Home Pay</span>
          <div className="text-right">
            <span className={`font-medium ${affordabilityPercentage > 10 ? 'text-red-500' : 'text-green-600'}`}>
              {affordabilityPercentage.toFixed(1)}%
            </span>
            <div className="text-[8px] text-muted-foreground">SFM-105</div>
          </div>
        </div>
        
        <Separator />
        
        {/* SFM-106 - BUOM Monthly Funding Cost */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">BUOM Monthly Funding Cost</span>
          <div className="text-right">
            <span className="font-medium text-green-600">{formatCurrency(buomCost)}</span>
            <div className="text-[8px] text-muted-foreground">SFM-106</div>
          </div>
        </div>
        
        {/* SFM-107 - % of Take Home Pay */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">% of Take Home Pay</span>
          <div className="text-right">
            <span className={`font-medium ${buomAffordabilityPercentage > 10 ? 'text-red-500' : 'text-green-600'}`}>
              {buomAffordabilityPercentage.toFixed(1)}%
            </span>
            <div className="text-[8px] text-muted-foreground">SFM-107</div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md text-sm">
          <p>BUOM members have access to our advanced funding platform with precise sponsorship matching based on individual shortfall calculations.</p>
        </div>
        
        {/* SFM-108 - Check My Funding Eligibility Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={() => onChangeTab("funding-eligibility")} 
            className="bg-green-600 hover:bg-green-700 w-full flex items-center gap-2 justify-center"
          >
            Check My Funding Eligibility <ArrowRight size={16} />
          </Button>
          <div className="text-[8px] text-muted-foreground text-center mt-1">SFM-108</div>
        </div>
        
        {/* SFM-102 - Apply Now for Advanced Pension Funding */}
        <div className="pt-2">
          <Button 
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Apply Now for Advanced Pension Funding
          </Button>
          <div className="text-[8px] text-muted-foreground text-center mt-1">SFM-102</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingOptionsCard;
