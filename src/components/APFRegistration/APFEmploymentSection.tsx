
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";

interface APFEmploymentSectionProps {
  formData: {
    employmentType: string;
    employerName: string;
    employerAddress: string;
    tradingName: string;
    companyNumber: string;
    businessAddress: string;
    worksFromHome: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export function APFEmploymentSection({ formData, onInputChange }: APFEmploymentSectionProps) {
  const employmentTypes = [
    { value: "paye_employee", label: "PAYE Employee" },
    { value: "self_employed", label: "Self Employed" },
    { value: "business_owner", label: "Business Owner" }
  ];

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <Briefcase className="h-4 w-4" />
        <span>Employment Information</span>
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="employmentType">Employment Type *</Label>
          <Select value={formData.employmentType} onValueChange={(value) => onInputChange('employmentType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              {employmentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.employmentType === 'paye_employee' && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                value={formData.employerName}
                onChange={(e) => onInputChange('employerName', e.target.value)}
                placeholder="Enter your employer's name"
              />
            </div>
            <div>
              <Label htmlFor="employerAddress">Employer Address</Label>
              <Input
                id="employerAddress"
                value={formData.employerAddress}
                onChange={(e) => onInputChange('employerAddress', e.target.value)}
                placeholder="Enter your employer's address"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="worksFromHome"
                checked={formData.worksFromHome}
                onChange={(e) => onInputChange('worksFromHome', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="worksFromHome" className="text-sm">
                I work from home
              </Label>
            </div>
          </div>
        )}

        {(formData.employmentType === 'self_employed' || formData.employmentType === 'business_owner') && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="tradingName">Trading Name</Label>
              <Input
                id="tradingName"
                value={formData.tradingName}
                onChange={(e) => onInputChange('tradingName', e.target.value)}
                placeholder="Enter your trading name"
              />
            </div>
            {formData.employmentType === 'business_owner' && (
              <div>
                <Label htmlFor="companyNumber">Company Number</Label>
                <Input
                  id="companyNumber"
                  value={formData.companyNumber}
                  onChange={(e) => onInputChange('companyNumber', e.target.value)}
                  placeholder="Enter your company number"
                />
              </div>
            )}
            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => onInputChange('businessAddress', e.target.value)}
                placeholder="Enter your business address"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
