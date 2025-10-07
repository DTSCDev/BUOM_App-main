import { ApfRetirementPlanSummary } from "@/components/Dashboard/RetirementPlanOverview";
import { APFSummaryCards } from "@/components/Dashboard/APFSummaryCards";
import { CurrentYearAPFCard } from "@/components/Dashboard/CurrentYearAPFCard";
import { CurrentYearINBLCard } from "@/components/Dashboard/CurrentYearINBLCard";
import BUOMRetirementGraph from "@/components/BUOMRetirementGraph";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { calculateRetirementProjection } from "@/utils/retirementCalculations";
import { calculateAge, calculateYearsUntilPension } from "@/utils/pensionCalculations";
import { calculateUnifiedPensionMetrics } from "@/utils/pension/unifiedCalculationEngine";
import { Asset as UnifiedAsset, Profile as UnifiedProfile } from "@/utils/systemFields/types";
import { getPensionParameters } from "@/utils/pensionParameters";
import { Button } from "@/components/ui/button";

export default function APFDashboard() {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  
  // Check if APF is actually live (not just Agreement In Principle)
  const isAPFLive = false; // TODO: Connect to actual APF status when available
  
  // Ensure profile data is complete before proceeding
  if (!profile?.date_of_birth || !profile?.annual_salary) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Profile Incomplete</h2>
          <p className="text-gray-600 mb-4">
            Please complete your profile information including salary to view your APF Dashboard.
          </p>
          <Button onClick={() => window.location.href = '/profile'}>
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  // Calculate dynamic retirement data from user profile
  const currentAge = calculateAge(new Date(profile.date_of_birth)).years;
  
  const params = getPensionParameters();
  const retirementAge = (profile.retirement_age ?? params.retirementAge) as number;
  
  // Calculate existing pension value from assets (guard against undefined assets)
  const existingPensionValue = (assets || [])
    .filter(asset => 
      asset.category?.name?.toLowerCase().includes('pension') ||
      asset.name?.toLowerCase().includes('pension')
    )
    .reduce((sum, asset) => sum + (asset.value || 0), 0);
  
  // Use unified pension engine for APF Dashboard calculations (guard against undefined assets)
  const currentISAValue = (assets || [])
    .filter(asset => 
      asset.category?.name?.toLowerCase().includes('isa') ||
      asset.name?.toLowerCase().includes('isa')
    )
    .reduce((sum, asset) => sum + (asset.value || 0), 0);
  
  const unified = calculateUnifiedPensionMetrics(
    currentAge,
    profile.annual_salary || 0,
    existingPensionValue,
    false,
    // Map assets to unified engine type
    (assets || []).map(a => ({
      name: a.name,
      category: { name: a.category?.name },
      value: a.value,
    })) as UnifiedAsset[],
    // Provide a minimally-typed unified profile
    ({
      annual_salary: profile.annual_salary || 0,
    } as UnifiedProfile)
  );
  
  // Calculate dynamic retirement projection using APF results
  // CAL-4107: Target Income at Retirement (use SPA 67 inflation)
  const yearsToSPA = calculateYearsUntilPension(new Date(profile.date_of_birth)).years;
  const targetIncomeToday = (profile?.annual_salary || 0) * params.pensionIncomeTarget;
  const cal4107TargetIncome = targetIncomeToday * Math.pow(1 + params.pensionIncomeInflation, Math.max(0, yearsToSPA));

  const retirementData = calculateRetirementProjection({
    currentAge,
    retirementAge,
    currentSalary: profile?.annual_salary || 0,
    currentPensionValue: existingPensionValue,
    monthlyContribution: (profile?.annual_salary || 0) * (profile?.pension_contribution_employee || 5) / 100 / 12,
    employerContribution: (profile?.annual_salary || 0) * (profile?.pension_contribution_employer || 3) / 100 / 12,
    annualGrowthRate: params.growthRateAccumulation,
    inflationRate: params.pensionIncomeInflation,
    targetRetirementIncome: cal4107TargetIncome
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">APF Dashboard</h1>
        <p className="text-muted-foreground mt-2">Advanced Pension Funding - Member Portal</p>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Retirement Plan Overview */}
        <div className="space-y-6">
          <ApfRetirementPlanSummary />
        </div>
        
        {/* Right Column - Chart */}
        <div className="space-y-6">
          {retirementData.length > 0 ? (
            <BUOMRetirementGraph 
              data={retirementData}
              currentAge={currentAge}
              retirementAge={retirementAge}
              title="APF Retirement Projection"
            />
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700">Complete Your Profile</h3>
              <p className="text-gray-600 mt-2">
                Add your salary and pension details to see your retirement projection.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* APF Status Notice - Show if APF is not live */}
      {!isAPFLive && (
        <div className="w-full bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-800">APF Agreement In Principle Stage</h3>
              <p className="text-yellow-700 mt-1">
                APF assets, loans, and account balances will be displayed once your Advanced Pension Fund goes live. 
                Currently showing projection data only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Second Row - Current Year Cards - Only show if APF is live */}
      {isAPFLive && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentYearAPFCard />
          <CurrentYearINBLCard />
        </div>
      )}
      
      {/* APF Summary Cards - Only show if APF is live */}
      {isAPFLive && (
        <div className="w-full bg-white p-6 rounded-lg border">
          <APFSummaryCards />
        </div>
      )}
    </div>
  );
}