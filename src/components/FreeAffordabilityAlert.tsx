import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FreePensionCalculationResults } from '@/components/FreeCalculatorResults';
import { formatCurrency } from '@/utils/formatUtils';
import { useFreeCentralisedCalculations } from '@/hooks/useFreeCentralisedCalculations';

interface FreeAffordabilityAlertProps {
  results: FreePensionCalculationResults;
  onChangeTab: (tab: string) => void;
}

const FreeAffordabilityAlert: React.FC<FreeAffordabilityAlertProps> = ({
  results,
  onChangeTab
}) => {
  // Use the centralized calculations hook
  const calculationResults = useFreeCentralisedCalculations(results);
  
  // Calculate required values for affordability assessment
  const monthlyGrossPay = results.annualSalary / 12; // SFM-112
  const pensionableEarnings = monthlyGrossPay * 0.85; // SFM-113 (85% of gross pay)
  const employeeContribution = pensionableEarnings * 0.05; // SFM-114 (5% AE contribution)
  
  // Calculate net pay (simplified calculation using 25% for tax/NI)
  const taxAndNI = monthlyGrossPay * 0.25;
  const monthlyNetIncome = monthlyGrossPay - taxAndNI - employeeContribution; // SFM-103
  
  // Get monthly funding cost from calculated results (SFM-012)
  const monthlyFundingCost = calculationResults.pensionFunding.monthlyFundingCost || 0;
  
  // Calculate total personal contributions required (SFM-012 + SFM-114)
  const totalPersonalContributions = monthlyFundingCost + employeeContribution; // SFM-104
  
  // Calculate affordability percentage (SFM-105)
  const affordabilityPercentage = (totalPersonalContributions / monthlyNetIncome) * 100;
  
  // Determine alert color based on affordability logic
  // Yellow for 4–8.9%, Red for ≥9%, Green for <4%
  let textColor = 'text-green-600';
  let borderColor = 'border-green-200';
  if (affordabilityPercentage >= 4 && affordabilityPercentage < 9) {
    textColor = 'text-yellow-600';
    borderColor = 'border-yellow-200';
  } else if (affordabilityPercentage >= 9) {
    textColor = 'text-red-600';
    borderColor = 'border-red-200';
  }

  // SFM-101: Affordability Warning Status
  const isAffordable = affordabilityPercentage < 4;

  return (
    <Alert className={`border ${borderColor}`}>
      <AlertTitle className={`text-lg ${textColor}`}>
        {isAffordable 
          ? `Your estimated Top Up of ${formatCurrency(monthlyFundingCost)} is Affordable`
          : `⚠ Your estimated Top Up of ${formatCurrency(monthlyFundingCost)} may not be Affordable ⚠`
        }
        <div className="text-[8px] text-muted-foreground mt-1">SFM-101</div>
      </AlertTitle>
      <AlertDescription className={`space-y-4 ${textColor}`}>
        {isAffordable ? (
          <p>
            Your top-up looks affordable relative to your take-home pay. If you want to optimise costs further, consider Advanced Pension Funding for potential savings.
          </p>
        ) : (
          <p>
            Your estimated Top Up of {formatCurrency(monthlyFundingCost)} is a lot more than you currently pay. This sudden increase may not be Affordable or Suitable given the Cost of Living Crisis. You are therefore eligible to be considered for Expert Financial Assistance using Advanced Pension Funding.
          </p>
        )}
        
        <div className="relative">
          <Button 
            onClick={() => onChangeTab("funding-eligibility")}
            className="w-full text-gray-700 font-semibold text-xs sm:text-sm md:text-base px-2 sm:px-4 py-2 sm:py-3 leading-tight"
            style={{ backgroundColor: '#4FF546' }}
          >
            <span className="block sm:hidden">Check Eligibility For Risk Free Assistance</span>
            <span className="hidden sm:block">Check Your Eligibility For Risk Free Financial Assistance</span>
          </Button>
          <div className="text-[8px] text-muted-foreground mt-1">SFM-102</div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FreeAffordabilityAlert;