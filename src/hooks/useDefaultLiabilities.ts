
import { Category } from "@/types/NetAssetValue";

interface DefaultLiability {
  name: string;
  value: number;
  description?: string;
  interest_rate?: number | null;
  account_number?: string;
}

export function useDefaultLiabilities() {
  // Default liability examples based on category
  const getDefaultLiabilities = (category: Category): DefaultLiability[] => {
    switch (category.name) {
      case 'Loans':
        return [
          { name: 'INBL Loan', value: 39125, description: 'Interest Not Bearing Loan', interest_rate: 0, account_number: 'INBL-2023' }
        ];
      case 'Other Debts':
        return [
          { name: 'Credit Card', value: 15300, description: 'Credit card balances', interest_rate: 19.9, account_number: 'CC-1234-5678' },
          { name: 'Student Loan', value: 28125, description: 'Student loan debt', interest_rate: 2.75, account_number: 'SL-98765' }
        ];
      default:
        return [];
    }
  };

  return { getDefaultLiabilities };
}
