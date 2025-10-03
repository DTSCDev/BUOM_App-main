
import { BUOMCalculationResult } from "@/utils/pension/buomTypes";
import { formatCurrency } from "@/utils/formatUtils";

interface UserProfile {
  age: number;
  salary: number;
  targetIncome: number;
  existingPension: number;
}

export const generateBUOMReportContent = (
  calculationResult: BUOMCalculationResult,
  userProfile: UserProfile
): string => {
  const { 
    apfSponsorships, 
    totalAPFFunding,
    totalMaturityValue,
    totalISARequired,
    currentCapitalShortfall,
    projectedShortfallEliminated,
    // Use fallbacks for optional properties
    payslipComparison,
    totalAPFSponsorship = totalAPFFunding,
    totalAPFMaturityValue = totalMaturityValue,
    totalISAMonthlyRequired = totalISARequired / 12,
    capitalShortfall = currentCapitalShortfall,
    meetsShortfall = projectedShortfallEliminated,
    proposedAPFFunding = totalAPFFunding,
    proposedISAMonthlyValue = totalISARequired / 12
  } = calculationResult;
  
  return `
BEST USE OF MONEY - ADVANCED PENSION FUNDING PROPOSAL
Professional Financial Planning Report

═══════════════════════════════════════════════════════════════════

CLIENT PROFILE
═══════════════════════════════════════════════════════════════════

Client Age:                    ${userProfile.age} years
Annual Salary:                 ${formatCurrency(userProfile.salary)}
Target Retirement Income:       ${formatCurrency(userProfile.targetIncome)}
Existing Pension Value:         ${formatCurrency(userProfile.existingPension)}
Retirement Age:                67 years

UNMET NEED ANALYSIS - VALUE 6 METHODOLOGY
═══════════════════════════════════════════════════════════════════

CAPITAL SHORTFALL IDENTIFIED:  ${formatCurrency(capitalShortfall)}

This represents the lump sum required at retirement to generate your target income 
of ${formatCurrency(userProfile.targetIncome)} annually, after considering:
- State pension provision: ${formatCurrency(11502)} annually
- Existing pension projections: ${formatCurrency(userProfile.existingPension)}
- 3.5% sustainable drawdown rate
- 25% tax-free cash entitlement

Without additional funding, you will experience a significant retirement income shortfall.

PROPOSED BUOM SOLUTION SUMMARY
═══════════════════════════════════════════════════════════════════

Proposed APF Funding Required:    ${formatCurrency(proposedAPFFunding)}
Proposed ISA Monthly Value:       ${formatCurrency(proposedISAMonthlyValue)}

Capital Shortfall Analysis:
- Shortfall ÷ 1.582 = APF Funding: ${formatCurrency(capitalShortfall)} ÷ 1.582 = ${formatCurrency(proposedAPFFunding)}
- (Shortfall ÷ £100k) × £150 = ISA Monthly: (${formatCurrency(capitalShortfall)} ÷ £100,000) × £150 = ${formatCurrency(proposedISAMonthlyValue)}

DISCRETE TRANCHE METHODOLOGY - NO 5-YEAR LIMIT
═══════════════════════════════════════════════════════════════════

Our Advanced Pension Funding (APF) solution uses discrete sponsorship tranches,
each creating a specific ISA savings requirement using the "No Worse Off" principle.
Sponsorships continue until the capital shortfall is fully funded.

${apfSponsorships.map((sponsorship, index) => `
SPONSORSHIP YEAR ${sponsorship.year}
───────────────────────────────────────────────────────────────────
Tax Year:                      ${sponsorship.taxYear}
Client Age at Sponsorship:     ${sponsorship.age} years
APF Sponsorship Amount:        ${formatCurrency(sponsorship.sponsorshipAmount)}
APF Maturity Value (21 years): ${formatCurrency(sponsorship.maturityValue)}
APF Maturity Age:             ${sponsorship.maturityAge} years
Discrete ISA Monthly Target:   ${formatCurrency(sponsorship.isaMonthlyRequired)}
Discrete ISA Annual Target:    ${formatCurrency(sponsorship.isaAnnualRequired)}
ISA Duration:                 21 years (stops at APF maturity)
`).join('\n')}

FUNDING SUMMARY
═══════════════════════════════════════════════════════════════════

Total APF Sponsorship Required:    ${formatCurrency(totalAPFSponsorship)}
Total APF Maturity Value:          ${formatCurrency(totalAPFMaturityValue)}
Combined Monthly ISA Target:       ${formatCurrency(totalISAMonthlyRequired)}
Combined Annual ISA Target:        ${formatCurrency(totalISAMonthlyRequired * 12)}

Capital Shortfall:                 ${formatCurrency(capitalShortfall)}
Plan Funding Capacity:             ${formatCurrency(totalAPFMaturityValue)}
Shortfall Status:                  ${meetsShortfall ? 'FULLY FUNDED ✓' : 'REQUIRES ADDITIONAL FUNDING'}

APF MATURITY TIMING - CRITICAL UNDERSTANDING
═══════════════════════════════════════════════════════════════════

IMPORTANT: APF assets accrue value through 4-stage pricing but do NOT reduce 
the capital shortfall until they mature at 21 years. The shortfall remains 
constant (with inflation adjustment) until APF maturities occur.

At APF maturity:
- APF asset becomes fully owned (loan repaid by ISA funds)
- Capital shortfall reduces by the maturity value
- Corresponding ISA tranche stops accumulating

This ensures accurate modeling of the loan-based APF structure.

NET PAY IMPACT ANALYSIS - "NO WORSE OFF" PRINCIPLE
═══════════════════════════════════════════════════════════════════

Current Payslip (With Auto Enrollment):
───────────────────────────────────────────────────────────────────
Monthly Gross Pay:             ${formatCurrency(payslipComparison.beforeAPF.grossPay)}
Less: Income Tax:              ${formatCurrency(payslipComparison.beforeAPF.incomeTax)}
Less: National Insurance:      ${formatCurrency(payslipComparison.beforeAPF.nationalInsurance)}
Less: Pension Contribution:    ${formatCurrency(payslipComparison.beforeAPF.pensionContribution)}
───────────────────────────────────────────────────────────────────
NET PAY:                       ${formatCurrency(payslipComparison.beforeAPF.netPay)}

Proposed Payslip (During APF Years - No Auto Enrollment):
───────────────────────────────────────────────────────────────────
Monthly Gross Pay:             ${formatCurrency(payslipComparison.duringAPF.grossPay)}
Less: Income Tax:              ${formatCurrency(payslipComparison.duringAPF.incomeTax)}
Less: National Insurance:      ${formatCurrency(payslipComparison.duringAPF.nationalInsurance)}
Less: Pension Contribution:    ${formatCurrency(payslipComparison.duringAPF.pensionContribution)}
───────────────────────────────────────────────────────────────────
NET PAY:                       ${formatCurrency(payslipComparison.duringAPF.netPay)}

NET PAY IMPROVEMENT ANALYSIS:
───────────────────────────────────────────────────────────────────
Monthly Net Pay Increase:       ${formatCurrency(payslipComparison.difference.netPayIncrease)}
Available for Enhanced ISA:    ${formatCurrency(payslipComparison.difference.availableForISA)}
Combined Enhanced Capacity:    ${formatCurrency(payslipComparison.difference.availableForISA + totalISAMonthlyRequired)}

CHART VISUALIZATION EXPLANATION
═══════════════════════════════════════════════════════════════════

The accompanying chart shows:
- Grey Dashed Line: Capital shortfall remaining flat until APF maturities reduce it
- Gold Bars: APF asset values building through 4-stage pricing (but not reducing shortfall)
- Blue Bars: ISA values accumulating then stopping when corresponding APF matures
- Combined Effect: Demonstrates the timing of shortfall elimination at APF maturity

This visualization correctly models APF as loans that don't reduce shortfall 
until maturity, with discrete ISA tranches for repayment.

KEY BENEFITS SUMMARY
═══════════════════════════════════════════════════════════════════

✓ ELIMINATES CAPITAL SHORTFALL: ${formatCurrency(capitalShortfall)}
✓ NO ADVERSE IMPACT ON CURRENT NET PAY
✓ ENHANCED NET PAY DURING APF YEARS: +${formatCurrency(payslipComparison.difference.netPayIncrease)}/month
✓ GUARANTEED MATURITY VALUES WITH 4-STAGE PRICING PROTECTION
✓ TAX-EFFICIENT FUNDING USING UNLIMITED CARRY FORWARD ALLOWANCES
✓ SELF-FUNDING ISA REPAYMENT METHODOLOGY
✓ DISCRETE TRANCHE APPROACH FOR MAXIMUM FLEXIBILITY
✓ ACCURATE SHORTFALL MODELING UNTIL APF MATURITY

REGULATORY COMPLIANCE
═══════════════════════════════════════════════════════════════════

This proposal complies with:
- Financial Services and Markets Act (FSMA) regulations
- Conduct of Business Sourcebook (COBS) requirements
- Pension Scheme Management (PSM) standards
- HM Revenue & Customs pension allowance rules

NEXT STEPS
═══════════════════════════════════════════════════════════════════

1. Review and approve this BUOM funding strategy
2. Complete APF sponsorship applications using unlimited carry forward
3. Establish discrete ISA savings tranches
4. Suspend Auto Enrollment during APF active years
5. Implement annual strategy reviews and optimization

═══════════════════════════════════════════════════════════════════
Professional Report Generated: ${new Date().toLocaleDateString('en-GB')}
BUOM - Best Use Of Money Advanced Pension Funding
Tel: 0333 321 3435 | Email: info@buom.co.uk
Authorized and Regulated by the Financial Conduct Authority
═══════════════════════════════════════════════════════════════════
    `;
};
