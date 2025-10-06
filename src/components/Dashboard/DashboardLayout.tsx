
import React from "react";
import { SalaryAssumptionsSection } from "./SalaryAssumptionsSection";
import { RetirementPlanTargetSection } from "./RetirementPlanTargetSection";
import { RepaymentPlanTargetSection } from "./RepaymentPlanTargetSection";
import { PensionShortfallChart } from "./PensionShortfallChart";
import { CustomContributionsCard } from "./CustomContributionsCard";
import { formatCurrency } from "@/utils/formatUtils";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { myBUOMCalculator } from "@/utils/myBUOMCalculator";
import { calculateAge } from "@/utils/pensionCalculations";

export function DashboardLayout() {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  
  // Use the new myBUOMCalculator system with proper CAL-4XXX defaults from Parameters Settings
  const calculations = React.useMemo(() => {
    if (!profile || !profile.date_of_birth) {
      return {
        annualSalary: 0,
        annualSalaryInflated: 0,
        targetIncomeAtRetirement: 0,
        existingPlanIncomeAtRetirement: 0,
        apfTargetIncome: 0,
        retirementProgressPercentage: 0,
        isaTargetMonthly: 0,
        isaValueToday: 0,
        isaSavingsTargetToday: 0,
        repaymentProgressPercentage: 0
      };
    }
    
    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    
    // Derive existing pension value strictly from assets (Net Asset Value)
    const existingPensionValue = (assets || [])
      .filter(asset => 
        asset?.category?.name?.toLowerCase().includes('pension') ||
        asset?.name?.toLowerCase().includes('pension')
      )
      .reduce((sum, asset) => sum + (asset.value || 0), 0);
    
    const inputs = {
      currentAge,
      retirementAge: 67, // CAL-4XXX default from Parameters Settings
      currentSalary: profile.annual_salary || 60000,
      existingPensionValue,
      targetIncomePercentage: 50, // CAL-4XXX default from Parameters Settings
      apfSponsorshipYears: 4,
      isaContributionCapacity: 20000
    };
    
    return myBUOMCalculator.calculateAPFDashboard(inputs);
  }, [profile, assets]);
  
  const formatValue = (value: number) => formatCurrency(value);

  return (
    <div className="space-y-8">
      <CustomContributionsCard />
      
      <div className="grid gap-6 md:grid-cols-3">
        <SalaryAssumptionsSection 
          currentSalary={calculations.annualSalary}
          futureSalary={calculations.annualSalaryInflated}
          formatValue={formatValue}
        />
        <RetirementPlanTargetSection calculations={calculations} />
        <RepaymentPlanTargetSection calculations={calculations} />
      </div>

      <div className="w-full">
        <PensionShortfallChart />
      </div>
    </div>
  );
}
