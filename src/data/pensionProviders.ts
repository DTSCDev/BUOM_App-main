export const authorisedMasterTrusts: string[] = [
  "Aegon Master Trust",
  "The Aon MasterTrust",
  "Aviva Master Trust",
  "The Baptist Pension Scheme",
  "BCF Pension Trust",
  "The Cheviot Pension",
  "Combined Nuclear Pension Plan",
  "Creative Pension Trust",
  "Cushon Master Trust",
  "FCA Pension Plan",
  "Fidelity Master Trust",
  "Industry-Wide Defined Contribution Section (Railways Pension Scheme)",
  "The ITB Pension Funds",
  "Legal & General WorkSave Mastertrust",
  "Legal & General WorkSave Mastertrust (RAS)",
  "The Lewis Workplace Pension Trust",
  "LifeSight",
  "Mercer Master Trust",
  "National Employment Savings Trust (NEST)",
  "NOW: Pensions Trust",
  "Options Workplace Pension Trust",
  "The Pensions Trust (TPT Retirement Solutions)",
  "The People’s Pension",
  "Scottish Widows Master Trust",
  "The SEI Master Trust",
  "Smart Pension Master Trust",
  "Standard Life DC Master Trust",
  "Stanplan A",
  "Superannuation Arrangements Of The University Of London (SAUL)",
  "Universities Superannuation Scheme",
  "The University of Oxford Staff Pension Scheme",
];

export const personalPensionProviders: string[] = [
  "Aviva Personal Pension",
  "Aegon Personal Pension",
  "Scottish Widows Personal Pension",
  "Legal & General Personal Pension",
  "Standard Life Personal Pension",
  "Royal London Personal Pension",
  "Fidelity Personal Pension",
  "Prudential Personal Pension",
  "Phoenix Life / ReAssure Personal Pension",
  "PensionBee",
  "Penfold",
  "Moneybox Pension",
  "Wealthify Pension",
  "OneFamily Pension",
  "True Potential Investor Pension",
];

export const sippProviders: string[] = [
  "Hargreaves Lansdown SIPP",
  "AJ Bell Youinvest SIPP",
  "Vanguard Personal Pension (SIPP)",
  "Interactive Investor SIPP",
  "Nutmeg Pension (SIPP)",
  "James Hay Partnership SIPP",
  "Curtis Banks SIPP",
  "Dentons SIPP",
  "Rowanmoor SIPP",
  "Embark / Advance by Embark SIPP",
  "Charles Stanley Direct SIPP",
  "Bestinvest SIPP",
  "iWeb SIPP",
];

export type PensionProviderCategory = 'workplace' | 'personal' | 'sipp' | 'all';

export const getProvidersByCategory = (category: PensionProviderCategory): string[] => {
  switch (category) {
    case 'workplace':
      return authorisedMasterTrusts;
    case 'personal':
      return personalPensionProviders;
    case 'sipp':
      return sippProviders;
    case 'all':
    default:
      return [
        ...authorisedMasterTrusts,
        ...personalPensionProviders,
        ...sippProviders,
      ];
  }
};