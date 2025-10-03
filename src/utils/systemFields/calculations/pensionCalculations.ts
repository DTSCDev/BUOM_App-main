
import { calculateUnifiedPensionMetrics } from '@/utils/pension/unifiedCalculationEngine';
import { compoundingCore } from '@/utils/pension/compoundingCore';
import { calculateExistingPensionValue } from '@/utils/pension/existingPensionCalculations';
import { calculateDynamicAEContributions, calculateTotalAEContributions } from '@/utils/pension/aeContributionCalculations';
import { getPensionParameters } from '@/utils/pensionParameters';
import { SFMCalculationContext } from '../types';

export function calculatePensionValues(sfmId: string, context: SFMCalculationContext, resolver: (id: string) => number): number {
  const { profile, currentAge, existingPensionValue } = context;
  const annualSalary = profile?.annual_salary || 0;
  const params = getPensionParameters();

  switch (sfmId) {
    case "SFM-003C": { // FIXED: Estimated Historical Contributions (from age 21) - CORRECTED METHODOLOGY
      const yearsUntilRetirement = Math.max(0, 67 - currentAge);
      const { historicalContributions } = calculateTotalAEContributions(annualSalary, currentAge, yearsUntilRetirement);
      console.log(`🔧 SFM-003C: Using CORRECTED calculation for age ${currentAge}: £${historicalContributions.toLocaleString()}`);
      return Math.round(historicalContributions);
    }

    case "SFM-003V": { // FIXED: Use actual Net Asset Value data instead of calculated estimate
      // Use the existingPensionValue from context which is calculated from actual Net Asset Value data
      console.log(`🔧 SFM-003V: Using ACTUAL Net Asset Value data: £${existingPensionValue.toLocaleString()}`);
      return Math.round(existingPensionValue);
    }

    case "SFM-003G": { // Future Growth on Existing Fund Value
      const yearsToRetirement = Math.max(0, 67 - currentAge);
      const monthsToRetirement = yearsToRetirement * 12;
      const grownValue = compoundingCore.compoundMonthly(existingPensionValue, monthsToRetirement, false);
      const growthValue = grownValue - existingPensionValue;
      return Math.round(growthValue);
    }

    case "SFM-005": { // Current Projection Amount (Total Projected Pension at Retirement)
      const existingValue = resolver('SFM-003V');
      const existingGrowth = resolver('SFM-003G');
      const futureAEContribs = resolver('SFM-008C');
      const futureAEGrowth = resolver('SFM-008G');
      return Math.round(existingValue + existingGrowth + futureAEContribs + futureAEGrowth);
    }

    // Remove these incorrect implementations:
    // case "SFM-006": // Required Capital assuming full State Pension (same as SFM-012)
    //   return resolver('SFM-012');
    
    // case "SFM-007": { // Shortfall Target (Capital Shortfall)
    //   const requiredCapital = resolver('SFM-012');
    //   const currentProjection = resolver('SFM-005');
    //   return Math.max(0, requiredCapital - currentProjection);
    // }
    
    // SFM-006 and SFM-007 should be input fields, not calculated values
    // They should be handled by the form inputs, not by calculations

    case "SFM-008C": { // Future AE Contributions (Total Contributions)
      const yearsLeft = Math.max(0, 67 - currentAge);
      const { totalContributions: aeContributions } = calculateDynamicAEContributions(annualSalary, yearsLeft);
      return Math.round(aeContributions);
    }

    case "SFM-008G": { // Future AE Contributions Growth
      const yearsLeftForGrowth = Math.max(0, 67 - currentAge);
      const { totalFutureValue: aeFutureValue, totalContributions: aeContributionsForGrowth } = calculateDynamicAEContributions(annualSalary, yearsLeftForGrowth);
      const aeGrowth = aeFutureValue - aeContributionsForGrowth;
      return Math.round(aeGrowth);
    }

    case "SFM-009": { // Current Projection - Projected pension pot at retirement
      const existingValue = resolver('SFM-003V');
      const existingGrowth = resolver('SFM-003G');
      const futureAEContribs = resolver('SFM-008C');
      const futureAEGrowth = resolver('SFM-008G');
      return Math.round(existingValue + existingGrowth + futureAEContribs + futureAEGrowth);
    }

    case "SFM-010": { // Required Capital assuming full State Pension
      // Calculate Target Income at Retirement (inflated target income)
      const targetIncomeToday = resolver('SFM-013');
      const yearsToInflate = Math.max(0, 67 - currentAge);
      const targetIncomeAtRetirement = compoundingCore.applyAnnualInflation(targetIncomeToday, yearsToInflate, 'salary');
      
      // Calculate State Pension at Retirement (inflated)
      const statePensionToday = resolver('SFM-011');
      const statePensionAtRetirement = compoundingCore.applyAnnualInflation(statePensionToday, yearsToInflate, 'pension');
      
      // Required Capital = (Target Income at Retirement - State Pension at Retirement) / Drawdown Rate
      const netIncomeRequired = Math.max(0, targetIncomeAtRetirement - statePensionAtRetirement);
      return Math.round(netIncomeRequired / params.drawdownRate);
    }

    case "SFM-011": { // State Pension Today
      const currentStatePension = compoundingCore.getCurrentStatePension() * 52;
      return Math.round(currentStatePension);
    }

    case "SFM-012": { // Target Income at Retirement (moved from SFM-010)
      const targetIncomeToday = resolver('SFM-013');
      const yearsToInflate = Math.max(0, 67 - currentAge);
      return Math.round(compoundingCore.applyAnnualInflation(targetIncomeToday, yearsToInflate, 'salary'));
    }

    case "SFM-013": { // Target Income Today - 50% of current annual salary
      return Math.round(annualSalary * params.pensionIncomeTarget);
    }

    case "SFM-014": { // Net Pay Monthly
      const grossMonthly = annualSalary / 12;
      const taxableIncome = Math.max(0, grossMonthly - (compoundingCore.params.personalAllowance / 12));
      const basicRateTax = Math.min(taxableIncome, (compoundingCore.params.basicRateBand / 12)) * compoundingCore.params.basicRateIncomeTax;
      const higherRateTax = Math.max(0, taxableIncome - (compoundingCore.params.basicRateBand / 12)) * compoundingCore.params.higherRateIncomeTax;
      const totalTax = basicRateTax + higherRateTax;
      
      const niThreshold = compoundingCore.params.niPrimaryThreshold;
      const nationalInsurance = Math.max(0, grossMonthly - niThreshold) * compoundingCore.params.niBasicRate;
      
      const netPay = grossMonthly - totalTax - nationalInsurance;
      return Math.round(netPay);
    }

    case "SFM-015": { // State Pension at Retirement (Inflated)
      const statePensionToday = resolver('SFM-011');
      const yearsUntilRetirementForStatePension = Math.max(0, 67 - currentAge);
      return Math.round(compoundingCore.applyAnnualInflation(statePensionToday, yearsUntilRetirementForStatePension, 'pension'));
    }

    case "SFM-020-1": { // Top Up Contributions Paid (300 paydays)
      const monthlyTopUp = resolver('SFM-115');
      return Math.round(monthlyTopUp * 300);
    }

    case "SFM-020-2": { // Top Up Investment Growth
      const shortfallTarget = resolver('SFM-007');
      const contributionsPaid = resolver('SFM-020-1');
      return Math.max(0, shortfallTarget - contributionsPaid);
    }

    case "SFM-022": // Drawdown Rate
      return params.drawdownRate;

    case "SFM-025": { // Base Current Age - returns paydays remaining
      const yearsToRetirementForPaydays = Math.max(0, 67 - currentAge);
      return yearsToRetirementForPaydays * 12;
    }

    case "SFM-025-1": // Current Age (formatted)
      return currentAge;

    case "SFM-025-2": // Time to Retirement (formatted)
      return Math.max(0, 67 - currentAge);

    case "SFM-025-3": { // Days Until Pension
      const yearsLeftForDays = Math.max(0, 67 - currentAge);
      return Math.round(yearsLeftForDays * 365.25);
    }

    case "SFM-026": { // Target Income at Retirement (calculator version)
      // SFM-026 should be the inflated target income at retirement, not today's income
      const revaluedTargetIncome = resolver('SFM-012'); // Target Income at Retirement (inflated)
      console.log(`🔧 SFM-026: Target Income at Retirement = SFM-012 = £${revaluedTargetIncome.toLocaleString()} (REVALUED)`);
      return Math.round(revaluedTargetIncome);
    }

    case "SFM-126": { // Dashboard Your Target Income (NEW: dashboard version)
      const dashboardTargetIncome = resolver('SFM-012'); // Target Income at Retirement (inflated)
      console.log(`🔧 SFM-126: Dashboard Target Income = SFM-012 = £${dashboardTargetIncome.toLocaleString()}`);
      return Math.round(dashboardTargetIncome);
    }

    case "SFM-027": { // Existing Plan Future Income (calculator version)
      // SFM-027 = (SFM-005 × SFM-022) + SFM-015 as specified by user
      const currentProjectionIncome = resolver('SFM-005'); // Total Projected Pension at Retirement
      const statePensionAtRetirement = resolver('SFM-015'); // State Pension at Retirement
      const drawdownRate = params.drawdownRate; // SFM-022
      
      // FIXED: Ensure we have valid values
      const validCurrentProjection = isNaN(currentProjectionIncome) ? 0 : currentProjectionIncome;
      const validStatePension = isNaN(statePensionAtRetirement) ? 0 : statePensionAtRetirement;
      const validDrawdownRate = isNaN(drawdownRate) ? 0.035 : drawdownRate;
      
      // Calculate: (SFM-005 × SFM-022) + SFM-015
      const pensionIncome = validCurrentProjection * validDrawdownRate;
      const totalExistingPlanIncome = pensionIncome + validStatePension;
      
      console.log(`🔧 SFM-027: Existing Plan Income = (£${validCurrentProjection.toLocaleString()} × ${validDrawdownRate}) + £${validStatePension.toLocaleString()} = £${Math.round(totalExistingPlanIncome).toLocaleString()}`);
      
      return isNaN(totalExistingPlanIncome) ? 0 : Math.round(totalExistingPlanIncome);
    }

    case "SFM-127": { // Dashboard Existing Plan Future Income (NEW: dashboard version)
      const dashboardCurrentProjection = resolver('SFM-005'); // Total Projected Pension at Retirement
      const dashboardStatePension = resolver('SFM-015'); // State Pension at Retirement
      const dashboardDrawdownRate = params.drawdownRate; // SFM-022
      
      const validDashboardProjection = isNaN(dashboardCurrentProjection) ? 0 : dashboardCurrentProjection;
      const validDashboardStatePension = isNaN(dashboardStatePension) ? 0 : dashboardStatePension;
      const validDashboardDrawdownRateValue = isNaN(dashboardDrawdownRate) ? 0.035 : dashboardDrawdownRate;
      
      const dashboardPensionIncome = validDashboardProjection * validDashboardDrawdownRateValue;
      const dashboardTotalExistingPlanIncome = dashboardPensionIncome + validDashboardStatePension;
      
      console.log(`🔧 SFM-127: Dashboard Existing Plan Income = (£${validDashboardProjection.toLocaleString()} × ${validDashboardDrawdownRateValue}) + £${validDashboardStatePension.toLocaleString()} = £${Math.round(dashboardTotalExistingPlanIncome).toLocaleString()}`);
      
      return isNaN(dashboardTotalExistingPlanIncome) ? 0 : Math.round(dashboardTotalExistingPlanIncome);
    }

    case "SFM-033": { // Effective Growth Rate
      const investmentGrowth = resolver('SFM-020-2');
      const totalContributionsPaid = resolver('SFM-020-1');
      if (totalContributionsPaid === 0) return 0;
      return Math.round((investmentGrowth / totalContributionsPaid) * 100 * 10) / 10;
    }

    case "SFM-037": // Capital Shortfall (same as SFM-007)
      return resolver('SFM-007');

    case "SFM-042": // Required Capital for Target Income (same as SFM-010)
      return resolver('SFM-010');

    case "SFM-115": { // Monthly Funding Cost (Top-up contribution)
      const shortfall = resolver('SFM-037');
      const yearsLeftFunding = Math.max(0, 67 - currentAge);
      const monthsLeftFunding = yearsLeftFunding * 12;
      
      if (monthsLeftFunding <= 0 || shortfall <= 0) return 0;
      
      // Calculate monthly contribution needed to reach shortfall with compound growth
      const monthlyGrowthRate = compoundingCore.netMonthlyGrowthRate;
      const futureValueFactor = ((Math.pow(1 + monthlyGrowthRate, monthsLeftFunding) - 1) / monthlyGrowthRate);
      const monthlyContribution = shortfall / futureValueFactor;
      
      return Math.round(monthlyContribution);
    }

    default:
      console.warn(`Unknown pension SFM ID: ${sfmId}`);
      return 0;
  }
}
