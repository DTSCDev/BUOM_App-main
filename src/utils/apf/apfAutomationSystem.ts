// APF Automation System for ISA Updates and Time Tokens
export interface APFUpdateStatus {
  lastUpdateDate: Date;
  monthsBehind: number;
  isUpToDate: boolean;
  requiresUpdate: boolean;
  timeTokensEarned: number;
}

export interface TimeToken {
  id: string;
  userId: string;
  earnedDate: Date;
  value: number; // Represents 50% savings value
  isRedeemed: boolean;
  redeemedDate?: Date;
  advisoryFirmId?: string;
}

export class APFAutomationSystem {
  
  /**
   * Check if user's APF records are up to date
   */
  static checkUpdateStatus(lastUpdateDate: Date): APFUpdateStatus {
    const now = new Date();
    const monthsDiff = this.getMonthsDifference(lastUpdateDate, now);
    
    return {
      lastUpdateDate,
      monthsBehind: monthsDiff,
      isUpToDate: monthsDiff <= 1,
      requiresUpdate: monthsDiff >= 1,
      timeTokensEarned: monthsDiff <= 1 ? 1 : 0
    };
  }

  /**
   * Calculate SFM-APF-1008 - Annual ISA Update requirement
   */
  static calculateAnnualISAUpdate(lastUpdateDate: Date): {
    isDue: boolean;
    daysSinceUpdate: number;
    updateMethod: 'manual' | 'api' | 'required';
  } {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      isDue: daysDiff >= 365,
      daysSinceUpdate: daysDiff,
      updateMethod: daysDiff >= 365 ? 'required' : daysDiff >= 330 ? 'manual' : 'api'
    };
  }

  /**
   * Calculate SFM-APF-1009 - Annual ISA Savings + Growth with monthly automation
   */
  static calculateISASavingsGrowth(
    monthlyISAAmount: number,
    growthRate: number = 0.05,
    monthsInvested: number = 12
  ): {
    totalContributions: number;
    growthAmount: number;
    totalValue: number;
    monthlyForecast: number[];
  } {
    const monthlyGrowthRate = growthRate / 12;
    let totalValue = 0;
    const monthlyForecast: number[] = [];
    
    for (let month = 1; month <= monthsInvested; month++) {
      totalValue = (totalValue + monthlyISAAmount) * (1 + monthlyGrowthRate);
      monthlyForecast.push(totalValue);
    }
    
    const totalContributions = monthlyISAAmount * monthsInvested;
    const growthAmount = totalValue - totalContributions;
    
    return {
      totalContributions,
      growthAmount,
      totalValue,
      monthlyForecast
    };
  }

  /**
   * Award Time Tokens for maintaining up-to-date records
   */
  static awardTimeTokens(userId: string, updateStatus: APFUpdateStatus): TimeToken | null {
    if (!updateStatus.isUpToDate) {
      return null;
    }

    return {
      id: `tt_${userId}_${Date.now()}`,
      userId,
      earnedDate: new Date(),
      value: 50, // Represents 50% savings on advisory costs
      isRedeemed: false
    };
  }

  /**
   * Calculate advisory cost savings with Time Tokens
   */
  static calculateAdvisorySavings(
    originalCost: number,
    timeTokensAvailable: number
  ): {
    maxSavings: number;
    tokensRequired: number;
    finalCost: number;
    savingsPercentage: number;
  } {
    const maxSavingsAmount = originalCost * 0.5; // 50% maximum savings
    const tokensRequired = Math.min(timeTokensAvailable, Math.ceil(maxSavingsAmount / 50));
    const actualSavings = tokensRequired * 50;
    
    return {
      maxSavings: maxSavingsAmount,
      tokensRequired,
      finalCost: originalCost - actualSavings,
      savingsPercentage: (actualSavings / originalCost) * 100
    };
  }

  /**
   * Generate persistent update reminders for users behind by 12+ months
   */
  static generateUpdateReminders(updateStatus: APFUpdateStatus): {
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    actionRequired: string[];
  } {
    const { monthsBehind } = updateStatus;
    
    if (monthsBehind >= 12) {
      return {
        urgencyLevel: 'critical',
        message: 'Your APF records are significantly behind. Immediate action required.',
        actionRequired: [
          'Download latest ISA statement',
          'Upload statement image or PDF',
          'Connect via API if available',
          'Schedule advisory consultation'
        ]
      };
    } else if (monthsBehind >= 6) {
      return {
        urgencyLevel: 'high',
        message: 'Your APF records need updating to maintain accuracy.',
        actionRequired: [
          'Provide latest ISA values',
          'Upload recent statement',
          'Verify contribution amounts'
        ]
      };
    } else if (monthsBehind >= 3) {
      return {
        urgencyLevel: 'medium',
        message: 'Consider updating your APF records for better projections.',
        actionRequired: [
          'Review current ISA performance',
          'Update contribution amounts if changed'
        ]
      };
    } else {
      return {
        urgencyLevel: 'low',
        message: 'Your APF records are up to date. Well done!',
        actionRequired: ['Continue regular monitoring']
      };
    }
  }

  private static getMonthsDifference(date1: Date, date2: Date): number {
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    return yearDiff * 12 + monthDiff;
  }
}

