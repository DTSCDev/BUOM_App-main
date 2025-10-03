import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const RetirementParameters = () => {
  // Dynamic parameters with no restrictions - all sliders are fully customizable
  const [customParams, setCustomParams] = useState({
    // Core Dynamic Parameters
    growthRate: 5.0,
    inflationRate: 2.0,
    providerCharges: 0.5,
    drawdownRate: 3.5,
    selectedRetirementAge: 67,
    
    // Additional Parameters (keeping default slide settings)
    pensionIncomeTarget: 50,
    taxFreeCash: 0,
    advisorFee: 0,
    
    // Auto-Enrollment parameters
    autoEnrollmentEmployeeRate: 5,
    autoEnrollmentEmployerRate: 3,
    autoEnrollmentPensionablePayRate: 85,
    
    // UK Tax System Parameters (2025-2026 Tax Year)
    // Income Tax
    personalAllowance: 12570,
    basicRateBand: 37700,
    basicRateIncomeTax: 20,
    higherRateIncomeTax: 40,
    additionalRateIncomeTax: 45,
    additionalRateThreshold: 125140,
    
    // National Insurance (2025-2026)
    niEmployeePrimaryThreshold: 12584, // £242/week * 52
    niEmployeeUpperEarningsLimit: 50284, // £967/week * 52
    niEmployeeRate: 8, // Between primary threshold and upper earnings limit
    niEmployeeUpperRate: 2, // Above upper earnings limit
    niEmployerSecondaryThreshold: 4992, // £96/week * 52
    niEmployerRate: 15, // Above secondary threshold
    
    // Corporation Tax (2025-2026)
    corporationTaxSmallProfitsRate: 19, // Under £50,000
    corporationTaxMainRate: 25, // Over £250,000
    corporationTaxSmallProfitsLimit: 50000,
    corporationTaxMainRateLimit: 250000,
    
    // Inheritance Tax (2025-2026)
    inheritanceTaxNilRateBand: 325000, // Frozen until 2030
    inheritanceTaxResidenceNilRateBand: 175000, // Frozen until 2030
    inheritanceTaxRate: 40,
    inheritanceTaxTaperThreshold: 2000000,
    
    // EIS Tax Relief (2025-2026)
    eisIncomeeTaxReliefRate: 30,
    eisMaxInvestmentStandard: 1000000,
    eisMaxInvestmentKIC: 2000000, // Knowledge-Intensive Companies
    
    // SEIS Tax Relief (2025-2026)
    seisIncomeTaxReliefRate: 50,
    seisMaxInvestment: 200000,
    seisCGTReinvestmentReliefRate: 50,
    seisCGTReinvestmentMaxExemption: 100000,
    
    // Affordability parameters
    affordabilityThreshold: 15,
    buomDiscountRate: 50,
  });

  const handleChange = (name: keyof typeof customParams, value: number) => {
    setCustomParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save parameters to localStorage for the retirement calculator
    localStorage.setItem('retirement-calculator-parameters', JSON.stringify(customParams));
    toast({
      title: "Parameters saved",
      description: "Your retirement calculator parameters have been saved.",
    });
  };

  const handleReset = () => {
    setCustomParams({
      growthRate: 5.0,
      inflationRate: 2.0,
      selectedRetirementAge: 67,
      pensionIncomeTarget: 50,
      taxFreeCash: 0,
      providerCharges: 0.5,
      advisorFee: 0,
      drawdownRate: 3.5,
      autoEnrollmentEmployeeRate: 5,
      autoEnrollmentEmployerRate: 3,
      autoEnrollmentPensionablePayRate: 85,
      
      // Updated 2025-2026 defaults
      personalAllowance: 12570,
      basicRateBand: 37700,
      basicRateIncomeTax: 20,
      higherRateIncomeTax: 40,
      additionalRateIncomeTax: 45,
      additionalRateThreshold: 125140,
      
      niEmployeePrimaryThreshold: 12584,
      niEmployeeUpperEarningsLimit: 50284,
      niEmployeeRate: 8,
      niEmployeeUpperRate: 2,
      niEmployerSecondaryThreshold: 4992,
      niEmployerRate: 15,
      
      corporationTaxSmallProfitsRate: 19,
      corporationTaxMainRate: 25,
      corporationTaxSmallProfitsLimit: 50000,
      corporationTaxMainRateLimit: 250000,
      
      inheritanceTaxNilRateBand: 325000,
      inheritanceTaxResidenceNilRateBand: 175000,
      inheritanceTaxRate: 40,
      inheritanceTaxTaperThreshold: 2000000,
      
      eisIncomeeTaxReliefRate: 30,
      eisMaxInvestmentStandard: 1000000,
      eisMaxInvestmentKIC: 2000000,
      
      seisIncomeTaxReliefRate: 50,
      seisMaxInvestment: 200000,
      seisCGTReinvestmentReliefRate: 50,
      seisCGTReinvestmentMaxExemption: 100000,
      
      affordabilityThreshold: 15,
      buomDiscountRate: 50,
    });
    toast({
      title: "Parameters reset",
      description: "Your retirement calculator parameters have been reset to 2025-2026 tax year defaults.",
    });
  };

  // Load saved parameters on component mount
  useEffect(() => {
    try {
      const savedParams = localStorage.getItem('retirement-calculator-parameters');
      if (savedParams) {
        const parsedParams = JSON.parse(savedParams);
        setCustomParams(parsedParams);
      }
    } catch (error) {
      console.error('Error loading saved parameters:', error);
    }
  }, []);

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
      } else {
        return `£${Math.round(val).toLocaleString()}`;
      }
    };

    // Special formatting for retirement age
    const formatRetirementAge = (val: number) => {
      return `${Math.round(val)} years`;
    };

    const displayValue = paramName === 'selectedRetirementAge' 
      ? formatRetirementAge(value)
      : formatValue(value);

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <div>
            <Label htmlFor={name}>{label}</Label>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <span className="text-sm font-medium">
            {displayValue}
          </span>
        </div>
        <div className="relative">
          <Slider
            id={name}
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={values => handleChange(paramName, values[0])}
            className="w-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Access Status */}
      <Card className="border-2 border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Dynamic Parameters Active (2025-2026 Tax Year)
          </CardTitle>
          <CardDescription>
            All parameters are fully customizable with no restrictions. Updated with official UK tax rates and bands for 2025-2026.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retirement Calculator Parameters</CardTitle>
          <CardDescription>
            Fully dynamic parameters for independent retirement calculations (2025-2026 Tax Year)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Dynamic Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Core Dynamic Parameters</h3>
            {renderParameter("growth-rate", "Growth Rate", customParams.growthRate, 0, 15, 0.1, "growthRate", true, "Annual investment growth rate")}
            {renderParameter("inflation-rate", "Inflation Rate", customParams.inflationRate, 0, 10, 0.1, "inflationRate", true, "Annual inflation rate")}
            {renderParameter("retirement-age", "Selected Retirement Age", customParams.selectedRetirementAge, 55, 75, 1, "selectedRetirementAge", false, "Your chosen retirement age")}
          </div>

          {/* Core Pension Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Core Pension Parameters</h3>
            {renderParameter("pension-income-target", "Pension Income Target (% of Salary)", customParams.pensionIncomeTarget, 20, 100, 5, "pensionIncomeTarget")}
            {renderParameter("provider-charges", "Pension Provider Charges", customParams.providerCharges, 0, 3, 0.05, "providerCharges")}
            {renderParameter("advisor-fee", "Advisor Fee", customParams.advisorFee, 0, 3, 0.05, "advisorFee")}
            {renderParameter("drawdown-rate", "Annual Drawdown Rate", customParams.drawdownRate, 1, 10, 0.1, "drawdownRate", true, "Annual withdrawal rate in retirement")}
          </div>

          {/* Auto-Enrollment Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Auto-Enrollment Parameters</h3>
            {renderParameter("ae-employee-rate", "Employee Contribution Rate", customParams.autoEnrollmentEmployeeRate, 0, 15, 0.1, "autoEnrollmentEmployeeRate")}
            {renderParameter("ae-employer-rate", "Employer Contribution Rate", customParams.autoEnrollmentEmployerRate, 0, 10, 0.1, "autoEnrollmentEmployerRate")}
            {renderParameter("ae-pensionable-pay", "Pensionable Pay Rate", customParams.autoEnrollmentPensionablePayRate, 50, 100, 1, "autoEnrollmentPensionablePayRate")}
          </div>

          {/* Income Tax Parameters (2025-2026) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Income Tax Parameters (2025-2026)</h3>
            {renderParameter("personal-allowance", "Personal Allowance", customParams.personalAllowance, 0, 20000, 100, "personalAllowance", false, "Annual personal allowance")}
            {renderParameter("basic-rate-band", "Basic Rate Band Upper Limit", customParams.basicRateBand, 20000, 80000, 1000, "basicRateBand", false, "Upper limit for basic rate tax")}
            {renderParameter("basic-rate-tax", "Basic Rate Income Tax", customParams.basicRateIncomeTax, 10, 30, 1, "basicRateIncomeTax", true, "Basic rate income tax percentage")}
            {renderParameter("higher-rate-tax", "Higher Rate Income Tax", customParams.higherRateIncomeTax, 30, 50, 1, "higherRateIncomeTax", true, "Higher rate income tax percentage")}
            {renderParameter("additional-rate-tax", "Additional Rate Income Tax", customParams.additionalRateIncomeTax, 40, 50, 1, "additionalRateIncomeTax", true, "Additional rate income tax percentage")}
            {renderParameter("additional-rate-threshold", "Additional Rate Threshold", customParams.additionalRateThreshold, 100000, 150000, 1000, "additionalRateThreshold", false, "Threshold for additional rate tax")}
          </div>

          {/* National Insurance Parameters (2025-2026) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">National Insurance Parameters (2025-2026)</h3>
            {renderParameter("ni-employee-primary", "Employee Primary Threshold", customParams.niEmployeePrimaryThreshold, 10000, 20000, 100, "niEmployeePrimaryThreshold", false, "Annual primary threshold for employee NI")}
            {renderParameter("ni-employee-upper", "Employee Upper Earnings Limit", customParams.niEmployeeUpperEarningsLimit, 40000, 60000, 100, "niEmployeeUpperEarningsLimit", false, "Annual upper earnings limit")}
            {renderParameter("ni-employee-rate", "Employee NI Rate", customParams.niEmployeeRate, 5, 15, 0.5, "niEmployeeRate", true, "Employee NI rate (primary to upper limit)")}
            {renderParameter("ni-employee-upper-rate", "Employee NI Upper Rate", customParams.niEmployeeUpperRate, 1, 5, 0.5, "niEmployeeUpperRate", true, "Employee NI rate above upper limit")}
            {renderParameter("ni-employer-threshold", "Employer Secondary Threshold", customParams.niEmployerSecondaryThreshold, 3000, 8000, 100, "niEmployerSecondaryThreshold", false, "Annual secondary threshold for employer NI")}
            {renderParameter("ni-employer-rate", "Employer NI Rate", customParams.niEmployerRate, 10, 20, 0.5, "niEmployerRate", true, "Employer NI rate above secondary threshold")}
          </div>

          {/* Corporation Tax Parameters (2025-2026) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Corporation Tax Parameters (2025-2026)</h3>
            {renderParameter("corp-tax-small-rate", "Small Profits Rate", customParams.corporationTaxSmallProfitsRate, 15, 25, 1, "corporationTaxSmallProfitsRate", true, "Corporation tax rate for profits under £50k")}
            {renderParameter("corp-tax-main-rate", "Main Rate", customParams.corporationTaxMainRate, 20, 30, 1, "corporationTaxMainRate", true, "Corporation tax rate for profits over £250k")}
            {renderParameter("corp-tax-small-limit", "Small Profits Limit", customParams.corporationTaxSmallProfitsLimit, 25000, 75000, 5000, "corporationTaxSmallProfitsLimit", false, "Upper limit for small profits rate")}
            {renderParameter("corp-tax-main-limit", "Main Rate Limit", customParams.corporationTaxMainRateLimit, 200000, 300000, 10000, "corporationTaxMainRateLimit", false, "Lower limit for main rate")}
          </div>

          {/* Inheritance Tax Parameters (2025-2026) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inheritance Tax Parameters (2025-2026)</h3>
            {renderParameter("iht-nil-rate", "Nil-Rate Band", customParams.inheritanceTaxNilRateBand, 250000, 400000, 5000, "inheritanceTaxNilRateBand", false, "IHT nil-rate band (frozen until 2030)")}
            {renderParameter("iht-residence-nil-rate", "Residence Nil-Rate Band", customParams.inheritanceTaxResidenceNilRateBand, 100000, 250000, 5000, "inheritanceTaxResidenceNilRateBand", false, "IHT residence nil-rate band (frozen until 2030)")}
            {renderParameter("iht-rate", "Inheritance Tax Rate", customParams.inheritanceTaxRate, 30, 50, 1, "inheritanceTaxRate", true, "Standard IHT rate")}
            {renderParameter("iht-taper-threshold", "Taper Threshold", customParams.inheritanceTaxTaperThreshold, 1500000, 2500000, 50000, "inheritanceTaxTaperThreshold", false, "Threshold for residence nil-rate band taper")}
          </div>

          {/* EIS Tax Relief Parameters (2025-2026) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">EIS Tax Relief Parameters (2025-2026)</h3>
            {renderParameter("eis-relief-rate", "EIS Income Tax Relief Rate", customParams.eisIncomeeTaxReliefRate, 20, 40, 1, "eisIncomeeTaxReliefRate", true, "EIS income tax relief percentage")}
            {renderParameter("eis-max-standard", "EIS Max Investment (Standard)", customParams.eisMaxInvestmentStandard, 500000, 1500000, 50000, "eisMaxInvestmentStandard", false, "Maximum annual EIS investment")}
            {renderParameter("eis-max-kic", "EIS Max Investment (KIC)", customParams.eisMaxInvestmentKIC, 1500000, 2500000, 50000, "eisMaxInvestmentKIC", false, "Maximum annual EIS investment in Knowledge-Intensive Companies")}
          </div>

          {/* SEIS Tax Relief Parameters (2025-2026) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEIS Tax Relief Parameters (2025-2026)</h3>
            {renderParameter("seis-relief-rate", "SEIS Income Tax Relief Rate", customParams.seisIncomeTaxReliefRate, 40, 60, 1, "seisIncomeTaxReliefRate", true, "SEIS income tax relief percentage")}
            {renderParameter("seis-max-investment", "SEIS Max Investment", customParams.seisMaxInvestment, 100000, 300000, 10000, "seisMaxInvestment", false, "Maximum annual SEIS investment")}
            {renderParameter("seis-cgt-relief-rate", "SEIS CGT Reinvestment Relief Rate", customParams.seisCGTReinvestmentReliefRate, 40, 60, 1, "seisCGTReinvestmentReliefRate", true, "SEIS CGT reinvestment relief percentage")}
            {renderParameter("seis-cgt-max-exemption", "SEIS CGT Max Exemption", customParams.seisCGTReinvestmentMaxExemption, 50000, 150000, 5000, "seisCGTReinvestmentMaxExemption", false, "Maximum SEIS CGT exemption amount")}
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
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleReset}>Reset to 2025-2026 Defaults</Button>
            <Button onClick={handleSave}>Save Parameters</Button>
          </div>

          {/* Source Attribution */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Official Sources (2025-2026 Tax Year)</h4>
            <p className="text-xs text-gray-600">
              Tax rates and bands sourced from GOV.UK official publications for the 2025-2026 tax year. 
              Includes Income Tax, National Insurance, Corporation Tax, Inheritance Tax, EIS, and SEIS rates 
              as published by HM Revenue & Customs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementParameters;