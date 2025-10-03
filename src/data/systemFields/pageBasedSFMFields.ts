import { SystemField } from './types';
import { freeCalculatorFields } from './freeCalculatorFields';
import { apfPageFields, generateAPFYearCodes } from './apfPageFields';
import { profilePageFields } from './profilePageFields';
import { netAssetValueFields } from './netAssetValueFields';

// Page-based SFM Code Structure
// Free Calculator and Affordability Tab UI's are SFM-0XX-X series
// APF Pages and Sub Pages are SFM-APF-1XXX-X
// Profile Page is SFM-PRF-2XXX-X
// Net Asset Value is SFM-NAV-3XXX-X
// Calculators Page is SFM-CAL-4XXX-X
// Payments Page is SFM-PAY-5XXX-X
// Reports Page is SFM-REP-6XXX-X
// Statements Page is SFM-STA-7XXX-X
// FREE Benefits Page is SFM-BEN-8XXX-X

export const calculatorsPageFields: SystemField[] = [
  // Calculators Page is SFM-CAL-4XXX-X
  {
    sfmId: "SFM-CAL-4001",
    description: "Calculator Selection",
    pageName: "Calculators",
    cardName: "Calculator Options",
    outputValue: "selectedCalculator",
    correlatedTo: "Currently selected calculator type",
    valueType: "Text"
  },
  {
    sfmId: "SFM-CAL-4002",
    description: "Calculator Result",
    pageName: "Calculators",
    cardName: "Calculator Results",
    outputValue: "calculatorResult",
    correlatedTo: "Primary calculator result value",
    valueType: "Currency"
  },
  
  // RETIREMENT CALCULATOR EMPLOYEE - Calculator Tab (SFM-CAL-4101 to 4139)
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
  
  // PENSION TIMELINE CARD - Left Section
  {
    sfmId: "SFM-CAL-4106",
    description: "Target Income Today",
    pageName: "Retirement Calculator",
    cardName: "Pension Timeline",
    outputValue: "targetIncomeToday",
    correlatedTo: "50% of current annual salary",
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
    correlatedTo: "Current age in years and months",
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
  
  // PENSION PROJECTION ANALYSIS CARD - Right Section
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
    correlatedTo: "Current estimated pension fund value",
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
    correlatedTo: "Growth on future AE contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4119",
    description: "Total Projected Pension Value",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "totalProjectedPensionValue",
    correlatedTo: "Total projected pension value at retirement",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4120",
    description: "Required Capital",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "requiredCapital",
    correlatedTo: "Capital required for retirement goals",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4121",
    description: "Capital Shortfall",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "capitalShortfall",
    correlatedTo: "Shortfall between projected and required capital",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4122",
    description: "Top Up Contributions Paid",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "topUpContributionsPaid",
    correlatedTo: "Total top-up contributions paid",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4123",
    description: "Top Up Investment Growth",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "topUpInvestmentGrowth",
    correlatedTo: "Growth on top-up contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4124",
    description: "Top Up Total Fund Value",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "topUpTotalFundValue",
    correlatedTo: "Total fund value from top-up contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4125",
    description: "Effective Growth Rate",
    pageName: "Retirement Calculator",
    cardName: "Pension Projection Analysis",
    outputValue: "effectiveGrowthRate",
    correlatedTo: "Effective growth rate on investments",
    valueType: "Percentage"
  },
  
  // ESTIMATED SHORTFALL ANALYSIS CARD - Left Section
  {
    sfmId: "SFM-CAL-4126",
    description: "Existing Fund Value at Retirement",
    pageName: "Retirement Calculator",
    cardName: "Estimated Shortfall Analysis",
    outputValue: "existingFundValueAtRetirement",
    correlatedTo: "SFM-CAL-4115 + SFM-CAL-4116 (£109,233 + £226,521)",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4127",
    description: "Existing Plan Future Contributions",
    pageName: "Retirement Calculator",
    cardName: "Estimated Shortfall Analysis",
    outputValue: "existingPlanFutureContributions",
    correlatedTo: "SFM-CAL-4117 + SFM-CAL-4118 (£131,877 + £100,329)",
    valueType: "Currency"
  },
  
  // VALUE FOR MONEY COMPARISON CARD - Right Section
  {
    sfmId: "SFM-CAL-4128",
    description: "Existing Plan Monthly Top Up (Year 1)",
    pageName: "Retirement Calculator",
    cardName: "Value for Money Comparison",
    outputValue: "existingPlanMonthlyTopUp",
    correlatedTo: "Monthly top-up required for existing plan",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4129",
    description: "BUOM Monthly Estimate (Year 1)",
    pageName: "Retirement Calculator",
    cardName: "Value for Money Comparison",
    outputValue: "buomMonthlyEstimate",
    correlatedTo: "BUOM monthly estimate for year 1",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4130",
    description: "Best Use Of Money Notice",
    pageName: "Retirement Calculator",
    cardName: "Value for Money Comparison",
    outputValue: "bestUseOfMoneyNotice",
    correlatedTo: "Best Use Of Money principles notice",
    valueType: "Text"
  },
  {
    sfmId: "SFM-CAL-4131",
    description: "BUOM Total Estimate",
    pageName: "Retirement Calculator",
    cardName: "Value for Money Comparison",
    outputValue: "buomTotalEstimate",
    correlatedTo: "BUOM total estimate for contributions",
    valueType: "Currency"
  },

  // RETIREMENT CALCULATOR EMPLOYEE - Affordability Tab (SFM-CAL-4140 to 4159)
  {
    sfmId: "SFM-CAL-4140",
    description: "Contribution Method",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "contributionMethod",
    correlatedTo: "Net Pay Arrangement",
    valueType: "Text"
  },
  {
    sfmId: "SFM-CAL-4141",
    description: "Auto Enrollment Basis",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "autoEnrollmentBasis",
    correlatedTo: "Pensionable Pay Method (Set 2 & 3)",
    valueType: "Text"
  },
  {
    sfmId: "SFM-CAL-4142",
    description: "Pensionable Pay Percentage",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "pensionablePayPercentage",
    correlatedTo: "85% of Total Pay",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4143",
    description: "Monthly Gross Pay",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "monthlyGrossPay",
    correlatedTo: "Annual salary divided by 12",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4144",
    description: "Pensionable Earnings",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "pensionableEarnings",
    correlatedTo: "85% of monthly gross pay",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4145",
    description: "Your Contribution (5%)",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "employeeContribution",
    correlatedTo: "5% of pensionable earnings",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4146",
    description: "Employer Contribution (3%)",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "employerContribution",
    correlatedTo: "3% of pensionable earnings",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4147",
    description: "Total Monthly Contribution (8%)",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "totalMonthlyContribution",
    correlatedTo: "Employee + Employer contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4148",
    description: "Annual Pensionable Earnings",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "annualPensionableEarnings",
    correlatedTo: "Monthly pensionable earnings × 12",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4149",
    description: "Annual Total Contribution",
    pageName: "Retirement Calculator",
    cardName: "Affordability Assessment",
    outputValue: "annualTotalContribution",
    correlatedTo: "Total monthly contribution × 12",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4150",
    description: "Affordability Warning Status",
    pageName: "Retirement Calculator",
    cardName: "Affordability Alert",
    outputValue: "affordabilityWarningStatus",
    correlatedTo: "Based on affordability percentage thresholds",
    valueType: "Boolean"
  },
  {
    sfmId: "SFM-CAL-4151",
    description: "Check Eligibility Button",
    pageName: "Retirement Calculator",
    cardName: "Affordability Alert",
    outputValue: "checkEligibilityButton",
    correlatedTo: "Button to check funding eligibility",
    valueType: "Action"
  },
  {
    sfmId: "SFM-CAL-4152",
    description: "Monthly Take Home Pay",
    pageName: "Retirement Calculator",
    cardName: "Affordability Analysis",
    outputValue: "monthlyTakeHomePay",
    correlatedTo: "Net pay after tax, NI, and pension contributions",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4153",
    description: "Standard Monthly Funding Cost + Top Up Cost",
    pageName: "Retirement Calculator",
    cardName: "Affordability Analysis",
    outputValue: "totalFundingCost",
    correlatedTo: "Employee contribution + monthly funding cost",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4154",
    description: "Affordability Percentage",
    pageName: "Retirement Calculator",
    cardName: "Affordability Analysis",
    outputValue: "affordabilityPercentage",
    correlatedTo: "Total funding cost as % of take home pay",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4155",
    description: "BUOM Monthly Funding Cost",
    pageName: "Retirement Calculator",
    cardName: "Affordability Analysis",
    outputValue: "buomMonthlyCost",
    correlatedTo: "BUOM discounted monthly funding cost",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4156",
    description: "BUOM Affordability Percentage",
    pageName: "Retirement Calculator",
    cardName: "Affordability Analysis",
    outputValue: "buomAffordabilityPercentage",
    correlatedTo: "BUOM cost as % of take home pay",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4157",
    description: "Check Funding Eligibility Button",
    pageName: "Retirement Calculator",
    cardName: "Affordability Analysis",
    outputValue: "checkFundingEligibilityButton",
    correlatedTo: "Button to check funding eligibility",
    valueType: "Action"
  },
  {
    sfmId: "SFM-CAL-4158",
    description: "Estimated Monthly Net Pay (1257L)",
    pageName: "Retirement Calculator",
    cardName: "Net Pay Assumption",
    outputValue: "estimatedNetPay1257L",
    correlatedTo: "Net pay using 1257L tax code calculation",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4159",
    description: "Pensions UK Standards Reference",
    pageName: "Retirement Calculator",
    cardName: "Retirement Living Standards",
    outputValue: "pensionsUKStandards",
    correlatedTo: "Reference to Pensions UK retirement living standards",
    valueType: "Reference"
  },

  // PARAMETER SETTINGS - SFM-CAL-4400 Series
  // Core Dynamic Parameters Card (4401-4410)
  {
    sfmId: "SFM-CAL-4401",
    description: "Annual Growth Rate",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "growthRate",
    correlatedTo: "Expected annual investment growth rate",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4402",
    description: "Annual Inflation Rate",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "inflationRate",
    correlatedTo: "Expected annual inflation rate",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4403",
    description: "Provider Charges",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "providerCharges",
    correlatedTo: "Annual management charges",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4404",
    description: "Drawdown Rate",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "drawdownRate",
    correlatedTo: "Annual pension drawdown rate",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4405",
    description: "Retirement Age",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "selectedRetirementAge",
    correlatedTo: "Target retirement age",
    valueType: "Number"
  },
  {
    sfmId: "SFM-CAL-4406",
    description: "Pension Income Target",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "pensionIncomeTarget",
    correlatedTo: "Target pension as % of final salary",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4407",
    description: "Tax-Free Cash",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "taxFreeCash",
    correlatedTo: "Tax-free cash percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4408",
    description: "Advisor Fee",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "advisorFee",
    correlatedTo: "Annual advisor fee percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4409",
    description: "Growth Rate (Drawdown Phase - Gross)",
    pageName: "Parameter Settings",
    cardName: "Core Dynamic Parameters",
    outputValue: "growthRateDrawdown",
    correlatedTo: "Net rate after fees: 3.5% (4% - 0.5%) - Static fund during drawdown",
    valueType: "Percentage"
  },

  // Auto-Enrollment Parameters Card (4411-4420)
  {
    sfmId: "SFM-CAL-4411",
    description: "Employee Contribution Rate",
    pageName: "Parameter Settings",
    cardName: "Auto-Enrollment Parameters",
    outputValue: "autoEnrollmentEmployeeRate",
    correlatedTo: "Employee pension contribution rate",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4412",
    description: "Employer Contribution Rate",
    pageName: "Parameter Settings",
    cardName: "Auto-Enrollment Parameters",
    outputValue: "autoEnrollmentEmployerRate",
    correlatedTo: "Employer pension contribution rate",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4413",
    description: "Pensionable Pay Rate",
    pageName: "Parameter Settings",
    cardName: "Auto-Enrollment Parameters",
    outputValue: "autoEnrollmentPensionablePayRate",
    correlatedTo: "Percentage of salary that is pensionable",
    valueType: "Percentage"
  },

  // UK Tax System (2025-2026) Card (4421-4430)
  {
    sfmId: "SFM-CAL-4421",
    description: "Personal Allowance",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "personalAllowance",
    correlatedTo: "Tax-free personal allowance",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4422",
    description: "Basic Rate Band",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "basicRateBand",
    correlatedTo: "Basic rate tax band upper limit",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4423",
    description: "Basic Rate Income Tax",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "basicRateIncomeTax",
    correlatedTo: "Basic rate income tax percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4424",
    description: "Higher Rate Income Tax",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "higherRateIncomeTax",
    correlatedTo: "Higher rate income tax percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4425",
    description: "Dividend Allowance",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "dividendAllowance",
    correlatedTo: "Tax-free dividend allowance",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4426",
    description: "Dividend Basic Rate",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "dividendBasicRate",
    correlatedTo: "Dividend tax rate for basic rate taxpayers",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4427",
    description: "Dividend Higher Rate",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "dividendHigherRate",
    correlatedTo: "Dividend tax rate for higher rate taxpayers",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4428",
    description: "Dividend Additional Rate",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "dividendAdditionalRate",
    correlatedTo: "Dividend tax rate for additional rate taxpayers",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4429",
    description: "NI Employee Rate",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "niEmployeeRate",
    correlatedTo: "National Insurance employee contribution rate",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4430",
    description: "NI Employer Rate",
    pageName: "Parameter Settings",
    cardName: "UK Tax System (2025-2026)",
    outputValue: "niEmployerRate",
    correlatedTo: "National Insurance employer contribution rate",
    valueType: "Percentage"
  },

  // Corporation Tax (2025-2026) Card (4431-4440)
  {
    sfmId: "SFM-CAL-4431",
    description: "Small Profits Rate",
    pageName: "Parameter Settings",
    cardName: "Corporation Tax (2025-2026)",
    outputValue: "corporationTaxSmallProfitsRate",
    correlatedTo: "Corporation tax rate for profits under £50,000",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4432",
    description: "Main Rate",
    pageName: "Parameter Settings",
    cardName: "Corporation Tax (2025-2026)",
    outputValue: "corporationTaxMainRate",
    correlatedTo: "Corporation tax rate for profits over £250,000",
    valueType: "Percentage"
  },

  // Inheritance Tax (2025-2026) Card (4441-4450)
  {
    sfmId: "SFM-CAL-4441",
    description: "Nil-Rate Band",
    pageName: "Parameter Settings",
    cardName: "Inheritance Tax (2025-2026)",
    outputValue: "inheritanceTaxNilRateBand",
    correlatedTo: "Inheritance tax nil-rate band",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4442",
    description: "Residence Nil-Rate Band",
    pageName: "Parameter Settings",
    cardName: "Inheritance Tax (2025-2026)",
    outputValue: "inheritanceTaxResidenceNilRateBand",
    correlatedTo: "Additional nil-rate band for main residence",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4443",
    description: "Inheritance Tax Rate",
    pageName: "Parameter Settings",
    cardName: "Inheritance Tax (2025-2026)",
    outputValue: "inheritanceTaxRate",
    correlatedTo: "Standard inheritance tax rate",
    valueType: "Percentage"
  },

  // EIS Tax Relief (2025-2026) Card (4451-4455)
  {
    sfmId: "SFM-CAL-4451",
    description: "Income Tax Relief Rate",
    pageName: "Parameter Settings",
    cardName: "EIS Tax Relief (2025-2026)",
    outputValue: "eisIncomeeTaxReliefRate",
    correlatedTo: "EIS income tax relief percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4452",
    description: "Max Investment (Standard)",
    pageName: "Parameter Settings",
    cardName: "EIS Tax Relief (2025-2026)",
    outputValue: "eisMaxInvestmentStandard",
    correlatedTo: "Maximum EIS investment for standard companies",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4453",
    description: "Max Investment (KIC)",
    pageName: "Parameter Settings",
    cardName: "EIS Tax Relief (2025-2026)",
    outputValue: "eisMaxInvestmentKIC",
    correlatedTo: "Maximum EIS investment for knowledge-intensive companies",
    valueType: "Currency"
  },

  // SEIS Tax Relief (2025-2026) Card (4456-4460)
  {
    sfmId: "SFM-CAL-4456",
    description: "Income Tax Relief Rate",
    pageName: "Parameter Settings",
    cardName: "SEIS Tax Relief (2025-2026)",
    outputValue: "seisIncomeTaxReliefRate",
    correlatedTo: "SEIS income tax relief percentage",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4457",
    description: "Max Investment",
    pageName: "Parameter Settings",
    cardName: "SEIS Tax Relief (2025-2026)",
    outputValue: "seisMaxInvestment",
    correlatedTo: "Maximum SEIS investment per tax year",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-CAL-4458",
    description: "CGT Reinvestment Relief Rate",
    pageName: "Parameter Settings",
    cardName: "SEIS Tax Relief (2025-2026)",
    outputValue: "seisCGTReinvestmentReliefRate",
    correlatedTo: "SEIS capital gains tax reinvestment relief",
    valueType: "Percentage"
  },

  // Affordability Parameters Card (4461-4462)
  {
    sfmId: "SFM-CAL-4461",
    description: "Affordability Threshold",
    pageName: "Parameter Settings",
    cardName: "Affordability Parameters",
    outputValue: "affordabilityThreshold",
    correlatedTo: "Minimum affordability percentage threshold",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-CAL-4462",
    description: "Emergency Fund Months",
    pageName: "Parameter Settings",
    cardName: "Affordability Parameters",
    outputValue: "emergencyFundMonths",
    correlatedTo: "Number of months for emergency fund",
    valueType: "Number"
  }
];

