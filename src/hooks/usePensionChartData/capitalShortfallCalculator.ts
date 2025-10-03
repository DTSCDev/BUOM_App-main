
import { getPensionParameters } from "@/utils/pensionParameters";

export function calculateCapitalShortfall(
  currentAge: number,
  targetIncomeToday: number,
  existingPensionValue: number,
  annualSalary: number,
  params: ReturnType<typeof getPensionParameters>
): number {
  const retirementAge = params.retirementAge;
  const yearsToRetirement = retirementAge - currentAge;
  const statePensionAnnual = params.statePensionWeekly * 52;
  
  // Calculate AE contribution details
  const aeTotalRate = params.autoEnrollmentEmployeeRate + params.autoEnrollmentEmployerRate;
  const aePensionablePay = annualSalary * params.autoEnrollmentPensionablePayRate;
  const aeAnnualContribution = aePensionablePay * aeTotalRate;
  
  console.log(`AE annual contribution: £${aeAnnualContribution.toLocaleString()}`);
  console.log(`State pension annual: £${statePensionAnnual.toLocaleString()}`);
  
  const initialInflatedTargetIncome = targetIncomeToday * Math.pow(1 + params.pensionIncomeInflation, yearsToRetirement);
  const initialTargetCapitalRequired = initialInflatedTargetIncome / params.drawdownRate;
  const netGrowthRate = params.growthRateAccumulation - params.providerCharges;
  const initialGrownExistingValue = existingPensionValue * Math.pow(1 + netGrowthRate, yearsToRetirement);
  
  let initialTotalContributionValue = 0;
  for (let contributionYear = 0; contributionYear < yearsToRetirement; contributionYear++) {
    const inflatedContribution = aeAnnualContribution * Math.pow(1 + params.salaryInflation, contributionYear);
    const yearsOfGrowth = yearsToRetirement - contributionYear - 1;
    const grownContribution = inflatedContribution * Math.pow(1 + netGrowthRate, yearsOfGrowth);
    initialTotalContributionValue += grownContribution;
  }
  
  const initialStatePensionCapitalValue = (statePensionAnnual * Math.pow(1 + params.pensionIncomeInflation, yearsToRetirement)) / params.drawdownRate;
  
  return Math.max(0, initialTargetCapitalRequired - initialGrownExistingValue - initialTotalContributionValue - initialStatePensionCapitalValue);
}
