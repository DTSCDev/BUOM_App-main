import { Button } from "@/components/ui/button";
import { APFSponsorshipYearsCard } from "./APFStep2Cards/APFSponsorshipYearsCard";
import { APFINBLSummaryCard } from "./APFStep2Cards/APFINBLSummaryCard";
import { calculateActualSponsorshipsFromShortfall } from "@/utils/pension/apfSponsorshipCalculations";
import { calculateAge } from "@/utils/pensionCalculations";
import { calculateUnifiedPensionMetrics, UnifiedCalculationResult } from "@/utils/pension/unifiedCalculationEngine";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { calculateExistingPensionValue as calculateExistingPensionFromAssets } from "./APFStep4Components/calculationUtils";
import { Asset as UnifiedAsset, Profile as UnifiedProfile } from "@/utils/systemFields/types";
 

interface APFStep2KeyFinancialsProps {
  profile: {
    date_of_birth?: string;
    annual_salary?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
  };
  onComplete?: (data: Record<string, unknown>) => void;
}

export function APFStep2KeyFinancials({ profile, onComplete }: APFStep2KeyFinancialsProps) {
  const { assets } = useNetAssetValue();
  
  // Get basic data from profile - fix the calculateAge usage
  const currentAge = profile?.date_of_birth ? calculateAge(new Date(profile.date_of_birth)).years : null;
  const annualSalary = profile?.annual_salary || null;
  
  // Compute shortfall using unified engine (PRF + NAV)
  const existingPensionValue = calculateExistingPensionFromAssets(assets || []);
  // Map NAV Asset type to unified engine Asset type
  const assetsForUnified: UnifiedAsset[] = (assets || []).map(a => ({
    name: a.name,
    category: { name: a.category?.name },
    value: a.value,
  }));
  // Prepare profile for unified engine
  const unifiedProfile: UnifiedProfile = {
    annual_salary: annualSalary ?? undefined,
  };
  const unifiedResult: UnifiedCalculationResult | null = (currentAge && annualSalary !== null)
    ? calculateUnifiedPensionMetrics(
        currentAge,
        annualSalary,
        existingPensionValue,
        true,
        assetsForUnified,
        unifiedProfile
      )
    : null;
  const shortfallTarget = unifiedResult?.currentCapitalShortfall || 0;

  // Calculate APF sponsorships using the shortfall target
  const apfSponsorships = (currentAge && annualSalary !== null && shortfallTarget > 0)
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
  const maxFundingYears = apfSponsorships.length;

  // Do not gate rendering on missing data; fallback values are handled downstream

  // Use unified engine outputs for the summary card; fall back to minimal fields when unavailable
  const summaryUnified: UnifiedCalculationResult = unifiedResult || {
    proposedAPFFunding: totalAPFFunding,
    feasibleAPFFunding: totalAPFFunding,
    salaryExchangeReasonForLimit: "",
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
    totalProjectedAssets: 0,
    capitalShortfallToday: 0,
    existingPlanIncome: 0,
    targetIncomeToday: 0
  };

  // Profile passthrough for cards that rely on salary or labels
  const profileForCards = {
    annual_salary: annualSalary ?? undefined,
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    dateOfBirth: profile.dateOfBirth || new Date()
  } as const;

  return (
    <div className="space-y-6">
      <APFINBLSummaryCard
        profile={{
          annualSalary: annualSalary ?? 0,
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          dateOfBirth: profile.dateOfBirth || new Date()
        }}
        unifiedResult={summaryUnified}
        sponsorships={apfSponsorships}
      />

      <div className="space-y-6">
          <APFSponsorshipYearsCard
            sponsorships={apfSponsorships}
            showMonthly={false}
            profile={profileForCards}
            initialCapitalShortfall={shortfallTarget}
          />
        {onComplete && (
          <div className="pt-2">
            <Button
              onClick={() => onComplete({
                sponsorships: apfSponsorships,
                maxFundingYears,
                totalAPFFunding,
              })}
              className="w-full"
            >
              Save and Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
