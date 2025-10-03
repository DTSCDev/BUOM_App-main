import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { ProfileData } from "@/hooks/useProfile";
import { PensionDetailsForm } from "./PensionDetailsForm";
import { ActionWarning } from "@/components/ui/action-warning";
import { SFMCodeDisplay } from "@/components/Dashboard/SFMCodeDisplay";

interface PensionDetailsCardProps {
  profile: ProfileData | null;
  onUpdate: (updates: Partial<ProfileData>) => Promise<boolean>;
}

export function PensionDetailsCard({ profile, onUpdate }: PensionDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    pension_provider: "",
    pension_contribution_employee: 0,
    pension_contribution_employer: 0,
  });

  // Update form data when profile changes or modal opens
  useEffect(() => {
    if (profile) {
      setFormData({
        pension_provider: profile.pension_provider || "",
        pension_contribution_employee: profile.pension_contribution_employee || 0,
        pension_contribution_employer: profile.pension_contribution_employer || 0,
      });
    }
  }, [profile, isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Use CAL-44XX parameter values for main application
  const employeeRate = 5; // CAL-4411: Auto-enrollment employee rate
  const employerRate = 3; // CAL-4412: Auto-enrollment employer rate
  const monthlyGrossSalary = (profile?.annual_salary || 0) / 12; // Read from PRF-2021
  const pensionablePayRate = 0.85; // CAL-4413: Auto-enrollment pensionable pay rate (85%)

  // Calculate contributions using CAL-44XX parameter values
  const employeeContribution = (monthlyGrossSalary * pensionablePayRate * (employeeRate / 100));
  const employerContribution = (monthlyGrossSalary * pensionablePayRate * (employerRate / 100));
  const totalMonthlyContribution = employeeContribution + employerContribution;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting pension data:', formData);
    
    try {
      const success = await onUpdate(formData);
      console.log('Pension update result:', success);
      if (success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating pension:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile data
    if (profile) {
      setFormData({
        pension_provider: profile.pension_provider || "",
        pension_contribution_employee: profile.pension_contribution_employee || 0,
        pension_contribution_employer: profile.pension_contribution_employer || 0,
      });
    }
    setIsOpen(false);
  };

  // Check if key pension information is missing
  const isIncomplete = !profile?.pension_provider || 
                      (!profile?.pension_contribution_employee || profile.pension_contribution_employee === 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-[#030227]">Pension Details</CardTitle>
          <ActionWarning message="Add Pension Info" show={isIncomplete} />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          {isOpen && (
            <PensionDetailsForm
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onCancel={handleCancel}
            />
          )}
        </Dialog>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Pension Provider</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2044" variant="profile" />
            </div>
            <p className="text-base font-medium">{profile?.pension_provider || "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Total Monthly Contribution (Parameter Settings)</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2041" variant="profile" />
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalMonthlyContribution)}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">Employee: {employeeRate}% (CAL-4411)</span>
                <SFMCodeDisplay sfmCode="SFM-PRF-2042-EeP" variant="profile" />
              </div>
              <span className="text-sm font-medium">{formatCurrency(employeeContribution)}</span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${employeeRate / (employeeRate + employerRate) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">Employer: {employerRate}% (CAL-4412)</span>
                <SFMCodeDisplay sfmCode="SFM-PRF-2042-ErP" variant="profile" />
              </div>
              <span className="text-sm font-medium">{formatCurrency(employerContribution)}</span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary" 
                style={{ width: `${employerRate / (employeeRate + employerRate) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