export const paymentsPageFields: SystemField[] = [
  // Payments Page is SFM-PAY-5XXX-X
  {
    sfmId: "SFM-PAY-5001",
    description: "Payment Status",
    pageName: "Payments",
    cardName: "Payment Status",
    outputValue: "paymentStatus",
    correlatedTo: "Current payment status",
    valueType: "Text"
  },
  {
    sfmId: "SFM-PAY-5002",
    description: "Payment Amount",
    pageName: "Payments",
    cardName: "Payment Details",
    outputValue: "paymentAmount",
    correlatedTo: "Payment amount",
    valueType: "Currency"
  }
];

export const reportsPageFields: SystemField[] = [
  // Reports Page is SFM-REP-6XXX-X
  {
    sfmId: "SFM-REP-6001",
    description: "Report Type",
    pageName: "Reports",
    cardName: "Report Selection",
    outputValue: "reportType",
    correlatedTo: "Selected report type",
    valueType: "Text"
  },
  {
    sfmId: "SFM-REP-6002",
    description: "Report Data",
    pageName: "Reports",
    cardName: "Report Content",
    outputValue: "reportData",
    correlatedTo: "Report data content",
    valueType: "Data"
  }
];

export const statementsPageFields: SystemField[] = [
  // Statements Page is SFM-STA-7XXX-X
  {
    sfmId: "SFM-STA-7001",
    description: "Statement Period",
    pageName: "Statements",
    cardName: "Statement Period",
    outputValue: "statementPeriod",
    correlatedTo: "Statement period selection",
    valueType: "Date Range"
  },
  {
    sfmId: "SFM-STA-7002",
    description: "Statement Balance",
    pageName: "Statements",
    cardName: "Statement Summary",
    outputValue: "statementBalance",
    correlatedTo: "Statement balance",
    valueType: "Currency"
  }
];

