import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatUtils';
import { DEFAULT_PENSION_PARAMETERS } from '@/utils/pensionParameters/constants';
import { APFSponsorshipBreakdown } from '@/utils/pension/buomTypes';
import { systemFields } from '@/data/systemFields';

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
}

interface DashboardData {
  apfTargetIncome?: number;
  isaTargetMonthly?: number;
  currentAge?: number;
  retirementAge?: number;
  existingPensionValue?: number;
  totalAPFFunding?: number;
  totalMaturityValue?: number;
  shortfallAmount?: number;
}

interface ISARepaymentChartProps {
  sponsorships?: APFSponsorshipBreakdown[];
  showMonthly: boolean;
  dashboardData?: DashboardData;
  profile?: Profile;
  className?: string;
}

interface ChartDataPoint {
  age: number;
  inblDebt: number;
  isaTotal: number;
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

export function ISARepaymentChart({ sponsorships = [], showMonthly, dashboardData, profile, className }: ISARepaymentChartProps) {
  // Helper function to get SFM values - migrated from useSFMResolver to direct systemFields access
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };

  // Use ONLY SFM codes - NO FALLBACKS
  const currentAge = getSFMValue('SFM-PRF-2004'); // Profile Current Age from completed profile
  const retirementAge = getSFMValue('SFM-PRF-2005') || DEFAULT_PENSION_PARAMETERS.retirementAge;

  // Calculate chart data with proper error handling
  const generateChartData = (): ChartDataPoint[] => {
    if (!sponsorships || sponsorships.length === 0) {
      console.warn('No sponsorship data available for ISA Repayment Chart');
      return [];
    }

    const chartData: ChartDataPoint[] = [];
    const currentAgeInMonths = currentAge * 12;
    const startDisplayAge = Math.max(currentAge, 25);
    const growthRate = DEFAULT_PENSION_PARAMETERS.growthRateAccumulation;

    // Create tranche data from sponsorships with proper typing
    const trancheData = sponsorships.map((sponsorship, index) => ({
      startMonth: (sponsorship.age - currentAge) * 12 + 1,
      sponsorshipAmount: sponsorship.sponsorshipAmount,
      isaMonthlyRequired: sponsorship.isaMonthlyRequired,
      trancheNumber: index + 1
    }));

    // Generate chart data for each year from start age to retirement
    for (let displayAge = startDisplayAge; displayAge <= retirementAge; displayAge++) {
      const ageInMonths = displayAge * 12;
      const monthsFromStart = ageInMonths - currentAgeInMonths;
      
      let totalISABalance = 0;
      let totalINBLDebt = 0;
      let redemptionEvent: ChartDataPoint['redemptionEvent'] = undefined;
      
      // Calculate ISA and INBL for each tranche
      trancheData.forEach(tranche => {
        const monthsIntoTranche = monthsFromStart - (tranche.startMonth - 1);
        
        if (monthsIntoTranche > 0) {
          // ISA contributions phase (months 1-240)
          if (monthsIntoTranche <= 240) {
            const monthlyGrowthRate = growthRate / 12;
            const contributionMonths = Math.min(monthsIntoTranche, 240);
            
            // Calculate ISA balance with compound growth - FIXED calculation
            let isaBalance = 0;
            const monthlyContribution = tranche.isaMonthlyRequired;
            
            // Use proper compound interest formula
            if (monthlyGrowthRate > 0) {
              isaBalance = monthlyContribution * 
                ((Math.pow(1 + monthlyGrowthRate, contributionMonths) - 1) / monthlyGrowthRate);
            } else {
              isaBalance = monthlyContribution * contributionMonths;
            }
            
            totalISABalance += isaBalance;
            
            // Calculate INBL debt (reduces over time)
            const inblPrincipal = tranche.sponsorshipAmount;
            const monthsToMaturity = 252;
            const remainingMonths = Math.max(0, monthsToMaturity - monthsIntoTranche);
            const inblBalance = inblPrincipal * (remainingMonths / monthsToMaturity);
            totalINBLDebt += inblBalance;
          }
          
          // Redemption event at month 240 (20 years)
          if (monthsIntoTranche === 240) {
            redemptionEvent = {
              type: 'APF Maturity',
              amount: tranche.sponsorshipAmount * DEFAULT_PENSION_PARAMETERS.apfMaturityMultiplier,
              tranche: tranche.trancheNumber
            };
          }
        }
      });

      chartData.push({
        age: displayAge,
        inblDebt: totalINBLDebt,
        isaTotal: totalISABalance,
        month: monthsFromStart,
        redemptionEvent
      });
    }

    return chartData;
  };

  const chartData = generateChartData();

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
          <p className="font-semibold">{`Age: ${label}`}</p>
          <p className="text-blue-600">{`ISA Total: ${formatCurrency(data.isaTotal)}`}</p>
          <p className="text-red-600">{`INBL Debt: ${formatCurrency(data.inblDebt)}`}</p>
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
        <CardTitle className="flex items-center justify-between">
          <span>ISA Repayment Plan Target</span>
          <div className="text-sm font-normal text-gray-600">
            {sponsorships?.length || 0} Year Plan
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Key Metrics Header */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency((totalISARequired || 0) / monthlyDivisor)}
            </div>
            <div className="text-sm text-gray-600">
              ISA {showMonthly ? 'Monthly' : 'Annual'} Target
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency((totalAPFFunding || 0) / monthlyDivisor)}
            </div>
            <div className="text-sm text-gray-600">
              APF {showMonthly ? 'Monthly' : 'Annual'} Funding
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sponsorships?.length || 0}
            </div>
            <div className="text-sm text-gray-600">
              Sponsorship Years
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tickFormatter={(value: number) => formatCurrency(value)}
                  label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="isaTotal" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="ISA Total"
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="inblDebt" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  name="INBL Debt"
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No Data Available</p>
              <p className="text-sm">Complete Step 2 to generate ISA repayment projections</p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
            <span className="text-sm">ISA Savings Growth</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span className="text-sm">INBL Debt Reduction</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}