
export interface SFMValueMap {
  [sfmId: string]: number;
}

export interface SFMCalculationContext {
  profile: any;
  assets: any[];
  currentAge: number;
  existingPensionValue: number;
}
