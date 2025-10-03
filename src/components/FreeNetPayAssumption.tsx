import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreePensionCalculationResults } from '@/components/FreeCalculatorResults';
import { freeCalculatorFields } from '@/data/systemFields/freeCalculatorFields';

interface FreeNetPayAssumptionProps {
  results: FreePensionCalculationResults;
}

const FreeNetPayAssumption: React.FC<FreeNetPayAssumptionProps> = ({ results }) => {
  // Get SFM field helper function
  const getSFMField = (sfmId: string) => {
    return freeCalculatorFields.find(field => field.sfmId === sfmId);
  };

  // Fixed values for Free Calculator (using standard assumptions)
  const contributionMethod = "Auto Enrollment";                       // SFM-109 (fixed assumption)
  const autoEnrollmentBasis = "Set 2 & 3 (85% of gross)";            // SFM-110 (fixed assumption)
  
  // Calculate values based on basic inputs
  const monthlyGrossPay = results.annualSalary / 12;                    // SFM-112
  const pensionablePayPercentage = 85; // SFM-111
  const pensionableEarnings = monthlyGrossPay * 0.85;           // SFM-113
  const employeeContribution = pensionableEarnings * 0.05;         // SFM-114
  const employerContribution = pensionableEarnings * 0.03;         // SFM-115
  const totalMonthlyContribution = employeeContribution + employerContribution; // SFM-116
  const annualPensionableEarnings = pensionableEarnings * 12; // SFM-117
  const annualTotalContribution = totalMonthlyContribution * 12;   // SFM-118
  const estimatedNetPay1257L = monthlyGrossPay - (monthlyGrossPay * 0.25) - employeeContribution;         // SFM-119
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#4FF456]">
          Estimated Existing Monthly Pay Assumption
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SFM-109: Contribution Method */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-109')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{contributionMethod}</div>
            <div className="text-xs text-gray-500">SFM-109</div>
          </div>
        </div>

        {/* SFM-110: Auto Enrollment Basis */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-110')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{autoEnrollmentBasis}</div>
            <div className="text-xs text-gray-500">SFM-110</div>
          </div>
        </div>

        {/* SFM-111: Pensionable Pay Percentage */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-111')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatPercentage(pensionablePayPercentage)}</div>
            <div className="text-xs text-gray-500">SFM-111</div>
          </div>
        </div>

        {/* SFM-112: Monthly Gross Pay */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-112')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(monthlyGrossPay)}</div>
            <div className="text-xs text-gray-500">SFM-112</div>
          </div>
        </div>

        {/* SFM-113: Pensionable Earnings */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-113')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(pensionableEarnings)}</div>
            <div className="text-xs text-gray-500">SFM-113</div>
          </div>
        </div>

        {/* SFM-114: Your Contribution (5%) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-114')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(employeeContribution)}</div>
            <div className="text-xs text-gray-500">SFM-114</div>
          </div>
        </div>

        {/* SFM-115: Employer Contribution (3%) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-115')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(employerContribution)}</div>
            <div className="text-xs text-gray-500">SFM-115</div>
          </div>
        </div>

        {/* SFM-116: Total Monthly Contribution (8%) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-116')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(totalMonthlyContribution)}</div>
            <div className="text-xs text-gray-500">SFM-116</div>
          </div>
        </div>

        {/* SFM-117: Annual Pensionable Earnings */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-117')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(annualPensionableEarnings)}</div>
            <div className="text-xs text-gray-500">SFM-117</div>
          </div>
        </div>

        {/* SFM-118: Annual Total Contribution */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-118')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(annualTotalContribution)}</div>
            <div className="text-xs text-gray-500">SFM-118</div>
          </div>
        </div>

        {/* SFM-119: Estimated Monthly Net Pay (1257L) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{getSFMField('SFM-119')?.description.replace(':', '')}:</span>
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatCurrency(estimatedNetPay1257L)}</div>
            <div className="text-xs text-gray-500">SFM-119</div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Calculations based on 1257L tax code (2024/25 rates)</li>
            <li>• Assumes standard Auto Enrollment contribution rates</li>
            <li>• Net pay calculation includes Income Tax and National Insurance</li>
            <li>• Pensionable pay calculated using Set 2 & 3 method (85% of gross)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeNetPayAssumption;