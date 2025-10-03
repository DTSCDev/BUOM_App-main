
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/NetAssetValue";

interface CategorySelectorProps {
  categories: Category[];
  value: number | undefined;
  onChange: (value: string) => void;
}

// SFM Code ranges and descriptions for each category
const getSFMCodeInfo = (categoryName: string) => {
  const category = categoryName.toLowerCase();
  
  if (category.includes('pension') || category.includes('retirement')) {
    return {
      range: "SFM-NAV-3501 - 3599",
      description: "Pension Assets (Workplace, Personal, SIPP, SSaS, Section 32, Section 226, Annuity Income, Final Salary Income, 3PPS/ZVaR)"
    };
  }
  
  if (category.includes('property') || category.includes('real estate')) {
    return {
      range: "SFM-NAV-3601 - 3699", 
      description: "Property Assets (Main Residence, Investment Property, Commercial Property, Land)"
    };
  }
  
  if (category.includes('investment') || category.includes('stocks') || category.includes('shares') || category.includes('bonds')) {
    return {
      range: "SFM-NAV-3710 - 3799",
      description: "Investment Assets (ISAs, Bonds, SEIS, EIS/VCT, Stocks & Shares, Unit Trusts, Investment Trusts)"
    };
  }
  
  if (category.includes('cash') || category.includes('savings') || category.includes('deposit')) {
    return {
      range: "SFM-NAV-3800 - 3899",
      description: "Cash & Savings (Current Accounts, Savings Accounts, Fixed Term Deposits, Premium Bonds)"
    };
  }
  
  if (category.includes('other') || category.includes('crypto') || category.includes('alternative')) {
    return {
      range: "SFM-NAV-3900 - 3999",
      description: "Other Investments (Crypto Assets, Alternative Investments, Collectibles, Business Assets)"
    };
  }
  
  // Default for unrecognized categories
  return {
    range: "SFM-NAV-3500 - 3999",
    description: "Asset Categories"
  };
};

const getLiabilitySFMCodeInfo = (categoryName: string) => {
  const category = categoryName.toLowerCase();
  
  if (category.includes('mortgage') || category.includes('loan') && category.includes('secured')) {
    return {
      range: "SFM-NAV-3001 - 3199",
      description: "Mortgage Liabilities (Main Residence, Investment Property, Equity Release, Commercial)"
    };
  }
  
  if (category.includes('credit') && category.includes('card')) {
    return {
      range: "SFM-NAV-3201 - 3299",
      description: "Credit Card Liabilities (Personal Credit Cards, Business Credit Cards, Store Cards)"
    };
  }
  
  if (category.includes('debt') || category.includes('loan') || category.includes('other')) {
    return {
      range: "SFM-NAV-3301 - 3499",
      description: "Other Debt Liabilities (Personal Loans, Business Loans, Overdrafts, HP Agreements)"
    };
  }
  
  // Default for liability categories
  return {
    range: "SFM-NAV-3000 - 3499",
    description: "Liability Categories"
  };
};

export default function CategorySelector({ categories, value, onChange }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category_id">Category</Label>
      <Select
        value={value ? value.toString() : ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="category_id">
          <SelectValue placeholder="Please select" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {categories.map((category) => {
            // Determine if this is an asset or liability category based on context
            const isLiability = category.name.toLowerCase().includes('mortgage') || 
                               category.name.toLowerCase().includes('loan') || 
                               category.name.toLowerCase().includes('debt') || 
                               category.name.toLowerCase().includes('credit');
            
            const sfmInfo = isLiability ? 
              getLiabilitySFMCodeInfo(category.name) : 
              getSFMCodeInfo(category.name);
            
            return (
              <SelectItem 
                key={category.id} 
                value={category.id.toString()}
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
              >
                <div className="flex flex-col items-start py-2 w-full">
                  <span className="font-medium text-sm text-gray-900 leading-tight">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-600 mt-1 leading-tight">
                    {sfmInfo.description}
                  </span>
                  <span className="text-xs text-gray-400 font-mono mt-1 leading-tight">
                    {sfmInfo.range}
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {/* Hidden input for HTML5 validation */}
      <input
        type="hidden"
        name="category_id"
        value={value || ""}
        required
        style={{ display: 'none' }}
      />
    </div>
  );
}
