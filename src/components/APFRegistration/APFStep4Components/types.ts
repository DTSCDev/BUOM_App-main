export interface CalculationInput {
  profile: any;
  assets: any[];
}

export interface CalculationResult {
  unifiedResult: any;
  apfSponsorships: any[];
  totalMaturityValue: number;
  totalISAContributions: number;
  hasError: boolean;
  errorMessage: string;
}