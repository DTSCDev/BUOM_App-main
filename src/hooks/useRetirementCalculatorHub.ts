import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { getPensionParameters } from '@/utils/pensionParameters';
import { calculateTotalAEContributions } from '@/utils/pension/aeContributionCalculations';
import { compoundingCore } from '@/utils/pension/compoundingCore';
// Local PMT helper: escalating monthly payment with effective monthly rates
function calculateEscalatingPMT(
  targetAmount: number,
  totalMonths: number,
  monthlyGrowthRate: number,
  annualEscalationRate: number
): number {
  if (totalMonths <= 0 || targetAmount <= 0) return 0;
  const monthlyEscalationRate = Math.pow(1 + annualEscalationRate, 1/12) - 1;
  const effectiveRate = monthlyGrowthRate - monthlyEscalationRate;
  if (Math.abs(effectiveRate) < 1e-9) {
    return targetAmount / totalMonths;
  }
  const numerator = targetAmount * effectiveRate;
  const denominator = Math.pow(1 + monthlyGrowthRate, totalMonths) - Math.pow(1 + monthlyEscalationRate, totalMonths);
  return numerator / denominator;
}
import { calculateDaysUntilPension } from '@/utils/pensionCalculations';
import { calculateRemainingPayDays } from '@/utils/pensionCalculations';
import { calculateAge as calcAgeYears } from '@/utils/pensionCalculations';
import { calculateYearsUntilPension } from '@/utils/pensionCalculations';

// Centralized Retirement Calculator Hub hook exposing CAL-4XXX values
// This replaces ad-hoc hooks like myBOUMRetirementCalculations and ensures
// APF components and retirement calculator page read the same regulated outputs.

export interface RetirementCalculatorValues {
  // Timeline
  cal4106_targetIncomeToday: number; // SFM-CAL-4106
  cal4107_targetIncomeAtRetirement: number; // SFM-CAL-4107
  cal4108_statePensionToday: number; // SFM-CAL-4108
  cal4109_statePensionAtRetirement: number; // SFM-CAL-4109
  cal4110_currentAge: number; // SFM-CAL-4110
  cal4111_timeToRetirementYears: number; // SFM-CAL-4111
  cal4112_daysUntilPension: number; // SFM-CAL-4112
  cal4113_paydaysRemaining: number; // SFM-CAL-4113

  // Projection analysis
  cal4114_estimatedHistoricalContributions: number;
  cal4115_estimatedExistingPensionFundValue: number;
  cal4116_futureGrowthOnExistingFundValue: number;
  cal4117_futureAEContributions: number;
  cal4118_futureAEContributionsGrowth: number;
  cal4119_totalProjectedPensionValue: number;
  cal4120_requiredCapital: number;
  cal4121_capitalShortfall: number;
  cal4126_existingFundValueAtRetirement: number;
  cal4127_existingPlanFutureContributions: number;
  cal4128_existingPlanMonthlyTopUpYear1: number;

  // Income equivalents
  cal4132_existingPlanProjectedIncome: number; // (totalProjected × drawdown) + statePensionAtRetirement

  // Convenience values used elsewhere
  prf2021_annualSalary: number;
}

