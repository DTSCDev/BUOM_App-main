
/*
 * 4100 RETIREMENT CALCULATOR 
 * 4200 APF CALCULATOR 
 * 4300 DIRECTOR EARNINGS 
 * 4400 MAX PENSION FUNDING 
 * 4500 SALARY SACRIFICE COMPARISON 
 * 4600 MAX PENSION FUNDING 
 * 4800 PARAMETERS PAGE 
 * 
 * RETIREMENT CALCULATOR EMPLOYEE PAGE CODES ALLOCATED 
 * 
 * SFM CODE ALLOCATION FOR THIS PAGE: 
 * SFM-CAL-4101 to 4139 = Calculator Tab 
 * SFM-CAL-4140 to 4159 = Affordability Tab  
 * 
 * CURRENT SFM CODE ASSIGNMENTS: 
 * SFM-CAL-4101 "Funding Progress" 
 * SFM-CAL-4102 "Existing Fund Value" 
 * SFM-CAL-4103 "Current Projection" 
 * SFM-CAL-4104 "Required Capital" 
 * SFM-CAL-4105 "Estimated Shortfall" 
 * SFM-CAL-4106 "Target Income Today" 
 * SFM-CAL-4107 "Target Income at Retirement" 
 * SFM-CAL-4108 "State Pension Today" 
 * SFM-CAL-4109 "State Pension at Retirement" 
 * SFM-CAL-4110 "Current Age" 
 * SFM-CAL-4111 "Time to Retirement" 
 * SFM-CAL-4112 "Days Until Pension" 
 * SFM-CAL-4113 "Paydays Remaining" 
 * SFM-CAL-4114 "Estimated Historical Contributions" 
 * SFM-CAL-4115 "Estimated Existing Pension Fund Value" 
 * SFM-CAL-4116 "Future Growth on Existing Fund Value" 
 * SFM-CAL-4117 "Future AE Contributions" 
 * SFM-CAL-4118 "Future AE Contributions Growth" 
 * SFM-CAL-4119 "Total Projected Pension Value" 
 * SFM-CAL-4120 "Required Capital" 
 * SFM-CAL-4121 "Capital Shortfall" 
 * SFM-CAL-4122 "Top Up Contributions Paid" 
 * SFM-CAL-4123 "Top Up Investment Growth" 
 * SFM-CAL-4124 "Top Up Total Fund Value" 
 * SFM-CAL-4125 "Effective Growth Rate" 
 * SFM-CAL-4126 "Existing Fund Value at Retirement" 
 * SFM-CAL-4127 "Existing Plan Future Contributions" 
 * SFM-CAL-4128 "Existing Plan Monthly Top Up (Year 1)" 
 * SFM-CAL-4129 "BUOM Monthly Estimate (Year 1)" 
 * SFM-CAL-4130 "BUOM APF Application CTA" 
 * SFM-CAL-4131 "BUOM ISA Contributions Paid" 
 * SFM-CAL-4132 "Advanced Pension Funding Period"
 * 
 * AUTOMATION REMINDER: 
 * When making ANY changes to SFM codes in this file: 
 * 1. Update the SFM Audit CSV Export file immediately 
 * 2. Use only SFM-XXX-XXXX or SFM-XXX-XXXX-X series for APP pages 
 * 3. SFM-XXX codes are ONLY for Free Calculator (non-subscription) 
 * 4. Old formats SFM-XXX, SFM-XXX-X, SFM-XXXX are DEPRECATED for APP pages 
 * 5. Each APP page has isolated series to prevent corruption from previous Dev AI 
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { PensionCharts } from '@/components/PensionCharts';
import { useRetirementCalculatorHub } from '@/hooks/useRetirementCalculatorHub';
import { calculateAffordability } from '@/utils/pension/taxCalculations';
import { TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import SFMCodeBadge from '@/components/SystemFields/SFMCodeBadge';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { Switch } from '@/components/ui/switch';
import { formatCurrency, calculateAge, calculateDaysUntilPension, calculateRemainingPayDays, calculateYearsUntilPension } from '@/utils/pensionCalculations';
import { getPensionParameters } from '@/utils/pensionParameters';
import { calculateTotalAEContributions } from '@/utils/pension/aeContributionCalculations';
import { calculateExistingPensionValue as estimateExistingPensionValue } from '@/utils/pension/existingPensionCalculations';
// Removed Free components to keep page-based SFM usage consistent

/*
 * RETIREMENT CALCULATOR EMPLOYEE PAGE
 * 
 * SFM CODE ALLOCATION FOR THIS PAGE:
 * SFM-CAL-4101 to 4131 = Calculator Tab (properly allocated via SFMTracker)
 * SFM-CAL-4132 to 4151 = Affordability Tab (SHOULD BE - currently incorrectly 4140-4159)
 * 
 * CURRENT ISSUE: SFM codes 4140-4159 were manually allocated without using SFMTracker
 * CORRECT PROCESS: Use SFMAllocationUtils.autoAllocate() for sequential allocation
 * 
 * CURRENT SFM CODE ASSIGNMENTS:
 * SFM-CAL-4101 "Funding Progress"
 * SFM-CAL-4102 "Existing Fund Value"
 * SFM-CAL-4103 "Current Projection"
 * SFM-CAL-4104 "Required Capital"
 * SFM-CAL-4105 "Estimated Shortfall"
 * SFM-CAL-4106 "Target Income Today"
 * SFM-CAL-4107 "Target Income at Retirement"
 * SFM-CAL-4108 "State Pension Today"
 * SFM-CAL-4109 "State Pension at Retirement"
 * SFM-CAL-4110 "Current Age"
 * SFM-CAL-4111 "Time to Retirement"
 * SFM-CAL-4112 "Days Until Pension"
 * SFM-CAL-4113 "Paydays Remaining"
 * SFM-CAL-4114 "Estimated Historical Contributions"
 * SFM-CAL-4115 "Estimated Existing Pension Fund Value"
 * SFM-CAL-4116 "Future Growth on Existing Fund Value"
 * SFM-CAL-4117 "Future AE Contributions"
 * SFM-CAL-4118 "Future AE Contributions Growth"
 * SFM-CAL-4119 "Total Projected Pension Value"
 * SFM-CAL-4120 "Required Capital"
 * SFM-CAL-4121 "Capital Shortfall"
 * SFM-CAL-4122 "Top Up Contributions Paid"
 * SFM-CAL-4123 "Top Up Investment Growth"
 * SFM-CAL-4124 "Top Up Total Fund Value"
 * SFM-CAL-4125 "Effective Growth Rate"
 * SFM-CAL-4126 "Existing Fund Value at Retirement"
 * SFM-CAL-4127 "Existing Plan Future Contributions"
 * SFM-CAL-4128 "Existing Plan Monthly Top Up (Year 1)"
 * SFM-CAL-4129 "BUOM Monthly Estimate (Year 1)"
 * SFM-CAL-4130 "BUOM APF Application CTA"
 * SFM-CAL-4131 "BUOM ISA Contributions Paid"
 * 
 * AFFORDABILITY TAB CODES (CURRENTLY INCORRECT - NEED TO FIX):
 * Currently using SFM-CAL-4140 to 4159 (manually allocated - WRONG)
 * Should be using SFM-CAL-4132 to 4151 (sequential via SFMTracker)
 * 
 * SFM ALLOCATION PROCESS:
 * 1. Use SFMAllocationUtils.autoAllocate() for 'CALCULATORS_PAGE' range
 * 2. Register allocations in sfmAllocationRegistry
 * 3. Update pageBasedSFMFields.ts with allocated codes
 * 4. Cross-reference with systemFields.ts
 * 5. Never manually assign SFM codes without SFMTracker
 * 
 * AUTOMATION REMINDER:
 * When making ANY changes to SFM codes in this file:
 * 1. Use SFMAllocationUtils.autoAllocate() - NEVER manual allocation
 * 2. Update pageBasedSFMFields.ts with proper allocations
 * 3. Ensure systemFields.ts reflects the changes
 * 4. Update the SFM Audit CSV Export file
 * 5. Use only SFM-CAL-4XXX series for Calculator pages
 */

