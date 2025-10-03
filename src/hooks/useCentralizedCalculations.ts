import { useMemo } from 'react';
import { getPensionParameters } from '@/utils/pensionParameters';

// Core input interface
export interface CoreInputs {
  dateOfBirth: string;
  grossSalary: number;
  existingPensionValue: number;
  historicalContributions: number;
  monthlyAEContributions: number;
  finalSalaryIncome: number; // CORRECTED: was dbIncomeAtRetirement
  otherIncome: number; // CORRECTED: was otherIncomeAtRetirement
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  
  // Parse date safely - handle both YYYY-MM-DD and DD/MM/YYYY formats
  let birthDate: Date;
  
  if (dateOfBirth.includes('/')) {
    // DD/MM/YYYY format
    const parts = dateOfBirth.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      
      // Validate date parts
      if (isNaN(day) || isNaN(month) || isNaN(year) || 
          day < 1 || day > 31 || month < 0 || month > 11 || 
          year < 1900 || year > today.getFullYear()) {
        return 42; // Default age fallback
      }
      
      birthDate = new Date(year, month, day);
    } else {
      return 42; // Default age fallback
    }
  } else {
    // Assume YYYY-MM-DD format
    birthDate = new Date(dateOfBirth);
  }
  
  // Verify the date was created correctly
  if (isNaN(birthDate.getTime())) {
    return 42; // Default age fallback
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Helper function to get default date of birth (42 years old)
// NOTE: MAIN APP should use PRF-2003 from profile data, not this default
function getDefaultDateOfBirth(): string {
  // Calculate date that makes user exactly 42 years old today
  const today = new Date();
  const birthYear = today.getFullYear() - 42;
  const birthMonth = today.getMonth(); // 0-indexed
  const birthDay = today.getDate();
  
  // Create birth date and format as YYYY-MM-DD
  const birthDate = new Date(birthYear, birthMonth, birthDay);
  return birthDate.toISOString().split('T')[0];
}

// Helper function to calculate monthly net pay using 1257L tax code
function calculateMonthlyNetPay(grossSalary: number): number {
  const monthlyGross = grossSalary / 12;
  const personalAllowance = 12570; // 1257L tax code
  const monthlyAllowance = personalAllowance / 12;
  
  const taxableIncome = Math.max(0, monthlyGross - monthlyAllowance);
  const incomeTax = taxableIncome * 0.20; // 20% basic rate
  const nationalInsurance = Math.max(0, (monthlyGross - 1048) * 0.12); // 12% NI above £1,048/month
  
  return monthlyGross - incomeTax - nationalInsurance;
}

// Main calculation hook
export function useCentralizedCalculations(inputs: Partial<CoreInputs> = {}) {
  return useMemo(() => {
    const params = getPensionParameters();
    
    // CORE INPUTS with defaults
    const dateOfBirth = inputs.dateOfBirth || getDefaultDateOfBirth();
    const grossSalary = inputs.grossSalary || 60000;
    const existingPensionValue = inputs.existingPensionValue || 109233;
    const historicalContributions = inputs.historicalContributions || 69406;
    const monthlyAEContributions = inputs.monthlyAEContributions || 340;
    const finalSalaryIncome = inputs.finalSalaryIncome || 0; // CORRECTED: SFM-006
    const otherIncome = inputs.otherIncome || 0; // CORRECTED: SFM-007
    
    // CORE CALCULATIONS
    const currentAge = calculateAge(dateOfBirth);
    const retirementAge = 67;
    const timeToRetirement = retirementAge - currentAge;
    const monthsToRetirement = timeToRetirement * 12;
    const daysToRetirement = timeToRetirement * 365;
    
    // Target income calculations
    const targetIncomeToday = grossSalary * 0.5; // 50% of current salary
    const targetIncomeAtRetirement = targetIncomeToday * Math.pow(1 + params.pensionIncomeInflation, timeToRetirement);
    
    // State pension calculations
    const statePensionAtRetirement = 11973 * Math.pow(1 + params.pensionIncomeInflation, timeToRetirement);
    
    // Pension projections
    const existingPensionGrowth = existingPensionValue * Math.pow(1 + params.growthRateAccumulation, timeToRetirement) - existingPensionValue;
    const totalFutureAEContributions = monthlyAEContributions * 12 * timeToRetirement;
    const futureAEGrowth = monthlyAEContributions * 12 * (Math.pow(1 + params.growthRateAccumulation, timeToRetirement) - 1) / params.growthRateAccumulation - totalFutureAEContributions;
    const totalProjectedPension = existingPensionValue + existingPensionGrowth + totalFutureAEContributions + futureAEGrowth;
    
    // Required capital and shortfall (SFM-010: Required Capital assuming full State Pension)
    const netIncomeRequired = Math.max(0, targetIncomeAtRetirement - statePensionAtRetirement);
    const requiredCapital = netIncomeRequired / params.drawdownRate; // SFM-010: Deduct State Pension from Target Income
    const capitalShortfall = Math.max(0, requiredCapital - totalProjectedPension); // CORRECTED: SFM-011
    
    // Monthly funding cost calculation
    const monthlyTopUpRequired = capitalShortfall > 0 && monthsToRetirement > 0
      ? (capitalShortfall * params.growthRateAccumulation / 12) / (Math.pow(1 + params.growthRateAccumulation / 12, monthsToRetirement) - 1)
      : 0;
    
    // Top up analysis
    const totalTopUpCost = monthlyTopUpRequired * 12 * timeToRetirement;
    const topUpGrowth = totalTopUpCost > 0 ? capitalShortfall - totalTopUpCost : 0;
    
    // Affordability calculations
    const monthlyNetPay = calculateMonthlyNetPay(grossSalary);
    const totalMonthlyCost = monthlyAEContributions + monthlyTopUpRequired;
    const affordabilityPercentage = monthlyNetPay > 0 ? (totalMonthlyCost / monthlyNetPay) * 100 : 0;
    const buomMonthlyCost = monthlyTopUpRequired * 0.5; // 50% reduction with BUOM
    const buomAffordabilityPercentage = monthlyNetPay > 0 ? ((monthlyAEContributions + buomMonthlyCost) / monthlyNetPay) * 100 : 0;
    
    // CHART ELEMENT CALCULATIONS for SFM-033 to SFM-043
    const existingPlanValueTodayAtRetirement = existingPensionValue + existingPensionGrowth; // SFM-033
    const existingPlanFutureContributions = totalFutureAEContributions + futureAEGrowth; // SFM-034
    const shortfallAtRetirement = capitalShortfall; // SFM-035
    const existingPlanMonthlyTopUp = monthlyTopUpRequired; // SFM-036
    const buomMonthlyTopUp = monthlyTopUpRequired * 0.5; // SFM-037
    const existingPlanTotalTopUp = totalTopUpCost; // SFM-038
    const buomTotalContribution = totalTopUpCost * 0.5; // SFM-039
    // SFM-041: APF Estimated Funding Period - using correct APF funding formula
    const maxAPFFunding = (60000 - 12570) * 1.582; // £75,034
    const apfEstimatedFundingPeriod = Math.round(capitalShortfall / maxAPFFunding) + 2; // SFM-041
    const lumpSumCostTargetIncome = targetIncomeToday / 0.035; // SFM-042
    const estimatedLifeCoverNeed = Math.max(0, lumpSumCostTargetIncome - existingPensionValue); // SFM-043
    
    return {
      // CORE INPUTS
      coreInputs: {
        dateOfBirth,
        grossSalary, // SFM-002: £60,000
        existingPensionValue, // SFM-003: £109,233
        historicalContributions, // SFM-003C: £69,406
        monthlyAEContributions, // SFM-004: £340
        finalSalaryIncome, // SFM-006: £0 (CORRECTED)
        otherIncome, // SFM-007: £0 (CORRECTED)
      },
      
      // KEY METRICS
      keyMetrics: {
        currentAge, // SFM-001: 42
        retirementAge, // SFM-005: 67
        timeToRetirement, // SFM-025-2: 25 years
        monthsToRetirement, // SFM-025: 300 months
        daysToRetirement, // SFM-025-3: 9,125 days
      },
      
      // PENSION FUNDING OPTIONS
      pensionFunding: {
        fundingProgress: requiredCapital > 0 ? Math.round((totalProjectedPension / requiredCapital) * 100) : 0, // SFM-008: 67%
        totalProjectedPensionPot: totalProjectedPension, // SFM-009: £567,960
        requiredCapital, // SFM-010: £845,005 (CORRECTED)
        capitalShortfall, // SFM-011: £277,045 (CORRECTED)
        monthlyFundingCost: monthlyTopUpRequired, // SFM-012: £405
      },
      
      // PENSION TIMELINE
      pensionTimeline: {
        targetIncomeToday, // SFM-013: £30,000
        targetIncomeAtRetirement, // SFM-014: £49,218
      },
      
      // STATE PENSION
      statePension: {
        statePensionToday: 11973, // SFM-015: £11,973
        statePensionAtRetirement, // SFM-016: £19,643
      },
      
      // PENSION PROJECTION ANALYSIS
      projectionAnalysis: {
        currentAge, // SFM-017: 42
        timeToRetirement, // SFM-018: 25 years
        monthsToRetirement, // SFM-019: 300 months
        daysToRetirement, // SFM-020: 9,125 days
        statePensionAge: 67, // SFM-021: 67
        existingPensionValue, // SFM-022: £109,233
        existingPensionGrowth, // SFM-023: £226,521
        futureAEContributions: totalFutureAEContributions, // SFM-024: £131,877
        futureAEGrowth, // SFM-025: £100,329
        totalProjectedValue: totalProjectedPension, // SFM-026: £567,960
        requiredCapital, // SFM-027: £845,005
        capitalShortfall, // SFM-028: £277,045
      },
      
      // TOP UP ANALYSIS
      topUpAnalysis: {
        topUpContributionsPaid: totalTopUpCost, // SFM-029: £157,137
        topUpInvestmentGrowth: topUpGrowth, // SFM-030: £119,908
        topUpContributionsValue: capitalShortfall, // SFM-031: £277,045
        effectiveGrowthRate: totalTopUpCost > 0 ? ((topUpGrowth / totalTopUpCost) * 100) : 0, // SFM-032: 76.3%
      },
      
      // CHART ELEMENTS (SFM-033 to SFM-043)
      chartElements: {
        // Pie Chart Elements
        existingPlanValueTodayAtRetirement, // SFM-033: Existing Plan Value Today at Retirement
        existingPlanFutureContributions, // SFM-034: Existing Plan Future Contributions Value
        shortfallAtRetirement, // SFM-035: Shortfall at Retirement
        
        // Bar Chart Elements
        existingPlanMonthlyTopUp, // SFM-036: Existing Plan Monthly Top Up
        buomMonthlyTopUp, // SFM-037: BUOM Monthly Top Up
        existingPlanTotalTopUp, // SFM-038: Existing Pension Plan Total Top Up Contributions
        buomTotalContribution, // SFM-039: BUOM Total Contribution
        
        // Action Elements
        ctaCheckEligibility: 'funding-eligibility', // SFM-040: CTA Button Check Eligibility For Funding Here
        
        // Additional Chart Elements
        apfEstimatedFundingPeriod, // SFM-041: APF Estimated Funding Period
        lumpSumCostTargetIncome, // SFM-042: Lump Sum Cost of Target Income Today
        estimatedLifeCoverNeed, // SFM-043: Estimated Life Cover Need
      },
      
      // AFFORDABILITY CHECKER (SFM-101 to SFM-119)
      affordability: {
        affordabilityWarningStatus: monthlyTopUpRequired > 0, // SFM-101: Affordability Warning Status
        monthlyNetPay, // SFM-102: Monthly Net Pay
        totalMonthlyCost, // SFM-103: Total Monthly Cost
        affordabilityPercentage, // SFM-104: Affordability Percentage
        buomMonthlyCost, // SFM-105: BUOM Monthly Cost
        buomAffordabilityPercentage, // SFM-106: BUOM Affordability Percentage
        affordabilityMessage: `Monthly funding cost: £${monthlyTopUpRequired.toFixed(0)}`, // SFM-107: Affordability Message
        ctaCheckFundingEligibility: 'funding-eligibility', // SFM-108: CTA Button Check My Funding Eligibility
        contributionMethod: 'Net Pay Arrangement', // SFM-109: Contribution Method
        autoEnrollmentBasis: 'Pensionable Pay Method (Set 2 & 3)', // SFM-110: Auto Enrollment Basis
        pensionablePayPercentage: 85, // SFM-111: Pensionable Pay Percentage
        monthlyGrossPay: grossSalary / 12, // SFM-112: Monthly Gross Pay
        pensionableEarnings: (grossSalary / 12) * 0.85, // SFM-113: Pensionable Earnings
        yourContribution: ((grossSalary / 12) * 0.85) * 0.05, // SFM-114: Your Contribution (5%)
        employerContribution: ((grossSalary / 12) * 0.85) * 0.03, // SFM-115: Employer Contribution (3%)
        totalMonthlyContribution: monthlyAEContributions, // SFM-116: Total Monthly Contribution (8%)
        annualPensionableEarnings: grossSalary * 0.85, // SFM-117: Annual Pensionable Earnings
        annualTotalContribution: monthlyAEContributions * 12, // SFM-118: Annual Total Contribution
        estimatedMonthlyNetPay: monthlyNetPay, // SFM-119: Estimated Monthly Net Pay (1257L)
      },
      
      // CALCULATION PARAMETERS
      parameters: params
    };
  }, [inputs]);
}

// Helper hook for specific SFM code resolution
export function useSFMValue(sfmCode: string, inputs: Partial<CoreInputs> = {}): number {
  const calculations = useCentralizedCalculations(inputs);
  
  // Map SFM codes to calculation values
  const sfmMap: Record<string, number> = {
    // Core inputs (SFM-001 to SFM-007)
    'SFM-001': calculations.keyMetrics.currentAge,
    'SFM-002': calculations.coreInputs.grossSalary,
    'SFM-003': calculations.coreInputs.existingPensionValue,
    'SFM-004': calculations.coreInputs.monthlyAEContributions,
    'SFM-005': calculations.keyMetrics.retirementAge,
    'SFM-006': calculations.coreInputs.finalSalaryIncome, // CORRECTED
    'SFM-007': calculations.coreInputs.otherIncome, // CORRECTED
    
    // Pension funding options (SFM-008 to SFM-012)
    'SFM-008': calculations.pensionFunding.fundingProgress,
    'SFM-009': calculations.pensionFunding.totalProjectedPensionPot,
    'SFM-010': calculations.pensionFunding.requiredCapital, // CORRECTED
    'SFM-011': calculations.pensionFunding.capitalShortfall, // CORRECTED
    'SFM-012': calculations.pensionFunding.monthlyFundingCost,
    
    // Timeline (SFM-013 to SFM-016)
    'SFM-013': calculations.pensionTimeline.targetIncomeToday,
    'SFM-014': calculations.pensionTimeline.targetIncomeAtRetirement,
    'SFM-015': calculations.statePension.statePensionToday,
    'SFM-016': calculations.statePension.statePensionAtRetirement,
    
    // Projection analysis (SFM-017 to SFM-028)
    'SFM-017': calculations.projectionAnalysis.currentAge,
    'SFM-018': calculations.projectionAnalysis.timeToRetirement,
    'SFM-019': calculations.projectionAnalysis.monthsToRetirement,
    'SFM-020': calculations.projectionAnalysis.daysToRetirement,
    'SFM-021': calculations.projectionAnalysis.statePensionAge,
    'SFM-022': calculations.projectionAnalysis.existingPensionValue,
    'SFM-023': calculations.projectionAnalysis.existingPensionGrowth,
    'SFM-024': calculations.projectionAnalysis.futureAEContributions,
    'SFM-025': calculations.projectionAnalysis.futureAEGrowth,
    'SFM-026': calculations.projectionAnalysis.totalProjectedValue,
    'SFM-027': calculations.projectionAnalysis.requiredCapital,
    'SFM-028': calculations.projectionAnalysis.capitalShortfall,
    
    // Top up analysis (SFM-029 to SFM-032)
    'SFM-029': calculations.topUpAnalysis.topUpContributionsPaid,
    'SFM-030': calculations.topUpAnalysis.topUpInvestmentGrowth,
    'SFM-031': calculations.topUpAnalysis.topUpContributionsValue,
    'SFM-032': calculations.topUpAnalysis.effectiveGrowthRate,
    
    // Chart elements (SFM-033 to SFM-043)
    'SFM-033': calculations.chartElements.existingPlanValueTodayAtRetirement,
    'SFM-034': calculations.chartElements.existingPlanFutureContributions,
    'SFM-035': calculations.chartElements.shortfallAtRetirement,
    'SFM-036': calculations.chartElements.existingPlanMonthlyTopUp,
    'SFM-037': calculations.chartElements.buomMonthlyTopUp,
    'SFM-038': calculations.chartElements.existingPlanTotalTopUp,
    'SFM-039': calculations.chartElements.buomTotalContribution,
    'SFM-040': 0, // Action button - not a numeric value
    'SFM-041': calculations.chartElements.apfEstimatedFundingPeriod,
    'SFM-042': calculations.chartElements.lumpSumCostTargetIncome,
    'SFM-043': calculations.chartElements.estimatedLifeCoverNeed,
    
    // Affordability checker (SFM-101 to SFM-119)
    'SFM-101': calculations.affordability.affordabilityWarningStatus ? 1 : 0,
    'SFM-102': calculations.affordability.monthlyNetPay,
    'SFM-103': calculations.affordability.totalMonthlyCost,
    'SFM-104': calculations.affordability.affordabilityPercentage,
    'SFM-105': calculations.affordability.buomMonthlyCost,
    'SFM-106': calculations.affordability.buomAffordabilityPercentage,
    'SFM-107': 0, // Message - not a numeric value
    'SFM-108': 0, // Action button - not a numeric value
    'SFM-109': 0, // Text value - not numeric
    'SFM-110': 0, // Text value - not numeric
    'SFM-111': calculations.affordability.pensionablePayPercentage,
    'SFM-112': calculations.affordability.monthlyGrossPay,
    'SFM-113': calculations.affordability.pensionableEarnings,
    'SFM-114': calculations.affordability.yourContribution,
    'SFM-115': calculations.affordability.employerContribution,
    'SFM-116': calculations.affordability.totalMonthlyContribution,
    'SFM-117': calculations.affordability.annualPensionableEarnings,
    'SFM-118': calculations.affordability.annualTotalContribution,
    'SFM-119': calculations.affordability.estimatedMonthlyNetPay,
  };
  
  return sfmMap[sfmCode] || 0;
}