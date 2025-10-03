
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SalaryEmploymentFieldsProps {
  employmentType: 'paye_employee' | 'self_employed' | 'business_owner' | null;
  formData: {
    employer_name: string;
    employer_address: string;
    trading_name: string;
    company_number: string;
    business_address: string;
    works_from_home: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SalaryEmploymentFields({ employmentType, formData, onChange }: SalaryEmploymentFieldsProps) {
  if (employmentType === 'paye_employee') {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="employer_name">Employer Name</Label>
          <Input 
            id="employer_name"
            name="employer_name"
            value={formData.employer_name || ""}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employer_address">Employer Address</Label>
          <Input 
            id="employer_address"
            name="employer_address"
            value={formData.employer_address || ""}
            onChange={onChange}
          />
        </div>
      </>
    );
  }

  if (employmentType === 'self_employed' || employmentType === 'business_owner') {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="trading_name">Trading Name</Label>
          <Input 
            id="trading_name"
            name="trading_name"
            value={formData.trading_name || ""}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_number">Company Number</Label>
          <Input 
            id="company_number"
            name="company_number"
            value={formData.company_number || ""}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_address">Business Address</Label>
          <Input 
            id="business_address"
            name="business_address"
            value={formData.business_address || ""}
            onChange={onChange}
          />
        </div>
      </>
    );
  }

  return null;
}
