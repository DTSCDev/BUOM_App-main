
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PensionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const pensionTypes = [
  {
    value: "Workplace DC Pension",
    label: "Workplace DC Pension",
    description: "Defined Contribution workplace pension schemes",
    sfmCode: "SFM-NAV-3501"
  },
  {
    value: "Personal Pension",
    label: "Personal Pension", 
    description: "Individual personal pension plans",
    sfmCode: "SFM-NAV-3510"
  },
  {
    value: "SIPP",
    label: "SIPP",
    description: "Self-Invested Personal Pension",
    sfmCode: "SFM-NAV-3520"
  },
  {
    value: "SSaS",
    label: "SSaS",
    description: "Small Self-Administered Scheme",
    sfmCode: "SFM-NAV-3530"
  },
  {
    value: "Section 32",
    label: "Section 32",
    description: "Section 32 Buy-Out Plans",
    sfmCode: "SFM-NAV-3540"
  },
  {
    value: "Section 226",
    label: "Section 226", 
    description: "Section 226 Policies",
    sfmCode: "SFM-NAV-3550"
  },
  {
    value: "Annuity Income",
    label: "Annuity Income",
    description: "Purchased annuity income streams",
    sfmCode: "SFM-NAV-3560"
  },
  {
    value: "Final Salary Benefit",
    label: "Final Salary Income",
    description: "Defined Benefit pension income",
    sfmCode: "SFM-NAV-3570"
  },
  {
    value: "APF Assets",
    label: "3PPS / ZVaR Assets",
    description: "Third Party Pension Schemes / Zero Variance Assets",
    sfmCode: "SFM-NAV-3580"
  },
  {
    value: "Other",
    label: "Other Pension Assets",
    description: "Other pension-related assets",
    sfmCode: "SFM-NAV-3590"
  }
];

export default function PensionTypeSelector({ value, onChange }: PensionTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="pension_type">Pension Type</Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="pension_type">
          <SelectValue placeholder="Select pension type" />
        </SelectTrigger>
        <SelectContent>
          {pensionTypes.map((type) => (
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