export const benefitsPageFields: SystemField[] = [
  // FREE Benefits Page is SFM-BEN-8XXX-X
  {
    sfmId: "SFM-BEN-8001",
    description: "Benefit Type",
    pageName: "Benefits",
    cardName: "Benefit Selection",
    outputValue: "benefitType",
    correlatedTo: "Selected benefit type",
    valueType: "Text"
  },
  {
    sfmId: "SFM-BEN-8002",
    description: "Benefit Value",
    pageName: "Benefits",
    cardName: "Benefit Details",
    outputValue: "benefitValue",
    correlatedTo: "Benefit value",
    valueType: "Currency"
  }
];

// Combine all page-based fields
export const allPageBasedSFMFields: SystemField[] = [
  ...freeCalculatorFields,
  ...apfPageFields,
  ...generateAPFYearCodes(),
  ...profilePageFields,
  ...netAssetValueFields,
  ...calculatorsPageFields,
  ...paymentsPageFields,
  ...reportsPageFields,
  ...statementsPageFields,
  ...benefitsPageFields
];

// Export field groups by page
export const fieldsByPage = {
  freeCalculator: freeCalculatorFields,
  apf: [...apfPageFields, ...generateAPFYearCodes()],
  profile: profilePageFields,
  netAssetValue: netAssetValueFields,
  calculators: calculatorsPageFields,
  payments: paymentsPageFields,
  reports: reportsPageFields,
  statements: statementsPageFields,
  benefits: benefitsPageFields
};

