
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/pensionCalculations';

interface DetailedPensionContributionsProps {
  pensionContribution: number;
  grossPay: number;
}

const DetailedPensionContributions: React.FC<DetailedPensionContributionsProps> = ({
  pensionContribution,
  grossPay
}) => {
  // Pensionable Pay Method (Set 2 & 3) - Most common method for 2025/2026
  const pensionablePayPercentage = 0.85; // 85% of total pay
  const employeeContributionRate = 0.05; // 5%
  const employerContributionRate = 0.03; // 3%
  
  // Calculate the pensionable earnings using Set 2 & 3 method
  const pensionableEarnings = grossPay * pensionablePayPercentage;
  const employeeContribution = pensionableEarnings * employeeContributionRate;
  const employerContribution = pensionableEarnings * employerContributionRate;
  const totalContribution = employeeContribution + employerContribution;
  
  // Calculate net pay with 1257L tax code
  const taxCode1257L = 12570; // Personal allowance for 1257L
  const basicRateTax = 0.20;
  const niRate = 0.12;
  
  const annualGross = grossPay * 12;
  const taxableIncome = Math.max(0, annualGross - taxCode1257L);
  const annualIncomeTax = taxableIncome * basicRateTax;
  const annualNI = Math.max(0, (annualGross - 12570) * niRate); // NI threshold
  const annualNetPay = annualGross - annualIncomeTax - annualNI - (totalContribution * 12);
  const monthlyNetPay = annualNetPay / 12;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Estimated Existing Monthly Pay Assumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {/* SFM-109 */}
            <div className="text-muted-foreground">Contribution Method:</div>
            <div className="font-medium">
              Net Pay Arrangement
              <div className="text-[8px] text-muted-foreground">SFM-109</div>
            </div>
            
            {/* SFM-110 */}
            <div className="text-muted-foreground">Auto Enrollment Basis:</div>
            <div className="font-medium">
              Pensionable Pay Method (Set 2 & 3)
              <div className="text-[8px] text-muted-foreground">SFM-110</div>
            </div>
            
            {/* SFM-111 */}
            <div className="text-muted-foreground">Pensionable Pay Percentage:</div>
            <div className="font-medium">
              85% of Total Pay
              <div className="text-[8px] text-muted-foreground">SFM-111</div>
            </div>
            
            {/* SFM-112 */}
            <div className="text-muted-foreground">Monthly Gross Pay:</div>
            <div className="font-medium">
              {formatCurrency(grossPay)}
              <div className="text-[8px] text-muted-foreground">SFM-112</div>
            </div>
            
            {/* SFM-113 */}
            <div className="text-muted-foreground">Pensionable Earnings:</div>
            <div className="font-medium">
              {formatCurrency(pensionableEarnings)}
              <div className="text-[8px] text-muted-foreground">SFM-113</div>
            </div>
            
            {/* SFM-114 */}
            <div className="text-muted-foreground">Your Contribution (5%):</div>
            <div className="font-medium">
              {formatCurrency(employeeContribution)}
              <div className="text-[8px] text-muted-foreground">SFM-114</div>
            </div>
            
            {/* SFM-115 */}
            <div className="text-muted-foreground">Employer Contribution (3%):</div>
            <div className="font-medium">
              {formatCurrency(employerContribution)}
              <div className="text-[8px] text-muted-foreground">SFM-115</div>
            </div>
            
            {/* SFM-116 */}
            <div className="text-muted-foreground font-semibold">Total Monthly Contribution (8%):</div>
            <div className="font-semibold">
              {formatCurrency(totalContribution)}
              <div className="text-[8px] text-muted-foreground">SFM-116</div>
            </div>
            
            {/* SFM-117 */}
            <div className="text-muted-foreground">Annual Pensionable Earnings:</div>
            <div className="font-medium">
              {formatCurrency(pensionableEarnings * 12)}
              <div className="text-[8px] text-muted-foreground">SFM-117</div>
            </div>
            
            {/* SFM-118 */}
            <div className="text-muted-foreground">Annual Total Contribution:</div>
            <div className="font-medium">
              {formatCurrency(totalContribution * 12)}
              <div className="text-[8px] text-muted-foreground">SFM-118</div>
            </div>
            
            {/* SFM-119 - New field */}
            <div className="text-muted-foreground font-semibold">Estimated Monthly Net Pay (1257L):</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(monthlyNetPay)}
              <div className="text-[8px] text-muted-foreground">SFM-119</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
            <strong>Note:</strong> These calculations use the Net Pay arrangement where pension contributions are deducted before income tax, 
            providing immediate tax relief. The Pensionable Pay Method (Set 2 & 3) is the most commonly used by employers as it's the most 
            cost-effective, calculating contributions on 85% of total pay (excluding overtime and bonuses). 
            The employer contributes an additional 3% on top of your 5% contribution.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedPensionContributions;
