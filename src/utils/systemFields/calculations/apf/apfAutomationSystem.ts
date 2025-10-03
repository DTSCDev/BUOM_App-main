// APF Automation System for ISA Updates and Time Tokens
export interface APFUpdateStatus {
  lastFormalUpdateDate: Date;
  lastSystemUpdateDate: Date;
  monthsSinceLastFormalUpdate: number;
  monthsSinceLastSystemUpdate: number;
  isUpToDate: boolean;
  requiresFormalUpdate: boolean;
  timeTokensEarned: number;
  nextFormalUpdateDue: Date;
}

export interface TimeToken {
  id: string;
  userId: string;
  earnedDate: Date;
  value: number; // Represents 50% savings value
  isRedeemed: boolean;
  redeemedDate?: Date;
  advisoryFirmId?: string;
  evidenceType: 'formal_update' | 'monthly_tracking' | 'api_connection';
}

export interface ISATrackingRecord {
  month: number;
  year: number;
  targetAmount: number;
  actualAmount?: number; // Only filled when user provides evidence
  systemProjection: number;
  fundingTranche: string;
  isVerified: boolean;
  lastUpdated: Date;
}

export interface FREEBenefitsRewardsAccount {
  userId: string;
  timeTokensBalance: number;
  totalTimeTokensEarned: number;
  lastFormalEvidenceDate: Date;
  accountStatus: 'active' | 'pending_evidence' | 'suspended';
  evidenceHistory: EvidenceRecord[];
}

export interface EvidenceRecord {
  submissionDate: Date;
  evidenceType: 'isa_statement' | 'bank_statement' | 'api_data' | 'manual_input';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  coversPeriod: { from: Date; to: Date };
  timeTokensAwarded: number;
}

export class APFAutomationSystem {
  
  /**
   * Check if user's APF records are up to date based on 12-month formal evidence requirement
   */
  static checkUpdateStatus(
    lastFormalUpdateDate: Date, 
    lastSystemUpdateDate: Date = new Date()
  ): APFUpdateStatus {
    const now = new Date();
    const monthsSinceFormal = this.getMonthsDifference(lastFormalUpdateDate, now);
    const monthsSinceSystem = this.getMonthsDifference(lastSystemUpdateDate, now);
    
    // Calculate next formal update due date (12 months from last formal update)
    const nextFormalUpdateDue = new Date(lastFormalUpdateDate);
    nextFormalUpdateDue.setMonth(nextFormalUpdateDue.getMonth() + 12);
    
    return {
      lastFormalUpdateDate,
      lastSystemUpdateDate,
      monthsSinceLastFormalUpdate: monthsSinceFormal,
      monthsSinceLastSystemUpdate: monthsSinceSystem,
      isUpToDate: monthsSinceFormal <= 12, // Up to date if formal evidence within 12 months
      requiresFormalUpdate: monthsSinceFormal >= 12,
      timeTokensEarned: monthsSinceFormal <= 12 ? 1 : 0,
      nextFormalUpdateDue
    };
  }

  /**
   * Monthly System Automation - Records ISA targets automatically
   * This runs monthly and tracks all funding tranches without requiring user input
   */
  static recordMonthlyISATargets(
    userId: string,
    fundingTranches: string[],
    monthlyTargets: { [tranche: string]: number }
  ): ISATrackingRecord[] {
    const now = new Date();
    const records: ISATrackingRecord[] = [];
    
    fundingTranches.forEach(tranche => {
      const record: ISATrackingRecord = {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        targetAmount: monthlyTargets[tranche] || 0,
        systemProjection: this.calculateSystemProjection(monthlyTargets[tranche] || 0),
        fundingTranche: tranche,
        isVerified: false, // Will be verified when user provides formal evidence
        lastUpdated: now
      };
      records.push(record);
    });
    
    return records;
  }

  /**
   * Calculate SFM-APF-1008 - Annual ISA Update requirement (12-month cycle)
   */
  static calculateAnnualISAUpdate(lastFormalUpdateDate: Date): {
    isDue: boolean;
    daysSinceLastFormalUpdate: number;
    daysUntilDue: number;
    updateMethod: 'not_due' | 'approaching' | 'due' | 'overdue';
    evidenceRequired: boolean;
  } {
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - lastFormalUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilDue = 365 - daysSinceUpdate;
    
    let updateMethod: 'not_due' | 'approaching' | 'due' | 'overdue';
    if (daysSinceUpdate >= 365) {
      updateMethod = 'overdue';
    } else if (daysSinceUpdate >= 335) { // 30 days before due
      updateMethod = 'due';
    } else if (daysSinceUpdate >= 305) { // 60 days before due
      updateMethod = 'approaching';
    } else {
      updateMethod = 'not_due';
    }
    
    return {
      isDue: daysSinceUpdate >= 365,
      daysSinceLastFormalUpdate: daysSinceUpdate,
      daysUntilDue: Math.max(0, daysUntilDue),
      updateMethod,
      evidenceRequired: daysSinceUpdate >= 365
    };
  }

