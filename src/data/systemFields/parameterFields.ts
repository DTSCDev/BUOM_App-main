
import { SystemField } from './types';

export const parameterFields: SystemField[] = [
  // Core System Parameters
  {
    sfmId: "SFM-018",
    description: "State Pension Weekly",
    pageName: "Parameters Tab",
    cardName: "State Pension Parameters",
    outputValue: "statePensionWeekly",
    correlatedTo: "£230.25 (May 2025) - Review annually",
    valueType: "Current Value"
  },
  {
    sfmId: "SFM-020",
    description: "Monthly Top Up Contribution",
    pageName: "Affordability Tab",
    cardName: "Cost Comparison to Fund Shortfall", 
    outputValue: "monthlyFundingCost",
    correlatedTo: "Monthly top-up contribution required (replaces SFM-008)",
    valueType: "Year 1 Amount"
  },
  {
    sfmId: "SFM-019",
    description: "Pension Income Inflation", 
    pageName: "Parameters Tab",
    cardName: "Inflation Parameters",
    outputValue: "pensionIncomeInflation",
    correlatedTo: "2% per annum for state pension growth",
    valueType: "Rate"
  },
  {
    sfmId: "SFM-021",
    description: "Growth Rate Accumulation (CORRECTED)",
    pageName: "Parameters Tab",
    cardName: "Growth Parameters",
    outputValue: "growthRateAccumulation", 
    correlatedTo: "5% p.a. gross investment growth (4.5% net after 0.5% fees)",
    valueType: "Rate"
  },
  {
    sfmId: "SFM-022",
    description: "Drawdown Rate",
    pageName: "Parameters Tab",
    cardName: "Drawdown Parameters",
    outputValue: "drawdownRate",
    correlatedTo: "3.5% p.a. sustainable withdrawal rate", 
    valueType: "Rate"
  },
  
  // Enhanced Asset-Level Parameters (Premium Feature)
  {
    sfmId: "SFM-040",
    description: "Cash Growth Rate Range",
    pageName: "Parameters Tab",
    cardName: "Asset-Specific Growth Parameters",
    outputValue: "cashGrowthRate",
    correlatedTo: "3.5% to 5.5% current market rates",
    valueType: "Rate Range"
  },
  {
    sfmId: "SFM-041",
    description: "Bonds & Credit Growth Rate Range",
    pageName: "Parameters Tab",
    cardName: "Asset-Specific Growth Parameters",
    outputValue: "bondsGrowthRate",
    correlatedTo: "4% to 18% depending on risk profile",
    valueType: "Rate Range"
  },
  {
    sfmId: "SFM-043",
    description: "Equity Growth Rate Range",
    pageName: "Parameters Tab",
    cardName: "Asset-Specific Growth Parameters",
    outputValue: "equityGrowthRate",
    correlatedTo: "3.5% to 30% depending on market exposure",
    valueType: "Rate Range"
  },
  {
    sfmId: "SFM-043",
    description: "Property Growth Rate Range",
    pageName: "Parameters Tab",
    cardName: "Asset-Specific Growth Parameters",
    outputValue: "propertyGrowthRate",
    correlatedTo: "2% to 15% including rental yield",
    valueType: "Rate Range"
  },
  {
    sfmId: "SFM-044",
    description: "Alternative Investment Growth Rate Range",
    pageName: "Parameters Tab",
    cardName: "Asset-Specific Growth Parameters",
    outputValue: "alternativeGrowthRate",
    correlatedTo: "0% to 25% high risk/high return assets",
    valueType: "Rate Range"
  }
];
