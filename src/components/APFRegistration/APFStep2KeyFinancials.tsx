import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { APFINBLSummaryCard } from "./APFStep2Cards/APFINBLSummaryCard";
import { APFSponsorshipYearsCard } from "./APFStep2Cards/APFSponsorshipYearsCard";
import { calculateActualSponsorshipsFromShortfall } from "@/utils/pension/apfSponsorshipCalculations";
import { calculateAge } from "@/utils/pensionCalculations";
import { UnifiedCalculationResult } from "@/utils/pension/unifiedCalculationEngine";

interface APFStep2KeyFinancialsProps {
  profile: {
    date_of_birth?: string;
    annual_salary?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
  };
  dashboardData: {
    capitalShortfall?: number;
    shortfall?: number;
  };
}

export function APFStep2KeyFinancials({ profile, dashboardData }: APFStep2KeyFinancialsProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  
  // Get basic data from profile - fix the calculateAge usage
  const currentAge = profile?.date_of_birth ? calculateAge(new Date(profile.date_of_birth)).years : null;
  const annualSalary = profile?.annual_salary || null;
  
  // Get shortfall target from dashboardData
  const shortfallTarget = dashboardData?.capitalShortfall || dashboardData?.shortfall || 0;

  // Calculate APF sponsorships using the shortfall target
  const apfSponsorships = (currentAge && annualSalary && shortfallTarget) 
    ? calculateActualSponsorshipsFromShortfall(
        currentAge,
        annualSalary,
        shortfallTarget,
        true, // Enhanced member
        profile
      )
    : [];

  // Simple totals from sponsorships
  const totalAPFFunding = apfSponsorships.reduce((sum, s) => sum + s.sponsorshipAmount, 0);

  if (!currentAge || !annualSalary || !shortfallTarget) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Missing required data for APF calculations...</div>
        </CardContent>
      </Card>
    );
  }

  // Create a proper UnifiedCalculationResult for APFINBLSummaryCard
  const mockUnifiedResult: UnifiedCalculationResult = {
    proposedAPFFunding: totalAPFFunding,
    feasibleAPFFunding: totalAPFFunding,
    salaryExchangeReasonForLimit: "None",
    currentCapitalShortfall: shortfallTarget,
    retirementProgressPercentage: 0,
    targetIncomeAtRetirement: 0,
    existingPlanIncomeAtRetirement: 0,
    apfTargetIncome: 0,
    isaTargetMonthly: 0,
    isaValueToday: 0,
    repaymentProgressPercentage: 0,
    statePensionAtRetirement: 0,
    yearsToRetirement: 0,
    requiredCapital: 0,
    projectedExistingPlan: 0,
    totalFutureAEContributions: 0,
    statePensionLumpSum: 0,
    totalProjectedAssets: 0,
    capitalShortfallToday: 0,
    existingPlanIncome: 0,
    targetIncomeToday: 0
  };

  // Create profile object for APFINBLSummaryCard
  const profileForCard = {
    annualSalary: annualSalary,
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    dateOfBirth: profile.dateOfBirth || new Date()
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Key Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Current Age</div>
              <div className="text-2xl font-bold text-blue-900">{currentAge}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Annual Salary</div>
              <div className="text-2xl font-bold text-green-900">£{annualSalary.toLocaleString()}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Shortfall Target</div>
              <div className="text-2xl font-bold text-orange-900">£{shortfallTarget.toLocaleString()}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I acknowledge these financial details and wish to proceed with the APF calculation
              </span>
              {acknowledged && <Check className="w-5 h-5 text-green-600" />}
            </label>
          </div>
        </CardContent>
      </Card>

      {acknowledged && (
        <div className="space-y-6">
          <APFINBLSummaryCard 
            profile={profileForCard}
            unifiedResult={mockUnifiedResult}
            sponsorships={apfSponsorships}
          />
          
          <APFSponsorshipYearsCard
            sponsorships={apfSponsorships}
            showMonthly={false}
            profile={profile}
            initialCapitalShortfall={shortfallTarget}
          />
        </div>
      )}
    </div>
  );
}