  /**
   * Calculate SFM-APF-1009 - Annual ISA Savings + Growth with monthly automation
   * This tracks monthly but only requires formal evidence annually
   */
  static calculateISASavingsGrowth(
    monthlyISAAmount: number,
    growthRate: number = 0.05,
    monthsInvested: number = 12,
    hasRecentEvidence: boolean = false
  ): {
    totalContributions: number;
    growthAmount: number;
    totalValue: number;
    monthlyForecast: number[];
    confidenceLevel: 'high' | 'medium' | 'low';
    lastVerifiedValue?: number;
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
    
    // Confidence level based on recent evidence
    const confidenceLevel = hasRecentEvidence ? 'high' : monthsInvested <= 6 ? 'medium' : 'low';
    
    return {
      totalContributions,
      growthAmount,
      totalValue,
      monthlyForecast,
      confidenceLevel
    };
  }

  /**
   * Award Time Tokens for providing formal evidence within 12-month requirement
   */
  static awardTimeTokensForEvidence(
    userId: string, 
    evidenceRecord: EvidenceRecord,
    updateStatus: APFUpdateStatus
  ): TimeToken | null {
    // Only award tokens if evidence is provided within the 12-month window
    if (updateStatus.monthsSinceLastFormalUpdate > 12) {
      return null; // No tokens for overdue evidence
    }

    const tokenValue = this.calculateTokenValue(evidenceRecord, updateStatus);
    
    return {
      id: `tt_${userId}_${Date.now()}`,
      userId,
      earnedDate: new Date(),
      value: tokenValue,
      isRedeemed: false,
      evidenceType: 'formal_update'
    };
  }

  /**
   * Manage FREE Benefits Rewards Account
   */
  static updateFREEBenefitsAccount(
    account: FREEBenefitsRewardsAccount,
    newEvidence: EvidenceRecord
  ): FREEBenefitsRewardsAccount {
    const updatedAccount = { ...account };
    
    // Add new evidence to history
    updatedAccount.evidenceHistory.push(newEvidence);
    
    // Update last formal evidence date if verified
    if (newEvidence.verificationStatus === 'verified') {
      updatedAccount.lastFormalEvidenceDate = newEvidence.submissionDate;
      updatedAccount.timeTokensBalance += newEvidence.timeTokensAwarded;
      updatedAccount.totalTimeTokensEarned += newEvidence.timeTokensAwarded;
    }
    
    // Update account status based on evidence recency
    const daysSinceLastEvidence = Math.floor(
      (Date.now() - updatedAccount.lastFormalEvidenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastEvidence <= 365) {
      updatedAccount.accountStatus = 'active';
    } else if (daysSinceLastEvidence <= 395) { // 30-day grace period
      updatedAccount.accountStatus = 'pending_evidence';
    } else {
      updatedAccount.accountStatus = 'suspended';
    }
    
    return updatedAccount;
  }

  /**
   * Generate evidence submission reminders based on 12-month cycle
   */
  static generateEvidenceReminders(updateStatus: APFUpdateStatus): {
    urgencyLevel: 'none' | 'reminder' | 'urgent' | 'critical';
    message: string;
    actionRequired: string[];
    timeTokensAtRisk: boolean;
  } {
    const { monthsSinceLastFormalUpdate } = updateStatus;
    
    if (monthsSinceLastFormalUpdate >= 13) {
      return {
        urgencyLevel: 'critical',
        message: 'Your FREE Benefits Rewards account is suspended. Time Tokens are no longer being earned.',
        actionRequired: [
          'Submit ISA statement or bank statement immediately',
          'Upload evidence covering the last 12 months',
          'Contact support if you need assistance',
          'Consider setting up API connection for automatic updates'
        ],
        timeTokensAtRisk: true
      };
    } else if (monthsSinceLastFormalUpdate >= 12) {
      return {
        urgencyLevel: 'urgent',
        message: 'Formal evidence is now overdue. Submit within 30 days to maintain Time Token eligibility.',
        actionRequired: [
          'Download latest ISA statement',
          'Upload statement or provide manual update',
          'Verify all funding tranches are included'
        ],
        timeTokensAtRisk: true
      };
    } else if (monthsSinceLastFormalUpdate >= 11) {
      return {
        urgencyLevel: 'reminder',
        message: 'Formal evidence due within 30 days to continue earning Time Tokens.',
        actionRequired: [
          'Prepare ISA statements for all accounts',
          'Schedule time to submit evidence',
          'Consider API connection for future automation'
        ],
        timeTokensAtRisk: false
      };
    } else {
      return {
        urgencyLevel: 'none',
        message: 'Your APF tracking is up to date. Next formal evidence due in ' + 
                (12 - monthsSinceLastFormalUpdate) + ' months.',
        actionRequired: ['Continue monitoring monthly targets'],
        timeTokensAtRisk: false
      };
    }
  }

  /**
   * Calculate system projection for monthly tracking
   */
  private static calculateSystemProjection(monthlyTarget: number, growthRate: number = 0.05): number {
    const monthlyGrowthRate = growthRate / 12;
    return monthlyTarget * (1 + monthlyGrowthRate);
  }

  /**
   * Calculate Time Token value based on evidence quality and timing
   */
  private static calculateTokenValue(
    evidenceRecord: EvidenceRecord, 
    updateStatus: APFUpdateStatus
  ): number {
    let baseValue = 50; // Base 50% savings value
    
    // Bonus for early submission (before 11 months)
    if (updateStatus.monthsSinceLastFormalUpdate <= 11) {
      baseValue += 10; // Early submission bonus
    }
    
    // Bonus for comprehensive evidence (API data or detailed statements)
    if (evidenceRecord.evidenceType === 'api_data') {
      baseValue += 15; // API connection bonus
    } else if (evidenceRecord.evidenceType === 'isa_statement') {
      baseValue += 5; // Official statement bonus
    }
    
    return baseValue;
  }

  private static getMonthsDifference(date1: Date, date2: Date): number {
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    return yearDiff * 12 + monthDiff;
  }
}

// APF Calculation Functions for the new SFM codes with updated logic
export class APFCalculations {
  
