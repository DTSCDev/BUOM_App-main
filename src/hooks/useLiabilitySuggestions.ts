
import { Liability, Category } from "@/types/NetAssetValue";

interface LiabilityItemDisplay {
  id: string;
  name: string;
  value: number;
  description?: string | null;
  account_number?: string;
  interest_rate?: number | null;
  isReal: boolean;
}

export function useLiabilitySuggestions(
  category: Category,
  liabilities: Liability[]
) {
  // Only show real liabilities, no default ones
  const displayItems: LiabilityItemDisplay[] = liabilities.map(liability => ({
    id: liability.id,
    name: liability.name,
    value: liability.value,
    description: liability.description,
    account_number: liability.account_number,
    interest_rate: liability.interest_rate,
    isReal: true
  }));
    
  const createSuggestionLiability = (item: any): Partial<Liability> => {
    return {
      category_id: category.id,
      name: item.name,
      description: item.description || "",
      value: item.value,
      interest_rate: item.interest_rate || null,
      account_number: item.account_number || ""
    };
  };
  
  return { 
    displayItems,
    createSuggestionLiability
  };
}
