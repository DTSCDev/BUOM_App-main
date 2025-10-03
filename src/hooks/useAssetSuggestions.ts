
import { Asset, Category } from "@/types/NetAssetValue";

interface AssetItemDisplay {
  id: string;
  name: string;
  value: number;
  description?: string | null;
  account_number?: string;
  is_liquid?: boolean;
  isReal: boolean;
}

export function useAssetSuggestions(
  category: Category,
  assets: Asset[]
) {
  // Only show real assets, no default ones
  const displayItems: AssetItemDisplay[] = assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    value: asset.value,
    description: asset.description,
    account_number: asset.account_number,
    is_liquid: asset.is_liquid,
    isReal: true
  }));
    
  const createSuggestionAsset = (item: any): Partial<Asset> => {
    return {
      category_id: category.id,
      name: item.name,
      description: item.description || "",
      value: item.value,
      is_liquid: item.is_liquid || false,
      account_number: item.account_number || ""
    };
  };
  
  return { 
    displayItems,
    createSuggestionAsset
  };
}
