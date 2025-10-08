import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { getPensionParameters } from '@/utils/pensionParameters';
import { calculateTotalAEContributions, calculateMonthlyHistoricalAEContributions } from '@/utils/pension/aeContributionCalculations';
import { compoundingCore } from '@/utils/pension/compoundingCore';
// Top-up PMT formula
import { calculateEscalatingPMT } from '@/utils/pension/pensionShortfallCalculations';
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
  // Exact PMT rounded to 50p for audit/identification
  cal4128_monthlyTopUpYear1Actual50p: number;
  cal4122_topUpContributionsPaid: number;
  cal4123_topUpInvestmentGrowth: number;
  cal4124_topUpTotalFundValue: number;

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
    // APF-1003 / CAL-4113: Paydays Remaining should align to retirement age, not SPA
    const paydaysRemaining = yearsToRetirement * 12;

    // Existing pension assets from NAV
    const existingPensionValue = (assets || [])
      .filter(a => (a.category?.name?.toLowerCase().includes('pension') || a.name?.toLowerCase().includes('pension')))
      .reduce((sum, a) => sum + (a.value || 0), 0);

    // AE contributions breakdown
    const aeTotals = calculateTotalAEContributions(annualSalary, currentAgeYears || 0, yearsToRetirement);
    // Recompute CAL-4114 using strict monthly payday method with 50p rounding
    const historicalContributions = calculateMonthlyHistoricalAEContributions(annualSalary, currentAgeYears || 0);
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

    // CAL-4128: Monthly top-up cost (Year 1) using PMT formula with escalation
    const monthlyRate = compoundingCore.netMonthlyGrowthRate;
    const escalationRate = compoundingCore.params.salaryInflation;
    const monthlyTopUpPMTRaw = (capitalShortfall > 0 && yearsToRetirement > 0)
      ? calculateEscalatingPMT(
          capitalShortfall,
          yearsToRetirement * 12,
          monthlyRate,
          escalationRate
        )
      : 0;
    // Exact amount rounded to nearest 50p for calculations and audit
    const monthlyTopUpPMT50p = Math.round(monthlyTopUpPMTRaw * 2) / 2;
    // Display value rounded to nearest pound (up or down)
    const monthlyTopUpPMTRounded = Math.round(monthlyTopUpPMTRaw);

    // Compute top-up totals using the 50p-precision PMT as contribution
    const { totalContributions: totalTopUpContributions, futureValue: totalTopUpValue } =
      (capitalShortfall > 0 && yearsToRetirement > 0)
        ? compoundingCore.escalatingMonthlyContributions(monthlyTopUpPMT50p, monthsToRetirement)
        : { totalContributions: 0, futureValue: 0 };
    const topUpInvestmentGrowth = Math.max(0, totalTopUpValue - totalTopUpContributions);

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
      // CAL-4128: Existing Plan Monthly Top Up (Year 1) via PMT (nearest pound)
      cal4128_existingPlanMonthlyTopUpYear1: monthlyTopUpPMTRounded,
      // Exact PMT used for totals (rounded to 50p)
      cal4128_monthlyTopUpYear1Actual50p: monthlyTopUpPMT50p,
      // CAL-4122: Total Future AE Contributions with Inflation until retirement
      cal4122_topUpContributionsPaid: futureAEContributions,
      cal4123_topUpInvestmentGrowth: topUpInvestmentGrowth,
      cal4124_topUpTotalFundValue: totalTopUpValue,

      // Income equivalents
      cal4132_existingPlanProjectedIncome: existingPlanProjectedIncome,

      // Convenience
      prf2021_annualSalary: annualSalary,
    };
  }, [profile, assets]);
}