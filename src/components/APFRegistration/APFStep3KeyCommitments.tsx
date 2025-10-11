
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle } from "lucide-react";
import { APFNRSRFeeCard } from "./APFStep2Cards/APFNRSRFeeCard";
import { APFINBLRepaymentPlanCard } from "./APFStep2Cards/APFINBLRepaymentPlanCard";
import { ISARepaymentChart } from "./APFStep2Cards/ISARepaymentChart";
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";

// Define interface for raw sponsorship data from applicationData
interface RawSponsorshipData {
  year?: number;
  sponsorshipAmount?: number;
  maturityValue?: number;
  isaMonthlyRequired?: number;
  isaAnnualRequired?: number;
  [key: string]: unknown; // Allow additional properties
}

interface APFStep3KeyCommitmentsProps {
  profile: {
    date_of_birth?: string;
    annual_salary?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile?: string;
  };
  applicationData: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
}

export function APFStep3KeyCommitments({ profile, applicationData, onComplete }: APFStep3KeyCommitmentsProps) {
  const [showMonthly, setShowMonthly] = useState(false);
  const { calculatePayslipComparison } = usePayslipCalculations();

  // Use data from previous steps - convert to APFSponsorshipBreakdown format
  const rawSponsorships = (applicationData?.sponsorships as RawSponsorshipData[]) || [];
  const sponsorships: APFSponsorshipBreakdown[] = rawSponsorships.map((sponsorship, index) => ({
    year: sponsorship.year || (index + 1),
    age: (profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() + index : 30 + index),
    sponsorshipAmount: sponsorship.sponsorshipAmount || 0,
    taxYear: `${new Date().getFullYear() + index}/${new Date().getFullYear() + index + 1}`,
    monthsToMaturity: (10 - index) * 12, // Assuming 10-year maturity
    maturityValue: sponsorship.maturityValue || 0,
    isaMonthlyRequired: sponsorship.isaMonthlyRequired || 0,
    isaAnnualRequired: sponsorship.isaAnnualRequired || 0,
    maturityAge: (profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() + 10 : 40)
  }));

  const firstYearSponsorship = sponsorships.length > 0 ? sponsorships[0] : null;
  
  // Calculate first year APF funding and NPG (INBL principal)
  const firstYearAPFFunding = firstYearSponsorship?.sponsorshipAmount || 0;
  
  // Calculate INBL principal using payslip comparison
  const annualSalary = profile?.annual_salary || 0;
  const firstYearNPG = firstYearSponsorship ? 
    calculatePayslipComparison(annualSalary, firstYearSponsorship.sponsorshipAmount).totalINBLPrincipal * 12 : 0;

  const handleToggleView = () => {
    setShowMonthly(!showMonthly);
  };

  const handleSubmit = () => {
    const stepData = {
      sponsorships,
      firstYearAPFFunding,
      firstYearNPG,
      showMonthly,
      keyCommitmentsAccepted: true
    };
    
    onComplete(stepData);
  };

  if (!firstYearSponsorship) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Missing Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Unable to load sponsorship data from Step 2. Please go back and complete Step 2 first.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>3</div>
          <div>
            <h2 id="step3-header" className="text-xl font-semibold" style={{ color: '#4FF456' }}>Step 3: Key Commitments</h2>
            <p className="text-sm text-gray-600">Understand your NRSR terms and repayment obligations</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={showMonthly ? 'text-blue-600 font-medium' : 'text-gray-400'}>Monthly</span>
          <Switch
            checked={!showMonthly}
            onCheckedChange={(checked) => setShowMonthly(!checked)}
          />
          <span className={!showMonthly ? 'text-blue-600 font-medium' : 'text-gray-400'}>Annual</span>
        </div>
      </div>

      <div className="space-y-6">
        <APFNRSRFeeCard 
          showMonthly={showMonthly} 
          sponsorships={sponsorships}
          profile={profile}
        />
        <APFINBLRepaymentPlanCard 
          showMonthly={showMonthly}
          onToggle={handleToggleView}
          sponsorships={sponsorships}
          profile={profile}
        />
        <ISARepaymentChart
          sponsorships={sponsorships}
          showMonthly={showMonthly}
          profile={profile}
        />
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full"
      >
        Continue to Next Step
      </Button>
    </div>
  );
}
