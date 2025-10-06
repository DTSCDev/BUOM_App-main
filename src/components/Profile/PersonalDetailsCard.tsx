import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Eye } from "lucide-react";
import { ProfileData } from "@/hooks/useProfile";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { ActionWarning } from "@/components/ui/action-warning";
import { SFMCodeDisplay } from "@/components/Dashboard/SFMCodeDisplay";
import { formatDateString } from "@/utils/formatUtils";

interface PersonalDetailsCardProps {
  profile: ProfileData | null;
  onUpdate: (updates: Partial<ProfileData>) => Promise<boolean>;
}

export function PersonalDetailsCard({ profile, onUpdate }: PersonalDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    national_insurance_number: "",
    mobile: "",
  });

  // Update form data when profile changes or modal opens
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        middle_name: profile.middle_name || "",
        last_name: profile.last_name || "",
        date_of_birth: profile.date_of_birth || "",
        national_insurance_number: profile.national_insurance_number || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting personal details:', formData);
    
    try {
      const success = await onUpdate(formData);
      console.log('Personal details update result:', success);
      if (success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating personal details:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile data
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        middle_name: profile.middle_name || "",
        last_name: profile.last_name || "",
        date_of_birth: profile.date_of_birth || "",
        national_insurance_number: profile.national_insurance_number || "",
        mobile: profile.mobile || "",
      });
    }
    setIsOpen(false);
  };

  const computeAge = (dob?: string | null) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Check if key personal information is missing
  const isIncomplete = !profile?.first_name || 
                      !profile?.last_name || 
                      !profile?.date_of_birth ||
                      !profile?.national_insurance_number;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-[#4FF456] text-gray-700 font-bold rounded-t-lg">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Personal Details</CardTitle>
          <ActionWarning message="Complete Profile" show={isIncomplete} />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-gray-700">
              <Eye className="h-4 w-4 mr-2" /> View
            </Button>
          </DialogTrigger>
          {isOpen && (
            <PersonalDetailsForm
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onCancel={handleCancel}
            />
          )}
        </Dialog>
      </CardHeader>
      <CardContent className="py-3">
        <p className="text-gray-700">View and edit your personal information.</p>
      </CardContent>
    </Card>
  );
}
