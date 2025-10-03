
import { SystemField } from './types';

export const affordabilityFields: SystemField[] = [
  // Affordability Tab - Monthly Payslip Card
  {
    sfmId: "SFM-014",
    description: "Monthly Take Home Pay",
    pageName: "Affordability Tab",
    cardName: "Monthly Payslip Card",
    outputValue: "netPay",
    correlatedTo: "Gross pay - tax - NI - pension contributions",
    valueType: "Today"
  },
  {
    sfmId: "SFM-115",
    description: "Standard Monthly Funding Cost + Top Up Cost",
    pageName: "Affordability Tab",
    cardName: "Funding Options Card",
    outputValue: "totalFundingCost",
    correlatedTo: "SFM-901 (AE employee contribution) + SFM-008 (top up contribution)",
    valueType: "Today"
  },
  {
    sfmId: "SFM-017",
    description: "Affordability Percentage",
    pageName: "Affordability Tab", 
    cardName: "Affordability Header",
    outputValue: "affordabilityPercentage",
    correlatedTo: "Monthly funding cost / Net pay * 100",
    valueType: "Today"
  },
  {
    sfmId: "SFM-118",
    description: "BUOM Monthly Cost",
    pageName: "Affordability Tab",
    cardName: "Funding Options Card", 
    outputValue: "buomMonthlyCost",
    correlatedTo: "Monthly funding cost * 50% discount",
    valueType: "Year 1 Amount"
  },
  {
    sfmId: "SFM-101-1",
    description: "Affordability Warning Status",
    pageName: "Affordability Tab",
    cardName: "Affordability Alert Card",
    outputValue: "isAffordable",
    correlatedTo: "Monthly funding cost <= 15% of take home pay",
    valueType: "Boolean"
  },
  {
    sfmId: "SFM-119",
    description: "Estimated Monthly Net Pay assuming 1257L",
    pageName: "Affordability Tab",
    cardName: "Estimated Existing Monthly Pay Assumption",
    outputValue: "estimatedNetPay1257L",
    correlatedTo: "SFM-002 (Annual Salary) with fixed 1257L tax code calculation",
    valueType: "Today"
  }
  // SFM-120, SFM-121, SFM-124 REMOVED - These are now deprecated
];
