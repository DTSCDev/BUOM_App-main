
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProfileData } from "@/hooks/useProfile";
import { ActionWarning } from "@/components/ui/action-warning";
import { SalaryDetailsForm } from "./SalaryDetails/SalaryDetailsForm";
import { SalaryDisplayContent } from "./SalaryDetails/SalaryDisplayContent";

interface SalaryDetailsCardProps {
  profile: ProfileData | null;
  onUpdate: (updates: Partial<ProfileData>) => Promise<boolean>;
}

export function SalaryDetailsCard({ profile, onUpdate }: SalaryDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    annual_salary: profile?.annual_salary || 0,
    monthly_net_pay: profile?.monthly_net_pay || 0,
    employment_type: profile?.employment_type || null as 'paye_employee' | 'self_employed' | 'business_owner' | null,
    employer_name: profile?.employer_name || "",
    employer_address: profile?.employer_address || "",
    trading_name: profile?.trading_name || "",
    company_number: profile?.company_number || "",
    business_address: profile?.business_address || "",
    works_from_home: profile?.works_from_home || false,
    paye_tax_code: profile?.paye_tax_code || "1257L",
    is_director: profile?.is_director || false,
    has_controlling_shares: profile?.has_controlling_shares || false,
    director_nic_election: profile?.director_nic_election || null as 'annual' | 'monthly' | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'annual_salary' || name === 'monthly_net_pay') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdate(formData);
    if (success) setIsOpen(false);
  };

  // Check if key salary information is missing
  const isIncomplete = !profile?.annual_salary || 
                      profile.annual_salary === 0 || 
                      !profile?.employment_type ||
                      (profile?.employment_type === 'paye_employee' && !profile?.paye_tax_code);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Salary Details</CardTitle>
          <ActionWarning message="Complete Salary Details" show={isIncomplete} />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          <SalaryDetailsForm
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onCheckboxChange={handleCheckboxChange}
            onCancel={() => setIsOpen(false)}
          />
        </Dialog>
      </CardHeader>
      <CardContent className="py-6">
        <SalaryDisplayContent profile={profile} />
      </CardContent>
    </Card>
  );
}
