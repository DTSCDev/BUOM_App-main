
import { Category } from "@/types/NetAssetValue";

interface DefaultAsset {
  name: string;
  value: number;
  description?: string;
  is_liquid?: boolean;
  pension_type?: string;
  account_number?: string;
}

export function useDefaultAssets() {
  // Default asset examples based on category
  const getDefaultAssets = (category: Category): DefaultAsset[] => {
    switch (category.name) {
      case 'Cash & ISA Savings':
        return [
          { name: 'General Account', value: 2425, description: 'Everyday savings account', is_liquid: true, account_number: '' },
          { name: 'ISA Savings', value: 1335, description: 'Tax-free savings account', is_liquid: true, account_number: '' },
          { name: 'Emergency Fund', value: 125, description: '3-6 months of expenses', is_liquid: true, account_number: '' },
          { name: 'Holiday Fund', value: 236, description: 'Savings for vacations', is_liquid: true, account_number: '' },
          { name: 'Current Account', value: 236, description: 'Primary banking account', is_liquid: true, account_number: '' }
        ];
      case 'Investments':
        return [
          { name: 'VCTs', value: 41550, description: 'Venture Capital Trusts', account_number: '' },
          { name: 'Crypto', value: 39125, description: 'Cryptocurrency investments', account_number: '' },
        ];
      case 'Property':
        return [
          { name: 'Main Residence', value: 679000, description: 'Primary home', account_number: '' },
          { name: 'Buy To Let', value: 425000, description: 'Rental investment property', account_number: '' },
          { name: 'Holiday Home', value: 229000, description: 'Vacation property', account_number: '' },
        ];
      case 'Pensions':
        return [
          { name: 'Workplace Pension', value: 75000, description: 'Aegon workplace pension scheme', pension_type: 'Defined Contribution', account_number: 'POL123456' },
          { name: 'Individual Pension', value: 45000, description: 'Personal pension plan', pension_type: 'Defined Contribution', account_number: 'AB987654' },
          { name: 'SIPP', value: 123006, description: 'Self-Invested Personal Pension', pension_type: 'SIPP', account_number: 'SIPP-001-22' },
          { name: 'SSAS', value: 275125, description: 'Small Self-Administered Scheme', pension_type: 'SSAS', account_number: 'SSAS-2023-01' },
          { name: 'Final Salary', value: 475125, description: 'Defined benefit pension', pension_type: 'Defined Benefit', account_number: 'FS-12345-DB' },
        ];
      default:
        return [];
    }
  };

  return { getDefaultAssets };
}
