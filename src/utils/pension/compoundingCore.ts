
import { getPensionParameters } from '../pensionParameters';

/**
 * Core compounding calculation functions
 */
export class CompoundingCore {
  // Dynamic parameter access - always get fresh parameters
  get params() {
    return getPensionParameters();
  }
  
  // Monthly growth rate (e.g. 4.5% / 12)
  get monthlyGrowthRate(): number {
    // Use effective monthly rate derived from annual growth
    return Math.pow(1 + this.params.growthRateAccumulation, 1/12) - 1;
  }
  
  // Monthly drawdown growth rate (e.g. 4% / 12)
  get monthlyDrawdownGrowthRate(): number {
    // Use effective monthly rate derived from annual drawdown growth
    return Math.pow(1 + this.params.growthRateDrawdown, 1/12) - 1;
  }
  
  // Monthly provider charges (e.g. 0.5% / 12)
  get monthlyProviderCharges(): number {
    // Use effective monthly rate derived from annual provider charges
    return Math.pow(1 + this.params.providerCharges, 1/12) - 1;
  }
  
  // Monthly advisor fee (applied annually at plan anniversary)
  get annualAdvisorFee(): number {
    return this.params.advisorFee;
  }
  
  // Annual salary inflation (applied annually)
  get annualSalaryInflation(): number {
    return this.params.salaryInflation;
  }
  
  // Annual pension income inflation (applied annually)
  get annualPensionIncomeInflation(): number {
    return this.params.pensionIncomeInflation;
  }
  
  // Net monthly growth rate (growth minus monthly charges)
  get netMonthlyGrowthRate(): number {
    return this.monthlyGrowthRate - this.monthlyProviderCharges;
  }
  
  // Net monthly drawdown rate (drawdown growth minus monthly charges)
  get netMonthlyDrawdownRate(): number {
    return this.monthlyDrawdownGrowthRate - this.monthlyProviderCharges;
  }
  
  /**
   * Compound growth over exact months with monthly charges deducted
   */
  compoundMonthly(presentValue: number, months: number, isDrawdownPhase: boolean = false): number {
    const monthlyRate = isDrawdownPhase ? this.netMonthlyDrawdownRate : this.netMonthlyGrowthRate;
    return presentValue * Math.pow(1 + monthlyRate, months);
  }
  
  /**
   * Apply annual inflation to a value
   */
  applyAnnualInflation(presentValue: number, years: number, inflationType: 'salary' | 'pension' | 'custom', customRate?: number): number {
    let rate: number;
    switch (inflationType) {
      case 'salary':
        rate = this.annualSalaryInflation;
        break;
      case 'pension':
        rate = this.annualPensionIncomeInflation;
        break;
      case 'custom':
        rate = customRate || 0;
        break;
    }
    return presentValue * Math.pow(1 + rate, years);
  }
  
  /**
   * Apply advisor fee annually at plan anniversary
   */
  applyAdvisorFee(fundValue: number, planAnniversaryReached: boolean): number {
    if (!planAnniversaryReached || this.annualAdvisorFee === 0) {
      return fundValue;
    }
    return fundValue * (1 - this.annualAdvisorFee);
  }
  
  /**
   * Calculate future value of escalating monthly contributions
   */
  escalatingMonthlyContributions(
    monthlyContribution: number, 
    totalMonths: number, 
    isDrawdownPhase: boolean = false
  ): { totalContributions: number; futureValue: number } {
    const monthlyGrowthRate = isDrawdownPhase ? this.netMonthlyDrawdownRate : this.netMonthlyGrowthRate;
    const monthlySalaryInflation = Math.pow(1 + this.annualSalaryInflation, 1/12) - 1;
    
    let totalContributions = 0;
    let futureValue = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Apply salary inflation to monthly contribution
      const inflatedContribution = monthlyContribution * Math.pow(1 + monthlySalaryInflation, month - 1);
      totalContributions += inflatedContribution;
      
      // Calculate how many months this contribution will grow
      const monthsOfGrowth = totalMonths - month;
      
      // Add contribution with compound growth
      if (monthsOfGrowth > 0) {
        futureValue += inflatedContribution * Math.pow(1 + monthlyGrowthRate, monthsOfGrowth);
      } else {
        futureValue += inflatedContribution;
      }
    }
    
    return {
      totalContributions: Math.round(totalContributions),
      futureValue: Math.round(futureValue)
    };
  }
  
  /**
   * Calculate monthly Auto Enrollment contribution
   */
  calculateMonthlyAEContribution(annualSalary: number): number {
    const pensionableEarnings = (annualSalary * this.params.autoEnrollmentPensionablePayRate) / 12;
    const totalContributionRate = this.params.autoEnrollmentEmployeeRate + this.params.autoEnrollmentEmployerRate;
    return pensionableEarnings * totalContributionRate;
  }
  
  /**
   * Calculate age from date of birth using Parameters
   */
  calculateAge(dateOfBirth: Date): { years: number; months: number; days: number } {
    const today = new Date();
    let years = today.getFullYear() - dateOfBirth.getFullYear();
    let months = today.getMonth() - dateOfBirth.getMonth();
    let days = today.getDate() - dateOfBirth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }
  
  /**
   * Get current state pension using Parameters
   */
  getCurrentStatePension(): number {
    return this.params.statePensionWeekly;
  }
  
  /**
   * Get state pension at retirement using Parameters
   */
  getStatePensionAtRetirement(yearsUntilRetirement: number): number {
    const weeklyStatePension = this.getCurrentStatePension();
    const annualStatePension = weeklyStatePension * 52;
    return this.applyAnnualInflation(annualStatePension, yearsUntilRetirement, 'pension');
  }
}

// Export singleton instance
export const compoundingCore = new CompoundingCore();
