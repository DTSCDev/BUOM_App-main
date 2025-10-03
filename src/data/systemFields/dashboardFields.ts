
import { SystemField } from './types';

export const dashboardFields: SystemField[] = [
  // Dashboard - Salary Assumptions Card (FIXED: Using unique SFM codes 123-130)
  {
    sfmId: "SFM-123", // CHANGED FROM SFM-023 to avoid conflict
    description: "Dashboard Current Salary",
    pageName: "Dashboard",
    cardName: "Salary Assumptions Card",
    outputValue: "currentSalary",
    correlatedTo: "Displayed annually",
    valueType: "Today"
  },
  {
    sfmId: "SFM-124", // CHANGED FROM SFM-024 to avoid conflict
    description: "Dashboard Future Salary",
    pageName: "Dashboard",
    cardName: "Salary Assumptions Card", 
    outputValue: "futureSalary",
    correlatedTo: "Current salary inflated to retirement",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-125", // CHANGED FROM SFM-025 to avoid conflict
    description: "Dashboard Pay Days Remaining",
    pageName: "Dashboard",
    cardName: "Salary Assumptions Card",
    outputValue: "payDaysRemaining", 
    correlatedTo: "Exact months until retirement (years × 12 + months)",
    valueType: "Count"
  },
  
  // Dashboard - Retirement Plan Target Card (FIXED: Using unique SFM codes)
  {
    sfmId: "SFM-126", // CHANGED FROM SFM-026 to avoid conflict
    description: "Dashboard Your Target Income",
    pageName: "Dashboard",
    cardName: "Retirement Plan Target Card",
    outputValue: "targetIncome",
    correlatedTo: "SFM-124 × 50% (Future Salary × Default Target Income Parameter)",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-127", // CHANGED FROM SFM-027 to avoid conflict
    description: "Dashboard Existing Plan Future Income",
    pageName: "Dashboard",
    cardName: "Retirement Plan Target Card",
    outputValue: "existingPlanIncome",
    correlatedTo: "State pension + projected pension assets income (calculated directly)",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-129", // CHANGED FROM SFM-029 to avoid conflict
    description: "Dashboard Retirement Progress Percentage",
    pageName: "Dashboard",
    cardName: "Retirement Plan Target Card",
    outputValue: "retirementProgressPercentage",
    correlatedTo: "SFM-127 / SFM-126 × 100", // Updated references to new codes
    valueType: "Percentage"
  },
  
  // Dashboard - Repayment Plan Target Card (FIXED: Using unique SFM codes)
  {
    sfmId: "SFM-130", // CHANGED FROM SFM-030 to avoid conflict
    description: "Dashboard ISA Total Monthly Requirement",
    pageName: "Dashboard",
    cardName: "Repayment Plan Target Card",
    outputValue: "isaTargetTotalMonthly",
    correlatedTo: "Total ISA monthly requirement across all sponsorship years",
    valueType: "Today"
  },
  {
    sfmId: "SFM-030A",
    description: "Dashboard ISA Current Year Monthly Requirement",
    pageName: "Dashboard",
    cardName: "Repayment Plan Target Card",
    outputValue: "isaTargetCurrentYearMonthly",
    correlatedTo: "Current year proportional ISA monthly requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-031",
    description: "Dashboard ISA Savings Value Today",
    pageName: "Dashboard",
    cardName: "Repayment Plan Target Card",
    outputValue: "isaValueToday",
    correlatedTo: "Current ISA assets from Net Asset Value",
    valueType: "Today"
  },
  {
    sfmId: "SFM-032",
    description: "Dashboard ISA Savings Target Today",
    pageName: "Dashboard",
    cardName: "Repayment Plan Target Card",
    outputValue: "isaTargetToday",
    correlatedTo: "Annual target based on current year monthly requirement (SFM-030A × 12)",
    valueType: "Today"
  },
  {
    sfmId: "SFM-033",
    description: "Dashboard Repayment Progress Percentage",
    pageName: "Dashboard",
    cardName: "Repayment Plan Target Card",
    outputValue: "repaymentProgressPercentage",
    correlatedTo: "ISA Value Today / Current Year ISA Target Annual × 100",
    valueType: "Percentage"
  },
  
  // Dashboard - Chart Statistics Card
  {
    sfmId: "SFM-034",
    description: "Chart Estimated Shortfall at Retirement",
    pageName: "Dashboard",
    cardName: "Chart Statistics Card",
    outputValue: "estimatedShortfallAtRetirement",
    correlatedTo: "Should be £0 if BUOM plan works correctly",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-145",
    description: "APF Starting Point (Total Maturity Target)",
    pageName: "Dashboard",
    cardName: "APF Funding Plan",
    outputValue: "apfStartingPoint",
    correlatedTo: "Copy of SFM-007 - APF starting point for sponsorship calculations",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-036",
    description: "Chart Shortfall at Retirement",
    pageName: "Dashboard",
    cardName: "Chart Statistics Card",
    outputValue: "shortfallAtRetirement",
    correlatedTo: "Retirement shortfall after all funding sources - should be £0 if BUOM plan works",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-037",
    description: "Chart Capital Shortfall Today",
    pageName: "Dashboard",
    cardName: "Chart Statistics Card",
    outputValue: "capitalShortfallToday",
    correlatedTo: "Current age capital shortfall from chart data",
    valueType: "Today"
  },

  // Chart Legend Items
  {
    sfmId: "SFM-038",
    description: "Chart Legend - INBL Debt",
    pageName: "Dashboard",
    cardName: "Pension Shortfall Chart Legend",
    outputValue: "inblDebtValue",
    correlatedTo: "INBL balance shown as negative debt in chart",
    valueType: "Variable"
  },
  {
    sfmId: "SFM-039",
    description: "Chart Legend - APF Asset Value",
    pageName: "Dashboard",
    cardName: "Pension Shortfall Chart Legend",
    outputValue: "apfAssetValue",
    correlatedTo: "APF assets value over time in chart",
    valueType: "Variable"
  },
  {
    sfmId: "SFM-040",
    description: "Chart Legend - ISA Value",
    pageName: "Dashboard",
    cardName: "Pension Shortfall Chart Legend",
    outputValue: "isaValue",
    correlatedTo: "ISA accumulation value over time in chart",
    valueType: "Variable"
  },
  {
    sfmId: "SFM-041",
    description: "Chart Legend - BUOM Total Value",
    pageName: "Dashboard",
    cardName: "Pension Shortfall Chart Legend",
    outputValue: "buomTotalValue",
    correlatedTo: "Combined APF + ISA value over time in chart",
    valueType: "Variable"
  },
  {
    sfmId: "SFM-042",
    description: "Chart Legend - Capital Shortfall",
    pageName: "Dashboard",
    cardName: "Pension Shortfall Chart Legend",
    outputValue: "capitalShortfall",
    correlatedTo: "Remaining pension funding gap over time in chart",
    valueType: "Variable"
  },

  // BUOM Principles Table - Year-specific codes
  // Annual INBL - Years 1-10
  {
    sfmId: "SFM-166-1",
    description: "BUOM Table - Annual INBL (Year 1)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year1INBL",
    correlatedTo: "First year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-2",
    description: "BUOM Table - Annual INBL (Year 2)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year2INBL",
    correlatedTo: "Second year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-3",
    description: "BUOM Table - Annual INBL (Year 3)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year3INBL",
    correlatedTo: "Third year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-4",
    description: "BUOM Table - Annual INBL (Year 4)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year4INBL",
    correlatedTo: "Fourth year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-5",
    description: "BUOM Table - Annual INBL (Year 5)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year5INBL",
    correlatedTo: "Fifth year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-6",
    description: "BUOM Table - Annual INBL (Year 6)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year6INBL",
    correlatedTo: "Sixth year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-7",
    description: "BUOM Table - Annual INBL (Year 7)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year7INBL",
    correlatedTo: "Seventh year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-8",
    description: "BUOM Table - Annual INBL (Year 8)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year8INBL",
    correlatedTo: "Eighth year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-9",
    description: "BUOM Table - Annual INBL (Year 9)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year9INBL",
    correlatedTo: "Ninth year annual INBL principal amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-166-10",
    description: "BUOM Table - Annual INBL (Year 10)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year10INBL",
    correlatedTo: "Tenth year annual INBL principal amount",
    valueType: "Today"
  },
  
  // APF Funding - Years 1-10
  {
    sfmId: "SFM-169-1",
    description: "BUOM Table - APF Funding (Year 1)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year1APF",
    correlatedTo: "First year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-2",
    description: "BUOM Table - APF Funding (Year 2)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year2APF",
    correlatedTo: "Second year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-3",
    description: "BUOM Table - APF Funding (Year 3)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year3APF",
    correlatedTo: "Third year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-4",
    description: "BUOM Table - APF Funding (Year 4)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year4APF",
    correlatedTo: "Fourth year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-5",
    description: "BUOM Table - APF Funding (Year 5)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year5APF",
    correlatedTo: "Fifth year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-6",
    description: "BUOM Table - APF Funding (Year 6)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year6APF",
    correlatedTo: "Sixth year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-7",
    description: "BUOM Table - APF Funding (Year 7)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year7APF",
    correlatedTo: "Seventh year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-8",
    description: "BUOM Table - APF Funding (Year 8)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year8APF",
    correlatedTo: "Eighth year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-9",
    description: "BUOM Table - APF Funding (Year 9)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year9APF",
    correlatedTo: "Ninth year APF sponsorship amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-169-10",
    description: "BUOM Table - APF Funding (Year 10)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year10APF",
    correlatedTo: "Tenth year APF sponsorship amount",
    valueType: "Today"
  },
  
  // ISA Monthly - Years 1-10
  {
    sfmId: "SFM-172-1",
    description: "BUOM Table - ISA Monthly (Year 1)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year1ISAMonthly",
    correlatedTo: "First year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-2",
    description: "BUOM Table - ISA Monthly (Year 2)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year2ISAMonthly",
    correlatedTo: "Second year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-3",
    description: "BUOM Table - ISA Monthly (Year 3)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year3ISAMonthly",
    correlatedTo: "Third year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-4",
    description: "BUOM Table - ISA Monthly (Year 4)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year4ISAMonthly",
    correlatedTo: "Fourth year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-5",
    description: "BUOM Table - ISA Monthly (Year 5)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year5ISAMonthly",
    correlatedTo: "Fifth year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-6",
    description: "BUOM Table - ISA Monthly (Year 6)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year6ISAMonthly",
    correlatedTo: "Sixth year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-7",
    description: "BUOM Table - ISA Monthly (Year 7)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year7ISAMonthly",
    correlatedTo: "Seventh year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-8",
    description: "BUOM Table - ISA Monthly (Year 8)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year8ISAMonthly",
    correlatedTo: "Eighth year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-9",
    description: "BUOM Table - ISA Monthly (Year 9)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year9ISAMonthly",
    correlatedTo: "Ninth year monthly ISA contribution requirement",
    valueType: "Today"
  },
  {
    sfmId: "SFM-172-10",
    description: "BUOM Table - ISA Monthly (Year 10)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year10ISAMonthly",
    correlatedTo: "Tenth year monthly ISA contribution requirement",
    valueType: "Today"
  },
  
  // NPG Amount - Years 1-10
  {
    sfmId: "SFM-155-1",
    description: "NPG Amount (Year 1)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year1NPGAmount",
    correlatedTo: "First year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-2",
    description: "NPG Amount (Year 2)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year2NPGAmount",
    correlatedTo: "Second year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-3",
    description: "NPG Amount (Year 3)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year3NPGAmount",
    correlatedTo: "Third year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-4",
    description: "NPG Amount (Year 4)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year4NPGAmount",
    correlatedTo: "Fourth year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-5",
    description: "NPG Amount (Year 5)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year5NPGAmount",
    correlatedTo: "Fifth year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-6",
    description: "NPG Amount (Year 6)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year6NPGAmount",
    correlatedTo: "Sixth year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-7",
    description: "NPG Amount (Year 7)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year7NPGAmount",
    correlatedTo: "Seventh year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-8",
    description: "NPG Amount (Year 8)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year8NPGAmount",
    correlatedTo: "Eighth year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-9",
    description: "NPG Amount (Year 9)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year9NPGAmount",
    correlatedTo: "Ninth year Net Pay Guarantee amount",
    valueType: "Today"
  },
  {
    sfmId: "SFM-155-10",
    description: "NPG Amount (Year 10)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year10NPGAmount",
    correlatedTo: "Tenth year Net Pay Guarantee amount",
    valueType: "Today"
  },
  
  // NRSR Fee - Years 1-10
  {
    sfmId: "SFM-156-1",
    description: "NRSR Fee (Year 1)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year1NRSRFee",
    correlatedTo: "First year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-2",
    description: "NRSR Fee (Year 2)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year2NRSRFee",
    correlatedTo: "Second year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-3",
    description: "NRSR Fee (Year 3)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year3NRSRFee",
    correlatedTo: "Third year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-4",
    description: "NRSR Fee (Year 4)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year4NRSRFee",
    correlatedTo: "Fourth year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-5",
    description: "NRSR Fee (Year 5)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year5NRSRFee",
    correlatedTo: "Fifth year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-6",
    description: "NRSR Fee (Year 6)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year6NRSRFee",
    correlatedTo: "Sixth year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-7",
    description: "NRSR Fee (Year 7)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year7NRSRFee",
    correlatedTo: "Seventh year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-8",
    description: "NRSR Fee (Year 8)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year8NRSRFee",
    correlatedTo: "Eighth year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-9",
    description: "NRSR Fee (Year 9)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year9NRSRFee",
    correlatedTo: "Ninth year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  {
    sfmId: "SFM-156-10",
    description: "NRSR Fee (Year 10)",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "year10NRSRFee",
    correlatedTo: "Tenth year Non Recourse Single Repayment fee",
    valueType: "Today"
  },
  
  // Totals remain as base codes
  {
    sfmId: "SFM-175",
    description: "BUOM Table - Total INBL",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "totalINBL",
    correlatedTo: "Sum of all annual INBL amounts",
    valueType: "Today"
  },
  {
    sfmId: "SFM-176",
    description: "BUOM Table - Total APF",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "totalAPF",
    correlatedTo: "Sum of all APF sponsorship amounts",
    valueType: "Today"
  },
  {
    sfmId: "SFM-177",
    description: "BUOM Table - Total ISA Monthly",
    pageName: "Dashboard",
    cardName: "BUOM Principles Table",
    outputValue: "totalISAMonthly",
    correlatedTo: "Sum of all monthly ISA requirements",
    valueType: "Today"
  },

  // Current Year APF Card
  {
    sfmId: "SFM-178",
    description: "Current Year APF Asset Value",
    pageName: "Dashboard",
    cardName: "Current Year APF Card",
    outputValue: "currentYearAPFAssetValue",
    correlatedTo: "APF asset value for current sponsorship year",
    valueType: "Today"
  },
  {
    sfmId: "SFM-179",
    description: "Current Year APF Maturity Value",
    pageName: "Dashboard",
    cardName: "Current Year APF Card",
    outputValue: "currentYearAPFMaturityValue",
    correlatedTo: "APF maturity value for current sponsorship year",
    valueType: "Retirement"
  },
  {
    sfmId: "SFM-180",
    description: "Current Year APF Deferred Fees",
    pageName: "Dashboard",
    cardName: "Current Year APF Card",
    outputValue: "currentYearAPFDeferredFees",
    correlatedTo: "APF deferred fees for current sponsorship year",
    valueType: "Today"
  },
  {
    sfmId: "SFM-181",
    description: "Current Year APF Employer Savings",
    pageName: "Dashboard",
    cardName: "Current Year APF Card",
    outputValue: "currentYearAPFEmployerSavings",
    correlatedTo: "Employer savings from current year APF sponsorship",
    valueType: "Today"
  },

  // Current Year INBL Card
  {
    sfmId: "SFM-182",
    description: "Current Year INBL Loan Value",
    pageName: "Dashboard",
    cardName: "Current Year INBL Card",
    outputValue: "currentYearINBLLoanValue",
    correlatedTo: "INBL loan value for current sponsorship year",
    valueType: "Today"
  },
  {
    sfmId: "SFM-183",
    description: "Current Year INBL NPG Loan",
    pageName: "Dashboard",
    cardName: "Current Year INBL Card",
    outputValue: "currentYearINBLNPGLoan",
    correlatedTo: "Net Pay Guarantee loan for current year",
    valueType: "Today"
  },
  {
    sfmId: "SFM-184",
    description: "Current Year INBL ZVaR Loan",
    pageName: "Dashboard",
    cardName: "Current Year INBL Card",
    outputValue: "currentYearINBLZVaRLoan",
    correlatedTo: "Zero Value at Risk loan for current year",
    valueType: "Today"
  },
  {
    sfmId: "SFM-185",
    description: "Current Year INBL Funds Released",
    pageName: "Dashboard",
    cardName: "Current Year INBL Card",
    outputValue: "currentYearINBLFundsReleased",
    correlatedTo: "INBL funds released for current year",
    valueType: "Today"
  },
  {
    sfmId: "SFM-186",
    description: "Current Year INBL Funds Remaining",
    pageName: "Dashboard",
    cardName: "Current Year INBL Card",
    outputValue: "currentYearINBLFundsRemaining",
    correlatedTo: "INBL funds remaining for current year",
    valueType: "Today"
  },

  // APF Summary Cards
  {
    sfmId: "SFM-187",
    description: "APF Summary - Total APF Assets",
    pageName: "Dashboard",
    cardName: "APF Summary Cards",
    outputValue: "apfSummaryTotalAssets",
    correlatedTo: "Sum of all APF assets across all years",
    valueType: "Today"
  },
  {
    sfmId: "SFM-188",
    description: "APF Summary - Total INBL Loan",
    pageName: "Dashboard",
    cardName: "APF Summary Cards",
    outputValue: "apfSummaryTotalINBLLoan",
    correlatedTo: "Sum of all INBL loans across all years",
    valueType: "Today"
  },
  {
    sfmId: "SFM-189",
    description: "APF Summary - Total ISA Savings",
    pageName: "Dashboard",
    cardName: "APF Summary Cards",
    outputValue: "apfSummaryTotalISASavings",
    correlatedTo: "Sum of all ISA savings across all years",
    valueType: "Today"
  },
  {
    sfmId: "SFM-190",
    description: "APF Summary - Total General Account",
    pageName: "Dashboard",
    cardName: "APF Summary Cards",
    outputValue: "apfSummaryTotalGeneralAccount",
    correlatedTo: "Sum of all general account values across all years",
    valueType: "Today"
  }
];
