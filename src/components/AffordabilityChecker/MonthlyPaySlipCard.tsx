
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/pensionCalculations';
import { EnhancedTaxResult } from '@/utils/pension/enhancedTaxCalculations';

interface MonthlyPaySlipCardProps {
  taxResult: EnhancedTaxResult;
}

const MonthlyPaySlipCard: React.FC<MonthlyPaySlipCardProps> = ({ taxResult }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Monthly Pay Slip (Net Pay Arrangement)</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{taxResult.payeTaxCode}</Badge>
            <Badge variant="secondary">
              {taxResult.employmentType === 'director' ? 'Director' : 'Employee'}
            </Badge>
            {taxResult.hasNicProtection && (
              <Badge variant="destructive">NIC Protected</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gross Pay</span>
          <span className="font-medium">{formatCurrency(taxResult.grossPay)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Employee Pension Contribution (5%)</span>
          <span className="font-medium text-blue-600">-{formatCurrency(taxResult.pensionContribution)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Employer Pension Contribution (3%)</span>
          <span className="font-medium text-green-600">+{formatCurrency(taxResult.employerContribution)}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gross Pay After Pension</span>
          <span className="font-medium">{formatCurrency(taxResult.grossPayAfterPension)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Income Tax ({taxResult.payeTaxCode})</span>
          <span className="font-medium text-red-500">-{formatCurrency(taxResult.incomeTax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            National Insurance ({taxResult.nicCalculationMethod})
          </span>
          <span className="font-medium text-red-500">-{formatCurrency(taxResult.nationalInsurance)}</span>
        </div>
        {taxResult.hasNicProtection && (
          <div className="flex justify-between text-sm">
            <span className="text-amber-600">Minimum NIC Required</span>
            <span className="text-amber-600">{formatCurrency(taxResult.minNicContribution)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Take Home Pay</span>
          <span>{formatCurrency(taxResult.netPay)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <span>Total Pension Contribution (You + Employer)</span>
          <span>{formatCurrency(taxResult.totalContribution)}</span>
        </div>
        
        {taxResult.employmentType === 'director' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-800">
              <strong>Director Notice:</strong> National Insurance calculated on {taxResult.nicCalculationMethod} basis.
              {taxResult.hasNicProtection && ' Enhanced NIC protection ensures minimum contribution for benefit entitlements.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyPaySlipCard;
