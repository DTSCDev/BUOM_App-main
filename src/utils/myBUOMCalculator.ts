import { systemFields } from "@/data/systemFields";
import { SystemField } from "@/data/systemFields/types";

/**
 * myBUOMCalculator - Main calculation engine using systemFields as source of truth
 * This replaces the old useSFMResolver and provides centralized calculations
 */

export interface BUOMCalculationInputs {
  // Core user inputs
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  existingPensionValue: number;
  targetIncomePercentage: number;
  
  // APF specific inputs
  apfSponsorshipYears: number;
  isaContributionCapacity: number;
}

export interface BUOMCalculationResults {
  // APF-1001 to APF-1003 - Salary Summary
  annualSalary: number;
  annualSalaryInflated: number;
  paydaysRemaining: number;
  
  // APF-1004 to APF-1006 - Income Summary
  targetIncomeAtRetirement: number;
  existingPlanIncomeAtRetirement: number;
  apfTargetIncome: number;
  retirementProgressPercentage: number;
  
  // APF-1007 to APF-1009 - ISA Plan Summary
  isaTargetMonthly: number;
  isaValueToday: number;
  isaSavingsTargetToday: number;
  repaymentProgressPercentage: number;
  
  // Additional calculated values
  yearsToRetirement: number;
  monthsToRetirement: number;
  inflationRate: number;
  growthRate: number;
  drawdownRate: number;
}

class MyBUOMCalculator {
  private static instance: MyBUOMCalculator;
  
  // System parameters from systemFields
  private readonly INFLATION_RATE = 0.025; // 2.5% annual inflation
  private readonly GROWTH_RATE = 0.045; // 4.5% net growth rate
  private readonly DRAWDOWN_RATE = 0.04; // 4% drawdown rate
  private readonly WORKING_DAYS_PER_YEAR = 260;
  
  private constructor() {}
  
  public static getInstance(): MyBUOMCalculator {
    if (!MyBUOMCalculator.instance) {
      MyBUOMCalculator.instance = new MyBUOMCalculator();
    }
    return MyBUOMCalculator.instance;
  }
  
  /**
   * Get system field by SFM code
   */
  public getSystemField(sfmCode: string): SystemField | undefined {
    return systemFields.find(field => field.sfmId === sfmCode);
  }
  
  /**
   * Get all system fields for a specific page
   */
  public getFieldsByPage(pageName: string): SystemField[] {
    return systemFields.filter(field => field.pageName === pageName);
  }
  
  /**
   * Get all APF Dashboard fields (APF-1001 to APF-1009)
   */
  public getAPFDashboardFields(): SystemField[] {
    return systemFields.filter(field => 
      field.sfmId.match(/^SFM-APF-100[1-9]$/) && 
      field.pageName === "APF Dashboard"
    );
  }
  
  /**
   * Main calculation method - processes all APF Dashboard calculations
   */
  public calculateAPFDashboard(inputs: BUOMCalculationInputs): BUOMCalculationResults {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // APF-1001: Annual Salary (Base Reference)
    const annualSalary = inputs.currentSalary;
    
    // APF-1002: Annual Salary with Inflation
    const annualSalaryInflated = this.calculateInflatedValue(
      inputs.currentSalary, 
      yearsToRetirement, 
      this.INFLATION_RATE
    );
    
    // APF-1003: Paydays Remaining
    const paydaysRemaining = yearsToRetirement * this.WORKING_DAYS_PER_YEAR;
    
    // APF-1004: Target Income at Retirement
    const targetIncomeAtRetirement = (annualSalaryInflated * inputs.targetIncomePercentage) / 100;
    
    // APF-1005: Existing Plan Income at Retirement
    const existingPlanIncomeAtRetirement = this.calculatePensionIncome(
      inputs.existingPensionValue,
      yearsToRetirement,
      this.GROWTH_RATE,
      this.DRAWDOWN_RATE
    );
    
    // APF-1006: APF Target Income (shortfall)
    const apfTargetIncome = Math.max(0, targetIncomeAtRetirement - existingPlanIncomeAtRetirement);
    
    // Retirement progress percentage
    const retirementProgressPercentage = targetIncomeAtRetirement > 0 
      ? Math.min(100, (existingPlanIncomeAtRetirement / targetIncomeAtRetirement) * 100)
      : 0;
    
    // APF-1007: ISA Target Monthly (to fund APF shortfall)
    const requiredAPFValue = this.calculateRequiredPensionValue(apfTargetIncome, this.DRAWDOWN_RATE);
    const isaTargetMonthly = this.calculateMonthlyContribution(
      requiredAPFValue,
      yearsToRetirement,
      this.GROWTH_RATE
    );
    
    // APF-1008: ISA Value Today (current ISA savings)
    const isaValueToday = inputs.isaContributionCapacity * 12; // Assume annual capacity as current value
    
    // APF-1009: ISA Savings Target Today (total needed)
    const isaSavingsTargetToday = requiredAPFValue;
    
    // Repayment progress percentage
    const repaymentProgressPercentage = isaSavingsTargetToday > 0
      ? Math.min(100, (isaValueToday / isaSavingsTargetToday) * 100)
      : 0;
    
    return {
      annualSalary,
      annualSalaryInflated,
      paydaysRemaining,
      targetIncomeAtRetirement,
      existingPlanIncomeAtRetirement,
      apfTargetIncome,
      retirementProgressPercentage,
      isaTargetMonthly,
      isaValueToday,
      isaSavingsTargetToday,
      repaymentProgressPercentage,
      yearsToRetirement,
      monthsToRetirement,
      inflationRate: this.INFLATION_RATE,
      growthRate: this.GROWTH_RATE,
      drawdownRate: this.DRAWDOWN_RATE
    };
  }
  
  /**
   * Calculate inflated value using compound inflation
   */
  private calculateInflatedValue(currentValue: number, years: number, inflationRate: number): number {
    return currentValue * Math.pow(1 + inflationRate, years);
  }
  
  /**
   * Calculate pension income from a given pension value
   */
  private calculatePensionIncome(pensionValue: number, yearsToGrow: number, growthRate: number, drawdownRate: number): number {
    const futureValue = pensionValue * Math.pow(1 + growthRate, yearsToGrow);
    return futureValue * drawdownRate;
  }
  
  /**
   * Calculate required pension value to generate target income
   */
  private calculateRequiredPensionValue(targetIncome: number, drawdownRate: number): number {
    return targetIncome / drawdownRate;
  }
  
  /**
   * Calculate monthly contribution needed to reach target value
   */
  private calculateMonthlyContribution(targetValue: number, years: number, growthRate: number): number {
    const months = years * 12;
    const monthlyRate = growthRate / 12;
    
    if (monthlyRate === 0) {
      return targetValue / months;
    }
    
    // PMT formula for monthly contributions
    const futureValueFactor = Math.pow(1 + monthlyRate, months) - 1;
    return (targetValue * monthlyRate) / futureValueFactor;
  }
  
  /**
   * Format currency values
   */
  public formatCurrency(value: number): string {
    return `£${Math.round(value).toLocaleString()}`;
  }
  
  /**
   * Format percentage values
   */
  public formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }
}

export const myBUOMCalculator = MyBUOMCalculator.getInstance();