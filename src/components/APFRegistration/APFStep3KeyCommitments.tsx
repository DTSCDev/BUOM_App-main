
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle } from "lucide-react";
import { APFNRSRFeeCard } from "./APFStep3Cards/APFNRSRFeeCard";
import { APFINBLRepaymentPlanCard } from "./APFStep3Cards/APFINBLRepaymentPlanCard";
import { ISARepaymentChart } from "./APFStep3Cards/ISARepaymentChart";
import { APFSponsorshipBreakdown } from "@/utils/pension/buomTypes";
import { usePayslipCalculations } from "@/hooks/usePayslipCalculations";
import { useRetirementCalculatorHub } from "@/hooks/useRetirementCalculatorHub";

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
  const hub = useRetirementCalculatorHub();

  // Use data from previous steps - convert to APFSponsorshipBreakdown format
  const rawSponsorships = (applicationData?.sponsorships as RawSponsorshipData[]) || [];
  let sponsorships: APFSponsorshipBreakdown[] = rawSponsorships.map((sponsorship, index) => ({
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

  // Fallback: if Step 2 provided no sponsorships, synthesize Year 1 from APF-1282 (CAL-4121)
  if (sponsorships.length === 0) {
    const capitalShortfall = hub.cal4121_capitalShortfall || 0; // APF-1282
    const isaMonthlyRequired = hub.cal4128_existingPlanMonthlyTopUpYear1 || 0; // CAL-4128
    const currentYear = new Date().getFullYear();
    const baseAge = profile?.date_of_birth
      ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
      : 30;

    // Temporary Year 1 multipliers based on APF-1282
    const annualINBLPrincipalY1 = capitalShortfall * 0.521576; // SFM-APF-1303

    sponsorships = [{
      year: 1,
      age: baseAge,
      taxYear: `${currentYear}/${currentYear + 1}`,
      monthsToMaturity: 10 * 12,
      maturityAge: baseAge + 10,
      maturityValue: capitalShortfall,
      sponsorshipAmount: annualINBLPrincipalY1,
      isaMonthlyRequired,
      isaAnnualRequired: isaMonthlyRequired * 12
    }];
  }

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

  // Render even if data is synthesized; no blocking error

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>3</div>
          <div>
            <h2 id="step3-header" className="text-2xl font-semibold" style={{ color: '#4FF456' }}>Key Commitments</h2>
          </div>
        </div>
        {/* Toggle removed per request */}
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

      {/* CTA button removed per request */}
    </div>
  );
}
