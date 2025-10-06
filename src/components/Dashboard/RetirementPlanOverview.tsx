
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatUtils";
import { ImportantNoticeDialog } from "./ImportantNoticeDialog";
import { ApfSalarySummary } from "./apfSalarySummary";
import { ApfIncomeSummary } from "./apfIncomeSummary";
import { ApfISAPlanSummary } from "./apfISAPlanSummary";
import { myBUOMCalculator } from "@/utils/myBUOMCalculator";
import { getPensionParameters } from "@/utils/pensionParameters";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { calculateAge } from "@/utils/pensionCalculations";

export function ApfRetirementPlanSummary() {
  const [isAnnualView, setIsAnnualView] = useState(true);
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();

  // Early return if profile is not loaded
  if (!profile || !profile.date_of_birth || !profile.annual_salary) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get calculation inputs from profile
  const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
  
  // Prefer central pension parameters, fallback to localStorage
  const params = getPensionParameters();
  const parameterValues = (() => {
    try {
      const savedParams = localStorage.getItem('retirement-calculator-parameters');
      if (savedParams) {
        const parsed = JSON.parse(savedParams);
        return {
          retirementAge: parsed.selectedRetirementAge ?? params.retirementAge,
          pensionIncomeTarget: parsed.pensionIncomeTarget ?? (params.pensionIncomeTarget * 100)
        };
      }
    } catch (error) {
      console.warn('Error loading retirement-calculator-parameters', error);
    }
    return { retirementAge: params.retirementAge, pensionIncomeTarget: params.pensionIncomeTarget * 100 };
  })();
  
  // Calculate existing pension value from assets
  const existingPensionValue = assets?.filter(asset => 
    asset.category?.name?.toLowerCase().includes('pension') ||
    asset.name?.toLowerCase().includes('pension')
  ).reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;

  // Use current ISA value from assets instead of hardcoded capacity
  const currentISAValue = assets?.filter(asset => 
    asset.category?.name?.toLowerCase().includes('isa') ||
    asset.name?.toLowerCase().includes('isa')
  ).reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;

  // Calculate using myBUOMCalculator with real Net Asset Value data
  const calculations = myBUOMCalculator.calculateAPFDashboard({
    currentAge,
    retirementAge: parameterValues.retirementAge,
    currentSalary: profile.annual_salary,
    existingPensionValue,
    // Convert percent to fraction if needed
    targetIncomePercentage: (typeof parameterValues.pensionIncomeTarget === 'number') 
      ? (parameterValues.pensionIncomeTarget > 1 ? parameterValues.pensionIncomeTarget / 100 : parameterValues.pensionIncomeTarget)
      : params.pensionIncomeTarget,
    apfSponsorshipYears: 5,
    currentISAValue: currentISAValue,
  });

  const formatValue = (value: number) => {
    const displayValue = isAnnualView ? value : value / 12;
    return formatCurrency(displayValue);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">RETIREMENT PLAN</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant={isAnnualView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAnnualView(true)}
          >
            Annual
          </Button>
          <Button
            variant={!isAnnualView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAnnualView(false)}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ApfSalarySummary
          currentSalary={calculations.annualSalary}
          futureSalary={calculations.annualSalaryInflated}
          paydaysRemaining={calculations.paydaysRemaining}
          formatValue={formatValue}
        />

        <ApfIncomeSummary calculations={calculations} />

        <ApfISAPlanSummary calculations={calculations} />

        <div className="flex justify-center pt-4 border-t">
          <ImportantNoticeDialog />
        </div>
      </CardContent>
    </Card>
  );
}