  /**
   * SFM-APF-1001: Annual Salary (Base Reference)
   */
  static calculateAPF1001(sfm002: number): number {
    return sfm002; // Direct reference to SFM-002
  }

  /**
   * SFM-APF-1002: Annual Salary with Inflation
   */
  static calculateAPF1002(sfm002: number, inflationRate: number = 0.02, years: number = 1): number {
    return sfm002 * Math.pow(1 + inflationRate, years);
  }

  /**
   * SFM-APF-1003: Paydays Remaining
   */
  static calculateAPF1003(sfm026: number): number {
    return sfm026; // Direct reference to SFM-026
  }

  /**
   * SFM-APF-1004: Target Income at Retirement
   */
  static calculateAPF1004(sfm010: number): number {
    return sfm010; // Direct reference to SFM-010
  }

  /**
   * SFM-APF-1005: Projected Pension Income at Retirement
   */
  static calculateAPF1005(sfm013: number): number {
    return sfm013; // Direct reference to SFM-013
  }

  /**
   * SFM-APF-1006: Income Shortfall at Retirement
   */
  static calculateAPF1006(apf1004: number, apf1005: number): number {
    return Math.max(0, apf1004 - apf1005); // Ensure non-negative shortfall
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
   * SFM-APF-1008: Annual ISA Update (User Input Required every 12 months)
   * System tracks monthly, but formal evidence required annually
   */
  static calculateAPF1008(
    userProvidedValue: number = 0,
    lastFormalUpdateDate: Date,
    systemProjectedValue: number
  ): {
    value: number;
    source: 'user_evidence' | 'system_projection';
    confidenceLevel: 'high' | 'medium' | 'low';
    evidenceAge: number; // days since last formal evidence
  } {
    const now = new Date();
    const evidenceAge = Math.floor((now.getTime() - lastFormalUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Use user evidence if recent (within 365 days), otherwise use system projection
    if (evidenceAge <= 365 && userProvidedValue > 0) {
      return {
        value: userProvidedValue,
        source: 'user_evidence',
        confidenceLevel: 'high',
        evidenceAge
      };
    } else {
      const confidenceLevel = evidenceAge <= 180 ? 'medium' : 'low';
      return {
        value: systemProjectedValue,
        source: 'system_projection',
        confidenceLevel,
        evidenceAge
      };
    }
  }

  /**
   * SFM-APF-1009: Annual ISA Savings + Growth (Monthly automation with annual verification)
   */
  static calculateAPF1009(
    monthlyContribution: number, 
    growthRate: number = 0.05,
    hasRecentEvidence: boolean = false,
    lastEvidenceDate?: Date
  ): {
    totalValue: number;
    monthlyTracking: number[];
    verificationStatus: 'verified' | 'projected' | 'stale';
    nextEvidenceDue: Date;
  } {
    const result = APFAutomationSystem.calculateISASavingsGrowth(
      monthlyContribution, 
      growthRate, 
      12, 
      hasRecentEvidence
    );
    
    // Determine verification status
    let verificationStatus: 'verified' | 'projected' | 'stale';
    const now = new Date();
    const nextEvidenceDue = new Date();
    
    if (lastEvidenceDate) {
      const daysSinceEvidence = Math.floor((now.getTime() - lastEvidenceDate.getTime()) / (1000 * 60 * 60 * 24));
      nextEvidenceDue.setTime(lastEvidenceDate.getTime() + (365 * 24 * 60 * 60 * 1000));
      
      if (daysSinceEvidence <= 365) {
        verificationStatus = 'verified';
      } else if (daysSinceEvidence <= 395) {
        verificationStatus = 'projected';
      } else {
        verificationStatus = 'stale';
      }
    } else {
      verificationStatus = 'projected';
      nextEvidenceDue.setTime(now.getTime() + (365 * 24 * 60 * 60 * 1000));
    }
    
    return {
      totalValue: result.totalValue,
      monthlyTracking: result.monthlyForecast,
      verificationStatus,
      nextEvidenceDue
    };
  }
}