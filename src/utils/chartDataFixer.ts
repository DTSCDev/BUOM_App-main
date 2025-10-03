import { getPensionParameters } from '@/utils/pensionParameters';

export interface FixedChartData {
  age: number;
  capitalShortfall: number;
  apfAssetValue: number;
  isaValue: number;
  buomTotalValue: number;
  targetValue: number;
  existingPlanValue: number;
  inblBalance?: number;
}

export interface CalculationInputs {
  currentAge: number;
  annualSalary: number;
  existingPensionValue: number;
  yearsToRetirement: number;
}

/**
 * FIXED: Chart Data Generator - Eliminates circular dependencies and calculation errors
 */
export class ChartDataFixer {
  private params = getPensionParameters();
  
  /**
   * Generate clean, consistent chart data without circular dependencies
   */
  generateFixedChartData(inputs: CalculationInputs): FixedChartData[] {
    const { currentAge, annualSalary, existingPensionValue, yearsToRetirement } = inputs;
    
    // Validate inputs
    if (!this.validateInputs(inputs)) {
      console.error('Invalid inputs for chart data generation');
      return [];
    }
    
    // Core calculations - done once, consistently
    const targetIncomeToday = annualSalary * this.params.pensionIncomeTarget;
    const targetCapitalRequired = targetIncomeToday / this.params.drawdownRate;
    const retirementAge = this.params.retirementAge;
    
    // Project existing pension value to retirement
    const existingPensionAtRetirement = existingPensionValue * 
      Math.pow(1 + this.params.growthRateAccumulation, yearsToRetirement);
    
    // Calculate actual shortfall
    const actualShortfall = Math.max(0, targetCapitalRequired - existingPensionAtRetirement);
    
    // Fixed APF calculation - simple, no circular dependencies
    const apfRequired = actualShortfall * 0.6; // 60% of shortfall via APF
    const isaRequired = actualShortfall * 0.4; // 40% of shortfall via ISA
    
    console.log('=== FIXED CHART DATA GENERATION ===');
    console.log(`Target capital required: £${targetCapitalRequired.toLocaleString()}`);
    console.log(`Existing pension at retirement: £${existingPensionAtRetirement.toLocaleString()}`);
    console.log(`Actual shortfall: £${actualShortfall.toLocaleString()}`);
    console.log(`APF required: £${apfRequired.toLocaleString()}`);
    console.log(`ISA required: £${isaRequired.toLocaleString()}`);
    
    // Generate chart data points
    const chartData: FixedChartData[] = [];
    const startAge = Math.max(currentAge - 1, 40);
    const endAge = Math.min(retirementAge + 2, 70);
    
    for (let age = startAge; age <= endAge; age++) {
      const yearsFromNow = age - currentAge;
      const dataPoint = this.calculateDataPoint(age, yearsFromNow, {
        targetCapitalRequired,
        existingPensionValue,
        actualShortfall,
        apfRequired,
        isaRequired,
        currentAge,
        retirementAge
      });
      
      chartData.push(dataPoint);
    }
    
    console.log(`Generated ${chartData.length} fixed chart data points`);
    return chartData;
  }
  
