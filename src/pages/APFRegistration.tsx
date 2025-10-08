import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useProfile, ProfileData } from "@/hooks/useProfile";
import { APFRegistrationHeader } from "@/components/APFRegistration/APFRegistrationHeader";
import { APFProgressIndicator } from "@/components/APFRegistration/APFProgressIndicator";
import { APFStepRenderer } from "@/components/APFRegistration/APFStepRenderer";
import { APFNavigationControls } from "@/components/APFRegistration/APFNavigationControls";
import { isTestingAccount } from "@/utils/testing";

// Use the actual ProfileData interface from the hook
interface Profile extends ProfileData {
  // Add any additional properties if needed
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
}


export default function APFRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [apfStage, setApfStage] = useState<1 | 2 | 3>(1);
  const [applicationData, setApplicationData] = useState<Record<string, unknown>>({});
  const { profile, isLoading: profileLoading } = useProfile();

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleStepComplete = (data: Record<string, unknown>) => {
    setApplicationData(prev => ({ ...prev, ...data }));
    // Advance to next step immediately after a step reports completion
    setCurrentStep(prev => (prev < 6 ? prev + 1 : prev));
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Prepare profile with safe fallbacks for test/dev accounts
  let typedProfile: Profile;
  if (profile) {
    typedProfile = {
      ...profile,
      firstName: profile?.first_name || undefined,
      lastName: profile?.last_name || undefined,
      dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined
    } as Profile;
  } else if (isTestingAccount()) {
    // Minimal demo profile to render UI without hardcoded salary values
    typedProfile = {
      date_of_birth: "1990-06-15",
      firstName: "Demo",
      lastName: "User",
      dateOfBirth: new Date("1990-06-15"),
    } as Profile;
  } else {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Unable to load profile data. Please try again.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <APFRegistrationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-6xl mx-auto">
          <div className="p-6">
            <APFProgressIndicator 
              currentStep={currentStep}
              completedSteps={[1, 2, 3, 4, 5, 6]}
              onStepClick={handleStepClick}
            />
            
            <div className="mt-8">
              <APFStepRenderer
                currentStep={currentStep}
                profile={typedProfile}
                applicationData={applicationData}
                onComplete={handleStepComplete}
                stage={apfStage}
              />
            </div>

            <APFNavigationControls
              currentStep={currentStep}
              canProceed={true}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
