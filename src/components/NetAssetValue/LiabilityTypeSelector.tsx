import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LiabilityTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  category: string;
}

const mortgageTypes = [
  {
    value: "Main Residence Mortgage",
    label: "Main Residence Mortgage",
    description: "Mortgage on primary residential property",
    sfmCode: "SFM-NAV-3001"
  },
  {
    value: "Investment Property Mortgage",
    label: "Investment Property Mortgage", 
    description: "Buy-to-let mortgage",
    sfmCode: "SFM-NAV-3050"
  },
  {
    value: "Equity Release",
    label: "Equity Release",
    description: "Lifetime mortgage or home reversion plan",
    sfmCode: "SFM-NAV-3100"
  },
  {
    value: "Commercial Mortgage",
    label: "Commercial Mortgage",
    description: "Mortgage on commercial property",
    sfmCode: "SFM-NAV-3150"
  },
  {
    value: "Other Mortgage",
    label: "Other Mortgage",
    description: "Other secured lending on property",
    sfmCode: "SFM-NAV-3199"
  }
];

const creditCardTypes = [
  {
    value: "Personal Credit Card",
    label: "Personal Credit Card",
    description: "Personal credit card debt",
    sfmCode: "SFM-NAV-3201"
  },
  {
    value: "Business Credit Card",
    label: "Business Credit Card",
    description: "Business credit card debt",
    sfmCode: "SFM-NAV-3250"
  },
  {
    value: "Store Card",
    label: "Store Card",
    description: "Retail store card debt",
    sfmCode: "SFM-NAV-3280"
  },
  {
    value: "Other Credit",
    label: "Other Credit",
    description: "Other credit card or revolving credit",
    sfmCode: "SFM-NAV-3299"
  }
];

const otherDebtTypes = [
  {
    value: "Personal Loan",
    label: "Personal Loan",
    description: "Unsecured personal loan",
    sfmCode: "SFM-NAV-3301"
  },
  {
    value: "Business Loan",
    label: "Business Loan",
    description: "Business loan or overdraft",
    sfmCode: "SFM-NAV-3350"
  },
  {
    value: "Car Finance",
    label: "Car Finance",
    description: "Hire purchase or car loan",
    sfmCode: "SFM-NAV-3380"
  },
  {
    value: "Student Loan",
    label: "Student Loan",
    description: "Student loan debt",
    sfmCode: "SFM-NAV-3400"
  },
  {
    value: "Family Loan",
    label: "Family Loan",
    description: "Loan from family or friends",
    sfmCode: "SFM-NAV-3420"
  },
  {
    value: "Tax Liability",
    label: "Tax Liability",
    description: "Outstanding tax liabilities",
    sfmCode: "SFM-NAV-3450"
  },
  {
    value: "Other Debt",
    label: "Other Debt",
    description: "Other unsecured debt",
    sfmCode: "SFM-NAV-3499"
  }
];

export default function LiabilityTypeSelector({ value, onChange, category }: LiabilityTypeSelectorProps) {
  const categoryLower = category.toLowerCase();
  
  let liabilityTypes = otherDebtTypes;
  let label = "Debt Type";
  
  if (categoryLower.includes('mortgage')) {
    liabilityTypes = mortgageTypes;
    label = "Mortgage Type";
  } else if (categoryLower.includes('credit')) {
    liabilityTypes = creditCardTypes;
    label = "Credit Type";
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="liability_type">{label}</Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="liability_type">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {liabilityTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex flex-col">
                <span className="font-medium">{type.label}</span>
                <span className="text-xs text-gray-500 mt-1">{type.description}</span>
                <span className="text-xs text-blue-600 font-mono" style={{ fontSize: '7px' }}>
                  {type.sfmCode}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}