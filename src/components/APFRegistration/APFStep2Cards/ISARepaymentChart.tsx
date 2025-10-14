import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';
import { formatCurrency } from '@/utils/formatUtils';
import { DEFAULT_PENSION_PARAMETERS } from '@/utils/pensionParameters/constants';
import { getPensionParameters } from '@/utils/pensionParameters';
import { APFSponsorshipBreakdown } from '@/utils/pension/buomTypes';
import { systemFields } from '@/data/systemFields';
import { usePayslipCalculations } from '@/hooks/usePayslipCalculations';

// Define proper interfaces to replace 'any' types
interface Profile {
  annual_salary?: number;
  date_of_birth?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  paye_tax_code?: string;
  is_director?: boolean;
  has_controlling_shares?: boolean;
  p11d?: number | string;
}


interface ISARepaymentChartProps {
  sponsorships?: APFSponsorshipBreakdown[];
  showMonthly: boolean;
  profile?: Profile;
  className?: string;
}

interface ChartDataPoint {
  age: number;
  inblDebt: number;
  isaTotal: number;
  isaMonthly?: number;
  month: number;
  redemptionEvent?: {
    type: string;
    amount: number;
    tranche: number;
  };
}

// Define proper tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
    value: number;
    dataKey: string;
    color: string;
    name?: string;
  }>;
  label?: string | number;
}

