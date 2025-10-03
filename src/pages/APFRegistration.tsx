import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useProfile, ProfileData } from "@/hooks/useProfile";
import { useCorrectedDashboardCalculations } from "@/hooks/useCorrectedDashboardCalculations";
import { APFRegistrationHeader } from "@/components/APFRegistration/APFRegistrationHeader";
import { APFProgressIndicator } from "@/components/APFRegistration/APFProgressIndicator";
import { APFStepRenderer } from "@/components/APFRegistration/APFStepRenderer";
import { APFNavigationControls } from "@/components/APFRegistration/APFNavigationControls";

// Use the actual ProfileData interface from the hook
interface Profile extends ProfileData {
  // Add any additional properties if needed
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
}

interface DashboardData {
  capitalShortfall?: number;
  shortfall?: number;
  currentSalary?: number;
  futureSalary?: number;
  targetIncomeAtRetirement?: number;
  existingPlanIncomeAtRetirement?: number;
  apfTargetIncome?: number;
  isaTargetMonthly?: number;
  isaValueToday?: number;
  retirementProgressPercentage?: number;
  repaymentProgressPercentage?: number;
  isLoading?: boolean;
}

export default function APFRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const { profile, isLoading: profileLoading } = useProfile();
  const dashboardData = useCorrectedDashboardCalculations();

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Unable to load profile data. Please try again.</p>
        </div>
      </div>
    );
  }

  // Type the profile and dashboardData properly
  const typedProfile: Profile = {
    ...profile,
    firstName: profile?.first_name || undefined,
    lastName: profile?.last_name || undefined,
    dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined
  } as Profile;
  const typedDashboardData: DashboardData = dashboardData || {};

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
                dashboardData={typedDashboardData}
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
