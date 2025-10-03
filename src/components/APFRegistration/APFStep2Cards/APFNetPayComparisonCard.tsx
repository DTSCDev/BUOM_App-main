
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { systemFields } from '@/data/systemFields';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { usePayslipCalculations, PayslipComparison } from '@/hooks/usePayslipCalculations';
import { APFSponsorshipBreakdown } from '@/utils/pension/buomTypes';

interface Profile {
  annual_salary?: number;
  // Add other profile properties as needed
}

interface APFNetPayComparisonCardProps {
  showMonthly: boolean;
  sponsorships: APFSponsorshipBreakdown[];
  profile: Profile;
  className?: string;
}

export function APFNetPayComparisonCard({ showMonthly, sponsorships, profile, className }: APFNetPayComparisonCardProps) {
  const { calculatePayslipComparison } = usePayslipCalculations();

  // Use systemFields directly instead of useSFMResolver
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };

  // Calculate payslip comparison if we have the required data
  const payslipComparison = React.useMemo(() => {
    if (!profile?.annual_salary || !sponsorships?.length) {
      return null;
    }
    
    // Calculate total APF contribution from sponsorships
    const totalAPFContribution = sponsorships.reduce((sum, sponsorship) => sum + sponsorship.sponsorshipAmount, 0);
    
    return calculatePayslipComparison(profile.annual_salary, totalAPFContribution);
  }, [profile?.annual_salary, sponsorships, calculatePayslipComparison]);

  // If we don't have sponsorship data, show a message
  if (!sponsorships || sponsorships.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Net Pay Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Complete your APF sponsorship calculation to see your net pay comparison.
          </p>
        </CardContent>
      </Card>
    );
  }

  const netPayIncrease = payslipComparison?.netPayDifference || 0;
  const npgAmount = payslipComparison?.npgAmount || 0;
  const nrsrFee = payslipComparison?.nrsrFee || 0;

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Net Pay Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Net Pay Change - Using CAL-4XXX for payslip calculations */}
        <MetricCard
          title="Net Pay Change"
          value={formatCurrency(showMonthly ? netPayIncrease : netPayIncrease * 12)}
          headerBgColor="bg-blue-500"
          valueTextColor="text-blue-600"
          sfmCode="SFM-CAL-4221"
        />

        {/* NPG Amount - Net Pay Guarantee */}
        <MetricCard
          title="Net Pay Guarantee (NPG)"
          value={formatCurrency(showMonthly ? npgAmount : npgAmount * 12)}
          headerBgColor="bg-green-500"
          valueTextColor="text-green-600"
          sfmCode="SFM-CAL-4222"
        />

        {/* NRSR Fee */}
        <MetricCard
          title="NRSR Fee (25% of NPG)"
          value={formatCurrency(showMonthly ? nrsrFee : nrsrFee * 12)}
          headerBgColor="bg-purple-500"
          valueTextColor="text-purple-600"
          sfmCode="SFM-CAL-4223"
        />

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Monthly Net Pay Change:
            </span>
            <div className="flex items-center space-x-2">
              {getTrendIcon(netPayIncrease)}
              <span className={`font-semibold ${getTrendColor(netPayIncrease)}`}>
                {netPayIncrease >= 0 ? '+' : ''}{formatCurrency(showMonthly ? netPayIncrease : netPayIncrease * 12)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">
              Net Pay Guarantee:
            </span>
            <div className="flex items-center space-x-2">
              {getTrendIcon(npgAmount)}
              <span className={`font-semibold ${getTrendColor(npgAmount)}`}>
                {formatCurrency(showMonthly ? npgAmount : npgAmount * 12)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">
              NRSR Fee:
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-purple-600">
                {formatCurrency(showMonthly ? nrsrFee : nrsrFee * 12)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
