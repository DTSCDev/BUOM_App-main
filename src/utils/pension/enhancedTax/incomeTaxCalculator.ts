
import { TAX_THRESHOLDS } from './taxThresholds';
import { parsePAYETaxCode } from './taxCodeParser';

export function calculateIncomeTax(
  grossAnnual: number, 
  pensionContribution: number, 
  payeTaxCode: string
): number {
  const { personalAllowance, specialCode } = parsePAYETaxCode(payeTaxCode);
  const taxableIncome = Math.max(0, grossAnnual - (pensionContribution * 12) - personalAllowance);

  // Handle special codes
  if (specialCode === 'BR') {
    return taxableIncome * TAX_THRESHOLDS.basicRate;
  }
  if (specialCode === 'D0') {
    return taxableIncome * TAX_THRESHOLDS.higherRate;
  }
  if (specialCode === 'D1') {
    return taxableIncome * TAX_THRESHOLDS.additionalRate;
  }
  if (specialCode === 'NT') {
    return 0;
  }

  // Standard progressive calculation
  let tax = 0;
  let remaining = taxableIncome;

  // Basic rate band
  const basicRateAmount = Math.min(remaining, TAX_THRESHOLDS.basicRateThreshold);
  tax += basicRateAmount * TAX_THRESHOLDS.basicRate;
  remaining -= basicRateAmount;

  if (remaining > 0) {
    // Higher rate band
    const higherRateLimit = TAX_THRESHOLDS.higherRateThreshold - TAX_THRESHOLDS.basicRateThreshold;
    const higherRateAmount = Math.min(remaining, higherRateLimit);
    tax += higherRateAmount * TAX_THRESHOLDS.higherRate;
    remaining -= higherRateAmount;

    if (remaining > 0) {
      // Additional rate band
      tax += remaining * TAX_THRESHOLDS.additionalRate;
    }
  }

  return tax;
}
