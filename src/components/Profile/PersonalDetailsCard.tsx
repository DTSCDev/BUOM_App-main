import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
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
        last_name: profile.last_name || "",
        date_of_birth: profile.date_of_birth || "",
        national_insurance_number: profile.national_insurance_number || "",
        mobile: profile.mobile || "",
      });
    }
    setIsOpen(false);
  };

  // Check if key personal information is missing
  const isIncomplete = !profile?.first_name || 
                      !profile?.last_name || 
                      !profile?.date_of_birth ||
                      !profile?.national_insurance_number;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Personal Details</CardTitle>
          <ActionWarning message="Complete Profile" show={isIncomplete} />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4 mr-2" /> Edit
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
      <CardContent className="py-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">First Name</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2001" variant="profile" />
            </div>
            <p className="text-base">{profile?.first_name || "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Last Name</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2001" variant="profile" />
            </div>
            <p className="text-base">{profile?.last_name || "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Date of Birth</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2003" variant="profile" />
            </div>
            <p className="text-base">{profile?.date_of_birth ? formatDateString(profile.date_of_birth) : "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">National Insurance Number</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2006" variant="profile" />
            </div>
            <p className="text-base">{profile?.national_insurance_number || "Not specified"}</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Mobile Number</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2081" variant="profile" />
            </div>
            <p className="text-base">{profile?.mobile || "Not specified"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
