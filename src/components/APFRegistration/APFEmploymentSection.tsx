
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";

interface APFEmploymentSectionProps {
  formData: {
    annualSalary: string;
    payeTaxCode: string;
    p11dBenefit: string;
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

  const formatGBP = (raw: string) => {
    const numeric = Number(String(raw).replace(/[^0-9.]/g, ""));
    if (!numeric || isNaN(numeric)) return "";
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(numeric);
  };

  const formatOnChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return "";
    const amount = Number(cleaned);
    return `£${amount.toLocaleString('en-GB')}`;
  };

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <Briefcase className="h-4 w-4" />
        <span>Employment Information</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="annualSalary">Annual Salary</Label>
          <Input
            id="annualSalary"
            type="text"
            value={formData.annualSalary}
            onChange={(e) => onInputChange('annualSalary', formatOnChange(e.target.value))}
            onBlur={(e) => onInputChange('annualSalary', formatGBP(e.target.value))}
            placeholder="£60,000"
          />
        </div>

        <div>
          <Label htmlFor="payeTaxCode">PAYE Tax Code</Label>
          <Input
            id="payeTaxCode"
            type="text"
            value={formData.payeTaxCode}
            onChange={(e) => onInputChange('payeTaxCode', e.target.value)}
            placeholder="e.g., 1257L"
          />
        </div>

        <div>
          <Label htmlFor="p11dBenefit">P11D Benefit</Label>
          <Input
            id="p11dBenefit"
            type="text"
            value={formData.p11dBenefit}
            onChange={(e) => onInputChange('p11dBenefit', formatOnChange(e.target.value))}
            onBlur={(e) => onInputChange('p11dBenefit', formatGBP(e.target.value))}
            placeholder="£0"
          />
        </div>

        <div className="md:col-span-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div>
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                value={formData.employerName}
                onChange={(e) => onInputChange('employerName', e.target.value)}
                placeholder="Enter your employer's name"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="employerAddress">Employer Address</Label>
              <Input
                id="employerAddress"
                value={formData.employerAddress}
                onChange={(e) => onInputChange('employerAddress', e.target.value)}
                placeholder="Enter your employer's address"
              />
            </div>
            <div className="md:col-span-2 flex items-center space-x-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
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
            <div className="md:col-span-2">
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