const RetirementCalculatorEmployee = () => {
  const { profile } = useProfile();
  const [isCapitalView, setIsCapitalView] = useState(true);
  const { assets } = useNetAssetValue();
  const [activeTab, setActiveTab] = useState('calculator');
  const [retirementAge, setRetirementAge] = useState(67); // Default retirement age

  // Use centralized Calculator Hub CAL values
  const hub = useRetirementCalculatorHub();
  const monthlyFundingCost = hub.cal4128_existingPlanMonthlyTopUpYear1;

  // Set retirement age from Profile (PRF-2041) only; no localStorage
  useEffect(() => {
    if (profile?.retirement_age) {
      setRetirementAge(profile.retirement_age);
    }
  }, [profile?.retirement_age]);

  // Calculate age from date of birth
  const age = profile?.date_of_birth 
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

  // Calculate existing pension value from NAV assets with fallback to estimated value
  // Guard against undefined assets to avoid calling reduce on undefined
  let existingPensionValue = (assets || [])
    .filter(asset => 
      asset.category?.name?.toLowerCase().includes('pension') ||
      asset.name?.toLowerCase().includes('pension')
    )
    .reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;

  // Fallback: if no NAV pension assets found, estimate existing fund value from salary history
  if (existingPensionValue === 0 && profile?.annual_salary && age !== null) {
    try {
      const { fundValue } = estimateExistingPensionValue(profile.annual_salary!, age!);
      existingPensionValue = fundValue || 0;
    } catch {
      // Silent fallback failure per no-console policy
    }
  }

  // Use page-based calculations and NAV; avoid Free parameter utilities

  // Calculate pension contributions if profile data is available
  const pensionCalcs = profile?.annual_salary ? (() => {
    const monthlyGrossPay = profile.annual_salary / 12;
    const pensionableEarnings = monthlyGrossPay * 0.85; // 85% pensionable pay
    const employeeRate = profile.pension_contribution_employee || 5;
    const employerRate = profile.pension_contribution_employer || 3;
    const totalRate = employeeRate + employerRate;
    const employeeContribution = pensionableEarnings * (employeeRate / 100);
    const employerContribution = pensionableEarnings * (employerRate / 100);
    const totalContribution = employeeContribution + employerContribution;
    
    // Calculate affordability metrics using the tax calculation utility
    const affordabilityData = calculateAffordability(profile.annual_salary, monthlyFundingCost);
    const totalFundingCost = employeeContribution + monthlyFundingCost;
    const buomMonthlyCost = monthlyFundingCost * (1 - ((getPensionParameters().buomDiscountRate <= 1 ? getPensionParameters().buomDiscountRate : getPensionParameters().buomDiscountRate / 100)));
    const buomAffordabilityPercentage = (buomMonthlyCost + employeeContribution) / affordabilityData.taxResult.netPay * 100;
    
    return {
      monthlyGrossPay,
      pensionableEarnings,
      employeeRate,
      employerRate,
      totalRate,
      employeeContribution,
      employerContribution,
      totalContribution,
      monthlyTakeHomePay: affordabilityData.taxResult.netPay,
      totalFundingCost,
      affordabilityPercentage: affordabilityData.affordabilityPercentage,
      buomMonthlyCost,
      buomAffordabilityPercentage,
      estimatedNetPay1257L: affordabilityData.taxResult.netPay,
      monthlyFundingCost,
    };
  })() : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Income-mode values derived from Parameters and existing calculations
  const params = getPensionParameters();
  const currentAge = age || 0;
  const yearsToRetirement = Math.max(0, (retirementAge ?? params.retirementAge) - currentAge);
  // Use monthly-based functions for display metrics, aligned with Free Calculator
  // Use precise calendar month calculation for paydays (regulated standard)
  const paydaysRemainingDisplay = profile?.date_of_birth
    ? (() => {
        const { years, months } = calculateYearsUntilPension(new Date(profile.date_of_birth));
        return Math.max(0, (years * 12) + months);
      })()
    : null;
  // Days until pension display value (guards against missing profile DOB)
  const daysUntilPensionDisplay = profile?.date_of_birth
    ? calculateDaysUntilPension(
        new Date(profile.date_of_birth),
        retirementAge ?? params.retirementAge
      )
    : null;
  const requiredIncomeAtRetirement = (profile?.annual_salary || 0) * params.pensionIncomeTarget;
  const projectedIncomeAtRetirement = (hub.cal4119_totalProjectedPensionValue || 0) * params.drawdownRate;
  const incomeShortfall = Math.max(0, requiredIncomeAtRetirement - projectedIncomeAtRetirement);
  const incomeProgress = requiredIncomeAtRetirement > 0
    ? (projectedIncomeAtRetirement / requiredIncomeAtRetirement) * 100
    : 0;

  // Pension Timeline derived values for display panels
  const targetIncomeToday = (profile?.annual_salary || 0) * params.pensionIncomeTarget;
  const targetIncomeAtRetirement = targetIncomeToday * Math.pow(1 + params.pensionIncomeInflation, yearsToRetirement);
  const statePensionToday = params.statePensionWeekly * 52;
  const statePensionAtRetirement = statePensionToday * Math.pow(1 + params.pensionIncomeInflation, yearsToRetirement);
  const existingPlanProjectedIncome = ((hub.cal4119_totalProjectedPensionValue || 0) * params.drawdownRate) + statePensionAtRetirement;

  // Page-based Projection Analysis derivations (SFM-CAL-4114 to 4125, 4133)
  const currentAgeYears = profile?.date_of_birth ? calculateAge(new Date(profile.date_of_birth)).years : (age ?? 0);
  const yearsUntilPension = Math.max(0, (retirementAge ?? params.retirementAge) - (currentAgeYears || 0));
  const aeTotals = calculateTotalAEContributions(profile?.annual_salary || 0, currentAgeYears || 0, yearsUntilPension);
  const historicalContributions = aeTotals.historicalContributions || 0; // SFM-CAL-4114
  const growthFromExisting = Math.max(0, (hub.cal4126_existingFundValueAtRetirement || 0) - (existingPensionValue || 0)); // SFM-CAL-4116
  const futureAEContributions = aeTotals.futureContributions || 0; // SFM-CAL-4117
  const futureAEGrowth = Math.max(0, (hub.cal4127_existingPlanFutureContributions || 0) - futureAEContributions); // SFM-CAL-4118
  const totalProjectedValue = (hub.cal4126_existingFundValueAtRetirement || 0) + (hub.cal4127_existingPlanFutureContributions || 0); // SFM-CAL-4119
  const requiredCapital = hub.cal4120_requiredCapital || 0; // SFM-CAL-4120
  const capitalShortfall = hub.cal4121_capitalShortfall || 0; // SFM-CAL-4121
  const equivalentIncomeShortfall = Math.round((capitalShortfall || 0) * params.drawdownRate); // SFM-CAL-4133
  const topUpContributionsPaid = Math.max(0, (monthlyFundingCost || 0) * 12); // SFM-CAL-4122
  const topUpInvestmentGrowth = Math.max(0, capitalShortfall - topUpContributionsPaid); // SFM-CAL-4123
  const topUpTotalFundValue = topUpContributionsPaid + topUpInvestmentGrowth; // SFM-CAL-4124
  const effectiveGrowthRate = topUpContributionsPaid > 0 ? ((topUpInvestmentGrowth / topUpContributionsPaid) * 100) : 0; // SFM-CAL-4125

  // Use dynamic calculations instead of mock data
  const fundingProgress = requiredCapital > 0 ? Math.min(100, (totalProjectedValue / requiredCapital) * 100) : 0;
  const showAffordabilityWarning = monthlyFundingCost > 0;
  const isOnTrack = fundingProgress >= 100;
  const isReasonablyOnTrack = fundingProgress >= 80;

  // Show loading state if calculations are still loading
  if (!profile?.date_of_birth) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Retirement Calculator</h1>
            <p className="text-gray-600">Loading your retirement calculations...</p>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Loading dynamic calculations...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Retirement Calculator</h1>
          <p className="text-gray-600">Plan your retirement with comprehensive pension calculations and projections</p>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 bg-gray-700 p-1 rounded-lg">
              <TabsTrigger 
                value="calculator"
                className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700 rounded-md"
                style={{ 
                  color: activeTab === 'calculator' ? '#374151' : '#4FF456',
                  backgroundColor: activeTab === 'calculator' ? '#4FF546' : 'transparent',
                  opacity: activeTab === 'calculator' ? 1 : 0.7
                }}
              >
                Calculator
              </TabsTrigger>
              <TabsTrigger 
                value="affordability"
                className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700 rounded-md"
                style={{ 
                  color: activeTab === 'affordability' ? '#374151' : '#4FF456',
                  backgroundColor: activeTab === 'affordability' ? '#4FF546' : 'transparent',
                  opacity: activeTab === 'affordability' ? 1 : 0.7
                }}
              >
                Affordability
              </TabsTrigger>
              {/* Reserve space for future tabs to keep layout consistent */}
              <div className="hidden md:block" />
              <div className="hidden md:block" />
              <div className="hidden md:block" />
            </TabsList>
            
            <TabsContent value="calculator" className="mt-6">
              <div className="space-y-6">
                {/* Cashflow Modeller (Voyants-style) - Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle style={{ color: '#4FF456' }}>Cashflow Modeller (Voyants-style)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      A dynamic cashflow modeller will appear here to visualise income,
                      expenses, and pension drawdown over time.
                    </p>
                  </CardContent>
                </Card>
                {/* Pension Funding Analysis - replicate Free layout and style with page-based SFM codes */}
                <Card className="border-2 border-green-200 bg-green-50/30 rounded-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle style={{ color: '#4FF456' }}>Pension Funding Analysis</CardTitle>
                      {/* Right-aligned Income/Capital toggle (UI state only) */}
                      <div className="flex items-center gap-3">
                        <span className={!isCapitalView ? 'font-medium' : 'text-gray-400'} style={!isCapitalView ? { color: '#4FF456' } : {}}>Income Values</span>
                        <Switch checked={isCapitalView} onCheckedChange={setIsCapitalView} />
                        <span className={isCapitalView ? 'font-medium' : 'text-gray-400'} style={isCapitalView ? { color: '#4FF456' } : {}}>Capital Values</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Free calculator funding analysis</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Top alert bar mirroring Funding Analysis screenshot */}
                    {capitalShortfall > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          Your estimated Top Up of {formatCurrency(monthlyFundingCost)} may not be Affordable. Check your eligibility for risk-free financial assistance.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Row 1: Funding Progress + Current Projection */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 relative">
                        <h3 className="font-medium text-gray-900">Funding Progress</h3>
                        <div className={`text-3xl font-bold ${fundingProgress >= 100 ? 'text-green-600' : fundingProgress >= 80 ? 'text-yellow-500' : 'text-red-600'}`}>
                          {Math.round(fundingProgress)}%
                        </div>
                        <Progress value={Math.min(fundingProgress, 100)} className={`h-3 ${fundingProgress >= 100 ? 'progress-green' : fundingProgress >= 80 ? 'progress-amber' : 'progress-red'}`} />
                        <p className="text-sm text-gray-600">
                          {fundingProgress >= 100
                            ? "Congratulations! You're on track for retirement."
                              : fundingProgress >= 80
                              ? "You're close to your retirement target."
                              : "You have a pension funding gap that needs attention."}
                        </p>
                        <div className="absolute bottom-0 right-0">
                          <SFMCodeBadge sfmId="SFM-CAL-4101" />
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <h3 className="font-medium text-gray-900">Current Projection</h3>
                        <div className={`text-3xl font-bold ${fundingProgress >= 100 ? 'text-green-600' : fundingProgress >= 80 ? 'text-yellow-500' : 'text-red-600'}`}>
                          {formatCurrency(totalProjectedValue)}
                        </div>
                        <p className="text-sm text-gray-600">Projected pension pot at retirement</p>
                        <div className="absolute bottom-0 right-0">
                          <SFMCodeBadge sfmId="SFM-CAL-4103" />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Required Capital + Estimated Shortfall */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 relative pb-6">
                        <h3 className="font-medium text-gray-900">Capital Target Required</h3>
                        <div className="text-3xl font-bold text-black">
                          {formatCurrency(requiredCapital)}
                        </div>
                        <p className="text-sm text-gray-600">Assumes full State Pension is payable</p>
                        <div className="absolute bottom-0 right-0">
                          <SFMCodeBadge sfmId="SFM-CAL-4120" />
                        </div>
                      </div>

                      <div className="space-y-2 relative pb-6">
                        <h3 className="font-medium text-gray-900">Estimated Shortfall</h3>
                        <div className={`text-3xl font-bold ${capitalShortfall > 0 ? 'text-[#9333EA]' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(capitalShortfall))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {capitalShortfall > 0 ? 'Additional capital needed' : 'Excess above target'}
                        </p>
                        <div className="absolute bottom-0 right-0">
                          <SFMCodeBadge sfmId="SFM-CAL-4121" />
                        </div>
                      </div>
                    </div>

                    {/* Top-Up Monthly Cost CTA - positioned beneath CAL-4120 and CAL-4121 */}
                    {capitalShortfall > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 relative">
                        <h4 className="text-2xl font-semibold text-purple-600 mb-2">Existing Plan Top-Up Monthly Cost</h4>
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {formatCurrency(monthlyFundingCost)}
                        </div>
                        <p className="text-sm text-purple-600 mb-4">
                          Additional monthly contribution needed to close your Estimated Shortfall
                        </p>
                        <button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-3"
                          onClick={() => setActiveTab('affordability')}
                        >
                          Check Affordability
                        </button>
                        <div className="absolute bottom-2 right-2">
                          <SFMCodeBadge sfmId="SFM-CAL-4119" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Charts block mirroring layout using page-based components */}
                <PensionCharts
                  projectedPensionPot={hub.cal4126_existingFundValueAtRetirement + hub.cal4127_existingPlanFutureContributions}
                  existingPensionValue={existingPensionValue}
                  existingPlanValueTodayAtRetirement={hub.cal4126_existingFundValueAtRetirement}
                  existingPlanFutureContributions={hub.cal4127_existingPlanFutureContributions}
                  shortfall={capitalShortfall}
                  monthlyFundingCost={monthlyFundingCost}
                  totalStandardCost={monthlyFundingCost * 12}
                  annualSalary={profile?.annual_salary ?? 0}
                  yearsToRetirement={(age !== null ? retirementAge - age : 0)}
                  onChangeTab={(tab: string) => setActiveTab(tab)}
                />

                {/* Side-by-side layout for Timeline and Projection Analysis - page-based SFM */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Pension Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ color: '#4FF456' }}>Pension Timeline</CardTitle>
                      <p className="text-sm text-muted-foreground">Timeline calculations for your retirement planning</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Target Income & Existing Plan Projected Income - inline within parent card */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Target Income Today</h3>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(targetIncomeToday)}</p>
                            <SFMCodeBadge sfmId="SFM-CAL-4106" />
                          </div>
                          <p className="text-sm text-gray-600">50% of current annual salary</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Target Income at Retirement</h3>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(targetIncomeAtRetirement)}</p>
                            <SFMCodeBadge sfmId="SFM-CAL-4107" />
                          </div>
                          <p className="text-sm text-gray-600">Target income adjusted for inflation</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Existing Plan Projected Income</h3>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(existingPlanProjectedIncome)}</p>
                            <SFMCodeBadge sfmId="SFM-CAL-4132" />
                          </div>
                          <p className="text-sm text-gray-600">Projected income (inc. State Pension)</p>
                        </div>
                      </div>

                      {/* Simple divider between target income data and state pension details */}
                      <div className="border-t" />

                      {/* State Pension Details - grouped within parent card */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">State Pension Details</h3>
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="text-sm text-gray-700">State Pension Today</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-2xl font-bold text-blue-600">{formatCurrency(statePensionToday)}</p>
                              <SFMCodeBadge sfmId="SFM-CAL-4108" />
                            </div>
                            <p className="text-sm text-gray-600">Current state pension value</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">State Pension at Retirement</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-2xl font-bold text-green-600">{formatCurrency(statePensionAtRetirement)}</p>
                              <SFMCodeBadge sfmId="SFM-CAL-4109" />
                            </div>
                            <p className="text-sm text-gray-600">State pension adjusted for inflation</p>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Section - single green panel, no icon, gray typography */}
                      <div className="rounded-lg p-6 bg-[#4FF456]">
                        <h3 className="text-lg font-semibold mb-6 text-gray-700">Key Metrics</h3>
                        <div className="space-y-6 text-gray-700">
                          <div className="flex items-baseline justify-between">
                            <span>Current Age</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{age || 'Not set'} years 0 months</span>
                              <SFMCodeBadge sfmId="SFM-CAL-4110" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span>Time to Retirement</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{age ? retirementAge - age : 'N/A'} years 00 months</span>
                              <SFMCodeBadge sfmId="SFM-CAL-4111" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span>Days Until Pension</span>
                            <div className="text-right">
                            <span className="font-semibold text-gray-900">{daysUntilPensionDisplay !== null ? Math.round(daysUntilPensionDisplay).toLocaleString() : 'N/A'}</span>
                              <SFMCodeBadge sfmId="SFM-CAL-4112" />
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span>Paydays Remaining</span>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900">{paydaysRemainingDisplay !== null ? Math.round(paydaysRemainingDisplay).toLocaleString() : 'N/A'}</span>
                              <SFMCodeBadge sfmId="SFM-CAL-4113" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pension Projection Analysis - Page-based SFM fields */}
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ color: '#4FF456' }}>Pension Projection Analysis</CardTitle>
                      <p className="text-sm text-muted-foreground">Detailed breakdown of your pension projections</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Main Projection Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Estimated Historical Contributions</span>
                          <span className="font-medium">{formatCurrency(historicalContributions)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4114" />
                          </div>
                        </div>

                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Estimated Existing Pension Fund Value</span>
                          <span className="font-medium">{formatCurrency(existingPensionValue)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4115" />
                          </div>
                        </div>

                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Future Growth on Existing Fund Value</span>
                          <span className="font-medium text-green-600">+{formatCurrency(growthFromExisting)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4116" />
                          </div>
                        </div>

                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Future AE Contributions</span>
                          <span className="font-medium">{formatCurrency(futureAEContributions)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4117" />
                          </div>
                        </div>

                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Future AE Contributions Growth</span>
                          <span className="font-medium text-green-600">+{formatCurrency(futureAEGrowth)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4118" />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between font-medium text-lg relative pb-6">
                          <span>Total Projected Pension Value</span>
                          <span>{formatCurrency(totalProjectedValue)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4119" />
                          </div>
                        </div>
                        
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Required Capital</span>
                          <span className="font-medium">{formatCurrency(requiredCapital)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4120" />
                          </div>
                        </div>
                        
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Capital Shortfall</span>
                          <span className="font-medium text-[#9333EA]">{formatCurrency(capitalShortfall)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4121" />
                          </div>
                        </div>

                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Equivalent Income Shortfall</span>
                          <span className="font-medium text-[#9333EA]">{formatCurrency(equivalentIncomeShortfall)}</span>
                          <div className="absolute bottom-0 right-0">
                            <SFMCodeBadge sfmId="SFM-CAL-4133" />
                          </div>
                        </div>
                      </div>

                      {/* Top Up Contribution Analysis */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456', borderWidth: '1px' }}>
                        <h3 className="font-semibold text-gray-700 mb-3">Top Up Contribution Analysis</h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between relative pb-6">
                            <span>Top Up Contributions Paid:</span>
                            <span className="font-medium text-gray-700">{formatCurrency(topUpContributionsPaid)}</span>
                            <div className="absolute bottom-0 right-0">
                              <SFMCodeBadge sfmId="SFM-CAL-4122" />
                            </div>
                          </div>

                          <div className="flex justify-between relative pb-6">
                            <span>Top Up Investment Growth:</span>
                            <span className="font-medium text-gray-700">+{formatCurrency(topUpInvestmentGrowth)}</span>
                            <div className="absolute bottom-0 right-0">
                              <SFMCodeBadge sfmId="SFM-CAL-4123" />
                            </div>
                          </div>

                          <div className="flex justify-between relative pb-6">
                            <span>Top Up Total Fund Value:</span>
                            <span className="font-medium text-[#9333EA]">{formatCurrency(topUpTotalFundValue)}</span>
                            <div className="absolute bottom-0 right-0">
                              <SFMCodeBadge sfmId="SFM-CAL-4124" />
                            </div>
                          </div>

                          <div className="flex justify-between relative pb-6">
                            <span>Effective Growth Rate:</span>
                            <span className="font-medium text-gray-700">{effectiveGrowthRate.toFixed(1)}%</span>
                            <div className="absolute bottom-0 right-0">
                              <SFMCodeBadge sfmId="SFM-CAL-4125" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="affordability" className="mt-6">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Affordability Assessment
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Analyze the affordability of your pension funding requirements
                  </p>
                </div>

                {/* Affordability Alert */}
                {pensionCalcs && (
                  <Alert className={`border-2 ${
                    pensionCalcs.affordabilityPercentage < 4 
                      ? 'border-green-600 bg-white' 
                      : pensionCalcs.affordabilityPercentage < 9 
                        ? 'border-yellow-600 bg-white' 
                        : 'border-red-600 bg-white'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      pensionCalcs.affordabilityPercentage < 4 
                        ? 'text-green-600' 
                        : pensionCalcs.affordabilityPercentage < 9 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`} />
                    <div className={`text-lg ${
                      pensionCalcs.affordabilityPercentage < 4 
                        ? 'text-green-600' 
                        : pensionCalcs.affordabilityPercentage < 9 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {pensionCalcs.affordabilityPercentage < 4
                        ? `Your estimated Top Up of ${formatCurrency(pensionCalcs.monthlyFundingCost)} is Affordable`
                        : `Your estimated Top Up of ${formatCurrency(pensionCalcs.monthlyFundingCost)} may not be Affordable`
                      }
                      <SFMCodeBadge sfmId="SFM-CAL-4150" className="mt-1" />
                    </div>
                    <AlertDescription className={`space-y-4 ${
                      pensionCalcs.affordabilityPercentage < 4 
                        ? 'text-green-600' 
                        : pensionCalcs.affordabilityPercentage < 9 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      <p>
                        Your estimated Top Up of {formatCurrency(pensionCalcs.monthlyFundingCost)} is a lot more than you currently pay. 
                        This sudden increase may not be Affordable or Suitable given the Cost of Living Crisis. 
                        You are therefore eligible to be considered for Expert Financial Assistance using Advanced Pension Funding.
                      </p>
                      
                      <div className="relative">
                        <Button 
                          className="w-full text-black font-semibold"
                          style={{ backgroundColor: '#4FF546' }}
                        >
                          Check Your Eligibility For Risk Free Financial Assistance
                        </Button>
                        <SFMCodeBadge sfmId="SFM-CAL-4151" className="mt-1" />
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Pension Funding Affordability Analysis */}
                {pensionCalcs && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#4FF456]">
                        <DollarSign className="h-5 w-5" />
                        Pension Funding Affordability Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Informational top box */}
                      <div className="p-4 bg-white border rounded-lg" style={{ borderColor: '#4FF456' }}>
                        <p className="text-gray-700">
                          BUOM members have access to our unique Advanced Pension Funding platform, which target 50% contribution cost savings.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Monthly Take Home Pay */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Monthly Take Home Pay</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(pensionCalcs.monthlyTakeHomePay)}
                          </div>
                          <SFMCodeBadge sfmId="SFM-CAL-4152" className="mt-1" />
                        </div>

                        {/* Total Funding Cost */}
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456' }}>
                          <div className="text-sm text-gray-700">Standard Monthly Funding Cost + Top Up</div>
                          <div className="text-2xl font-bold text-gray-700">
                            {formatCurrency(pensionCalcs.totalFundingCost)}
                          </div>
                          <div className="text-xs mt-1 text-gray-700">
                            {formatCurrency(pensionCalcs.employeeContribution)} (AE) + {formatCurrency(pensionCalcs.monthlyFundingCost)} (Top Up)
                          </div>
                          <SFMCodeBadge sfmId="SFM-CAL-4153" className="mt-1" />
                        </div>

                        {/* Affordability Percentage */}
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <div className="text-sm text-orange-600">Affordability % of Take Home Pay</div>
                          <div className="text-2xl font-bold text-orange-900">
                            {pensionCalcs.affordabilityPercentage.toFixed(1)}%
                          </div>
                          <SFMCodeBadge sfmId="SFM-CAL-4154" className="mt-1" />
                        </div>

                        {/* BUOM Costs */}
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-600">BUOM Monthly Cost (50% Discount)</div>
                          <div className="text-2xl font-bold text-green-900">
                            {formatCurrency(pensionCalcs.buomMonthlyCost)}
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            {pensionCalcs.buomAffordabilityPercentage.toFixed(1)}% of take home pay
                          </div>
                          <div className="flex gap-2 mt-2">
                            <SFMCodeBadge sfmId="SFM-CAL-4155" />
                            <SFMCodeBadge sfmId="SFM-CAL-4156" />
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4 border-t">
                        <Button className="w-full text-gray-700">
                          Check My Funding Eligibility
                        </Button>
                        <div className="flex justify-center">
                          <SFMCodeBadge sfmId="SFM-CAL-4157" className="mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Estimated Existing Monthly Pay Assumption */}
                {pensionCalcs && (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-[#4FF456]">
                        Estimated Existing Monthly Pay Assumption
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Contribution Method:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">Net Pay Arrangement</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4140" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Auto Enrollment Basis:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">Pensionable Pay Method (Set 2 & 3)</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4141" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pensionable Pay Percentage:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">85% of Total Pay</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4142" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Gross Pay:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.monthlyGrossPay)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4143" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pensionable Earnings:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.pensionableEarnings)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4144" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Your Contribution ({pensionCalcs.employeeRate}%):</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.employeeContribution)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4145" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Employer Contribution ({pensionCalcs.employerRate}%):</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.employerContribution)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4146" />
                        </div>
                      </div>

                      <div className="flex justify-between font-medium text-lg">
                        <span>Total Monthly Contribution ({pensionCalcs.totalRate}%):</span>
                        <div className="text-right">
                          <span>{formatCurrency(pensionCalcs.totalContribution)}</span>
                          <SFMCodeBadge sfmId="SFM-CAL-4147" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annual Pensionable Earnings:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.pensionableEarnings * 12)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4148" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annual Total Contribution:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.totalContribution * 12)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4149" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estimated Monthly Net Pay (1257L):</span>
                        <div className="text-right">
                          <div className="font-medium text-green-600">{formatCurrency(pensionCalcs.estimatedNetPay1257L)}</div>
                          <SFMCodeBadge sfmId="SFM-CAL-4158" />
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Note:</strong> These calculations use the Net Pay arrangement where pension contributions are deducted before income tax, 
                          providing immediate tax relief. The Pensionable Pay Method (Set 2 & 3) is the most commonly used by employers as it's the most 
                          cost-effective, calculating contributions on 85% of total pay (excluding overtime and bonuses). 
                          The employer contributes an additional {pensionCalcs.employerRate}% on top of your {pensionCalcs.employeeRate}% contribution.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pensions UK Retirement Living Standards */}
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold text-[#4FF456]">
                        Pensions UK Retirement Living Standards
                      </CardTitle>
                      <a 
                        href="https://www.retirementlivingstandards.org.uk/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        🔗 Visit Pensions UK Website
                      </a>
                      <SFMCodeBadge sfmId="SFM-CAL-4159" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      The Pensions UK Retirement Living Standards help you understand how much money you might need in retirement. The figures below show annual income needed for different lifestyles:
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          level: 'BASIC',
                          color: 'bg-teal-600',
                          single: 14400,
                          couple: 22400,
                          features: ['Covers all basic needs', 'Some social activities', 'No budget for car', 'Limited travel/holidays']
                        },
                        {
                          level: 'MODERATE',
                          color: 'bg-pink-600',
                          single: 31300,
                          couple: 43100,
                          features: ['Financial security', 'Regular social activities', 'Budget for car replacement', 'Annual UK holidays']
                        },
                        {
                          level: 'COMFORTABLE',
                          color: 'bg-cyan-600',
                          single: 43100,
                          couple: 59000,
                          features: ['Financial freedom', 'Regular dining out', 'New car every 5 years', 'Extended foreign holidays']
                        }
                      ].map((standard) => (
                        <div key={standard.level} className="border rounded-lg overflow-hidden">
                          <div className={`${standard.color} text-white text-center py-4`}>
                            <h3 className="text-lg font-bold">{standard.level}</h3>
                          </div>
                          <div className="p-4 space-y-4">
                            <div className="text-center">
                              <div className="font-semibold text-gray-700">SINGLE:</div>
                              <div className="text-2xl font-bold text-gray-900">{formatCurrency(standard.single)}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-700">COUPLE:</div>
                              <div className="text-2xl font-bold text-gray-900">{formatCurrency(standard.couple)}</div>
                              <div className="text-xs text-gray-500 mt-1">per year</div>
                            </div>
                            <div className="space-y-2">
                              {standard.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-sm text-gray-600">
                                  <span className="text-green-600 mr-2">✓</span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      Source: Pensions UK Retirement Living Standards, last checked 14/5/2025
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculatorEmployee;