export function useRetirementCalculatorHub(): RetirementCalculatorValues {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  const params = getPensionParameters();

  return useMemo(() => {
    // Profile inputs
    const annualSalary = profile?.annual_salary || 0; // PRF-2021
    const retirementAge = profile?.retirement_age || params.retirementAge;

    // Age calculations
    const currentAgeYears = profile?.date_of_birth
      ? calcAgeYears(new Date(profile.date_of_birth)).years
      : 0;
    const yearsToRetirement = Math.max(0, (retirementAge || params.retirementAge) - currentAgeYears);

    // Timeline values
    const targetIncomeToday = annualSalary * params.pensionIncomeTarget; // 50% default target
    const targetIncomeAtRetirement = targetIncomeToday * Math.pow(1 + params.pensionIncomeInflation, yearsToRetirement);
    const statePensionToday = params.statePensionWeekly * 52;
    const statePensionAtRetirement = statePensionToday * Math.pow(1 + params.pensionIncomeInflation, yearsToRetirement);

    // Days/months to retirement
    const daysUntilPension = profile?.date_of_birth
      ? calculateDaysUntilPension(new Date(profile.date_of_birth), retirementAge)
      : Math.round(yearsToRetirement * 365.25);
    const paydaysRemaining = profile?.date_of_birth
      ? (() => {
          const { years, months } = calculateYearsUntilPension(new Date(profile.date_of_birth));
          return Math.max(0, (years * 12) + months);
        })()
      : yearsToRetirement * 12;

    // Existing pension assets from NAV
    const existingPensionValue = (assets || [])
      .filter(a => (a.category?.name?.toLowerCase().includes('pension') || a.name?.toLowerCase().includes('pension')))
      .reduce((sum, a) => sum + (a.value || 0), 0);

    // AE contributions breakdown
    const aeTotals = calculateTotalAEContributions(annualSalary, currentAgeYears || 0, yearsToRetirement);
    const historicalContributions = aeTotals.historicalContributions || 0; // CAL-4114
    const futureAEContributions = aeTotals.futureContributions || 0; // CAL-4117

    // Growth assumptions (MONTHLY compounding at net monthly rate)
    const monthsToRetirement = yearsToRetirement * 12;
    const existingFundValueAtRetirement = compoundingCore.compoundMonthly(existingPensionValue, monthsToRetirement); // CAL-4126
    const existingPlanFutureContributions = aeTotals.futureValue || 0; // Use precise escalating monthly contributions future value (CAL-4127)
    const futureGrowthOnExistingFundValue = Math.max(0, existingFundValueAtRetirement - existingPensionValue); // CAL-4116

    // Total projected pension value at retirement
    const totalProjectedPensionValue = existingFundValueAtRetirement + existingPlanFutureContributions; // CAL-4119

    // Required capital and shortfall
    const netIncomeRequired = Math.max(0, targetIncomeAtRetirement - statePensionAtRetirement);
    const requiredCapital = netIncomeRequired / params.drawdownRate; // CAL-4120
    const capitalShortfall = Math.max(0, requiredCapital - totalProjectedPensionValue); // CAL-4121

    // Monthly top-up (Year 1) using PMT with effective monthly rates and salary inflation
    const monthsUntilRetirement = yearsToRetirement * 12;
    let monthlyTopUpYear1 =
      (capitalShortfall > 0 && yearsToRetirement > 0)
        ? calculateEscalatingPMT(
            capitalShortfall,
            monthsUntilRetirement,
            compoundingCore.netMonthlyGrowthRate,
            params.salaryInflation
          )
        : 0;
    // Guard against invalid PMT outputs
    if (!Number.isFinite(monthlyTopUpYear1) || monthlyTopUpYear1 < 0) {
      monthlyTopUpYear1 = 0;
    }

    // CAL-4128: Estimated Shortfall Target at Retirement
    // Per specification: 4128 = Top Up Monthly Contribution in Year 1 + (CAL-4402) + CAL-4401 - CAL-4403
    // Implemented as an effective one-step adjustment to the Year-1 PMT using these annual parameters.
    const effectiveAnnualAdjustment = (params.salaryInflation + params.growthRateAccumulation - params.providerCharges);
    const existingPlanMonthlyTopUpYear1 = monthlyTopUpYear1 * (1 + effectiveAnnualAdjustment);

    // Income equivalent
    const existingPlanProjectedIncome = (totalProjectedPensionValue * params.drawdownRate) + statePensionAtRetirement; // CAL-4132

    return {
      // Timeline
      cal4106_targetIncomeToday: targetIncomeToday,
      cal4107_targetIncomeAtRetirement: targetIncomeAtRetirement,
      cal4108_statePensionToday: statePensionToday,
      cal4109_statePensionAtRetirement: statePensionAtRetirement,
      cal4110_currentAge: currentAgeYears,
      cal4111_timeToRetirementYears: yearsToRetirement,
      cal4112_daysUntilPension: daysUntilPension,
      cal4113_paydaysRemaining: paydaysRemaining,

      // Projection analysis
      cal4114_estimatedHistoricalContributions: historicalContributions,
      cal4115_estimatedExistingPensionFundValue: existingPensionValue,
      cal4116_futureGrowthOnExistingFundValue: futureGrowthOnExistingFundValue,
      cal4117_futureAEContributions: futureAEContributions,
      cal4118_futureAEContributionsGrowth: Math.max(0, (existingPlanFutureContributions - futureAEContributions)),
      cal4119_totalProjectedPensionValue: totalProjectedPensionValue,
      cal4120_requiredCapital: requiredCapital,
      cal4121_capitalShortfall: capitalShortfall,
      cal4126_existingFundValueAtRetirement: existingFundValueAtRetirement,
      cal4127_existingPlanFutureContributions: existingPlanFutureContributions,
      cal4128_existingPlanMonthlyTopUpYear1: existingPlanMonthlyTopUpYear1,

      // Income equivalents
      cal4132_existingPlanProjectedIncome: existingPlanProjectedIncome,

      // Convenience
      prf2021_annualSalary: annualSalary,
    };
  }, [profile, assets]);
}