
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
import { PensionShortfallPieChart } from '@/components/PensionCharts/PensionShortfallPieChart';
import { CostComparisonChart } from '@/components/PensionCharts/CostComparisonChart';
import { APFPeriodCard } from '@/components/APFPeriodCard';
import { useMyBOUMRetirementCalculations } from '@/hooks/myBOUMRetirementCalculations';
import { calculateAffordability } from '@/utils/pension/taxCalculations';
import { TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('calculator');
  const [retirementAge, setRetirementAge] = useState(67); // Default retirement age

  // Use dynamic calculations instead of hardcoded values
  const calculations = useMyBOUMRetirementCalculations();

  // Load retirement age from Parameter Settings
  useEffect(() => {
    try {
      const savedParams = localStorage.getItem('retirement-calculator-parameters');
      if (savedParams) {
        const parsedParams = JSON.parse(savedParams);
        if (parsedParams.selectedRetirementAge) {
          setRetirementAge(parsedParams.selectedRetirementAge);
        }
      }
    } catch (error) {
      console.error('Error loading retirement age from parameters:', error);
    }
  }, []);

  // Calculate age from date of birth
  const age = profile?.date_of_birth 
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

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
    const affordabilityData = calculateAffordability(profile.annual_salary, calculations.monthlyFundingCost);
    const totalFundingCost = employeeContribution + calculations.monthlyFundingCost;
    const buomAffordabilityPercentage = (calculations.buomMonthlyCost + employeeContribution) / affordabilityData.taxResult.netPay * 100;
    
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
      buomMonthlyCost: calculations.buomMonthlyCost,
      buomAffordabilityPercentage,
      estimatedNetPay1257L: affordabilityData.taxResult.netPay,
      monthlyFundingCost: calculations.monthlyFundingCost,
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

  // Use dynamic calculations instead of mock data
  const showAffordabilityWarning = calculations.monthlyFundingCost > 0;
  const isOnTrack = calculations.fundingProgress >= 100;
  const isReasonablyOnTrack = calculations.fundingProgress >= 80;

  // Show loading state if calculations are still loading
  if (calculations.isLoading) {
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="affordability">Affordability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="mt-6">
              <div className="space-y-6">
                {/* Main Funding Options Card - Using Dynamic Calculations */}
                <Card className="border-2" style={{ borderColor: '#4FF456', backgroundColor: '#4FF45659' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      Pension Funding Options
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Dynamic calculations using page-based SFM codes
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Affordability Warning Alert */}
                    {showAffordabilityWarning && (
                      <Alert className="border-[#4FF546]" style={{ backgroundColor: '#4FF546' }}>
                        <AlertTriangle className="h-4 w-4 text-black" />
                        <AlertDescription className="text-black">
                          Your estimated Top Up of {formatCurrency(calculations.monthlyFundingCost)} may not be Affordable. 
                          Check your eligibility for risk-free financial assistance.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 relative pb-6">
                        <h3 className="font-medium text-gray-900">Funding Progress</h3>
                        <div className={`text-3xl font-bold ${
                          calculations.fundingProgress >= 100 ? 'text-green-600' : 
                          calculations.fundingProgress >= 80 ? 'text-yellow-500' : 'text-red-600'
                        }`}>
                          {calculations.fundingProgress}%
                        </div>
                        <Progress 
                          value={Math.min(calculations.fundingProgress, 100)} 
                          className={`h-3 ${
                            calculations.fundingProgress >= 100 ? 'progress-green' : 
                            calculations.fundingProgress >= 80 ? 'progress-amber' : 'progress-red'
                          }`} 
                        />
                        <p className="text-sm text-gray-600">
                          {isOnTrack 
                            ? "You're on track for your retirement target." 
                            : isReasonablyOnTrack 
                            ? "You're close to your retirement target." 
                            : "You have a pension funding gap that needs attention."
                          }
                        </p>
                        <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                          SFM-CAL-4101
                        </div>
                      </div>

                      <div className="space-y-2 relative pb-6">
                        <h3 className="font-medium text-gray-900">Current Projection</h3>
                        <div className="text-3xl font-bold text-blue-600">
                          {formatCurrency(calculations.currentProjection)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Projected pension pot at retirement
                        </p>
                        <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                          SFM-CAL-4103
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 relative pb-6">
                        <h3 className="font-medium text-gray-900">Required Capital assuming full State Pension</h3>
                        <div className="text-3xl font-bold text-black">
                          {formatCurrency(calculations.requiredCapital)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Capital needed for target retirement income
                        </p>
                        <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                          SFM-CAL-4104
                        </div>
                      </div>

                      <div className="space-y-2 relative pb-6">
                        <h3 className="font-medium text-gray-900">Estimated Shortfall</h3>
                        <div className="text-3xl font-bold text-red-600">
                          {formatCurrency(calculations.capitalShortfall)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Additional capital needed
                        </p>
                        <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                          SFM-CAL-4105
                        </div>
                      </div>
                    </div>

                    {calculations.capitalShortfall > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 relative pb-6">
                        <h4 className="text-2xl font-medium text-purple-600 mb-2">Existing Plan Top-Up Monthly Cost</h4>
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {formatCurrency(calculations.monthlyFundingCost)}
                        </div>
                        <p className="text-sm text-purple-600 mb-4">
                          Additional monthly contribution needed to close your Estimated Shortfall
                        </p>
                        <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                          SFM-CAL-4128
                        </div>
                        <div className="space-y-2 mt-4">
                          <Button onClick={() => setActiveTab("affordability")} className="w-full bg-purple-600 hover:bg-purple-700">
                            Check Affordability
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pie Chart and Bar Chart - Using Dynamic Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Estimated Shortfall Analysis with dynamic data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>📊 Estimated Shortfall Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <PensionShortfallPieChart
                        existingPlanValueTodayAtRetirement={calculations.existingPlanValueTodayAtRetirement}
                        existingPlanFutureContributions={calculations.existingPlanFutureContributions}
                        shortfall={calculations.shortfall}
                      />
                      <APFPeriodCard 
                        shortfall={calculations.shortfall}
                        userGrowthRate={5.0}
                        userInflationRate={2.5}
                        userRetirementAge={retirementAge}
                        currentAge={age || 42}
                        maxAnnualContribution={60000}
                      />
                    </CardContent>
                  </Card>

                  {/* Value for Money Comparison - Using Dynamic Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>💰 Value for Money Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CostComparisonChart
                        monthlyFundingCost={calculations.monthlyFundingCost}
                        buomMonthlyCost={calculations.buomMonthlyCost}
                        totalStandardCost={calculations.totalStandardCost}
                        totalBUOMCost={calculations.totalBUOMCost}
                        onChangeTab={(tab: string) => {
                          console.log('Tab change requested:', tab);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Side-by-side layout for Timeline and Projection Analysis */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Pension Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Pension Timeline
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Timeline calculations for your retirement planning</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Metrics Section with consistent blue background */}
                      <div className="rounded-lg p-4" style={{ backgroundColor: '#4FF45659' }}>
                        <h3 className="text-lg font-semibold mb-4 text-blue-900 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Key Metrics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-lg relative pb-6" style={{ backgroundColor: '#4FF45659' }}>
                            <span className="text-blue-700">Current Age</span>
                            <span className="font-medium text-blue-900">{age || 'Not set'} years 0 months</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              SFM-CAL-4110
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg relative pb-6" style={{ backgroundColor: '#4FF45659' }}>
                            <span className="text-blue-700">Time to Retirement</span>
                            <span className="font-medium text-blue-900">{age ? retirementAge - age : 'N/A'} years 00 months</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              SFM-CAL-4111
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg relative pb-6" style={{ backgroundColor: '#4FF45659' }}>
                            <span className="text-blue-700">Days Until Pension</span>
                            <span className="font-medium text-blue-900">{age ? Math.round((retirementAge - age) * 365.25).toLocaleString() : 'N/A'}</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              SFM-CAL-4112
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg relative pb-6" style={{ backgroundColor: '#4FF45659' }}>
                            <span className="text-blue-700">Paydays Remaining</span>
                            <span className="font-medium text-blue-900">{age ? ((retirementAge - age) * 12).toLocaleString() : 'N/A'}</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              SFM-CAL-4113
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pension Projection Analysis - Using Dynamic Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pension Projection Analysis</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Detailed breakdown of your pension projections using dynamic calculations
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Main Projection Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Existing Fund Value at Retirement</span>
                          <span className="font-medium">{formatCurrency(calculations.existingPlanValueTodayAtRetirement)}</span>
                          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                            SFM-CAL-4126
                          </div>
                        </div>
                        
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Existing Plan Future Contributions</span>
                          <span className="font-medium">{formatCurrency(calculations.existingPlanFutureContributions)}</span>
                          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                            SFM-CAL-4127
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between font-medium text-lg relative pb-6">
                          <span>Total Projected Pension Value</span>
                          <span>{formatCurrency(calculations.currentProjection)}</span>
                          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                            SFM-CAL-4119
                          </div>
                        </div>
                        
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Required Capital</span>
                          <span className="font-medium">{formatCurrency(calculations.requiredCapital)}</span>
                          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                            SFM-CAL-4120
                          </div>
                        </div>
                        
                        <div className="flex justify-between relative pb-6">
                          <span className="text-muted-foreground">Capital Shortfall</span>
                          <span className="font-medium text-[#9333EA]">{formatCurrency(calculations.capitalShortfall)}</span>
                          <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                            SFM-CAL-4121
                          </div>
                        </div>
                      </div>

                      {/* Top Up Contribution Analysis Section */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: '#4FF45659', borderColor: '#4FF456', borderWidth: '1px' }}>
                        <h3 className="font-semibold text-blue-900 mb-3">BUOM Cost Comparison</h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between relative pb-6">
                            <span>Standard Monthly Cost:</span>
                            <span className="font-medium text-red-600">{formatCurrency(calculations.monthlyFundingCost)}</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                              SFM-CAL-4122
                            </div>
                          </div>
                          
                          <div className="flex justify-between relative pb-6">
                            <span>BUOM Monthly Cost:</span>
                            <span className="font-medium text-green-600">{formatCurrency(calculations.buomMonthlyCost)}</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                              SFM-CAL-4129
                            </div>
                          </div>
                          
                          <div className="flex justify-between relative pb-6">
                            <span>Total Standard Cost (Annual):</span>
                            <span className="font-medium text-red-600">{formatCurrency(calculations.totalStandardCost)}</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                              SFM-CAL-4122
                            </div>
                          </div>
                          
                          <div className="flex justify-between relative pb-6">
                            <span>Total BUOM Cost (Annual):</span>
                            <span className="font-medium text-green-600">{formatCurrency(calculations.totalBUOMCost)}</span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border">
                              SFM-CAL-4131
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
                      <div className="text-[8px] text-muted-foreground mt-1">SFM-CAL-4150</div>
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
                        <div className="text-[8px] text-muted-foreground mt-1">SFM-CAL-4151</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Pension Funding Affordability Analysis */}
                {pensionCalcs && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        Pension Funding Affordability Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700">Monthly Take Home Pay</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold">{formatCurrency(pensionCalcs.monthlyTakeHomePay)}</span>
                          <div className="text-[8px] text-muted-foreground">SFM-CAL-4152</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700">Standard Monthly Funding Cost + Top Up Cost</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold">{formatCurrency(pensionCalcs.totalFundingCost)}</span>
                          <div className="text-sm text-gray-600">= {formatCurrency(pensionCalcs.employeeContribution)} + {formatCurrency(pensionCalcs.monthlyFundingCost)}</div>
                          <div className="text-[8px] text-muted-foreground">SFM-CAL-4153</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700">% of Take Home Pay</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold">{pensionCalcs.affordabilityPercentage.toFixed(1)}%</span>
                          <div className="text-[8px] text-muted-foreground">SFM-CAL-4154</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-green-700">BUOM Monthly Funding Cost</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold text-green-700">{formatCurrency(pensionCalcs.buomMonthlyCost)}</span>
                          <div className="text-[8px] text-muted-foreground">SFM-CAL-4155</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-green-700">% of Take Home Pay</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold text-green-700">{pensionCalcs.buomAffordabilityPercentage.toFixed(1)}%</span>
                          <div className="text-[8px] text-muted-foreground">SFM-CAL-4156</div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
                        <p className="text-sm text-blue-800">
                          BUOM members have access to our advanced funding platform with precise sponsorship matching based on individual shortfall calculations.
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Check My Funding Eligibility →
                        </Button>
                        <div className="text-[8px] text-muted-foreground mt-1 text-center">SFM-CAL-4157</div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Estimated Existing Monthly Pay Assumption */}
                {pensionCalcs && (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        Estimated Existing Monthly Pay Assumption
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Contribution Method:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">Net Pay Arrangement</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4140</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Auto Enrollment Basis:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">Pensionable Pay Method (Set 2 & 3)</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4141</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pensionable Pay Percentage:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">85% of Total Pay</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4142</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Gross Pay:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.monthlyGrossPay)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4143</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pensionable Earnings:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.pensionableEarnings)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4144</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Your Contribution ({pensionCalcs.employeeRate}%):</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.employeeContribution)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4145</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Employer Contribution ({pensionCalcs.employerRate}%):</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.employerContribution)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4146</div>
                        </div>
                      </div>

                      <div className="flex justify-between font-medium text-lg">
                        <span>Total Monthly Contribution ({pensionCalcs.totalRate}%):</span>
                        <div className="text-right">
                          <span>{formatCurrency(pensionCalcs.totalContribution)}</span>
                          <div className="text-xs text-gray-500">SFM-CAL-4147</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annual Pensionable Earnings:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.pensionableEarnings * 12)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4148</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annual Total Contribution:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{formatCurrency(pensionCalcs.totalContribution * 12)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4149</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estimated Monthly Net Pay (1257L):</span>
                        <div className="text-right">
                          <div className="font-medium text-green-600">{formatCurrency(pensionCalcs.estimatedNetPay1257L)}</div>
                          <div className="text-xs text-gray-500">SFM-CAL-4158</div>
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
                      <CardTitle className="text-xl font-semibold text-gray-900">
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
                      <div className="text-[8px] text-muted-foreground">SFM-CAL-4159</div>
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
