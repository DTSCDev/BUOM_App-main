
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface APFReferralSectionProps {
  formData: {
    referralSource: string;
    referralCode: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function APFReferralSection({ formData, onInputChange }: APFReferralSectionProps) {
  const referralSources = [
    { value: "calculator", label: "BUOM Calculator" },
    { value: "advisor", label: "Professional Advisor" },
    { value: "friend", label: "Friend/Family Member" },
    { value: "power_of_ten", label: "Power of Ten Challenge" },
    { value: "buom_employee", label: "BUOM Employee" },
    { value: "affiliate", label: "BUOM Affiliate" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <span>Referral Information</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="referralSource">How did you hear about us?</Label>
          <Select value={formData.referralSource} onValueChange={(value) => onInputChange('referralSource', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select referral source" />
            </SelectTrigger>
            <SelectContent>
              {referralSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="referralCode">Referral Code (Optional)</Label>
          <Input
            id="referralCode"
            value={formData.referralCode}
            onChange={(e) => onInputChange('referralCode', e.target.value)}
            placeholder="Enter referral code"
          />
        </div>
      </div>
    </div>
  );
}
