
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DEFAULT_PENSION_PARAMETERS, getPensionParameters } from '@/utils/pensionParameters';
import { hasActiveSubscription } from '@/utils/pensionParameters/subscription';
import { toast } from '@/hooks/use-toast';
import { Lock, CheckCircle } from 'lucide-react';

const PensionParameters = () => {
  const parameters = getPensionParameters();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [calculatorData, setCalculatorData] = useState(null);
  
  // Check for premium subscription and load calculator data
  useEffect(() => {
    const premiumStatus = hasActiveSubscription();
    setHasPremiumAccess(premiumStatus);
    
    // Load calculator data from local storage if available
    try {
      const savedCalculatorData = localStorage.getItem('retirement-calculator-data');
      if (savedCalculatorData) {
        const parsedData = JSON.parse(savedCalculatorData);
        setCalculatorData(parsedData);
        console.log('Calculator data loaded in Parameters tab:', parsedData);
      }
    } catch (error) {
      console.error('Error loading calculator data:', error);
    }
  }, []);
  
  const [customParams, setCustomParams] = useState({
    retirementAge: parameters.retirementAge, // Add retirement age with default 67
    salaryInflation: parameters.salaryInflation * 100,
    pensionIncomeTarget: parameters.pensionIncomeTarget * 100,
    pensionIncomeInflation: parameters.pensionIncomeInflation * 100,
    taxFreeCash: parameters.taxFreeCash * 100,
    legacyPlan: parameters.legacyPlan * 100,
    growthRateAccumulation: parameters.growthRateAccumulation * 100,
    growthRateDrawdown: parameters.growthRateDrawdown * 100,
    providerCharges: parameters.providerCharges * 100,
    advisorFee: parameters.advisorFee * 100,
    
    // Auto-Enrollment parameters
    autoEnrollmentEmployeeRate: parameters.autoEnrollmentEmployeeRate * 100,
    autoEnrollmentEmployerRate: parameters.autoEnrollmentEmployerRate * 100,
    autoEnrollmentPensionablePayRate: parameters.autoEnrollmentPensionablePayRate * 100,
    
    // Drawdown parameters
    drawdownRate: parameters.drawdownRate * 100,
    
    // Tax parameters (annual amounts)
    personalAllowance: parameters.personalAllowance,
    basicRateBand: parameters.basicRateBand,
    basicRateIncomeTax: parameters.basicRateIncomeTax * 100,
    higherRateIncomeTax: parameters.higherRateIncomeTax * 100,
    
    // Affordability parameters
    affordabilityThreshold: parameters.affordabilityThreshold * 100,
    buomDiscountRate: parameters.buomDiscountRate * 100,
  });

  const handleChange = (name: keyof typeof customParams, value: number) => {
    setCustomParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to a database or user profile
    // For this prototype, we'll just show a success message
    toast({
      title: "Parameters saved",
      description: "Your custom pension parameters have been saved.",
    });
  };

  const handleReset = () => {
    setCustomParams({
      retirementAge: DEFAULT_PENSION_PARAMETERS.retirementAge, // Add to reset function
      salaryInflation: DEFAULT_PENSION_PARAMETERS.salaryInflation * 100,
      pensionIncomeTarget: DEFAULT_PENSION_PARAMETERS.pensionIncomeTarget * 100,
      pensionIncomeInflation: DEFAULT_PENSION_PARAMETERS.pensionIncomeInflation * 100,
      taxFreeCash: DEFAULT_PENSION_PARAMETERS.taxFreeCash * 100,
      legacyPlan: DEFAULT_PENSION_PARAMETERS.legacyPlan * 100,
      growthRateAccumulation: DEFAULT_PENSION_PARAMETERS.growthRateAccumulation * 100,
      growthRateDrawdown: DEFAULT_PENSION_PARAMETERS.growthRateDrawdown * 100,
      providerCharges: DEFAULT_PENSION_PARAMETERS.providerCharges * 100,
      advisorFee: DEFAULT_PENSION_PARAMETERS.advisorFee * 100,
      autoEnrollmentEmployeeRate: DEFAULT_PENSION_PARAMETERS.autoEnrollmentEmployeeRate * 100,
      autoEnrollmentEmployerRate: DEFAULT_PENSION_PARAMETERS.autoEnrollmentEmployerRate * 100,
      autoEnrollmentPensionablePayRate: DEFAULT_PENSION_PARAMETERS.autoEnrollmentPensionablePayRate * 100,
      drawdownRate: DEFAULT_PENSION_PARAMETERS.drawdownRate * 100,
      personalAllowance: DEFAULT_PENSION_PARAMETERS.personalAllowance,
      basicRateBand: DEFAULT_PENSION_PARAMETERS.basicRateBand,
      basicRateIncomeTax: DEFAULT_PENSION_PARAMETERS.basicRateIncomeTax * 100,
      higherRateIncomeTax: DEFAULT_PENSION_PARAMETERS.higherRateIncomeTax * 100,
      affordabilityThreshold: DEFAULT_PENSION_PARAMETERS.affordabilityThreshold * 100,
      buomDiscountRate: DEFAULT_PENSION_PARAMETERS.buomDiscountRate * 100,
    });
    toast({
      title: "Parameters reset",
      description: "Your pension parameters have been reset to default values.",
    });
  };

  const renderParameter = (
    name: string, 
    label: string, 
    value: number, 
    min: number, 
    max: number, 
    step: number,
    paramName: keyof typeof customParams,
    isPercentage: boolean = true,
    description?: string
  ) => {
    // Format number without decimal points for display
    const formatValue = (val: number) => {
      if (isPercentage) {
        return `${Math.round(val * 10) / 10}%`;
      } else if (paramName === 'retirementAge') {
        return `${Math.round(val)}`;
      } else {
        return `£${Math.round(val).toLocaleString()}`;
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <div>
            <Label htmlFor={name}>{label}</Label>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <span className="text-sm font-medium">
            {formatValue(value)}
          </span>
        </div>
        <div className="relative">
          {!parameters.isCustomizable && (
            <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded-md">
              <div className="flex items-center bg-white dark:bg-gray-950 px-2 py-1 rounded shadow-sm">
                <Lock className="h-3 w-3 mr-1" />
                <span className="text-xs">Premium feature</span>
              </div>
            </div>
          )}
          <Slider
            id={name}
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={values => handleChange(paramName, values[0])}
            disabled={!parameters.isCustomizable}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Access Status */}
      <Card className={`border-2 ${hasPremiumAccess ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasPremiumAccess ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Premium Access Active
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 text-orange-600" />
                Premium Access Required
              </>
            )}
          </CardTitle>
          <CardDescription>
            {hasPremiumAccess ? (
              <>
                You have premium access to advanced parameters and calculator data.
                {calculatorData && (
                  <div className="mt-2 text-sm text-green-700">
                    ✓ Calculator data loaded from your previous session
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <p>Subscribe to access advanced pension parameters and save your calculator data.</p>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Free Calculator Notice:</strong> You're currently using our FREE Calculator with fixed generic assumptions (Tax Code: 1257L, Standard Employment). 
                      Upgrade to personalize your shortfall calculations with custom tax codes, director status, and advanced parameters.
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Centralized Pension Calculation Parameters</CardTitle>
          <CardDescription>
            {parameters.isCustomizable 
              ? "Single source of truth for ALL application calculations" 
              : "Upgrade to premium to customize these parameters"}
          </CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Pension Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Core Pension Parameters</h3>
          {renderParameter("retirement-age", "Retirement Age", customParams.retirementAge, 55, 75, 1, "retirementAge", false, "Target retirement age")}
          {renderParameter("salary-inflation", "Unified Inflation Rate (Salary & Contributions)", customParams.salaryInflation, 0, 10, 0.1, "salaryInflation", true, "Single 2% rate for all inflation calculations")}
          {renderParameter("pension-income-target", "Pension Income Target (% of Salary)", customParams.pensionIncomeTarget, 20, 100, 5, "pensionIncomeTarget")}
          {renderParameter("pension-income-inflation", "Pension Income Inflation", customParams.pensionIncomeInflation, 0, 10, 0.1, "pensionIncomeInflation", true, "Matches unified inflation rate (2%)")}
          {renderParameter("growth-rate-accumulation", "Growth Rate (Accumulation Phase - Gross)", customParams.growthRateAccumulation, 0, 15, 0.1, "growthRateAccumulation", true, "Net rate after fees: 4.5% (5% - 0.5%)")}
          {renderParameter("growth-rate-drawdown", "Growth Rate (Drawdown Phase - Gross)", customParams.growthRateDrawdown, 0, 10, 0.1, "growthRateDrawdown", true, "Net rate after fees: 3.5% (4% - 0.5%) - Static fund during drawdown")}
          {renderParameter("provider-charges", "Pension Provider Charges", customParams.providerCharges, 0, 3, 0.05, "providerCharges")}
          {renderParameter("advisor-fee", "Advisor Fee", customParams.advisorFee, 0, 3, 0.05, "advisorFee")}
          {renderParameter("drawdown-rate", "Annual Drawdown Rate", customParams.drawdownRate, 1, 10, 0.1, "drawdownRate", true, "3.5% withdrawal rate maintains static fund value")}
        </div>

        {/* Auto-Enrollment Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Auto-Enrollment Parameters</h3>
          {renderParameter("ae-employee-rate", "Employee Contribution Rate", customParams.autoEnrollmentEmployeeRate, 0, 15, 0.1, "autoEnrollmentEmployeeRate")}
          {renderParameter("ae-employer-rate", "Employer Contribution Rate", customParams.autoEnrollmentEmployerRate, 0, 10, 0.1, "autoEnrollmentEmployerRate")}
          {renderParameter("ae-pensionable-pay", "Pensionable Pay Rate", customParams.autoEnrollmentPensionablePayRate, 50, 100, 1, "autoEnrollmentPensionablePayRate")}
        </div>

        {/* Tax System Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">UK Tax System Parameters</h3>
          {renderParameter("personal-allowance", "Personal Allowance", customParams.personalAllowance, 0, 20000, 100, "personalAllowance", false)}
          {renderParameter("basic-rate-band", "Basic Rate Band Upper Limit", customParams.basicRateBand, 20000, 80000, 1000, "basicRateBand", false)}
          {renderParameter("basic-rate-tax", "Basic Rate Income Tax", customParams.basicRateIncomeTax, 10, 30, 1, "basicRateIncomeTax")}
          {renderParameter("higher-rate-tax", "Higher Rate Income Tax", customParams.higherRateIncomeTax, 30, 50, 1, "higherRateIncomeTax")}
        </div>

        {/* Affordability Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Affordability Parameters</h3>
          {renderParameter("affordability-threshold", "Affordability Threshold (% of Net Pay)", customParams.affordabilityThreshold, 5, 25, 1, "affordabilityThreshold")}
          {renderParameter("buom-discount", "BUOM Discount Rate", customParams.buomDiscountRate, 25, 75, 5, "buomDiscountRate")}
        </div>

        {/* Legacy Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Legacy Parameters</h3>
          {renderParameter("tax-free-cash", "Tax Free Cash Amount (% of Fund)", customParams.taxFreeCash, 0, 25, 5, "taxFreeCash")}
          {renderParameter("legacy-plan", "Legacy Plan (% to Beneficiaries)", customParams.legacyPlan, 0, 100, 10, "legacyPlan")}
        </div>
        
        {parameters.isCustomizable && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
            <Button onClick={handleSave}>Save Parameters</Button>
          </div>
        )}
      </CardContent>
      </Card>
    </div>
  );
};

export default PensionParameters;
