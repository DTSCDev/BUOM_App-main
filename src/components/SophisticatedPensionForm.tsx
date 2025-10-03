import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { calculateAge } from '@/utils/pension/ageCalculations';
import { FreePensionCalculationResults } from "@/components/FreeCalculatorResults";
import { calculateFreeExistingPensionValue, calculateTotalAEContributions } from '@/utils/pension/freeAEContributionCalculations';

interface SophisticatedPensionFormProps {
  onCalculationComplete: (results: FreePensionCalculationResults) => void;
}

const getDefaultDateOfBirth = (): string => {
  // Calculate date that makes user exactly 42 years old today
  const today = new Date();
  const birthDate = new Date(today);
  birthDate.setFullYear(today.getFullYear() - 42);
  
  // Format as YYYY-MM-DD for HTML date input
  const year = birthDate.getFullYear();
  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const day = String(birthDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};



const safeParseDateOfBirth = (dateOfBirth: string): Date => {
  try {
    if (!dateOfBirth) {
      return new Date(getDefaultDateOfBirth());
    }
    
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format, using default');
      return new Date(getDefaultDateOfBirth());
    }
    
    const currentYear = new Date().getFullYear();
    const birthYear = date.getFullYear();
    
    if (birthYear < 1900 || birthYear > currentYear - 16) {
      console.warn('Invalid birth year, using default');
      return new Date(getDefaultDateOfBirth());
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date of birth:', error);
    return new Date(getDefaultDateOfBirth());
  }
};

const SophisticatedPensionForm: React.FC<SophisticatedPensionFormProps> = ({ onCalculationComplete }) => {
  const [dateOfBirth, setDateOfBirth] = useState(getDefaultDateOfBirth());
  const [salaryValue, setSalaryValue] = useState(60000);
  const [isAnnualSalary, setIsAnnualSalary] = useState(true);

  const handleSalaryToggle = (newIsAnnual: boolean) => {
    if (newIsAnnual !== isAnnualSalary) {
      if (newIsAnnual) {
        // Convert monthly to annual, but if current value is 0, use default annual salary
        setSalaryValue(prev => prev === 0 ? 60000 : Math.round(prev * 12));
      } else {
        // Convert annual to monthly, but if current value is 0, use default monthly salary
        setSalaryValue(prev => prev === 0 ? 5000 : Math.round(prev / 12));
      }
      setIsAnnualSalary(newIsAnnual);
    }
  };

  const [existingPensionValue, setExistingPensionValue] = useState(0);
  const [autoCalculatePension, setAutoCalculatePension] = useState(true);
  const [retirementAge, setRetirementAge] = useState(67);
  const [finalSalaryIncome, setFinalSalaryIncome] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [useCustomContributions, setUseCustomContributions] = useState(false);
  const [customEmployeeContribution, setCustomEmployeeContribution] = useState(0);
  const [customEmployerContribution, setCustomEmployerContribution] = useState(0);
  const [monthlyAEContribution, setMonthlyAEContribution] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculate annual salary for the hook
  const birthDate = safeParseDateOfBirth(dateOfBirth);
  const annualSalary = isAnnualSalary ? salaryValue : salaryValue * 12;

  // Simple useEffect to set default date of birth on component mount only
  useEffect(() => {
    // Only set default if dateOfBirth is empty or invalid
    if (!dateOfBirth || dateOfBirth === '') {
      setDateOfBirth(getDefaultDateOfBirth());
    }
  }, []); // Empty dependency array - run only once on mount



  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString();
  };

  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = safeParseDateOfBirth(dateOfBirth);
      const annualSalary = isAnnualSalary ? salaryValue : salaryValue * 12;
      
      const monthlyAEContribution = useCustomContributions 
        ? (customEmployeeContribution + customEmployerContribution)
        : ((annualSalary * 0.85 * 0.08) / 12);
      
      setMonthlyAEContribution(monthlyAEContribution);
      
      console.log('=== MONTHLY AE CONTRIBUTION CALCULATION ===');
      console.log(`Annual salary: £${annualSalary.toLocaleString()}`);
      console.log(`Use custom contributions: ${useCustomContributions}`);
      if (useCustomContributions) {
        console.log(`Custom employee: £${customEmployeeContribution}, Custom employer: £${customEmployerContribution}`);
      } else {
        console.log(`Calculated AE contribution: £${monthlyAEContribution.toFixed(2)}/month`);
      }
    }
  }, [dateOfBirth, salaryValue, isAnnualSalary, useCustomContributions, customEmployeeContribution, customEmployerContribution]);

  useEffect(() => {
    if (autoCalculatePension && dateOfBirth) {
      const birthDate = safeParseDateOfBirth(dateOfBirth);
      const ageCalculation = calculateAge(birthDate);
      const annualSalary = isAnnualSalary ? salaryValue : salaryValue * 12;
      
      const { currentValue } = calculateFreeExistingPensionValue(annualSalary, ageCalculation.years);
      setExistingPensionValue(Math.round(currentValue));
    }
  }, [autoCalculatePension, dateOfBirth, salaryValue, isAnnualSalary]);

  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      
      // FREE CALCULATOR ISOLATION: Only pass SFM-001 to SFM-007 inputs
      // FreeCalculatorResults will calculate all other values internally using fixed assumptions
      const freeCalculatorInputs = {
        dateOfBirth: dateOfBirth,                                    // SFM-001: Date of Birth Input
        annualSalary: annualSalary,                                  // SFM-002: Annual Salary Input (correctly calculated)
        existingPensionValue: existingPensionValue,                  // SFM-003: Existing Pension Value Input
        finalSalaryIncome: finalSalaryIncome,                        // SFM-006: Final Salary Income Input
        otherIncome: otherIncome                                     // SFM-007: Other Income Input
      };

      // Pass only the basic inputs to FreeCalculatorResults
      // FreeCalculatorResults will handle all calculations internally
      onCalculationComplete(freeCalculatorInputs);
      
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error in pension form:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl" style={{ color: '#4FF456' }}>
            Enter Your Basic Details
          </CardTitle>
          <CardDescription className="flex items-center justify-center gap-2 text-gray-700">
            <span>Want to know how we will use this information?</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-pointer text-gray-700" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">How we use your information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Calculate your projected pension shortfall</li>
                      <li>Determine monthly funding requirements</li>
                      <li>Assess affordability and eligibility</li>
                      <li>Provide personalized retirement planning advice</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      All calculations are performed locally. Your data is not shared with third parties.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardDescription>
        </CardHeader>
        

        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)} />
            <div className="text-[8px] text-gray-500">SFM-001</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="salaryValue" className="text-sm sm:text-base">Gross Salary</Label>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className={`text-xs sm:text-sm ${!isAnnualSalary ? 'font-medium' : 'text-gray-400'}`} style={!isAnnualSalary ? { color: '#4FF456' } : {}}>Monthly</span>
                <Switch
                  checked={isAnnualSalary}
                  onCheckedChange={handleSalaryToggle}
                  className="sm:scale-100"
                  style={{ transform: 'scale(0.75)' }} />
                <span className={`text-xs sm:text-sm ${isAnnualSalary ? 'font-medium' : 'text-gray-400'}`} style={isAnnualSalary ? { color: '#4FF456' } : {}}>Annual</span>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="salaryValue"
                type="number"
                value={salaryValue === 0 ? '' : salaryValue}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  setSalaryValue(value);
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  if (value === 0 || isNaN(value)) {
                    // Set to minimum value if field is empty or 0
                    const minValue = isAnnualSalary ? 1000 : 100;
                    setSalaryValue(minValue);
                  }
                }}
                className="pl-8"
                min={isAnnualSalary ? "1000" : "100"}
                placeholder={isAnnualSalary ? "60000" : "5000"} />
              <div className="text-[8px] text-gray-500 mt-2">SFM-002</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="existingPensionValue" className="text-sm sm:text-base">Existing Pension Fund Value</Label>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className={`text-xs sm:text-sm ${!autoCalculatePension ? 'font-medium' : 'text-gray-400'}`} style={!autoCalculatePension ? { color: '#4FF456' } : {}}>User Input</span>
                <Switch
                  checked={autoCalculatePension}
                  onCheckedChange={setAutoCalculatePension}
                  className="sm:scale-100"
                  style={{ transform: 'scale(0.75)' }} />
                <span className={`text-xs sm:text-sm ${autoCalculatePension ? 'font-medium' : 'text-gray-400'}`} style={autoCalculatePension ? { color: '#4FF456' } : {}}>Auto Calculate</span>
              </div>
            </div>

              {autoCalculatePension ? (
        <div className="space-y-2 p-4 rounded-md relative" style={{ backgroundColor: '#4FF456' }}>
                  <p className="text-sm text-gray-600">
                    Estimated pension value based on your age and salary: <strong>£{formatNumber(existingPensionValue)}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated total contributions paid since age 21: <strong>£{(() => {
                      const birthDate = safeParseDateOfBirth(dateOfBirth);
                      const currentAge = calculateAge(birthDate).years;
                      const annualSalary = isAnnualSalary ? salaryValue : salaryValue * 12;
                      const contributionResult = calculateTotalAEContributions(
                        annualSalary,
                        currentAge,
                        Math.max(0, 67 - currentAge)
                      );
                      return formatNumber(contributionResult.historicalContributions);
                    })()}</strong>
                  </p>
                  <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                    SFM-003
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <Input
                    id="existingPensionValue"
                    type="number"
                    value={existingPensionValue === 0 ? '' : existingPensionValue}
                    onChange={(e) => setExistingPensionValue(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="pl-8"
                    placeholder="120000" />
                  <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                    SFM-003
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <Label className="text-xs sm:text-sm font-medium">Pension Contributions</Label>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className={`text-xs sm:text-sm ${useCustomContributions ? 'font-medium' : 'text-gray-400'}`} style={useCustomContributions ? { color: '#4FF456' } : {}}>Custom</span>
                  <Switch
                    checked={!useCustomContributions}
                    onCheckedChange={(checked) => setUseCustomContributions(!checked)}
                    className="sm:scale-100"
                    style={{ transform: 'scale(0.75)' }} />
                  <span className={`text-xs sm:text-sm ${!useCustomContributions ? 'font-medium' : 'text-gray-400'}`} style={!useCustomContributions ? { color: '#4FF456' } : {}}>Auto Enrolment</span>
                </div>
              </div>

              {useCustomContributions ? (
                <div className="space-y-4 p-4 bg-green-50 rounded-md">
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your custom monthly pension contributions:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Label htmlFor="customEmployeeContribution">Employee Contribution (Monthly)</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                        <Input
                          id="customEmployeeContribution"
                          type="number"
                          value={customEmployeeContribution}
                          onChange={(e) => setCustomEmployeeContribution(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="pl-8"
                          placeholder="200" />
                      </div>
                    </div>

                    <div className="relative">
                      <Label htmlFor="customEmployerContribution">Employer Contribution (Monthly)</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                        <Input
                          id="customEmployerContribution"
                          type="number"
                          value={customEmployerContribution}
                          onChange={(e) => setCustomEmployerContribution(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="pl-8"
                          placeholder="150" />
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                    <strong>Total Monthly Contributions: £{formatNumber(customEmployeeContribution + customEmployerContribution)}</strong>
                  </div>
                </div>
              ) : (
        <div className="space-y-2 p-4 rounded-md relative" style={{ backgroundColor: '#4FF456' }}>
                  <p className="text-sm text-gray-600">
                    Auto Enrolment contributions based on your salary: <strong>£{formatNumber(monthlyAEContribution)}/month</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    This includes both employee and employer contributions as per Auto Enrolment regulations.
                  </p>
                  <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                    SFM-004
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 relative">
                <Label htmlFor="retirementAge">Retirement Age</Label>
              <Input
                id="retirementAge"
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value === '' ? 67 : Number(e.target.value))}
                min="55"
                max="75"
                placeholder="67" />
              <p className="text-sm text-gray-500">Default State Pension Age</p>
              <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-005
              </div>
            </div>

              <div className="space-y-2 relative">
                <Label htmlFor="finalSalaryIncome">Final Salary Income (at Retirement)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="finalSalaryIncome"
                  type="number"
                  value={finalSalaryIncome}
                  onChange={(e) => setFinalSalaryIncome(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="pl-8"
                  placeholder="0" />
              </div>
              <p className="text-sm text-gray-500">Annual income from final salary or defined benefit pension schemes</p>
              <div className="text-[8px] text-gray-500">SFM-006</div>
            </div>

              <div className="space-y-2 relative">
                <Label htmlFor="otherIncome">Other Income (at Retirement)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <Input
                  id="otherIncome"
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="pl-8"
                  placeholder="0" />
              </div>
              <p className="text-sm text-gray-500">Annual income from other sources (rental income, investments, etc.)</p>
              <div className="text-[8px] text-gray-500">SFM-007</div>
            </div>
          </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleCalculate}
                disabled={isCalculating || !dateOfBirth || salaryValue === 0}
                className="bg-[#4FF546] hover:bg-[#4FF546] text-gray-700 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                    Calculating...
                  </div>
                ) : (
                  'Prepare Pension Shortfall Analysis'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div ref={resultsRef} />
      </>
    );
  };

  export default SophisticatedPensionForm;