// Validation function for SFM code format
export const validateSFMCode = (sfmCode: string): boolean => {
  const patterns = [
    /^SFM-0\d{2}(-[1-9F])?$/, // Free Calculator: SFM-0XX-X
    /^SFM-APF-1\d{3}(-[1-9F]|-[CVG])?$/, // APF: SFM-APF-1XXX-X
    /^SFM-PRF-2\d{3}(-[1-9F])?$/, // Profile: SFM-PRF-2XXX-X
    /^SFM-NAV-3\d{3}(-[1-9F])?$/, // Net Asset Value: SFM-NAV-3XXX-X
    /^SFM-CAL-4\d{3}(-[1-9F])?$/, // Calculators: SFM-CAL-4XXX-X
    /^SFM-PAY-5\d{3}(-[1-9F])?$/, // Payments: SFM-PAY-5XXX-X
    /^SFM-REP-6\d{3}(-[1-9F])?$/, // Reports: SFM-REP-6XXX-X
    /^SFM-STA-7\d{3}(-[1-9F])?$/, // Statements: SFM-STA-7XXX-X
    /^SFM-BEN-8\d{3}(-[1-9F])?$/, // Benefits: SFM-BEN-8XXX-X
  ];
  
  return patterns.some(pattern => pattern.test(sfmCode));
};

