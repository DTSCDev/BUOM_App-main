import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProvidersByCategory, PensionProviderCategory } from "@/data/pensionProviders";

interface PensionProviderSelectorProps {
  category: PensionProviderCategory;
  value: string;
  onChange: (value: string) => void;
}

export default function PensionProviderSelector({ category, value, onChange }: PensionProviderSelectorProps) {
  const providers = getProvidersByCategory(category);

  return (
    <div className="space-y-2">
      <Label htmlFor="pension_provider">Pension Provider</Label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger id="pension_provider">
          <SelectValue placeholder="Select a provider" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}