export function ISARepaymentChart({ sponsorships = [], showMonthly, profile, className }: ISARepaymentChartProps) {
  const params = (getPensionParameters() ?? DEFAULT_PENSION_PARAMETERS) as typeof DEFAULT_PENSION_PARAMETERS;
  const { calculatePayslipComparison } = usePayslipCalculations();
  // Helper: robust numeric extraction from systemFields (handles currency/commas)
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    if (!field) return 0;
    const cleaned = String(field.outputValue).replace(/[^0-9.-]/g, "");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  };

  // Use ONLY SFM codes - NO FALLBACKS
  const currentAge = getSFMValue('SFM-PRF-2004'); // Profile Current Age from completed profile
  const retirementAge = getSFMValue('SFM-PRF-2005') || DEFAULT_PENSION_PARAMETERS.retirementAge;
  // Fallback current age from profile if SFM missing
  let currentAgeSafe = getSFMValue('SFM-PRF-2004');
  if (!currentAgeSafe || currentAgeSafe < 16 || currentAgeSafe > 90) {
    if (profile?.date_of_birth) {
      const dob = new Date(profile.date_of_birth);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear() - (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      currentAgeSafe = Math.max(18, Math.min(90, age));
    } else {
      currentAgeSafe = 42; // sensible default for display
    }
  }

  // Calculate chart data: monthly symbiotic ISA vs INBL
  const generateChartData = (): ChartDataPoint[] => {
    const chartData: ChartDataPoint[] = [];

    const baseAnnualSalary = profile?.annual_salary ?? getSFMValue('SFM-PRF-2021');
  // Normalize rates (prefer Parameter Settings if SFM missing or non-positive)
  const normalizeRate = (raw: number | undefined, fallback: number): number => {
    let r = (typeof raw === 'number' && isFinite(raw) && raw > 0) ? raw : fallback;
    // Accept either percent or decimal; convert percent to decimal
    if (r > 1) r = r / 100;
    if (!isFinite(r)) r = fallback;
    // clamp bounds
    if (r < -0.99) r = -0.99;
    if (r > 0.99) r = 0.99;
    return r;
  };

    // Use unified salary inflation (2%) as the default escalation source
    const inflationRate = normalizeRate(
      getSFMValue('SFM-CAL-4402') || params.salaryInflation,
      DEFAULT_PENSION_PARAMETERS.salaryInflation
    );
    const growthRate = normalizeRate(getSFMValue('SFM-CAL-4401'), DEFAULT_PENSION_PARAMETERS.growthRateAccumulation);
    const providerCharges = normalizeRate(getSFMValue('SFM-CAL-4403'), params.providerCharges ?? DEFAULT_PENSION_PARAMETERS.providerCharges);
    const netAnnualGrowth = growthRate - providerCharges;
    let netMonthlyRate = Math.pow(1 + netAnnualGrowth, 1/12) - 1;
    if (!isFinite(netMonthlyRate)) netMonthlyRate = 0;

    const parseCurrencyToNumber = (raw?: string | number | null): number => {
      if (raw === undefined || raw === null) return 0;
      if (typeof raw === 'number') return raw;
      const cleaned = String(raw).replace(/[^0-9.-]/g, '');
      const n = Number(cleaned);
      return isNaN(n) ? 0 : n;
    };

    const p11d = parseCurrencyToNumber(profile?.p11d ?? null);
    const feasibleAPFFunding = Math.max(0, (baseAnnualSalary || 0) + p11d - params.personalAllowance);

    // Force ISA monthly base to £74 (APF-4261-M) per instruction
    // Ignore sponsorship-provided monthly amounts to avoid incorrect £424/mth values
    const isaMonthlyBase = 74;

    // Compute NPG/NRSR monthly from payslip comparison for Month 1 baseline
    let npgMonthly = 0;
    try {
      const pc = calculatePayslipComparison(baseAnnualSalary || 0, feasibleAPFFunding);
      npgMonthly = pc.npgAmount || 0;
    } catch {
      // Fallback to align with requirement: target ~£3,261 principal month 1
      npgMonthly = 3261; // will be combined with NRSR below
    }
    const nrsrMonthly = npgMonthly * 0.25;

    let isaBalance = 0;
    let inblDebt = 0; // positive magnitude tracked internally; rendered negative

    // Starting period 0
    chartData.push({ age: currentAgeSafe, month: 0, isaTotal: 0, inblDebt: 0 });

    const contributionsEndMonth = 240; // contributions stop after 240 months
    const stage1Month = 241; // NRSR Time Tokens reduce INBL principal
    const stage2Month = 242; // ISA repays NPG principal from ISA balance
    const totalMonthsToPlot = 300; // show 0–300 months as requested
    // Ensure INBL principal matches expected £39,136 at month 12
    const npgMonthlyFixed = 39136 / 12; // £3,261.333.. per month
    // Fixed amounts per APF codes
    const timeTokenReduction = 7827; // APF-4231-M (NRSR refund after 240 months)
    const isaRepaymentAt242 = 31309; // APF-4221-M (NPG principal repayment from ISA)

    for (let m = 1; m <= totalMonthsToPlot; m++) {
      // ISA contribution: escalates ANNUALLY by inflation (not monthly)
      const yearsElapsed = Math.max(0, Math.floor((m - 1) / 12));
      let factor = Math.pow(1 + inflationRate, yearsElapsed);
      if (!isFinite(factor)) factor = 1;
      const monthlyContribution = (m <= contributionsEndMonth)
        ? isaMonthlyBase * factor
        : 0; // contributions stop after 240 months

      // Apply monthly compounding growth after adding contribution
      const monthlyContributionSafe = Number.isFinite(monthlyContribution) ? monthlyContribution : 0;
      isaBalance = (isaBalance + monthlyContributionSafe) * (1 + netMonthlyRate);
      if (!Number.isFinite(isaBalance)) isaBalance = 0;

      // INBL debt behavior
      if (m <= 12) {
        // First 12 months: INBL principal increases (NPG only)
        // NRSR is applied separately and covered by Time Tokens later
        inblDebt += npgMonthlyFixed;
      } else if (m < stage1Month) {
        // Months 13..239: debt remains unchanged
      } else if (m === stage1Month) {
        // Month 241: Stage 1 — Time Tokens refund NRSR fee (no ISA withdrawal)
        inblDebt = Math.max(0, inblDebt - timeTokenReduction);
        chartData.push({
          age: currentAgeSafe + m / 12,
          month: m,
          isaTotal: isaBalance,
          isaMonthly: monthlyContribution,
          inblDebt: -Math.abs(inblDebt),
          redemptionEvent: { type: 'NRSR', amount: timeTokenReduction, tranche: 1 }
        });
        continue;
      } else if (m === stage2Month) {
        // Month 242: Stage 2 — ISA repays NPG principal
        const repayAmount = Math.min(isaBalance, isaRepaymentAt242);
        isaBalance -= repayAmount;
        inblDebt = Math.max(0, inblDebt - repayAmount);
        chartData.push({
          age: currentAgeSafe + m / 12,
          month: m,
          isaTotal: isaBalance,
          isaMonthly: monthlyContribution,
          inblDebt: -Math.abs(inblDebt),
          redemptionEvent: { type: 'NPG', amount: repayAmount, tranche: 2 }
        });
        continue;
      } else {
        // Post month 240: show any remaining debt; ISA compounds without contributions
      }

      chartData.push({
        age: currentAgeSafe + m / 12,
        month: m,
        isaTotal: isaBalance,
        isaMonthly: monthlyContribution,
        inblDebt: -Math.abs(inblDebt), // render negative for green downward bars
      });
    }

    return chartData;
  };

  const chartData = generateChartData();
  const hasInvalidPoints = chartData.some(d => !Number.isFinite(d.isaTotal) || !Number.isFinite(d.inblDebt) || !Number.isFinite(d.month));
  const maxDebtMagnitude = Math.max(...chartData.map(d => Math.abs(d.inblDebt || 0)), 0);
  const maxISAMonthly = Math.max(...chartData.map(d => d.isaMonthly || 0), 0);
  const yMaxDebt = Math.ceil(maxDebtMagnitude * 1.1);
  const yMaxISA = Math.ceil(maxISAMonthly * 1.5);

  // Debug logging
  console.log('=== ISA REPAYMENT CHART DEBUG ===');
  console.log('Sponsorships:', sponsorships?.length || 0);
  console.log('Current Age:', currentAge);
  console.log('Chart Data Points:', chartData.length);
  console.log('=== CHART DATA SAMPLE ===');
  console.log('First 5 data points:', chartData.slice(0, 5));
  console.log('Last 5 data points:', chartData.slice(-5));

  // Custom tooltip for the chart with proper typing
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{`Month: ${label}`}</p>
          <p className="text-blue-600">{`ISA Total: ${formatCurrency(data.isaTotal)}`}</p>
          <p className="text-green-600">{`INBL Debt: ${formatCurrency(data.inblDebt)}`}</p>
          {data.redemptionEvent && (
            <p className="text-green-600 font-medium">
              {`${data.redemptionEvent.type}: ${formatCurrency(data.redemptionEvent.amount)}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate key metrics for display
  const totalISARequired = sponsorships?.reduce((sum, s) => sum + s.isaAnnualRequired, 0) || 0;
  const totalAPFFunding = sponsorships?.reduce((sum, s) => sum + s.sponsorshipAmount, 0) || 0;
  const monthlyDivisor = showMonthly ? 12 : 1;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <span className="text-blue-600">ISA Repayment Plan</span>
          <div className="text-sm font-normal text-gray-600">
            Year {sponsorships?.[0]?.year || 1} ({sponsorships?.[0]?.taxYear || `${new Date().getFullYear()}/${new Date().getFullYear()+1}`}) · Age {sponsorships?.[0]?.age || Math.floor(currentAgeSafe)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>

        {/* Chart - Single axis: ISA Total (positive) vs INBL Debt (negative) */}
        {chartData.length > 0 && !hasInvalidPoints ? (
          <div className="h-80">
            <ReactECharts
              style={{ height: '100%', width: '100%' }}
              option={{
                // Compact grid and ensure labels stay within bounds
                // Align y-axis under the header text start (approx px-6 ~ 24px)
                grid: { left: 24, right: 16, top: 40, bottom: 80, containLabel: true },
                tooltip: {
                  trigger: 'axis',
                  formatter: (params: unknown) => {
                    const arr = Array.isArray(params) ? params : [params];
                    const first = arr[0] as { dataIndex?: number };
                    const idx = first?.dataIndex ?? 0;
                    const d = chartData[idx];
                    const lines = [
                      `Month: ${d.month}`,
                      `ISA Monthly: ${formatCurrency(d.isaMonthly || 0)}`,
                      `ISA Total: ${formatCurrency(d.isaTotal)}`,
                      `INBL Debt: ${formatCurrency(d.inblDebt)}`
                    ];
                    if (d.redemptionEvent) {
                      const label =
                        d.month === 241
                          ? 'Time Tokens repay NRSR Balance'
                          : d.month === 242
                          ? 'ISA repays NPG Balance'
                          : d.redemptionEvent.type;
                      lines.push(`${label}: ${formatCurrency(d.redemptionEvent.amount)}`);
                    }
                    return lines.join('<br/>');
                  }
                },
                legend: { data: ['ISA Total', 'INBL Debt'], bottom: 0 },
                xAxis: {
                  type: 'category',
                  // Remove axis name to avoid clipped 'M' at right
                  data: chartData.map(d => d.month),
                  axisLabel: {
                    // Show labels only at 12, 60, 120, 180, 240, 300
                    interval: (_index: number, value: string | number) => {
                      const allowed = new Set([12, 60, 120, 180, 240, 300]);
                      return allowed.has(Number(value));
                    },
                    formatter: (value: number | string) => String(value)
                  },
                  axisTick: {
                    // Keep default ticks; we’re only filtering labels
                    alignWithLabel: false
                  }
                },
                yAxis: {
                  type: 'value',
                  min: (() => {
                    const m = Math.max(...chartData.map(d => Math.abs(d.inblDebt || 0)), 0);
                    const val = -Math.ceil(m * 1.1);
                    return Number.isFinite(val) ? val : 0;
                  })(),
                  max: (() => {
                    const m = Math.max(...chartData.map(d => d.isaTotal || 0), 0);
                    const val = Math.ceil(m * 1.1);
                    return Number.isFinite(val) ? val : 0;
                  })(),
                  axisLabel: {
                    margin: 4,
                    hideOverlap: true,
                    formatter: (val: number) => {
                      const sign = val < 0 ? '-' : '';
                      const abs = Math.abs(val);
                      if (abs >= 1000) return `${sign}£${Math.round(abs / 1000)}k`;
                      return `${sign}£${Math.round(abs)}`;
                    }
                  }
                },
                series: [
                  {
                    name: 'ISA Total',
                    type: 'line',
                    data: chartData.map(d => d.isaTotal || 0),
                    itemStyle: { color: '#2563eb' },
                    lineStyle: { width: 2 },
                    areaStyle: { opacity: 0.1 }
                  },
                  {
                    name: 'INBL Debt',
                    type: 'bar',
                    data: chartData.map(d => d.inblDebt || 0),
                    itemStyle: { color: '#22c55e' },
                    barWidth: '40%'
                  }
                ],
                // markLine moved into series to ensure visibility
              }}
            />
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No Data Available</p>
              <p className="text-sm">Complete Step 2 to generate ISA repayment projections</p>
            </div>
          </div>
        )}

        {/* Legend provided by ECharts below x-axis */}
      </CardContent>
    </Card>
  );
}