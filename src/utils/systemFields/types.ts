
export interface SFMValueMap {
  [sfmId: string]: number;
}

export interface AssetCategory {
  name?: string;
}

export interface Asset {
  name?: string;
  category?: AssetCategory;
  value?: number;
}

export interface Profile {
  annual_salary?: number;
  pension_contribution_employee?: number;
  pension_contribution_employer?: number;
  state_pension_age?: number;
  target_retirement_income?: number;
  [key: string]: unknown;
}

export interface SFMCalculationContext {
  profile: Profile;
  assets: Asset[];
  currentAge: number;
  existingPensionValue: number;
}
