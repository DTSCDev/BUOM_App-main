
import React from "react";
import { SalaryAssumptionsSection } from "./SalaryAssumptionsSection";
import { RetirementPlanTargetSection } from "./RetirementPlanTargetSection";
import { RepaymentPlanTargetSection } from "./RepaymentPlanTargetSection";
import { PensionShortfallChart } from "./PensionShortfallChart";
import { CustomContributionsCard } from "./CustomContributionsCard";
import { formatCurrency } from "@/utils/formatUtils";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { myBUOMCalculator, type BUOMCalculationResults } from "@/utils/myBUOMCalculator";
import { calculateAge } from "@/utils/pensionCalculations";
import { getPensionParameters } from "@/utils/pensionParameters";

export function DashboardLayout() {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  
  // Use the new myBUOMCalculator system with proper CAL-4XXX defaults from Parameters Settings
  const calculations = React.useMemo<BUOMCalculationResults>(() => {
    if (!profile || !profile.date_of_birth) {
      return {
        // Salary Summary
        annualSalary: 0,
        annualSalaryInflated: 0,
        paydaysRemaining: 0,
        // Income Summary
        targetIncomeAtRetirement: 0,
        existingPlanIncomeAtRetirement: 0,
        apfTargetIncome: 0,
        retirementProgressPercentage: 0,
        // ISA Plan Summary
        isaTargetMonthly: 0,
        isaValueToday: 0,
        isaSavingsTargetToday: 0,
        repaymentProgressPercentage: 0,
        // Additional calculated values
        yearsToRetirement: 0,
        monthsToRetirement: 0,
        inflationRate: 0,
        growthRate: 0,
        drawdownRate: 0,
      };
    }
    
    const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
    const params = getPensionParameters();
    
    // Derive existing pension value strictly from assets (Net Asset Value)
    const existingPensionValue = (assets || [])
      .filter(asset => 
        asset?.category?.name?.toLowerCase().includes('pension') ||
        asset?.name?.toLowerCase().includes('pension')
      )
      .reduce((sum, asset) => sum + (asset.value || 0), 0);
    
    // Current ISA value strictly from NAV
    const currentISAValue = (assets || [])
      .filter(asset => 
        asset?.category?.name?.toLowerCase().includes('isa') ||
        asset?.name?.toLowerCase().includes('isa')
      )
      .reduce((sum, asset) => sum + (asset.value || 0), 0);

    const inputs = {
      currentAge,
      retirementAge: params.retirementAge,
      currentSalary: profile.annual_salary || 0,
      existingPensionValue,
      // Fraction (e.g. 0.5) from Parameters
      targetIncomePercentage: params.pensionIncomeTarget,
      apfSponsorshipYears: 4,
      currentISAValue
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
          paydaysRemaining={calculations.paydaysRemaining}
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
