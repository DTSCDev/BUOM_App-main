
// 2025/26 Tax Year Thresholds and Constants
export const TAX_THRESHOLDS = {
  personalAllowance: 12570,
  basicRateThreshold: 37700,
  higherRateThreshold: 125140,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45
};

// 2025/26 NIC Thresholds
export const NIC_THRESHOLDS = {
  employee: {
    monthlyLowerThreshold: 1048, // £12,570 / 12
    monthlyUpperThreshold: 4189, // £50,270 / 12
    annualLowerThreshold: 12570,
    annualUpperThreshold: 50270,
    // Employee NI main rate reduced to 8% (2025/26)
    mainRate: 0.08,
    additionalRate: 0.02
  },
  director: {
    annualLowerThreshold: 12570,
    annualUpperThreshold: 50270,
    // Directors use annual thresholds; employee main rate also 8%
    mainRate: 0.08,
    additionalRate: 0.02,
    // Directors can elect monthly calculation but still use annual thresholds
    monthlyLowerThreshold: 1048,
    monthlyUpperThreshold: 4189
  }
};

// Minimum NIC contribution to maintain entitlements (approximate)
export const MIN_NIC_WEEKLY = 4.45; // Minimum for benefits (unchanged baseline)
export const MIN_NIC_MONTHLY = MIN_NIC_WEEKLY * 52 / 12;
