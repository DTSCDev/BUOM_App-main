
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed button toggle; using switch instead
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/utils/formatUtils";
import { ImportantNoticeDialog } from "./ImportantNoticeDialog";
import { ApfSalarySummary } from "./apfSalarySummary";
import { ApfIncomeSummary } from "./apfIncomeSummary";
import { ApfISAPlanSummary } from "./apfISAPlanSummary";
import { calculateUnifiedPensionMetrics } from "@/utils/pension/unifiedCalculationEngine";
import { Asset as UnifiedAsset, Profile as UnifiedProfile } from "@/utils/systemFields/types";
import { getPensionParameters } from "@/utils/pensionParameters";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { calculateAge, calculateYearsUntilPension } from "@/utils/pensionCalculations";
import { useRetirementCalculatorHub } from "@/hooks/useRetirementCalculatorHub";

export function ApfRetirementPlanSummary() {
  const [isAnnualView, setIsAnnualView] = useState(true);
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  // Ensure hooks are always called in consistent order
  const hub = useRetirementCalculatorHub();

  // Early return if profile is not loaded (hooks already called above)
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
  
  // Use central pension parameters
  const params = getPensionParameters();
  const spa = calculateYearsUntilPension(new Date(profile.date_of_birth));
  const yearsToSPA = Math.max(0, spa.years);
  const monthsToSPA = Math.max(0, (spa.years * 12) + spa.months);
  
  // Calculate existing pension value from assets (guard against undefined assets)
  const existingPensionValue = (assets || [])
    .filter(asset => 
      asset.category?.name?.toLowerCase().includes('pension') ||
      asset.name?.toLowerCase().includes('pension')
    )
    .reduce((sum, asset) => sum + (asset.value || 0), 0);

  // Use current ISA value from assets instead of hardcoded capacity (guard against undefined assets)
  const currentISAValue = (assets || [])
    .filter(asset => 
      asset.category?.name?.toLowerCase().includes('isa') ||
      asset.name?.toLowerCase().includes('isa')
    )
    .reduce((sum, asset) => sum + (asset.value || 0), 0);

  // Map NAV assets to unified engine asset type and prepare typed profile
  const assetsForUnified: UnifiedAsset[] = (assets || []).map(a => ({
    name: a.name,
    category: { name: a.category?.name },
    value: a.value,
  }));

  const unifiedProfile: UnifiedProfile = {
    annual_salary: profile.annual_salary || 0,
  };

  // Calculate using unified pension engine with real Net Asset Value data
  const unified = calculateUnifiedPensionMetrics(
    currentAge,
    profile.annual_salary || 0,
    existingPensionValue,
    false,
    assetsForUnified,
    unifiedProfile
  );

  // APF-1001 = PRF-2021; APF-1002 = PRF-2021 × (1 + CAL-4402)^CAL-4111
  // Align to hub: use CAL-4111 (time to retirement years), not SPA years
  const annualSalaryInflated = (profile.annual_salary || 0) * Math.pow(1 + params.salaryInflation, hub.cal4111_timeToRetirementYears);

  // APF-1004: Future Target Income = APF-1002 × CAL-4406
  // APF-1002 is annualSalaryInflated; CAL-4406 maps to params.pensionIncomeTarget
  const targetIncomeAtRetirement = annualSalaryInflated * params.pensionIncomeTarget;

  const totalProjectedValue = (hub.cal4126_existingFundValueAtRetirement || 0) + (hub.cal4127_existingPlanFutureContributions || 0);

  // CAL-4109: State Pension at Retirement
  const statePensionToday = params.statePensionWeekly * 52;
  const statePensionAtRetirement = statePensionToday * Math.pow(1 + params.pensionIncomeInflation, yearsToSPA);

  // CAL-4132: Existing Plan Projected Income via hub
  const existingPlanIncomeAtRetirement = hub.cal4132_existingPlanProjectedIncome;

  // APF-1006: Shortfall vs target
  const apfTargetIncome = Math.max(0, targetIncomeAtRetirement - existingPlanIncomeAtRetirement);

  // ISA target capital from income shortfall
  const isaSavingsTargetToday = apfTargetIncome / params.drawdownRate;

  const calculations = {
    annualSalary: profile.annual_salary || 0, // APF-1001
    annualSalaryInflated, // APF-1002
    paydaysRemaining: hub.cal4113_paydaysRemaining, // APF-1003 (CAL-4113)
    targetIncomeAtRetirement, // APF-1004 (CAL-4107) — unified to local calculation
    existingPlanIncomeAtRetirement, // APF-1005 (CAL-4132)
    apfTargetIncome, // APF-1006
    retirementProgressPercentage: Math.min(100, targetIncomeAtRetirement > 0 ? (existingPlanIncomeAtRetirement / targetIncomeAtRetirement) * 100 : 0),
    // Keep ISA figures from unified for now to avoid broader ripple effects
    isaTargetMonthly: unified.isaTargetMonthly,
    isaValueToday: currentISAValue,
    isaSavingsTargetToday,
    repaymentProgressPercentage: Math.min(100, unified.repaymentProgressPercentage || 0),
  };

  const formatValue = (value: number) => {
    const displayValue = isAnnualView ? value : value / 12;
    return formatCurrency(displayValue);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold" style={{ color: '#4FF456' }}>RETIREMENT PLAN</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ApfSalarySummary
          currentSalary={calculations.annualSalary}
          futureSalary={calculations.annualSalaryInflated}
          paydaysRemaining={calculations.paydaysRemaining}
          formatValue={formatValue}
          isAnnualView={isAnnualView}
          onToggle={(checked) => setIsAnnualView(checked)}
        />

        <ApfIncomeSummary calculations={calculations} formatValue={formatValue} />

        <ApfISAPlanSummary calculations={calculations} formatValue={formatValue} />

        <div className="flex justify-center pt-4 border-t">
          <ImportantNoticeDialog />
        </div>
      </CardContent>
    </Card>
  );
}
