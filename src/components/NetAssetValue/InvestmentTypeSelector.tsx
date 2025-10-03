import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InvestmentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const investmentTypes = [
  {
    value: "Stocks & Shares ISA",
    label: "Stocks & Shares ISA",
    description: "Individual Savings Account for stocks and shares",
    sfmCode: "SFM-NAV-3710"
  },
  {
    value: "Cash ISA",
    label: "Cash ISA", 
    description: "Individual Savings Account for cash savings",
    sfmCode: "SFM-NAV-3720"
  },
  {
    value: "Innovative Finance ISA",
    label: "Innovative Finance ISA",
    description: "ISA for peer-to-peer lending and crowdfunding",
    sfmCode: "SFM-NAV-3730"
  },
  {
    value: "Lifetime ISA",
    label: "Lifetime ISA",
    description: "ISA for first-time buyers and retirement savings",
    sfmCode: "SFM-NAV-3740"
  },
  {
    value: "Junior ISA",
    label: "Junior ISA",
    description: "ISA for children under 18",
    sfmCode: "SFM-NAV-3750"
  },
  {
    value: "Government Bonds",
    label: "Government Bonds",
    description: "UK Government Gilts and Treasury bonds",
    sfmCode: "SFM-NAV-3760"
  },
  {
    value: "Corporate Bonds",
    label: "Corporate Bonds",
    description: "Corporate and high-yield bonds",
    sfmCode: "SFM-NAV-3770"
  },
  {
    value: "SEIS Investment",
    label: "SEIS Investment",
    description: "Seed Enterprise Investment Scheme",
    sfmCode: "SFM-NAV-3780"
  },
  {
    value: "EIS Investment",
    label: "EIS Investment",
    description: "Enterprise Investment Scheme",
    sfmCode: "SFM-NAV-3785"
  },
  {
    value: "VCT Investment",
    label: "VCT Investment",
    description: "Venture Capital Trust",
    sfmCode: "SFM-NAV-3790"
  },
  {
    value: "Unit Trusts",
    label: "Unit Trusts",
    description: "Pooled investment funds",
    sfmCode: "SFM-NAV-3795"
  },
  {
    value: "Investment Trusts",
    label: "Investment Trusts",
    description: "Closed-end investment companies",
    sfmCode: "SFM-NAV-3798"
  },
  {
    value: "Other Investment",
    label: "Other Investment",
    description: "Other investment assets",
    sfmCode: "SFM-NAV-3799"
  }
];

export default function InvestmentTypeSelector({ value, onChange }: InvestmentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="investment_type">Investment Type</Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="investment_type">
          <SelectValue placeholder="Select investment type" />
        </SelectTrigger>
        <SelectContent>
          {investmentTypes.map((type) => (
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