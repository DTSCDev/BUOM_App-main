import { SystemField } from './types';

// Free Calculator and Affordability Tab UI's are SFM-0XX-X series
export const freeCalculatorFields: SystemField[] = [
  // Basic Form Inputs (SFM-001 to SFM-007)
  {
    sfmId: "SFM-001",
    description: "Date of Birth Input",
    pageName: "Free Calculator",
    cardName: "Form Inputs",
    outputValue: "dateOfBirth",
    correlatedTo: "Age calculations, years to retirement",
    valueType: "Input"
  },
  {
    sfmId: "SFM-002",
    description: "Annual Salary Input",
    pageName: "Free Calculator", 
    cardName: "Form Inputs",
    outputValue: "annualSalary",
    correlatedTo: "Target income calculations, AE contributions",
    valueType: "Input"
  },
  {
    sfmId: "SFM-003",
    description: "Existing Pension Value Input",
    pageName: "Free Calculator",
    cardName: "Form Inputs",
    outputValue: "existingPensionValue",
    correlatedTo: "Current pension fund value for projections",
    valueType: "Input"
  },
  {
    sfmId: "SFM-004",
    description: "Pension Contributions",
    pageName: "Free Calculator",
    cardName: "Form Inputs",
    outputValue: "monthlyAECont",
    correlatedTo: "Auto Enrolment contributions based on your salary // £340",
    valueType: "Input"
  },
  {
    sfmId: "SFM-005",
    description: "Retirement Age Input",
    pageName: "Free Calculator",
    cardName: "Form Inputs",
    outputValue: "retirementAge",
    correlatedTo: "Age 67 default, affects time to retirement calculations",
    valueType: "Input"
  },
  {
    sfmId: "SFM-006",
    description: "Final Salary Income (at Retirement)",
    pageName: "Free Calculator",
    cardName: "Form Inputs",
    outputValue: "finalSalaryIncome",
    correlatedTo: "Optional DB pension income at retirement",
    valueType: "Input"
  },
  {
    sfmId: "SFM-007",
    description: "Other Income Input",
    pageName: "Free Calculator",
    cardName: "Form Inputs",
    outputValue: "otherIncome",
    correlatedTo: "Optional other retirement income sources",
    valueType: "Input"
  },

  // **Pension Funding Options** (SFM-008 to SFM-012)
  {
    sfmId: "SFM-008",
    description: "Funding Progress",
    pageName: "Free Calculator",
    cardName: "Pension Funding Options",
    outputValue: "progressPercentage",
    correlatedTo: "67% - (Current Projection / Required Capital) × 100",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-009",
    description: "Current Projection",
    pageName: "Free Calculator",
    cardName: "Pension Funding Options",
    outputValue: "totalProjectedPensionPot",
    correlatedTo: "£567,960 - Projected pension pot at retirement",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-010",
    description: "Required Capital assuming full State Pension",
    pageName: "Free Calculator",
    cardName: "Pension Funding Options",
    outputValue: "requiredCapital",
    correlatedTo: "£845,005 - Capital needed for target retirement income",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-011",
    description: "Estimated Shortfall",
    pageName: "Free Calculator",
    cardName: "Pension Funding Options",
    outputValue: "capitalShortfall",
    correlatedTo: "£277,045 - Additional capital needed",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-012",
    description: "Existing Plan Top-Up Monthly Cost",
    pageName: "Free Calculator",
    cardName: "Pension Funding Options",
    outputValue: "monthlyFundingCost",
    correlatedTo: "£405 - Additional monthly contribution needed to close your Estimated Shortfall",
    valueType: "Currency"
  },

  // **Pension Timeline** (SFM-013 to SFM-016)
  {
    sfmId: "SFM-013",
    description: "Target Income Today",
    pageName: "Free Calculator",
    cardName: "Pension Timeline",
    outputValue: "targetIncomeToday",
    correlatedTo: "£30,000 - 50% of current annual salary",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-014",
    description: "Target Income at Retirement",
    pageName: "Free Calculator",
    cardName: "Pension Timeline",
    outputValue: "targetIncomeAtRetirement",
    correlatedTo: "£49,218 - Target income adjusted for inflation",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-015",
    description: "State Pension Today",
    pageName: "Free Calculator",
    cardName: "State Pension Details",
    outputValue: "statePensionToday",
    correlatedTo: "£11,973 - Current state pension annual rate",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-016",
    description: "State Pension at Retirement",
    pageName: "Free Calculator",
    cardName: "State Pension Details",
    outputValue: "statePensionAtRetirement",
    correlatedTo: "£19,643 - State pension adjusted for inflation",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-044",
    description: "Existing Plan Projected Income",
    pageName: "Free Calculator",
    cardName: "Pension Timeline",
    outputValue: "existingPlanProjectedIncome",
    correlatedTo: "£39,521 - Projected income (inc. State Pension)",
    valueType: "Currency"
  },

  // **Key Metrics** (SFM-017 to SFM-020)
  {
    sfmId: "SFM-017",
    description: "Current Age",
    pageName: "Free Calculator",
    cardName: "Key Metrics",
    outputValue: "currentAge",
    correlatedTo: "42 years 0 months - Calculated from date of birth",
    valueType: "Age"
  },
  {
    sfmId: "SFM-018",
    description: "Time to Retirement",
    pageName: "Free Calculator",
    cardName: "Key Metrics",
    outputValue: "timeToRetirement",
    correlatedTo: "25 years 00 months - Years until retirement age",
    valueType: "Duration"
  },
  {
    sfmId: "SFM-019",
    description: "Days Until Pension",
    pageName: "Free Calculator",
    cardName: "Key Metrics",
    outputValue: "daysUntilPension",
    correlatedTo: "9,131 - Days until retirement",
    valueType: "Days"
  },
  {
    sfmId: "SFM-020",
    description: "Paydays Remaining",
    pageName: "Free Calculator",
    cardName: "Key Metrics",
    outputValue: "paydaysRemaining",
    correlatedTo: "300 - Monthly paydays until retirement",
    valueType: "Count"
  },

  // **Pension Projection Analysis** (SFM-021 to SFM-032)
  {
    sfmId: "SFM-021",
    description: "Estimated Historical Contributions",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "totalHistoricalContributions",
    correlatedTo: "£69,406 - Total AE contributions from age 21 to current age",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-022",
    description: "Estimated Existing Pension Fund Value",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "existingPensionValue",
    correlatedTo: "£109,233 - Current pension fund value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-023",
    description: "Future Growth on Existing Fund Value",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "growthFromExisting",
    correlatedTo: "+£226,521 - Investment growth on existing pension value to retirement",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-024",
    description: "Future AE Contributions",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "futureAEContributions",
    correlatedTo: "£131,877 - Total auto-enrollment contributions until retirement",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-025",
    description: "Future AE Contributions Growth",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "futureAEContributionsGrowth",
    correlatedTo: "+£100,329 - Investment growth on future AE contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-026",
    description: "Total Projected Pension Value",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "totalProjectedValue",
    correlatedTo: "£567,960 - Sum of all pension components",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-027",
    description: "Required Capital",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "requiredCapital",
    correlatedTo: "£845,005 - Capital needed for target income",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-028",
    description: "Capital Shortfall",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "capitalShortfall",
    correlatedTo: "£277,045 - Gap between required and projected capital",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-045",
    description: "Equivalent Income Shortfall",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "equivalentIncomeShortfall",
    correlatedTo: "SFM-028 × 3.5% - Annual income equivalent of capital shortfall",
    valueType: "Currency"
  },

  // **Top Up Contribution Analysis** (SFM-029 to SFM-032)
  {
    sfmId: "SFM-029",
    description: "Top Up Contributions Paid",
    pageName: "Free Calculator",
    cardName: "Top Up Contribution Analysis",
    outputValue: "topUpContributionsPaid",
    correlatedTo: "£157,137 - Total contributions needed to close shortfall",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-030",
    description: "Top Up Investment Growth",
    pageName: "Free Calculator",
    cardName: "Top Up Contribution Analysis",
    outputValue: "topUpInvestmentGrowth",
    correlatedTo: "£119,908 - Investment growth on top-up contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-031",
    description: "Shortfall Target",
    pageName: "Free Calculator",
    cardName: "Top Up Contribution Analysis",
    outputValue: "shortfallTarget",
    correlatedTo: "£277,045 - Target amount to close funding gap",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-032",
    description: "Effective Growth Rate",
    pageName: "Free Calculator",
    cardName: "Top Up Contribution Analysis",
    outputValue: "effectiveGrowthRate",
    correlatedTo: "76.3% - (Investment Growth / Contributions Paid) × 100",
    valueType: "Percentage"
  },
  // Additional Calculator Codes (SFM-033 to SFM-043)
  {
    sfmId: "SFM-033",
    description: "Existing Plan Value Today at Retirement",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "existingPlanValueAtRetirement",
    correlatedTo: "SFM-022 + SFM-023 - Current pension value plus growth",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-034",
    description: "Existing Plan Future Contributions Value",
    pageName: "Free Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "existingPlanFutureContributions",
    correlatedTo: "SFM-024 + SFM-025 - Future AE contributions plus growth",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-035",
    description: "Shortfall at Retirement",
    pageName: "Free Calculator",
    cardName: "Pension Funding Options",
    outputValue: "shortfallAtRetirement",
    correlatedTo: "SFM-011 - Estimated shortfall amount",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-036",
    description: "Existing Plan Monthly Top Up",
    pageName: "Free Calculator",
    cardName: "Cost Comparison Chart",
    outputValue: "existingPlanMonthlyTopUp",
    correlatedTo: "SFM-012 - Monthly top-up cost for existing plan",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-037",
    description: "BUOM Monthly Top Up",
    pageName: "Free Calculator",
    cardName: "Cost Comparison Chart",
    outputValue: "buomMonthlyTopUp",
    correlatedTo: "SFM-012 × 50% - BUOM monthly top-up cost",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-038",
    description: "Existing Pension Plan Total Top Up Contributions",
    pageName: "Free Calculator",
    cardName: "Cost Comparison Chart",
    outputValue: "existingPlanTotalTopUp",
    correlatedTo: "SFM-012 + Inflation until State Pension Age",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-039",
    description: "BUOM Total Contribution",
    pageName: "Free Calculator",
    cardName: "Cost Comparison Chart",
    outputValue: "buomTotalContribution",
    correlatedTo: "SFM-038 × 50% - Total BUOM contribution",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-040",
    description: "CTA Button Check Eligibility For Funding Here",
    pageName: "Free Calculator",
    cardName: "Cost Comparison Chart",
    outputValue: "ctaCheckEligibility",
    correlatedTo: "Button action for funding eligibility check",
    valueType: "Action"
  },
  {
    sfmId: "SFM-041",
    description: "APF Estimated Funding Period",
    pageName: "Free Calculator",
    cardName: "APF Period Card",
    outputValue: "apfEstimatedFundingPeriod",
    correlatedTo: "(SFM-011 / £60,000) + 2 - Funding period in years",
    valueType: "Duration"
  },
  {
    sfmId: "SFM-042",
    description: "Lump Sum Cost of Target Income Today",
    pageName: "Free Calculator",
    cardName: "Protection Analysis",
    outputValue: "lumpSumCostTargetIncome",
    correlatedTo: "SFM-013 / 3.5% - Capital needed for target income at 3.5% drawdown",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-043",
    description: "Estimated Life Cover Need",
    pageName: "Free Calculator",
    cardName: "Protection Card",
    outputValue: "estimatedLifeCoverNeed",
    correlatedTo: "SFM-042 - SFM-022 - Life cover needed after existing pension value",
    valueType: "Currency"
  },
  
  // Affordability Checker SFM Codes (SFM-101 to SFM-119)
  {
    sfmId: "SFM-101",
    description: "Affordability Warning Status",
    pageName: "Affordability Checker",
    cardName: "Affordability Alert Card",
    outputValue: "isAffordable",
    correlatedTo: "Your estimated Top Up of £0 may not be Affordable - reads SFM-012 Monthly Top Up value",
    valueType: "Boolean"
  },
  {
    sfmId: "SFM-102",
    description: "CTA Button Check Your Eligibility For Risk Free Financial Assistance",
    pageName: "Affordability Checker",
    cardName: "Affordability Alert Card",
    outputValue: "ctaCheckEligibility",
    correlatedTo: "Button action for risk-free financial assistance eligibility check",
    valueType: "Action"
  },
  {
    sfmId: "SFM-103",
    description: "Monthly Take Home Pay",
    pageName: "Affordability Checker",
    cardName: "Pension Funding Affordability Analysis",
    outputValue: "monthlyTakeHomePay",
    correlatedTo: "£3,509 - Net pay after tax, NI, and pension contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-104",
    description: "Standard Monthly Funding Cost + Top Up Cost",
    pageName: "Affordability Checker",
    cardName: "Pension Funding Affordability Analysis",
    outputValue: "totalFundingCost",
    correlatedTo: "£213 + £405 = £213 - SFM-114 (AE contribution) + SFM-012 (Top Up)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-105",
    description: "Affordability Percentage of Take Home Pay",
    pageName: "Affordability Checker",
    cardName: "Pension Funding Affordability Analysis",
    outputValue: "affordabilityPercentage",
    correlatedTo: "6.1% - (Total Funding Cost / Take Home Pay) × 100",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-106",
    description: "BUOM Monthly Funding Cost",
    pageName: "Affordability Checker",
    cardName: "Pension Funding Affordability Analysis",
    outputValue: "buomMonthlyCost",
    correlatedTo: "£106 - 50% discount on total funding cost",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-107",
    description: "BUOM Affordability Percentage of Take Home Pay",
    pageName: "Affordability Checker",
    cardName: "Pension Funding Affordability Analysis",
    outputValue: "buomAffordabilityPercentage",
    correlatedTo: "3.0% - (BUOM Cost / Take Home Pay) × 100",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-108",
    description: "CTA Button Check My Funding Eligibility",
    pageName: "Affordability Checker",
    cardName: "Pension Funding Affordability Analysis",
    outputValue: "ctaCheckFundingEligibility",
    correlatedTo: "Button action for BUOM funding eligibility check",
    valueType: "Action"
  },
  {
    sfmId: "SFM-109",
    description: "Contribution Method",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "contributionMethod",
    correlatedTo: "Net Pay Arrangement - pension contribution method",
    valueType: "Text"
  },
  {
    sfmId: "SFM-110",
    description: "Auto Enrollment Basis",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "autoEnrollmentBasis",
    correlatedTo: "Pensionable Pay Method (Set 2 & 3) - AE calculation basis",
    valueType: "Text"
  },
  {
    sfmId: "SFM-111",
    description: "Pensionable Pay Percentage",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "pensionablePayPercentage",
    correlatedTo: "85% of Total Pay - pensionable earnings calculation",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-112",
    description: "Monthly Gross Pay",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "monthlyGrossPay",
    correlatedTo: "£5,000 - SFM-002 Annual Salary / 12",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-113",
    description: "Pensionable Earnings",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "pensionableEarnings",
    correlatedTo: "£4,250 - 85% of monthly gross pay",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-114",
    description: "Your Contribution (5%)",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "employeeContribution",
    correlatedTo: "£213 - 5% of pensionable earnings (employee AE contribution)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-115",
    description: "Employer Contribution (3%)",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "employerContribution",
    correlatedTo: "£128 - 3% of pensionable earnings (employer AE contribution)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-116",
    description: "Total Monthly Contribution (8%)",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "totalMonthlyContribution",
    correlatedTo: "£340 - SFM-114 + SFM-115 (employee + employer contributions)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-117",
    description: "Annual Pensionable Earnings",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "annualPensionableEarnings",
    correlatedTo: "£51,000 - SFM-113 × 12 (annual pensionable earnings)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-118",
    description: "Annual Total Contribution",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "annualTotalContribution",
    correlatedTo: "£4,080 - SFM-116 × 12 (annual total AE contributions)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-119",
    description: "Estimated Monthly Net Pay (1257L)",
    pageName: "Affordability Checker",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "estimatedNetPay1257L",
    correlatedTo: "£3,395 - Net pay calculation using fixed 1257L tax code",
    valueType: "Currency"
  },

  // Funding Eligibility Form Fields (SFM-120 to SFM-128)
  {
    sfmId: "SFM-120",
    description: "First Name",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "firstName",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-121",
    description: "Last Name",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "lastName",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-122",
    description: "Address Line 1",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "addressLine1",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-123",
    description: "Address Line 2",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "addressLine2",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-124",
    description: "City",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "city",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-125",
    description: "Postcode",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "postCode",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-126",
    description: "Country",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "country",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-127",
    description: "Email",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "email",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  },
  {
    sfmId: "SFM-128",
    description: "Mobile",
    pageName: "Funding Eligibility",
    cardName: "Funding Eligibility Form",
    outputValue: "mobile",
    correlatedTo: "Funding Eligibility form input",
    valueType: "Text"
  }
];