// Get page from SFM code
export const getPageFromSFMCode = (sfmCode: string): string => {
  if (sfmCode.startsWith('SFM-0')) return 'Free Calculator';
  if (sfmCode.startsWith('SFM-APF-1')) return 'APF Pages';
  if (sfmCode.startsWith('SFM-PRF-2')) return 'Profile';
  if (sfmCode.startsWith('SFM-NAV-3')) return 'Net Asset Value';
  if (sfmCode.startsWith('SFM-CAL-4')) return 'Calculators';
  if (sfmCode.startsWith('SFM-PAY-5')) return 'Payments';
  if (sfmCode.startsWith('SFM-REP-6')) return 'Reports';
  if (sfmCode.startsWith('SFM-STA-7')) return 'Statements';
  if (sfmCode.startsWith('SFM-BEN-8')) return 'Benefits';
  return 'Unknown';
};


/**
 * Generate APF-42XX series codes for 10-year sponsorship system
 * Each year (1-10) has codes for different aspects with M (Max) or P (Partial) suffix
 */
export const generateAPF42XXSeries = (): SystemField[] => {
  const apfCodes: SystemField[] = [];
  
  // Code ranges for each aspect
  const codeRanges = [
    { start: 4201, end: 4210, description: "APF Initial Contribution", outputPrefix: "apfInitialContribution" },
    { start: 4211, end: 4220, description: "APF Maturity Value", outputPrefix: "apfMaturityValue" },
    { start: 4221, end: 4230, description: "INBL Net Pay Guarantee", outputPrefix: "inblNetPayGuarantee" },
    { start: 4231, end: 4240, description: "INBL NRSR Fee", outputPrefix: "inblNRSRFee" },
    { start: 4241, end: 4250, description: "INBL Principal Balance", outputPrefix: "inblPrincipalBalance" },
    { start: 4251, end: 4260, description: "Remaining Shortfall Balance", outputPrefix: "remainingShortfallBalance" },
    { start: 4261, end: 4270, description: "Monthly ISA Repayment Plan", outputPrefix: "monthlyISARepaymentPlan" },
    { start: 4271, end: 4280, description: "Rolling 12 Month ISA Target", outputPrefix: "rolling12MonthISATarget" },
    { start: 4281, end: 4290, description: "Time Token Reward", outputPrefix: "timeTokenReward" },
    { start: 4291, end: 4300, description: "APF Initial Contributions", outputPrefix: "apfInitialContributions" }
  ];
  
  codeRanges.forEach(range => {
    for (let year = 1; year <= 10; year++) {
      const codeNumber = range.start + (year - 1);
      
      // Generate both M (Maximum) and P (Partial) variants
      ['M', 'P'].forEach(suffix => {
        apfCodes.push({
          sfmId: `SFM-APF-${codeNumber}-${suffix}`,
          description: `${range.description} - Year ${year} (${suffix === 'M' ? 'Maximum' : 'Partial'})`,
          pageName: "APF Registration",
          cardName: `APF Year ${year}`,
          outputValue: `${range.outputPrefix}Year${year}${suffix}`,
          correlatedTo: `${range.description} for sponsorship year ${year} - ${suffix === 'M' ? 'full funding' : 'partial funding'}`,
          valueType: range.description.includes('Fee') || range.description.includes('Contribution') || range.description.includes('Balance') || range.description.includes('Value') || range.description.includes('Target') || range.description.includes('Reward') ? "Currency" : "Text"
        });
      });
    }
  });
  
  return apfCodes;
};