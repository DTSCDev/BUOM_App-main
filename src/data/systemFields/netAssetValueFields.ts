import { SystemField } from './types';

// Net Asset Value Page - SFM-NAV-3XXX-X Code Structure
// SFM-NAV-3000 to 3499 are reserved for LIABILITIES
// SFM-NAV-3500 to 3999 are reserved for ASSETS

export const netAssetValueFields: SystemField[] = [
  // ===========================================
  // LIABILITIES SECTION (SFM-NAV-3000 to 3499)
  // ===========================================
  
  // Total Liabilities Summary
  {
    sfmId: "SFM-NAV-3000",
    description: "Total Liabilities",
    pageName: "Net Asset Value",
    cardName: "Liability Summary",
    outputValue: "totalLiabilities",
    correlatedTo: "Sum of all liability values",
    valueType: "Currency"
  },

  // Loan > Mortgage Section (SFM-NAV-3001 to 3100)
  {
    sfmId: "SFM-NAV-3001",
    description: "Loan > Mortgage (Main Residence)",
    pageName: "Net Asset Value",
    cardName: "Mortgage Loans",
    outputValue: "mortgageMainResidence",
    correlatedTo: "Main residence mortgage balance",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3002",
    description: "Loan > Mortgage (Equity Release)",
    pageName: "Net Asset Value",
    cardName: "Mortgage Loans",
    outputValue: "mortgageEquityRelease",
    correlatedTo: "Equity release mortgage balance",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3101",
    description: "Loan > Mortgage (Investment Property)",
    pageName: "Net Asset Value",
    cardName: "Mortgage Loans",
    outputValue: "mortgageInvestmentProperty",
    correlatedTo: "Investment property mortgage balance",
    valueType: "Currency"
  },

  // Loan > Credit Card Section (SFM-NAV-3201)
  {
    sfmId: "SFM-NAV-3201",
    description: "Loan > Credit Card",
    pageName: "Net Asset Value",
    cardName: "Credit Card Debt",
    outputValue: "creditCardDebt",
    correlatedTo: "Total credit card outstanding balance",
    valueType: "Currency"
  },

  // Other Debts Section (SFM-NAV-3301 to 3401)
  {
    sfmId: "SFM-NAV-3301",
    description: "Other Debts > INBL Principal",
    pageName: "Net Asset Value",
    cardName: "Other Debts",
    outputValue: "inblPrincipal",
    correlatedTo: "Interest Not Bearing Loan principal amount",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3401",
    description: "Other Debts > Loan",
    pageName: "Net Asset Value",
    cardName: "Other Debts",
    outputValue: "otherLoans",
    correlatedTo: "Other miscellaneous loans",
    valueType: "Currency"
  },

  // ===========================================
  // ASSETS SECTION (SFM-NAV-3500 to 3999)
  // ===========================================
  
  // Total Assets Summary
  {
    sfmId: "SFM-NAV-3500",
    description: "Total Assets",
    pageName: "Net Asset Value",
    cardName: "Asset Summary",
    outputValue: "totalAssets",
    correlatedTo: "Sum of all asset values",
    valueType: "Currency"
  },

  // Pension Assets Section (SFM-NAV-3501 to 3599)
  {
    sfmId: "SFM-NAV-3501",
    description: "Pension > Workplace (Existing Fund Value)",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "workplacePensionValue",
    correlatedTo: "Current workplace pension fund value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3510",
    description: "Pension > Private (Personal Pension)",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "personalPensionValue",
    correlatedTo: "Personal pension fund value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3520",
    description: "Pension > Private (SIPP)",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "sippValue",
    correlatedTo: "Self-Invested Personal Pension value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3530",
    description: "Pension > Private (SSaS)",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "ssasValue",
    correlatedTo: "Small Self-Administered Scheme value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3540",
    description: "Pension > Section 32",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "section32Value",
    correlatedTo: "Section 32 pension value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3550",
    description: "Pension > Section 226",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "section226Value",
    correlatedTo: "Section 226 pension value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3560",
    description: "Pension > Annuity Income",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "annuityIncomeValue",
    correlatedTo: "Annuity income stream value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3570",
    description: "Pension > Final Salary Income",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "finalSalaryIncomeValue",
    correlatedTo: "Final salary pension income value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3580",
    description: "Pension > 3PPS / ZVaR Assets",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "threePPSZVaRValue",
    correlatedTo: "3PPS / ZVaR pension assets value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3599",
    description: "Pension Total",
    pageName: "Net Asset Value",
    cardName: "Pension Assets",
    outputValue: "pensionTotal",
    correlatedTo: "Total of all pension assets",
    valueType: "Currency"
  },

  // Property Assets Section (SFM-NAV-3601 to 3699)
  {
    sfmId: "SFM-NAV-3601",
    description: "Property > Main Residence",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "mainResidenceValue",
    correlatedTo: "Main home property value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3610",
    description: "Property > BTL Investment",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "btlInvestmentValue",
    correlatedTo: "Buy-to-let investment property value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3620",
    description: "Property > Commercial",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "commercialPropertyValue",
    correlatedTo: "Commercial property value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3630",
    description: "Property > Overseas Home",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "overseasHomeValue",
    correlatedTo: "Overseas home property value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3640",
    description: "Property > Off Plan",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "offPlanPropertyValue",
    correlatedTo: "Off plan property investment value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3650",
    description: "Property > Land",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "landValue",
    correlatedTo: "Land investment value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3699",
    description: "Property Total",
    pageName: "Net Asset Value",
    cardName: "Property Assets",
    outputValue: "propertyTotal",
    correlatedTo: "Total of all property assets",
    valueType: "Currency"
  },

  // Investment Assets Section (SFM-NAV-3710 to 3799)
  {
    sfmId: "SFM-NAV-3710",
    description: "Investments > ISA > Cash",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "isaCashValue",
    correlatedTo: "Cash ISA value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3720",
    description: "Investments > ISA > Stocks & Shares",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "isaStocksSharesValue",
    correlatedTo: "Stocks & Shares ISA value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3730",
    description: "Investments > ISA > Innovative Finance",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "isaInnovativeFinanceValue",
    correlatedTo: "Innovative Finance ISA value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3740",
    description: "Investments > ISA > Lifetime",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "isaLifetimeValue",
    correlatedTo: "Lifetime ISA value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3750",
    description: "Investments > ISA > Junior",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "isaJuniorValue",
    correlatedTo: "Junior ISA value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3760",
    description: "Investments > Bond > Onshore",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "bondOnshoreValue",
    correlatedTo: "Onshore bond investments value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3770",
    description: "Investments > Bond > Offshore",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "bondOffshoreValue",
    correlatedTo: "Offshore bond investments value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3780",
    description: "Investments > SEIS",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "seisValue",
    correlatedTo: "SEIS investment value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3790",
    description: "Investments > EIS / VCT",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "eisVctValue",
    correlatedTo: "EIS / VCT investment value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3799",
    description: "Investments Total",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "investmentsTotal",
    correlatedTo: "Total of all investment assets",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3799-1",
    description: "ISA Total",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "isaTotal",
    correlatedTo: "Total of all ISA investments",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3799-2",
    description: "Bond Total",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "bondTotal",
    correlatedTo: "Total of all bond investments",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3799-3",
    description: "SEIS / EIS / VCT Total",
    pageName: "Net Asset Value",
    cardName: "Investment Assets",
    outputValue: "seisEisVctTotal",
    correlatedTo: "Total of SEIS, EIS and VCT investments",
    valueType: "Currency"
  },

  // Cash & Savings Section (SFM-NAV-3800 to 3899)
  {
    sfmId: "SFM-NAV-3800",
    description: "Cash & Savings > Deposit",
    pageName: "Net Asset Value",
    cardName: "Cash & Savings",
    outputValue: "depositValue",
    correlatedTo: "Bank deposit accounts value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3820",
    description: "Cash & Savings > Premium Bonds",
    pageName: "Net Asset Value",
    cardName: "Cash & Savings",
    outputValue: "premiumBondsValue",
    correlatedTo: "Premium bonds holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3899",
    description: "Cash & Savings Total",
    pageName: "Net Asset Value",
    cardName: "Cash & Savings",
    outputValue: "cashSavingsTotal",
    correlatedTo: "Total of all cash and savings",
    valueType: "Currency"
  },

  // Other Investments Section (SFM-NAV-3900 to 3999)
  {
    sfmId: "SFM-NAV-3900",
    description: "Other Investments",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "otherInvestmentsValue",
    correlatedTo: "Other miscellaneous investments value",
    valueType: "Currency"
  },
  
  // Crypto Assets Section (SFM-NAV-3901 to 3950)
  {
    sfmId: "SFM-NAV-3901",
    description: "Other Investment > Crypto > Bitcoin",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoBitcoinValue",
    correlatedTo: "Bitcoin cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3902",
    description: "Other Investment > Crypto > Ethereum",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoEthereumValue",
    correlatedTo: "Ethereum cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3903",
    description: "Other Investment > Crypto > Litecoin",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoLitecoinValue",
    correlatedTo: "Litecoin cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3904",
    description: "Other Investment > Crypto > Ripple (XRP)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoRippleValue",
    correlatedTo: "Ripple (XRP) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3905",
    description: "Other Investment > Crypto > Cardano (ADA)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoCardanoValue",
    correlatedTo: "Cardano (ADA) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3906",
    description: "Other Investment > Crypto > Polkadot (DOT)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoPolkadotValue",
    correlatedTo: "Polkadot (DOT) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3907",
    description: "Other Investment > Crypto > Chainlink (LINK)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoChainlinkValue",
    correlatedTo: "Chainlink (LINK) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3908",
    description: "Other Investment > Crypto > Binance Coin (BNB)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoBinanceCoinValue",
    correlatedTo: "Binance Coin (BNB) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3909",
    description: "Other Investment > Crypto > Solana (SOL)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoSolanaValue",
    correlatedTo: "Solana (SOL) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3910",
    description: "Other Investment > Crypto > Avalanche (AVAX)",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoAvalancheValue",
    correlatedTo: "Avalanche (AVAX) cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3920",
    description: "Other Investment > Crypto > Stablecoins",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoStablecoinsValue",
    correlatedTo: "Stablecoin cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3930",
    description: "Other Investment > Crypto > DeFi Tokens",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoDefiTokensValue",
    correlatedTo: "DeFi token cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3940",
    description: "Other Investment > Crypto > NFTs",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoNftsValue",
    correlatedTo: "NFT (Non-Fungible Token) holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3949",
    description: "Other Investment > Crypto > Other",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoOtherValue",
    correlatedTo: "Other cryptocurrency holdings value",
    valueType: "Currency"
  },
  {
    sfmId: "SFM-NAV-3950",
    description: "Crypto Total",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "cryptoTotal",
    correlatedTo: "Total of all cryptocurrency assets",
    valueType: "Currency"
  },
  
  {
    sfmId: "SFM-NAV-3999",
    description: "Other Investments Total",
    pageName: "Net Asset Value",
    cardName: "Other Investments",
    outputValue: "otherInvestmentsTotal",
    correlatedTo: "Total of all other investments",
    valueType: "Currency"
  }
];