  /**
   * Calculate individual data point for chart
   */
  private calculateDataPoint(age: number, yearsFromNow: number, params: {
    targetCapitalRequired: number;
    existingPensionValue: number;
    actualShortfall: number;
    apfRequired: number;
    isaRequired: number;
    currentAge: number;
    retirementAge: number;
  }): FixedChartData {
    const { targetCapitalRequired, existingPensionValue, actualShortfall, 
            apfRequired, isaRequired, currentAge, retirementAge } = params;
    
    // Project existing pension value to this age
    const existingPlanValue = yearsFromNow <= 0 ? existingPensionValue : 
      existingPensionValue * Math.pow(1 + this.params.growthRateAccumulation, yearsFromNow);
    
    // Calculate APF asset value (grows over time)
    let apfAssetValue = 0;
    if (age >= currentAge && age <= retirementAge) {
      const yearsIntoAPF = Math.max(0, age - currentAge);
      apfAssetValue = (apfRequired / (retirementAge - currentAge)) * yearsIntoAPF;
    }
    
    // Calculate ISA value (grows over time)
    let isaValue = 0;
    if (age >= currentAge && age <= retirementAge) {
      const yearsIntoISA = Math.max(0, age - currentAge);
      isaValue = (isaRequired / (retirementAge - currentAge)) * yearsIntoISA;
    }
    
    // Calculate BUOM total value
    const buomTotalValue = apfAssetValue + isaValue;
    
    // Calculate remaining capital shortfall
    const totalAssets = existingPlanValue + buomTotalValue;
    const capitalShortfall = Math.max(0, targetCapitalRequired - totalAssets);
    
    // INBL balance (if applicable)
    const inblBalance = age <= retirementAge ? -apfAssetValue * 0.1 : 0; // 10% of APF as debt
    
    return {
      age,
      capitalShortfall: this.sanitizeValue(capitalShortfall),
      apfAssetValue: this.sanitizeValue(apfAssetValue),
      isaValue: this.sanitizeValue(isaValue),
      buomTotalValue: this.sanitizeValue(buomTotalValue),
      targetValue: this.sanitizeValue(targetCapitalRequired),
      existingPlanValue: this.sanitizeValue(existingPlanValue),
      inblBalance: this.sanitizeValue(inblBalance)
    };
  }
  
  /**
   * Validate calculation inputs
   */
  private validateInputs(inputs: CalculationInputs): boolean {
    const { currentAge, annualSalary, existingPensionValue, yearsToRetirement } = inputs;
    
    if (isNaN(currentAge) || currentAge < 18 || currentAge > 70) {
      console.error('Invalid current age:', currentAge);
      return false;
    }
    
    if (isNaN(annualSalary) || annualSalary < 10000 || annualSalary > 1000000) {
      console.error('Invalid annual salary:', annualSalary);
      return false;
    }
    
    if (isNaN(existingPensionValue) || existingPensionValue < 0) {
      console.error('Invalid existing pension value:', existingPensionValue);
      return false;
    }
    
    if (isNaN(yearsToRetirement) || yearsToRetirement < 0 || yearsToRetirement > 50) {
      console.error('Invalid years to retirement:', yearsToRetirement);
      return false;
    }
    
    return true;
  }
  
  /**
   * Sanitize values to prevent NaN, Infinity, or negative values where inappropriate
   */
  private sanitizeValue(value: number): number {
    if (isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return Math.max(0, Math.round(value));
  }
  
  /**
   * Generate calculation summary for validation
   */
  generateCalculationSummary(inputs: CalculationInputs): {
    valid: boolean;
    summary: string;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!this.validateInputs(inputs)) {
      errors.push('Invalid input parameters');
    }
    
    const { currentAge, annualSalary, existingPensionValue, yearsToRetirement } = inputs;
    const targetIncomeToday = annualSalary * this.params.pensionIncomeTarget;
    const targetCapitalRequired = targetIncomeToday / this.params.drawdownRate;
    
    // Check for calculation anomalies
    if (targetCapitalRequired > annualSalary * 50) {
      errors.push('Target capital seems unusually high');
    }
    
    if (existingPensionValue > targetCapitalRequired) {
      errors.push('Existing pension already exceeds target (no shortfall)');
    }
    
    const summary = `
Calculation Summary:
- Current Age: ${currentAge}
- Annual Salary: £${annualSalary.toLocaleString()}
- Years to Retirement: ${yearsToRetirement}
- Target Income (50% salary): £${targetIncomeToday.toLocaleString()}
- Target Capital Required: £${targetCapitalRequired.toLocaleString()}
- Existing Pension Value: £${existingPensionValue.toLocaleString()}
- Shortfall: £${Math.max(0, targetCapitalRequired - existingPensionValue).toLocaleString()}
`;
    
    return {
      valid: errors.length === 0,
      summary,
      errors
    };
  }
}

// Export singleton instance
export const chartDataFixer = new ChartDataFixer();