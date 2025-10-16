import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface FreeStatePensionDetailsCardProps {
  currentStatePension: number;
  statePensionAtRetirement: number;
  statePensionLumpSumEquivalent: number;
  statePensionLumpSumAtRetirement: number;
}

export function FreeStatePensionDetailsCard({
  currentStatePension,
  statePensionAtRetirement,
  statePensionLumpSumEquivalent,
  statePensionLumpSumAtRetirement
}: FreeStatePensionDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          State Pension Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your state pension entitlements and projections
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg relative">
            <span className="text-muted-foreground">Current State Pension (Annual)</span>
            <span className="font-medium text-blue-600">{formatCurrency(currentStatePension)}</span>
            <div className="absolute bottom-1 right-1 text-[8px] text-gray-500 px-1 py-0.5 rounded">
              SFM-015
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg relative">
            <span className="text-muted-foreground">State Pension at Retirement</span>
            <span className="font-medium text-green-600">{formatCurrency(statePensionAtRetirement)}</span>
            <div className="absolute bottom-1 right-1 text-[8px] text-gray-500 px-1 py-0.5 rounded">
              SFM-016
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Lump Sum Equivalents</h5>
            
            <div className="flex justify-between items-center p-2 border rounded relative">
              <span className="text-sm text-muted-foreground">Equivalent Lump Sum Today</span>
              <span className="text-sm font-medium">{formatCurrency(statePensionLumpSumEquivalent)}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 border rounded relative">
              <span className="text-sm text-muted-foreground">Equivalent Lump Sum at Retirement</span>
              <span className="text-sm font-medium">{formatCurrency(statePensionLumpSumAtRetirement)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FreeStatePensionDetailsCard;