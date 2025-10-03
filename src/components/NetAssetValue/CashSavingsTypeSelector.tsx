import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CashSavingsTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const cashSavingsTypes = [
  {
    value: "Current Account",
    label: "Current Account",
    description: "Day-to-day banking current account",
    sfmCode: "SFM-NAV-3800"
  },
  {
    value: "Savings Account",
    label: "Savings Account", 
    description: "Interest-bearing savings account",
    sfmCode: "SFM-NAV-3810"
  },
  {
    value: "Fixed Term Deposit",
    label: "Fixed Term Deposit",
    description: "Fixed-rate term deposit or bond",
    sfmCode: "SFM-NAV-3820"
  },
  {
    value: "Notice Account",
    label: "Notice Account",
    description: "Savings account requiring notice for withdrawals",
    sfmCode: "SFM-NAV-3830"
  },
  {
    value: "Premium Bonds",
    label: "Premium Bonds",
    description: "NS&I Premium Bonds",
    sfmCode: "SFM-NAV-3840"
  },
  {
    value: "Cash ISA",
    label: "Cash ISA",
    description: "Cash Individual Savings Account",
    sfmCode: "SFM-NAV-3850"
  },
  {
    value: "Help to Buy ISA",
    label: "Help to Buy ISA",
    description: "Government Help to Buy ISA scheme",
    sfmCode: "SFM-NAV-3860"
  },
  {
    value: "Regular Savings",
    label: "Regular Savings",
    description: "Monthly regular savings account",
    sfmCode: "SFM-NAV-3870"
  },
  {
    value: "Foreign Currency",
    label: "Foreign Currency",
    description: "Foreign currency deposits and accounts",
    sfmCode: "SFM-NAV-3880"
  },
  {
    value: "Other Cash",
    label: "Other Cash & Savings",
    description: "Other cash and savings products",
    sfmCode: "SFM-NAV-3899"
  }
];

export default function CashSavingsTypeSelector({ value, onChange }: CashSavingsTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="cash_savings_type">Cash & Savings Type</Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="cash_savings_type">
          <SelectValue placeholder="Select cash & savings type" />
        </SelectTrigger>
        <SelectContent>
          {cashSavingsTypes.map((type) => (
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