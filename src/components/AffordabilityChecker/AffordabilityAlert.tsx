
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/pensionCalculations';

interface AffordabilityAlertProps {
  isAffordable: boolean;
  monthlyFundingCost: number;
  affordabilityPercentage: number;
  onChangeTab: (tab: string) => void;
}

const AffordabilityAlert: React.FC<AffordabilityAlertProps> = ({
  isAffordable,
  monthlyFundingCost,
  affordabilityPercentage,
  onChangeTab
}) => {
  console.log('=== REALISTIC AFFORDABILITY ALERT (4% THRESHOLD) ===');
  console.log(`Monthly funding cost: £${monthlyFundingCost}`);
  console.log(`Affordability percentage: ${affordabilityPercentage.toFixed(1)}%`);
  console.log(`Is affordable (≤4%): ${isAffordable}`);

  // SFM-101 severity mapping: Yellow for 4–8.9%, Red for ≥9%, Green for <4%
  const isYellow = affordabilityPercentage >= 4 && affordabilityPercentage < 9;
  const isRed = affordabilityPercentage >= 9;
  // Force non-affordable text/icon to red to match user expectation
  const textColor = isAffordable ? 'text-green-600' : 'text-red-600';
  const borderColor = isRed ? 'border-red-200' : isYellow ? 'border-yellow-200' : 'border-green-200';

  return (
    <Alert variant="default" className={`border ${borderColor}`}>
      <AlertTitle className={`text-lg ${textColor}`}>
        {isAffordable 
          ? `Your estimated Top Up of ${formatCurrency(monthlyFundingCost)} is within our basic Affordability Test` 
          : `⚠ Your estimated Top Up of ${formatCurrency(monthlyFundingCost)} may not be Affordable ⚠`}
        <div className="text-[8px] text-muted-foreground mt-1">SFM-101</div>
      </AlertTitle>
      <AlertDescription className={`space-y-4 ${textColor}`}>
        {isAffordable ? (
          <>
            <p>
              However, should you feel that a 50% lower contribution cost may assist you, please feel free to apply for Advanced Pension Funding.
            </p>
            <div className="relative">
              <Button 
                onClick={() => onChangeTab("funding-eligibility")}
                className="w-full text-gray-700 font-semibold"
                style={{ backgroundColor: '#4FF546' }}
              >
                Check Your Eligibility For Risk Free Financial Assistance
              </Button>
              <div className="text-[8px] text-muted-foreground mt-1">SFM-102</div>
            </div>
          </>
        ) : (
          <>
            <p>
              Your estimated Top Up of {formatCurrency(monthlyFundingCost)} is a lot more than you currently pay. This sudden increase may not be Affordable or Suitable given the Cost of Living Crisis. You are therefore eligible to be considered for Expert Financial Assistance using Advanced Pension Funding.
            </p>
            <div className="relative">
              <Button 
                onClick={() => onChangeTab("funding-eligibility")}
                className="w-full text-gray-700 font-semibold"
                style={{ backgroundColor: '#4FF546' }}
              >
                Check Your Eligibility For Risk Free Financial Assistance
              </Button>
              <div className="text-[8px] text-muted-foreground mt-1">SFM-102</div>
            </div>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AffordabilityAlert;
