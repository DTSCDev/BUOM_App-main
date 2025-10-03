
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { PersonalDetailsCard } from "@/components/Profile/PersonalDetailsCard";
import { SalaryDetailsCard } from "@/components/Profile/SalaryDetailsCard";
import { PensionDetailsCard } from "@/components/Profile/PensionDetailsCard";
import { AddressDetailsCard } from "@/components/Profile/AddressDetailsCard";
import { DocumentsCard } from "@/components/Profile/DocumentsCard";
import { ProfessionalAdvisorsCard } from "@/components/Profile/ProfessionalAdvisorsCard";
import { LegacyPlanningCard } from "@/components/Profile/LegacyPlanningCard";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    profile, 
    isLoading, 
    updateProfile,
  } = useProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#030227]">My Details</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="w-full h-48 animate-pulse">
              <CardContent className="p-6">
                <div className="h-full bg-gray-200 rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#030227]">My Details</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PersonalDetailsCard profile={profile} onUpdate={updateProfile} />
        <SalaryDetailsCard profile={profile} onUpdate={updateProfile} />
        <PensionDetailsCard profile={profile} onUpdate={updateProfile} />
        <AddressDetailsCard profile={profile} onUpdate={updateProfile} />
        <ProfessionalAdvisorsCard />
        <LegacyPlanningCard profile={profile} onUpdate={updateProfile} />
        <DocumentsCard userId={user?.id} />
      </div>
    </div>
  );
}
