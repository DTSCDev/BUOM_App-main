
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatUtils";
import { Calculator } from "lucide-react";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { calculateFullISATimeline } from "@/utils/pension/isaTimelineCalculator";
import { calculateISAContributions } from "@/utils/pension/isaContributionCalculator";
import { getPensionParameters } from "@/utils/pensionParameters";
import { ISA_CALCULATION_CONSTANTS } from "@/utils/pension/isaConstants";

interface APFAEEquivalentCardProps {
  maturityValue: number;
  showMonthly?: boolean;
}

export function APFAEEquivalentCard({ maturityValue, showMonthly = false }: APFAEEquivalentCardProps) {
  const params = getPensionParameters();
  
  // Calculate AE equivalent contributions needed to match APF maturity value
  const calculateAEEquivalent = () => {
    // CORRECTED: Use net AE growth rate (5% gross - 0.5% fees = 4.5% net)
    const aeNetGrowthRate = params.growthRateAccumulation - params.providerCharges; // 4.5% annual net
    const monthlyAEGrowthRate = aeNetGrowthRate / 12;
    const annualInflationRate = params.pensionIncomeInflation; // 2% p.a.
    
    let totalAEContributions = 0;
    let year1AEContributions = 0;
    let year2AEContributions = 0;
    let year3AEContributions = 0;
    
    // Target maturity value per tranche (divide equally across 3 tranches)
    const targetMaturityPerTranche = maturityValue / 3;
    
    // Calculate required monthly AE contribution for each tranche
    const calculateRequiredMonthlyAE = (contributionMonths: number, targetValue: number) => {
      // Use future value of annuity formula to find required monthly payment
      // FV = PMT * [((1 + r)^n - 1) / r] where r is monthly rate, n is months
      const n = contributionMonths;
      const r = monthlyAEGrowthRate;
      
      if (r === 0) {
        return targetValue / n;
      }
      
      const futureValueFactor = (Math.pow(1 + r, n) - 1) / r;
      return targetValue / futureValueFactor;
    };
    
    // Calculate for each tranche using dynamic timeline (up to 3 tranches max)
    const maxTranches = 3; // Still support up to 3 for AE comparison
    const trancheResults = [];
    
    for (let trancheIndex = 0; trancheIndex < maxTranches; trancheIndex++) {
      const trancheStartMonth = ISA_CALCULATION_CONSTANTS.FIRST_TRANCHE_START + (trancheIndex * ISA_CALCULATION_CONSTANTS.TRANCHE_START_OFFSET);
      const trancheEndMonth = trancheStartMonth + ISA_CALCULATION_CONSTANTS.CONTRIBUTION_MONTHS_PER_TRANCHE - 1;
      const trancheContributionMonths = ISA_CALCULATION_CONSTANTS.CONTRIBUTION_MONTHS_PER_TRANCHE;
      
      const monthlyAE = calculateRequiredMonthlyAE(trancheContributionMonths, targetMaturityPerTranche);
      trancheResults.push({
        index: trancheIndex,
        startMonth: trancheStartMonth,
        endMonth: trancheEndMonth,
        monthlyAE: monthlyAE
      });
    }
    
    // Calculate total contributions with inflation escalation using dynamic tranches
    for (let month = 1; month <= ISA_CALCULATION_CONSTANTS.TOTAL_MONTHS; month++) {
      let monthlyAE = 0;
      
      // Process each tranche dynamically
      trancheResults.forEach((tranche) => {
        if (month >= tranche.startMonth && month <= tranche.endMonth) {
          const inflationYears = Math.floor((month - tranche.startMonth) / 12);
          const escalationYears = Math.max(0, inflationYears);
          const inflatedAE = tranche.monthlyAE * Math.pow(1 + annualInflationRate, escalationYears);
          monthlyAE += inflatedAE;
          
          // Accumulate by tranche for backward compatibility
          if (tranche.index === 0) {
            year1AEContributions += inflatedAE;
          } else if (tranche.index === 1) {
            year2AEContributions += inflatedAE;
          } else if (tranche.index === 2) {
            year3AEContributions += inflatedAE;
          }
        }
      });
      
      totalAEContributions += monthlyAE;
    }
    
    return {
      year1MonthlyAE: trancheResults[0]?.monthlyAE || 0,
      year2MonthlyAE: trancheResults[1]?.monthlyAE || 0,
      year3MonthlyAE: trancheResults[2]?.monthlyAE || 0,
      totalMonthlyAE: trancheResults.reduce((sum, t) => sum + t.monthlyAE, 0),
      totalAEContributions,
      year1AEContributions,
      year2AEContributions,
      year3AEContributions
    };
  };
  
  const aeEquivalent = calculateAEEquivalent();
  const isaTimeline = calculateFullISATimeline();
  
  // Calculate return on capital for AE
  const aeReturnOnCapital = aeEquivalent.totalAEContributions > 0 ? ((maturityValue / aeEquivalent.totalAEContributions) * 100) : 0;
  
  // For display purposes
  const displayAEContributions = showMonthly ? aeEquivalent.totalAEContributions / 312 : aeEquivalent.totalAEContributions;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Auto Enrollment Equivalent Comparison</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          AE contributions required to match APF maturity value over identical 21-year timeline
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title={showMonthly ? "TOTAL AE (MONTHLY AVG)" : "TOTAL AE CONTRIBUTIONS"}
            value={formatCurrency(displayAEContributions)}
            headerBgColor="bg-orange-600"
            valueTextColor="text-orange-600"
            sfmCode="SFM-APF-1263"
          />
          
          <MetricCard
            title="SAME MATURITY VALUE"
            value={formatCurrency(maturityValue)}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
            sfmCode="SFM-APF-1264"
          />
          
          <MetricCard
            title="RETURN ON CAPITAL"
            value={`${Math.round(aeReturnOnCapital)}%`}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
            style={{ backgroundColor: '#4FF546' }}
            sfmCode="SFM-APF-1265"
          />
        </div>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">Auto Enrollment Comparison Notes</h4>
          <ul className="text-sm space-y-1 text-orange-700">
            <li>• Uses identical 21-year contribution timeline as APF ({ISA_CALCULATION_CONSTANTS.CONTRIBUTION_MONTHS_PER_TRANCHE} months per tranche)</li>
            <li>• Assumes {((params.growthRateAccumulation - params.providerCharges) * 100).toFixed(1)}% annual growth rate for AE pension</li>
            <li>• Includes same {(params.pensionIncomeInflation * 100).toFixed(0)}% annual inflation escalation</li>
            <li>• Return on Capital shows AE investment efficiency vs contributions</li>
            <li>• Higher total AE contributions needed to achieve same maturity value</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
