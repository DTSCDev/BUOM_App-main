
import { SFMCalculationContext } from '../types';
import { getPensionParameters } from '@/utils/pensionParameters';
import { compoundingCore } from '@/utils/pension/compoundingCore';

export function calculateSalaryValues(sfmId: string, context: SFMCalculationContext): number {
  const { profile, currentAge } = context;
  const annualSalary = profile?.annual_salary || 0;
  const params = getPensionParameters();

  switch (sfmId) {
    case "SFM-001": // Date of Birth Input
      // For SFM-001, return 0 since it should use the GOSPEL string value from SFM Audit
      return 0;

    case "SFM-002": // Annual Salary Input
      return annualSalary;

    case "SFM-023": // Current Salary (calculator version)
    case "SFM-123": // Dashboard Current Salary (NEW: dashboard version)
      return annualSalary;

    case "SFM-024": // Future Salary (calculator version)
    case "SFM-124": { // Dashboard Future Salary (NEW: dashboard version)
      const yearsToRetirement = Math.max(0, 67 - currentAge);
      return Math.round(compoundingCore.applyAnnualInflation(annualSalary, yearsToRetirement, 'salary'));
    }

    case "SFM-025": // Current Age (calculator version)
      return currentAge;

    case "SFM-125": { // Dashboard Pay Days Remaining (NEW: dashboard version)
      const yearsToRet = Math.max(0, 67 - currentAge);
      return Math.round(yearsToRet * 12); // Return months to retirement
    }

    case "SFM-124-OLD": { // Auto Enrollment Employee Contribution (Monthly) - RENAMED TO AVOID CONFLICT
      // Use profile's pension contribution if available, otherwise calculate default from parameters
      if (profile?.pension_contribution_employee) {
        // Use the actual employee contribution from profile
        const monthlyContribution = (annualSalary * (profile.pension_contribution_employee / 100)) / 12;
        console.log(`🔧 SFM-124-OLD: Using actual pension contribution from profile: ${profile.pension_contribution_employee}% = £${Math.round(monthlyContribution).toLocaleString()} monthly`);
        return Math.round(monthlyContribution);
      } else {
        // Calculate default monthly AE employee contribution using parameters
        const pensionableEarnings = annualSalary * params.autoEnrollmentPensionablePayRate; // Use parameter for pensionable pay rate
        const employeeContributionRate = params.autoEnrollmentEmployeeRate; // Use parameter for employee contribution rate
        const monthlyAEContribution = (pensionableEarnings * employeeContributionRate) / 12;
        console.log(`🔧 SFM-124-OLD: Using parameter-based pension contribution: ${(employeeContributionRate * 100).toFixed(1)}% of ${(params.autoEnrollmentPensionablePayRate * 100).toFixed(0)}% pensionable pay = £${Math.round(monthlyAEContribution).toLocaleString()} monthly`);
        return Math.round(monthlyAEContribution);
      }
    }

    default:
      console.warn(`Unknown salary SFM ID: ${sfmId}`);
      return 0;
  }
}