// APF Calculation Functions for the new page-based SFM codes
export class APFCalculations {
  
  /**
   * SFM-APF-1001: Annual Salary (Base Reference)
   * UPDATED: Now uses PRF-2021 instead of SFM-002
   */
  static calculateAPF1001(prf2021: number): number {
    return prf2021; // Direct reference to SFM-PRF-2021 (Profile Annual Salary)
  }

  /**
   * SFM-APF-1002: Annual Salary with Inflation
   * UPDATED: Now uses PRF-2021 instead of SFM-002
   */
  static calculateAPF1002(prf2021: number, inflationRate: number = 0.02, years: number = 1): number {
    return prf2021 * Math.pow(1 + inflationRate, years);
  }

  /**
   * SFM-APF-1003: Paydays Remaining
   * UPDATED: Now uses CAL-4113 instead of SFM-026
   */
  static calculateAPF1003(cal4113: number): number {
    return cal4113; // Direct reference to SFM-CAL-4113 (Paydays Remaining)
  }

  /**
   * SFM-APF-1004: Target Income at Retirement
   * UPDATED: Now uses CAL-4107 instead of SFM-010
   */
  static calculateAPF1004(cal4107: number): number {
    return cal4107; // Direct reference to SFM-CAL-4107 (Target Income at Retirement)
  }

  /**
   * SFM-APF-1005: Projected Pension Income at Retirement
   * UPDATED: Now uses (CAL-4119 x CAL-4404) + CAL-4109
   */
  static calculateAPF1005(cal4119: number, cal4404: number, cal4109: number): number {
    return (cal4119 * cal4404) + cal4109; // (Total Projected Pension Value x Drawdown Rate) + State Pension at Retirement
  }

  /**
   * SFM-APF-1006: Income Shortfall at Retirement
   * UPDATED: Now uses CAL-4107 - APF-1005
   */
  static calculateAPF1006(cal4107: number, apf1005: number): number {
    return Math.max(0, cal4107 - apf1005); // Target Income - Projected Income (ensure non-negative)
  }

  /**
   * SFM-APF-1007: Monthly ISA Savings for Year 1
   */
  static calculateAPF1007(targetShortfall: number, yearsToRetirement: number, growthRate: number = 0.05): number {
    // Calculate required monthly ISA contribution to fill shortfall
    const monthlyGrowthRate = growthRate / 12;
    const totalMonths = yearsToRetirement * 12;
    
    // Future value of annuity formula: FV = PMT * [((1 + r)^n - 1) / r]
    const futureValueFactor = (Math.pow(1 + monthlyGrowthRate, totalMonths) - 1) / monthlyGrowthRate;
    
    return targetShortfall / futureValueFactor;
  }

  /**
   * SFM-APF-1008: Annual ISA Update (User Input Required)
   * This is a placeholder for user input - actual value comes from user updates
   */
  static calculateAPF1008(userProvidedValue: number = 0): number {
    return userProvidedValue; // User must provide this annually
  }

  /**
   * SFM-APF-1009: Annual ISA Savings + Growth
   */
  static calculateAPF1009(monthlyContribution: number, growthRate: number = 0.05): number {
    return APFAutomationSystem.calculateISASavingsGrowth(monthlyContribution, growthRate, 12).totalValue;
  }
}