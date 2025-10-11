import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { APFMetricSummaryCard } from "@/components/Dashboard/APFMetricSummaryCard";
import { Calendar, AlertTriangle, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { useRetirementCalculatorHub } from "@/hooks/useRetirementCalculatorHub";
import { useProfile } from "@/hooks/useProfile";
import { getPensionParameters } from "@/utils/pensionParameters";
import { APFInblSummaryProposedCard } from "./APFStep2Cards/APFInblSummaryProposedCard";

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

export function APFStep2KeyFinancials({ onComplete }: APFStep2KeyFinancialsProps) {
  // Central values: CAL-4121 shortfall and PRF salary/P11D for Year 1 calc
  const hub = useRetirementCalculatorHub();
  const { profile } = useProfile();
  const params = getPensionParameters();

  const annualSalary = profile?.annual_salary || hub.prf2021_annualSalary || 0; // SFM-PRF-2021
  // Safely parse P11D (may be stored as a currency string)
  const parseCurrencyToNumber = (raw?: string | null): number => {
    if (!raw) return 0;
    const cleaned = String(raw).replace(/[^0-9.-]/g, "");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  };
  const p11d = parseCurrencyToNumber(profile?.p11d); // SFM-PRF-2030
  const personalAllowance = params.personalAllowance; // SFM-CAL-4421

  // APF-4201-M: Year 1 Max Initial Contribution (no Carry Forward)
  const year1MaxInitialContribution = Math.max(0, annualSalary + p11d - personalAllowance);
  // SFM-APF-4211-M: Year 1 Maturity (APF-4201-M × 1.582)
  const year1Maturity = year1MaxInitialContribution * params.apfMaturityMultiplier;

  // APF & INBL SUMMARY: APF-1282 from CAL-4121, APF-1281 derived
  const totalMaturityValue = hub.cal4121_capitalShortfall || 0; // SFM-APF-1282
  const totalInitialFunding = totalMaturityValue / params.apfMaturityMultiplier; // SFM-APF-1281

  // SFM-APF-4241-M: INBL Principal (Year 1, Maximum) – allowed temporary fixed value per instructions
  const inblPrincipalYear1 = 37919;

  // APF-4251-M: Remaining shortfall balance (Year 1, Maximum)
  const year1ShortfallBalance = Math.max(0, totalInitialFunding - year1MaxInitialContribution);

  // Plan Summary calculations
  const totalYearsRequired = year1MaxInitialContribution > 0
    ? Math.ceil(totalInitialFunding / year1MaxInitialContribution)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div id="step2-header" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>
          2
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#4FF456' }}>Step 2: Key Financials for APF Funding</h2>
          <p className="text-sm text-gray-600">Review your Advanced Pension Funding structure and INBL loan details</p>
        </div>
      </div>

      {/* APF & INBL Summary - Proposed Funding */}
      <APFInblSummaryProposedCard profile={{ annual_salary: annualSalary }} sponsorships={[]} opacity="opacity-100" />

      {/* Year 1 Sponsorship Funding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg font-semibold" style={{ color: '#4FF456' }}>Year 1 Sponsorship Funding</span>
            </div>
            <span className="text-sm text-gray-700">(2025/26) · Age 42</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Advisory Banner */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-800">Advisory Protection Applied</div>
              <div className="text-sm text-yellow-700">1257L tax code limit — Personal Allowance deducted from AIP Offer to preserve NI credits.</div>
            </div>
          </div>

          {/* Year 1 metric tiles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="APF INITIAL CONTRIBUTION"
              value={formatCurrency(year1MaxInitialContribution)}
              headerBgColor="bg-transparent"
              valueTextColor="text-[rgb(191,144,0)]"
              style={{ backgroundColor: 'rgb(191,144,0)' }}
              opacity="opacity-100"
              sfmCode="SFM-APF-4201-M"
            />
            <MetricCard
              title="APF MATURITY"
              value={formatCurrency(year1Maturity)}
              headerBgColor="bg-purple-600"
              valueTextColor="text-purple-600"
              opacity="opacity-100"
              sfmCode="SFM-APF-4211-M"
            />
            <MetricCard
              title="TOTAL INBL PRINCIPAL"
              value={formatCurrency(inblPrincipalYear1)}
              headerBgColor="bg-green-600"
              valueTextColor="text-green-600"
              opacity="opacity-100"
              sfmCode="SFM-APF-4241-M"
            />
            <MetricCard
              title="SHORTFALL BALANCE"
              value={formatCurrency(year1ShortfallBalance)}
              headerBgColor="bg-red-600"
              valueTextColor="text-red-600"
              opacity="opacity-100"
              sfmCode="SFM-APF-4251-M"
            />
          </div>

          {/* Note under tiles */}
          <div className="text-xs font-bold text-black border rounded-md p-2" style={{ backgroundColor: '#4FF456' }}>Note: Remaining shortfall of {formatCurrency(year1ShortfallBalance)} will be met by additional APF funding in future tax years (subject to status)</div>
      </CardContent>
    </Card>

      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold" style={{ color: '#4FF456' }}>APF Sponsorship Plan Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-start">
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-600 min-h-[40px]">Total Sponsorship Years Required</div>
              <div className="text-lg font-semibold leading-none">{totalYearsRequired}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-600 min-h-[40px]">Total Initial APF Contributions</div>
              <div className="text-lg font-semibold leading-none text-[rgb(191,144,0)]">{formatCurrency(totalInitialFunding)}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-600 min-h-[40px]">Total APF Maturity Value</div>
              <div className="text-lg font-semibold leading-none text-purple-600">{formatCurrency(totalMaturityValue)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation (no inline Next button; navigation controls handle Next) */}
      <Card>
        <CardContent className="space-y-4">
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" />
            <span>
              I acknowledge that I have reviewed and understood the APF funding structure, INBL loan terms, and the value proposition of this arrangement.
            </span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
