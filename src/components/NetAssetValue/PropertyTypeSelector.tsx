import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PropertyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const propertyTypes = [
  {
    value: "Main Residence",
    label: "Main Residence",
    description: "Primary residential property",
    sfmCode: "SFM-NAV-3610"
  },
  {
    value: "Investment Property",
    label: "Investment Property", 
    description: "Buy-to-let residential property",
    sfmCode: "SFM-NAV-3620"
  },
  {
    value: "Holiday Home",
    label: "Holiday Home",
    description: "Second home or holiday property",
    sfmCode: "SFM-NAV-3630"
  },
  {
    value: "Commercial Property",
    label: "Commercial Property",
    description: "Office, retail, or industrial property",
    sfmCode: "SFM-NAV-3640"
  },
  {
    value: "Land",
    label: "Land",
    description: "Undeveloped land or plots",
    sfmCode: "SFM-NAV-3650"
  },
  {
    value: "Overseas Property",
    label: "Overseas Property",
    description: "International property investments",
    sfmCode: "SFM-NAV-3660"
  },
  {
    value: "Property Fund",
    label: "Property Fund",
    description: "Real Estate Investment Trust (REIT) or property fund",
    sfmCode: "SFM-NAV-3670"
  },
  {
    value: "Property Development",
    label: "Property Development",
    description: "Development projects and joint ventures",
    sfmCode: "SFM-NAV-3680"
  },
  {
    value: "Other Property",
    label: "Other Property",
    description: "Other property-related assets",
    sfmCode: "SFM-NAV-3699"
  }
];

export default function PropertyTypeSelector({ value, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="property_type">Property Type</Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="property_type">
          <SelectValue placeholder="Select property type" />
        </SelectTrigger>
        <SelectContent>
          {propertyTypes.map((type) => (
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