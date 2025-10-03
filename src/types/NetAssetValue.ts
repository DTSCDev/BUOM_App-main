
export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string | null;
  display_order: number;
}

export interface Asset {
  id: string;
  member_id: string;
  category_id: number;
  name: string;
  description: string | null;
  value: number;
  is_imported: boolean;
  is_liquid: boolean;
  account_number?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  isDetailsVisible?: boolean;
  sfm_code?: string; // Added SFM code support
}

export interface Liability {
  id: string;
  member_id: string;
  category_id: number;
  name: string;
  description: string | null;
  value: number;
  is_imported: boolean;
  interest_rate: number | null;
  account_number?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  isDetailsVisible?: boolean;
  sfm_code?: string; // Added SFM code support
}

export interface NetWorth {
  total_assets: number;
  total_liabilities: number;
  net_asset_value: number;
}
