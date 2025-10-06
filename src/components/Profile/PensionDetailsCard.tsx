import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
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
      <CardHeader className="flex flex-row items-center justify-between bg-[#4FF456] text-gray-700 font-bold rounded-t-lg">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Pension Details</CardTitle>
          <ActionWarning message="Add Pension Info" show={isIncomplete} />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-gray-700">
              <Eye className="h-4 w-4 mr-2" /> View
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
      <CardContent className="py-3">
        <p className="text-gray-700">View and manage your pension provider and contributions.</p>
      </CardContent>
    </Card>
  );
}
