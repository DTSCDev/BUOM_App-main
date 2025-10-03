
import { NIC_THRESHOLDS, MIN_NIC_MONTHLY } from './taxThresholds';

export function calculateEmployeeNIC(monthlyGross: number, pensionContribution: number): number {
  const nicableIncome = monthlyGross - pensionContribution;
  
  if (nicableIncome <= NIC_THRESHOLDS.employee.monthlyLowerThreshold) {
    return 0;
  }

  let nic = 0;
  const remaining = nicableIncome - NIC_THRESHOLDS.employee.monthlyLowerThreshold;
  
  // Main rate band
  const mainRateAmount = Math.min(remaining, 
    NIC_THRESHOLDS.employee.monthlyUpperThreshold - NIC_THRESHOLDS.employee.monthlyLowerThreshold);
  nic += mainRateAmount * NIC_THRESHOLDS.employee.mainRate;
  
  // Additional rate (if over upper threshold)
  if (nicableIncome > NIC_THRESHOLDS.employee.monthlyUpperThreshold) {
    const additionalAmount = nicableIncome - NIC_THRESHOLDS.employee.monthlyUpperThreshold;
    nic += additionalAmount * NIC_THRESHOLDS.employee.additionalRate;
  }

  return nic;
}

export function calculateDirectorNIC(
  annualGross: number, 
  annualPensionContribution: number, 
  hasControllingShares: boolean,
  electionMethod: 'annual' | 'monthly' = 'annual'
): number {
  const nicableIncome = annualGross - annualPensionContribution;
  
  if (nicableIncome <= NIC_THRESHOLDS.director.annualLowerThreshold) {
    return 0;
  }

  let nic = 0;
  const remaining = nicableIncome - NIC_THRESHOLDS.director.annualLowerThreshold;
  
  // Main rate band
  const mainRateAmount = Math.min(remaining, 
    NIC_THRESHOLDS.director.annualUpperThreshold - NIC_THRESHOLDS.director.annualLowerThreshold);
  nic += mainRateAmount * NIC_THRESHOLDS.director.mainRate;
  
  // Additional rate (if over upper threshold)
  if (nicableIncome > NIC_THRESHOLDS.director.annualUpperThreshold) {
    const additionalAmount = nicableIncome - NIC_THRESHOLDS.director.annualUpperThreshold;
    nic += additionalAmount * NIC_THRESHOLDS.director.additionalRate;
  }

  // Additional protection for controlling shareholders
  if (hasControllingShares) {
    // Ensure minimum NIC to maintain entitlements
    nic = Math.max(nic, MIN_NIC_MONTHLY * 12);
  }

  return nic;
}
