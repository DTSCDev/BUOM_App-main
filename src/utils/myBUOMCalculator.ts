import { systemFields } from "@/data/systemFields";
import { SystemField } from "@/data/systemFields/types";
import { getPensionParameters } from "@/utils/pensionParameters";
import { compoundingCalculator } from "@/utils/pension/compoundingUtils";

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
  // Fraction e.g. 0.5 for 50%
  targetIncomePercentage: number;
  
  // APF specific inputs
  apfSponsorshipYears: number;
  // Current ISA savings value from NAV
  currentISAValue: number;
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
  
  // Dynamic Parameters
  private get params() {
    return getPensionParameters();
  }
  
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
      this.params.salaryInflation
    );
    
    // APF-1003: Paydays Remaining
    // Monthly paydays remaining aligned with SFM-CAL-4113
    const paydaysRemaining = monthsToRetirement;
    
    // APF-1004: Target Income at Retirement
    const targetIncomeAtRetirement = annualSalaryInflated * inputs.targetIncomePercentage;
    
    // APF-1005: Existing Plan Income at Retirement
    const existingPlanIncomeAtRetirement = this.calculatePensionIncome(
      inputs.existingPensionValue,
      yearsToRetirement,
      this.params.growthRateAccumulation,
      this.params.drawdownRate
    );
    
    // APF-1006: APF Target Income (shortfall)
    const apfTargetIncome = Math.max(0, targetIncomeAtRetirement - existingPlanIncomeAtRetirement);
    
    // Retirement progress percentage
    const retirementProgressPercentage = targetIncomeAtRetirement > 0 
      ? Math.min(100, (existingPlanIncomeAtRetirement / targetIncomeAtRetirement) * 100)
      : 0;
    
    // APF-1007: ISA Target Monthly (to fund APF shortfall)
    const requiredAPFValue = this.calculateRequiredPensionValue(apfTargetIncome, this.params.drawdownRate);
    const isaTargetMonthly = this.calculateMonthlyContribution(
      requiredAPFValue,
      yearsToRetirement,
      this.params.growthRateAccumulation
    );
    
    // APF-1008: ISA Value Today (current ISA savings)
    const isaValueToday = inputs.currentISAValue;
    
    // APF-1009: ISA Savings Target Today (total needed)
    const isaSavingsTargetToday = requiredAPFValue;
    
    // Repayment progress percentage
    const repaymentProgressPercentage = isaSavingsTargetToday > 0
      ? Math.min(100, (isaValueToday / isaSavingsTargetToday) * 100)
      : 0;
    
    const result: BUOMCalculationResults = {
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
      inflationRate: this.params.salaryInflation,
      growthRate: this.params.growthRateAccumulation,
      drawdownRate: this.params.drawdownRate
    };

    // Lightweight debug to help verify wiring in preview
    try {
      console.debug('APF Dashboard Calculations', {
        inputs,
        params: this.params,
        result
      });
    } catch (error) {
      // Ignore logging errors in non-browser environments
      console.warn('APF Dashboard calculation debug logging failed', error);
    }

    return result;
  }
  
  /**
   * Calculate inflated value using compound inflation
   */
  private calculateInflatedValue(currentValue: number, years: number, inflationRate: number): number {
    // Annual inflation compounding (salary/pension inflation)
    return currentValue * Math.pow(1 + inflationRate, years);
  }
  
  /**
   * Calculate pension income from a given pension value
   */
  private calculatePensionIncome(pensionValue: number, yearsToGrow: number, _growthRate: number, drawdownRate: number): number {
    // Use net MONTHLY compounding (growth minus provider charges)
    const months = Math.max(0, yearsToGrow * 12);
    const futureValue = compoundingCalculator.applyMonthlyCompounding(pensionValue, months, false);
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
  private calculateMonthlyContribution(targetValue: number, years: number, _growthRate: number): number {
    const months = years * 12;
    const monthlyRate = compoundingCalculator.getNetMonthlyGrowthRate();
    
    if (monthlyRate === 0 || months === 0) {
      return months > 0 ? targetValue / months : 0;
    }
    
    // PMT formula using net monthly growth rate (fees deducted)
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