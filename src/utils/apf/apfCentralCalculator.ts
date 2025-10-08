import { calculateUKTax } from "@/utils/pension/taxCalculations";

export interface Stage2SummaryInputs {
  cal4121_capitalShortfall: number; // CAL-4121
  prf2021_annualSalary: number; // Annual salary from profile
  sponsorshipAmounts: number[]; // Annual APF contributions per year
}

export interface Stage2SummaryOutputs {
  apf1201_totalInitialFunding: number; // APF-1201
  apf1202_totalMaturityValue: number; // APF-1202
  apf1203_totalINBLPrincipal: number; // APF-1203
}

// Central APF calculator for Stage 2 (page-based SFM codes)
// - APF-1202 comes directly from CAL-4121 (capital shortfall)
// - APF-1201 = APF-1202 / 1.582
// - APF-1203 aggregates INBL principal across sponsorship years
//   using Net Pay Guarantee (NPG) + NRSR fee (25% of NPG)
export function computeStage2Summary(
  inputs: Stage2SummaryInputs
): Stage2SummaryOutputs {
  const { cal4121_capitalShortfall, prf2021_annualSalary, sponsorshipAmounts } = inputs;

  // APF-1202: Total Maturity Value (Proposed Funding)
  const apf1202_totalMaturityValue = Math.max(0, cal4121_capitalShortfall);

  // APF-1201: Total Initial Funding
  const apf1201_totalInitialFunding = apf1202_totalMaturityValue / 1.582;

  // APF-1203: Total INBL Principal across all sponsorship years
  const monthlySalary = (prf2021_annualSalary || 0) / 12;
  const apf1203_totalINBLPrincipal = (sponsorshipAmounts || []).reduce((sum, annualContribution) => {
    const monthlyAPFContribution = annualContribution / 12;
    const beforeAPF = calculateUKTax(monthlySalary);
    const grossAfterAPF = monthlySalary - monthlyAPFContribution;
    const afterAPFBase = calculateUKTax(grossAfterAPF);
    const netPayDifference = beforeAPF.netPay - afterAPFBase.netPay; // monthly NPG
    const npgAmount = netPayDifference;
    const nrsrFee = npgAmount * 0.25; // 25% of NPG
    const totalINBLMonthly = npgAmount + nrsrFee; // monthly principal for this year
    return sum + (totalINBLMonthly * 12);
  }, 0);

  return {
    apf1201_totalInitialFunding,
    apf1202_totalMaturityValue,
    apf1203_totalINBLPrincipal,
  };
}