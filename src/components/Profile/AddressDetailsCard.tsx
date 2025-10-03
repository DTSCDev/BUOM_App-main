
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { ProfileData } from "@/hooks/useProfile";
import { AddressDetailsForm } from "./AddressDetailsForm";
import { ActionWarning } from "@/components/ui/action-warning";
import { SFMCodeDisplay } from "@/components/Dashboard/SFMCodeDisplay";

interface AddressDetailsCardProps {
  profile: ProfileData | null;
  onUpdate: (updates: Partial<ProfileData>) => Promise<boolean>;
}

export function AddressDetailsCard({ profile, onUpdate }: AddressDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    postcode: "",
    country: "",
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        address_line1: profile.address_line1 || "",
        address_line2: profile.address_line2 || "",
        city: profile.city || "",
        postcode: profile.postcode || "",
        country: profile.country || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    try {
      const success = await onUpdate(formData);
      console.log('Update result:', success);
      if (success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile data
    if (profile) {
      setFormData({
        address_line1: profile.address_line1 || "",
        address_line2: profile.address_line2 || "",
        city: profile.city || "",
        postcode: profile.postcode || "",
        country: profile.country || "",
      });
    }
    setIsOpen(false);
  };

  const formatAddress = () => {
    const parts = [
      profile?.address_line1,
      profile?.address_line2,
      profile?.city
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  // Check if key address information is missing
  const isIncomplete = !profile?.address_line1 || 
                      !profile?.city || 
                      !profile?.postcode;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-[#030227]">Address Details</CardTitle>
          <ActionWarning message="Add Address" show={isIncomplete} />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          {isOpen && (
            <AddressDetailsForm
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
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Current Address</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2082" variant="profile" />
            </div>
            <p className="text-base">{formatAddress()}</p>
          </div>
          
          {profile?.postcode && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Postcode</h4>
                <SFMCodeDisplay sfmCode="SFM-PRF-2082" variant="profile" />
              </div>
              <p className="text-base font-medium">{profile.postcode}</p>
            </div>
          )}
          
          {profile?.country && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Country</h4>
                <SFMCodeDisplay sfmCode="SFM-PRF-2082" variant="profile" />
              </div>
              <p className="text-base font-medium">{profile.country}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
