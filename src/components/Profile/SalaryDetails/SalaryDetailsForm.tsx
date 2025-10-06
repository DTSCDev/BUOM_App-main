
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileData } from "@/hooks/useProfile";
import { SalaryEmploymentFields } from "./SalaryEmploymentFields";
import { Edit } from "lucide-react";

interface SalaryDetailsFormProps {
  formData: {
    annual_salary: number;
    monthly_net_pay: number;
    employment_type: 'paye_employee' | 'self_employed' | 'business_owner' | null;
    employer_name: string;
    employer_address: string;
    trading_name: string;
    company_number: string;
    business_address: string;
    works_from_home: boolean;
    paye_tax_code: string;
    is_director: boolean;
    has_controlling_shares: boolean;
    director_nic_election: 'annual' | 'monthly' | null;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onCancel: () => void;
}

export function SalaryDetailsForm({ 
  formData, 
  onSubmit, 
  onChange, 
  onSelectChange, 
  onCheckboxChange,
  onCancel 
}: SalaryDetailsFormProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Edit className="h-4 w-4" /> Edit Salary Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employment_type">Employment Type</Label>
          <Select 
            value={formData.employment_type || ""} 
            onValueChange={(value) => onSelectChange("employment_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paye_employee">PAYE Employee</SelectItem>
              <SelectItem value="self_employed">Self Employed</SelectItem>
              <SelectItem value="business_owner">Business Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annual_salary">Annual Salary (£)</Label>
            <Input 
              id="annual_salary"
              name="annual_salary"
              type="number"
              value={formData.annual_salary || ""}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly_net_pay">Monthly Net Pay (£)</Label>
            <Input 
              id="monthly_net_pay"
              name="monthly_net_pay"
              type="number"
              value={formData.monthly_net_pay || ""}
              onChange={onChange}
            />
          </div>
        </div>

        {/* PAYE and Director Section */}
        {formData.employment_type === 'paye_employee' && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-gray-900">PAYE & Employment Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paye_tax_code">PAYE Tax Code</Label>
                <Input 
                  id="paye_tax_code"
                  name="paye_tax_code"
                  value={formData.paye_tax_code || "1257L"}
                  onChange={onChange}
                  placeholder="e.g. 1257L, BR, D0"
                />
                <p className="text-xs text-gray-500">
                  Check your payslip or P60 for your current tax code
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Director Status</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_director"
                    checked={formData.is_director || false}
                    onCheckedChange={(checked) => onCheckboxChange("is_director", checked as boolean)}
                  />
                  <Label htmlFor="is_director" className="text-sm">I am a company director</Label>
                </div>
              </div>
            </div>

            {formData.is_director && (
              <div className="grid grid-cols-2 gap-4 ml-4 p-3 bg-blue-50 rounded-md">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_controlling_shares"
                      checked={formData.has_controlling_shares || false}
                      onCheckedChange={(checked) => onCheckboxChange("has_controlling_shares", checked as boolean)}
                    />
                    <Label htmlFor="has_controlling_shares" className="text-sm">
                      I have controlling shares (&gt;50%)
                    </Label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Affects National Insurance calculation and minimum contribution requirements
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="director_nic_election">NIC Calculation Method</Label>
                  <Select 
                    value={formData.director_nic_election || "annual"} 
                    onValueChange={(value) => onSelectChange("director_nic_election", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual (Standard)</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        )}
        
        <SalaryEmploymentFields 
          employmentType={formData.employment_type}
          formData={formData}
          onChange={onChange}
        />
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="works_from_home"
            checked={formData.works_from_home || false}
            onCheckedChange={(checked) => onCheckboxChange("works_from_home", checked as boolean)}
          />
          <Label htmlFor="works_from_home">Works from home</Label>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" className="bg-white text-gray-700 border border-gray-700" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#4FF456] text-gray-700 font-bold hover:bg-[#44e94f]">
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
