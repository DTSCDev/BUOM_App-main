import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings, CheckCircle } from 'lucide-react';

// SFM Code mapping for parameters
const parameterSFMCodes: Record<string, string> = {
  // Core Dynamic Parameters (SFM-CAL-4401 to SFM-CAL-4409) - CORRECTED TO MATCH SYSTEM FIELDS
  growthRateAccumulation: 'SFM-CAL-4401',        // Growth Rate (Accumulation Phase - Gross)
  inflationRate: 'SFM-CAL-4402',                 // Annual Inflation Rate  
  providerCharges: 'SFM-CAL-4403',               // Provider Charges
  drawdownRate: 'SFM-CAL-4404',                  // Drawdown Rate
  selectedRetirementAge: 'SFM-CAL-4405',         // Retirement Age
  pensionIncomeTarget: 'SFM-CAL-4406',           // Pension Income Target
  taxFreeCash: 'SFM-CAL-4407',                   // Tax-Free Cash
  advisorFee: 'SFM-CAL-4408',                    // Advisor Fee
  growthRateDrawdown: 'SFM-CAL-4409',            // Growth Rate (Drawdown Phase - Gross) - ADDED
  
  // Auto-Enrollment Parameters (SFM-CAL-4411 to SFM-CAL-4413)
  autoEnrollmentEmployeeRate: 'SFM-CAL-4411',
  autoEnrollmentEmployerRate: 'SFM-CAL-4412',
  autoEnrollmentPensionablePayRate: 'SFM-CAL-4413',
  
  // UK Tax System (2025-2026) (4421-4430)
  personalAllowance: 'SFM-CAL-4421',
  basicRateBand: 'SFM-CAL-4422',
  basicRateIncomeTax: 'SFM-CAL-4423',
  higherRateIncomeTax: 'SFM-CAL-4424',
  dividendAllowance: 'SFM-CAL-4425',
  dividendBasicRate: 'SFM-CAL-4426',
  dividendHigherRate: 'SFM-CAL-4427',
  dividendAdditionalRate: 'SFM-CAL-4428',
  niEmployeeRate: 'SFM-CAL-4429',
  niEmployerRate: 'SFM-CAL-4430',
  
  // Corporation Tax (2025-2026) (4431-4432)
  corporationTaxSmallProfitsRate: 'SFM-CAL-4431',
  corporationTaxMainRate: 'SFM-CAL-4432',
  
  // Inheritance Tax (2025-2026) (4441-4443)
  inheritanceTaxNilRateBand: 'SFM-CAL-4441',
  inheritanceTaxResidenceNilRateBand: 'SFM-CAL-4442',
  inheritanceTaxRate: 'SFM-CAL-4443',
  
  // EIS Tax Relief (2025-2026) (4451-4453)
  eisIncomeeTaxReliefRate: 'SFM-CAL-4451',
  eisMaxInvestmentStandard: 'SFM-CAL-4452',
  eisMaxInvestmentKIC: 'SFM-CAL-4453',
  
  // SEIS Tax Relief (2025-2026) (4456-4458)
  seisIncomeTaxReliefRate: 'SFM-CAL-4456',
  seisMaxInvestment: 'SFM-CAL-4457',
  seisCGTReinvestmentReliefRate: 'SFM-CAL-4458',
  
  // Affordability Parameters (4461-4462)
  affordabilityThreshold: 'SFM-CAL-4461',
  buomDiscountRate: 'SFM-CAL-4462'
};

const ParameterSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dynamic parameters with no restrictions - all sliders are fully customizable
  const [customParams, setCustomParams] = useState({
    // Core Dynamic Parameters - use proper phase-specific growth rates
    growthRateAccumulation: 5.0, // Changed from growthRate
    growthRateDrawdown: 4.0,     // Add drawdown phase
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
    
    // Dividend Tax (2025-2026)
    dividendAllowance: 500,
    dividendBasicRate: 8.75,
    dividendHigherRate: 33.75,
    dividendAdditionalRate: 39.35,
    
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
      growthRateAccumulation: 5.0, // Fixed: changed from growthRate
      growthRateDrawdown: 4.0,     // Fixed: added missing property
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
      
      // Dividend Tax defaults (2025-2026)
      dividendAllowance: 500,
      dividendBasicRate: 8.75,
      dividendHigherRate: 33.75,
      dividendAdditionalRate: 39.35,
      
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
    // Get SFM code for this parameter
    const sfmCode = parameterSFMCodes[paramName];
    
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

    const minLabel = paramName === 'selectedRetirementAge'
      ? `${min} years`
      : (isPercentage ? `${min}%` : `£${min.toLocaleString()}`);
    const maxLabel = paramName === 'selectedRetirementAge'
      ? `${max} years`
      : (isPercentage ? `${max}%` : `£${max.toLocaleString()}`);

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor={name}>{label}</Label>
              {sfmCode && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-mono">
                  {sfmCode}
                </span>
              )}
            </div>
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
            onValueChange={(values) => handleChange(paramName, values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/calculator_hub')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculator Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parameter Settings</h1>
              <p className="text-gray-600">Configure calculation parameters for all retirement calculators</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Parameters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Dynamic Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Core Dynamic Parameters</CardTitle>
              <CardDescription>
                Essential calculation parameters that affect all retirement projections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'growthRateAccumulation',
                'Growth Rate (Accumulation Phase - Gross)',
                customParams.growthRateAccumulation,
                0,
                15,
                0.1,
                'growthRateAccumulation',
                true,
                'Net rate after fees: 4.5% (5% - 0.5%)'
              )}
              {renderParameter(
                'inflationRate',
                'Annual Inflation Rate',
                customParams.inflationRate,
                0,
                10,
                0.1,
                'inflationRate',
                true,
                'Expected annual inflation rate'
              )}
              {renderParameter(
                'providerCharges',
                'Provider Charges',
                customParams.providerCharges,
                0,
                3,
                0.1,
                'providerCharges',
                true,
                'Annual management charges'
              )}
              {renderParameter(
                'drawdownRate',
                'Drawdown Rate',
                customParams.drawdownRate,
                0,
                10,
                0.1,
                'drawdownRate',
                true,
                'Annual pension drawdown rate'
              )}
              {renderParameter(
                'selectedRetirementAge',
                'Retirement Age',
                customParams.selectedRetirementAge,
                55,
                75,
                1,
                'selectedRetirementAge',
                false,
                'Target retirement age'
              )}
              {renderParameter(
                'pensionIncomeTarget',
                'Pension Income Target',
                customParams.pensionIncomeTarget,
                10,
                100,
                1,
                'pensionIncomeTarget',
                true,
                'Target pension as % of final salary'
              )}
              {renderParameter(
                'taxFreeCash',
                'Tax-Free Cash',
                customParams.taxFreeCash,
                0,
                25,
                1,
                'taxFreeCash',
                true,
                'Tax-free cash percentage'
              )}
              {renderParameter(
                'advisorFee',
                'Advisor Fee',
                customParams.advisorFee,
                0,
                5,
                0.1,
                'advisorFee',
                true,
                'Annual advisor fee percentage'
              )}
              {renderParameter(
                'growthRateDrawdown',
                'Growth Rate (Drawdown Phase - Gross)',
                customParams.growthRateDrawdown,
                0,
                10,
                0.1,
                'growthRateDrawdown',
                true,
                'Net rate after fees: 3.5% (4% - 0.5%) - Static fund during drawdown'
              )}
            </CardContent>
          </Card>

          {/* Auto-Enrollment Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Auto-Enrollment Parameters</CardTitle>
              <CardDescription>
                UK Auto-Enrollment pension scheme parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'autoEnrollmentEmployeeRate',
                'Employee Contribution Rate',
                customParams.autoEnrollmentEmployeeRate,
                0,
                20,
                0.5,
                'autoEnrollmentEmployeeRate',
                true,
                'Employee pension contribution rate'
              )}
              {renderParameter(
                'autoEnrollmentEmployerRate',
                'Employer Contribution Rate',
                customParams.autoEnrollmentEmployerRate,
                0,
                20,
                0.5,
                'autoEnrollmentEmployerRate',
                true,
                'Employer pension contribution rate'
              )}
              {renderParameter(
                'autoEnrollmentPensionablePayRate',
                'Pensionable Pay Rate',
                customParams.autoEnrollmentPensionablePayRate,
                50,
                100,
                1,
                'autoEnrollmentPensionablePayRate',
                true,
                'Percentage of salary that is pensionable'
              )}
            </CardContent>
          </Card>

          {/* UK Tax System Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>UK Tax System (2025-2026)</CardTitle>
              <CardDescription>
                Current UK tax rates and thresholds for Income Tax, Dividend Tax and National Insurance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'personalAllowance',
                'Personal Allowance',
                customParams.personalAllowance,
                0,
                20000,
                100,
                'personalAllowance',
                false,
                'Tax-free personal allowance'
              )}
              {renderParameter(
                'basicRateBand',
                'Basic Rate Band',
                customParams.basicRateBand,
                20000,
                60000,
                100,
                'basicRateBand',
                false,
                'Basic rate tax band upper limit'
              )}
              {renderParameter(
                'basicRateIncomeTax',
                'Basic Rate Income Tax',
                customParams.basicRateIncomeTax,
                10,
                30,
                1,
                'basicRateIncomeTax',
                true,
                'Basic rate income tax percentage'
              )}
              {renderParameter(
                'higherRateIncomeTax',
                'Higher Rate Income Tax',
                customParams.higherRateIncomeTax,
                30,
                50,
                1,
                'higherRateIncomeTax',
                true,
                'Higher rate income tax percentage'
              )}
              {renderParameter(
                'dividendAllowance',
                'Dividend Allowance',
                customParams.dividendAllowance,
                0,
                2000,
                100,
                'dividendAllowance',
                false,
                'Tax-free dividend allowance'
              )}
              {renderParameter(
                'dividendBasicRate',
                'Dividend Basic Rate',
                customParams.dividendBasicRate,
                5,
                15,
                0.25,
                'dividendBasicRate',
                true,
                'Dividend tax rate for basic rate taxpayers'
              )}
              {renderParameter(
                'dividendHigherRate',
                'Dividend Higher Rate',
                customParams.dividendHigherRate,
                25,
                40,
                0.25,
                'dividendHigherRate',
                true,
                'Dividend tax rate for higher rate taxpayers'
              )}
              {renderParameter(
                'dividendAdditionalRate',
                'Dividend Additional Rate',
                customParams.dividendAdditionalRate,
                35,
                45,
                0.25,
                'dividendAdditionalRate',
                true,
                'Dividend tax rate for additional rate taxpayers'
              )}
              {renderParameter(
                'niEmployeeRate',
                'NI Employee Rate',
                customParams.niEmployeeRate,
                0,
                15,
                0.5,
                'niEmployeeRate',
                true,
                'National Insurance employee contribution rate'
              )}
              {renderParameter(
                'niEmployerRate',
                'NI Employer Rate',
                customParams.niEmployerRate,
                10,
                20,
                0.5,
                'niEmployerRate',
                true,
                'National Insurance employer contribution rate'
              )}
            </CardContent>
          </Card>

          {/* Corporation Tax Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Corporation Tax (2025-2026)</CardTitle>
              <CardDescription>
                UK Corporation Tax rates and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'corporationTaxSmallProfitsRate',
                'Small Profits Rate',
                customParams.corporationTaxSmallProfitsRate,
                15,
                25,
                1,
                'corporationTaxSmallProfitsRate',
                true,
                'Corporation tax rate for profits under £50,000'
              )}
              {renderParameter(
                'corporationTaxMainRate',
                'Main Rate',
                customParams.corporationTaxMainRate,
                20,
                30,
                1,
                'corporationTaxMainRate',
                true,
                'Corporation tax rate for profits over £250,000'
              )}
            </CardContent>
          </Card>

          {/* Inheritance Tax Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Inheritance Tax (2025-2026)</CardTitle>
              <CardDescription>
                UK Inheritance Tax rates and allowances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'inheritanceTaxNilRateBand',
                'Nil-Rate Band',
                customParams.inheritanceTaxNilRateBand,
                200000,
                500000,
                5000,
                'inheritanceTaxNilRateBand',
                false,
                'Inheritance tax nil-rate band'
              )}
              {renderParameter(
                'inheritanceTaxResidenceNilRateBand',
                'Residence Nil-Rate Band',
                customParams.inheritanceTaxResidenceNilRateBand,
                100000,
                300000,
                5000,
                'inheritanceTaxResidenceNilRateBand',
                false,
                'Additional nil-rate band for main residence'
              )}
              {renderParameter(
                'inheritanceTaxRate',
                'Inheritance Tax Rate',
                customParams.inheritanceTaxRate,
                30,
                50,
                1,
                'inheritanceTaxRate',
                true,
                'Standard inheritance tax rate'
              )}
            </CardContent>
          </Card>

          {/* EIS Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>EIS Tax Relief (2025-2026)</CardTitle>
              <CardDescription>
                Enterprise Investment Scheme tax relief parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'eisIncomeeTaxReliefRate',
                'Income Tax Relief Rate',
                customParams.eisIncomeeTaxReliefRate,
                20,
                40,
                1,
                'eisIncomeeTaxReliefRate',
                true,
                'EIS income tax relief percentage'
              )}
              {renderParameter(
                'eisMaxInvestmentStandard',
                'Max Investment (Standard)',
                customParams.eisMaxInvestmentStandard,
                500000,
                2000000,
                50000,
                'eisMaxInvestmentStandard',
                false,
                'Maximum EIS investment for standard companies'
              )}
              {renderParameter(
                'eisMaxInvestmentKIC',
                'Max Investment (KIC)',
                customParams.eisMaxInvestmentKIC,
                1000000,
                3000000,
                100000,
                'eisMaxInvestmentKIC',
                false,
                'Maximum EIS investment for knowledge-intensive companies'
              )}
            </CardContent>
          </Card>

          {/* SEIS Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>SEIS Tax Relief (2025-2026)</CardTitle>
              <CardDescription>
                Seed Enterprise Investment Scheme tax relief parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'seisIncomeTaxReliefRate',
                'Income Tax Relief Rate',
                customParams.seisIncomeTaxReliefRate,
                40,
                60,
                1,
                'seisIncomeTaxReliefRate',
                true,
                'SEIS income tax relief percentage'
              )}
              {renderParameter(
                'seisMaxInvestment',
                'Max Investment',
                customParams.seisMaxInvestment,
                100000,
                500000,
                10000,
                'seisMaxInvestment',
                false,
                'Maximum SEIS investment per tax year'
              )}
              {renderParameter(
                'seisCGTReinvestmentReliefRate',
                'CGT Reinvestment Relief Rate',
                customParams.seisCGTReinvestmentReliefRate,
                40,
                60,
                1,
                'seisCGTReinvestmentReliefRate',
                true,
                'SEIS capital gains tax reinvestment relief'
              )}
            </CardContent>
          </Card>

          {/* Affordability Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Affordability Parameters</CardTitle>
              <CardDescription>
                Parameters for affordability calculations and BUOM discounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderParameter(
                'affordabilityThreshold',
                'Affordability Threshold',
                customParams.affordabilityThreshold,
                5,
                30,
                1,
                'affordabilityThreshold',
                true,
                'Affordability threshold percentage'
              )}
              {renderParameter(
                'buomDiscountRate',
                'BUOM Typical Savings',
                customParams.buomDiscountRate,
                0,
                100,
                5,
                'buomDiscountRate',
                true,
                'BUOM Typical Savings Rate'
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Information */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Data Sources:</strong> All tax rates and thresholds are based on official UK government publications for the 2025-2026 tax year.
              </p>
              <p className="mb-2">
                <strong>Income Tax & National Insurance:</strong> GOV.UK Income Tax rates and Personal Allowances, National Insurance rates and thresholds
              </p>
              <p className="mb-2">
                <strong>Dividend Tax:</strong> GOV.UK Dividend Tax rates and allowances (£500 allowance, 8.75% basic rate, 33.75% higher rate, 39.35% additional rate)
              </p>
              <p className="mb-2">
                <strong>Corporation Tax:</strong> GOV.UK Corporation Tax rates and allowances
              </p>
              <p className="mb-2">
                <strong>Inheritance Tax:</strong> GOV.UK Inheritance Tax thresholds and rates (frozen until April 2030)
              </p>
              <p>
                <strong>Investment Schemes:</strong> GOV.UK Enterprise Investment Scheme (EIS) and Seed Enterprise Investment Scheme (SEIS) guidance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParameterSettings;