
// 2024/25 Tax Year Thresholds and Constants
export const TAX_THRESHOLDS = {
  personalAllowance: 12570,
  basicRateThreshold: 37700,
  higherRateThreshold: 125140,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45
};

// 2024/25 NIC Thresholds
export const NIC_THRESHOLDS = {
  employee: {
    monthlyLowerThreshold: 1048, // £12,570 / 12
    monthlyUpperThreshold: 4189, // £50,270 / 12
    annualLowerThreshold: 12570,
    annualUpperThreshold: 50270,
    mainRate: 0.12,
    additionalRate: 0.02
  },
  director: {
    annualLowerThreshold: 12570,
    annualUpperThreshold: 50270,
    mainRate: 0.12,
    additionalRate: 0.02,
    // Directors can elect monthly calculation but still use annual thresholds
    monthlyLowerThreshold: 1048,
    monthlyUpperThreshold: 4189
  }
};

// Minimum NIC contribution to maintain entitlements (approximate)
export const MIN_NIC_WEEKLY = 4.45; // 2024/25 minimum for benefits
export const MIN_NIC_MONTHLY = MIN_NIC_WEEKLY * 52 / 12;
