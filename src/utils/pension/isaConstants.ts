
// ISA calculation constants - DYNAMIC: No hardcoded year limits
export const ISA_CALCULATION_CONSTANTS = {
  START_AGE: 42,
  TOTAL_MONTHS: 312, // Age 42-68
  
  // Base configuration for dynamic tranche calculation
  CONTRIBUTION_MONTHS_PER_TRANCHE: 240, // Exactly 240 months per tranche
  TRANCHE_START_OFFSET: 12, // Each tranche starts 12 months after the previous
  FIRST_TRANCHE_START: 1, // First tranche starts at month 1
  
  // Dynamic redemption ages (62, 63, 64, etc. based on actual sponsorships)
  REDEMPTION_BASE_AGE: 62, // First redemption at age 62
};
