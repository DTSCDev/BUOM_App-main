import { SystemField } from './types';

// Retirement Calculator Fields for Main App
// Uses page-based SFM-CAL-4XXX codes only
// No SFM-XXX codes should be in this file as it's for Main App use
// Should only call props/logic from PRF, NAV and CAL

export const retirementCalculatorFields: SystemField[] = [
  // RETIREMENT CALCULATOR - Funding Progress Overview
  {
    sfmId: "SFM-CAL-4101",
    description: "Funding Progress",
    pageName: "Retirement Calculator",
    cardName: "Funding Progress",
    outputValue: "fundingProgressPercentage",
    correlatedTo: "Pension funding progress percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4102",
    description: "Existing Fund Value",
    pageName: "Retirement Calculator",
    cardName: "Pension Overview Summary",
    outputValue: "existingFundValue",
    correlatedTo: "Current pension assets value from NAV-3XXX series",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4103",
    description: "Current Projection",
    pageName: "Retirement Calculator",
    cardName: "Pension Overview Summary",
    outputValue: "currentProjection",
    correlatedTo: "Projected pension pot at retirement",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4104",
    description: "Required Capital",
    pageName: "Retirement Calculator",
    cardName: "Pension Overview Summary",
    outputValue: "requiredCapital",
    correlatedTo: "Capital needed for target retirement income (assuming full State Pension)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4105",
    description: "Estimated Shortfall",
    pageName: "Retirement Calculator",
    cardName: "Pension Overview Summary",
    outputValue: "estimatedShortfall",
    correlatedTo: "Additional capital needed to meet retirement goals",
    valueType: "Currency"
  },
  
  // PENSION TIMELINE CARD
  {
    sfmId: "SFM-CAL-4106",
    description: "Target Income Today",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "targetIncomeToday",
    correlatedTo: "50% of current annual salary from PRF profile data",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4107",
    description: "Target Income at Retirement",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "targetIncomeAtRetirement",
    correlatedTo: "Target income adjusted for inflation",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4108",
    description: "State Pension Today",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "statePensionToday",
    correlatedTo: "Current state pension value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4109",
    description: "State Pension at Retirement",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "statePensionAtRetirement",
    correlatedTo: "State pension value at retirement",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4110",
    description: "Current Age",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "currentAge",
    correlatedTo: "Current age in years and months from PRF profile data",
    valueType: "Age"
  },
  {
    sfmId: "SFM-CAL-4111",
    description: "Time to Retirement",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "timeToRetirement",
    correlatedTo: "Years and months until retirement",
    valueType: "Duration"
  },
  {
    sfmId: "SFM-CAL-4112",
    description: "Days Until Pension",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "daysUntilPension",
    correlatedTo: "Total days until pension starts",
    valueType: "Number"
  },
  {
    sfmId: "SFM-CAL-4113",
    description: "Paydays Remaining",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "paydaysRemaining",
    correlatedTo: "Number of paydays until retirement",
    valueType: "Number"
  },
  
  // PENSION PROJECTION ANALYSIS CARD
  {
    sfmId: "SFM-CAL-4114",
    description: "Estimated Historical Contributions",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "estimatedHistoricalContributions",
    correlatedTo: "Total historical pension contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4115",
    description: "Estimated Existing Pension Fund Value",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "estimatedExistingPensionFundValue",
    correlatedTo: "Current estimated pension fund value from NAV data",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4116",
    description: "Future Growth on Existing Fund Value",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "projectedGrowthOnExistingFundValue",
    correlatedTo: "Expected growth on existing pension fund",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4117",
    description: "Future AE Contributions",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "futureAEContributions",
    correlatedTo: "Future auto-enrollment contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4118",
    description: "Future AE Contributions Growth",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "futureAEContributionsGrowth",
    correlatedTo: "Expected growth on future AE contributions",
    valueType: "Currency"
  },
  
  // PENSION FUNDING OPTIONS CARD
  {
    sfmId: "SFM-CAL-4119",
    description: "Monthly Top-Up Required",
    pageName: "Retirement Calculator",
    cardName: "Pension Funding Options",
    outputValue: "monthlyTopUpRequired",
    correlatedTo: "Monthly contribution needed to close shortfall",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4120",
    description: "Top Up Contributions Total",
    pageName: "Retirement Calculator",
    cardName: "Top Up Analysis",
    outputValue: "topUpContributionsTotal",
    correlatedTo: "Total top-up contributions over retirement period",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4121",
    description: "Top Up Investment Growth",
    pageName: "Retirement Calculator",
    cardName: "Top Up Analysis",
    outputValue: "topUpInvestmentGrowth",
    correlatedTo: "Investment growth on top-up contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4122",
    description: "Top Up Final Value",
    pageName: "Retirement Calculator",
    cardName: "Top Up Analysis",
    outputValue: "topUpFinalValue",
    correlatedTo: "Final projected top-up value at retirement",
    valueType: "Currency"
  }
];