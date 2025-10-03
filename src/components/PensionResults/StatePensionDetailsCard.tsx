
import React from 'react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface StatePensionDetailsCardProps {
  currentStatePension: number;
  statePensionAtRetirement: number;
  statePensionLumpSumEquivalent: number;
  statePensionLumpSumAtRetirement: number;
}

const StatePensionDetailsCard: React.FC<StatePensionDetailsCardProps> = ({
  currentStatePension,
  statePensionAtRetirement,
  statePensionLumpSumEquivalent,
  statePensionLumpSumAtRetirement
}) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg space-y-2">
      <h4 className="font-semibold text-blue-900 dark:text-blue-100">State Pension Details</h4>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Current State Pension (Annual)</span>
        <span className="font-medium">{formatCurrency(currentStatePension)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">State Pension at Retirement</span>
        <span className="font-medium">{formatCurrency(statePensionAtRetirement)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Equivalent Lump Sum Today</span>
        <span className="font-medium">{formatCurrency(statePensionLumpSumEquivalent)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Equivalent Lump Sum at Retirement</span>
        <span className="font-medium">{formatCurrency(statePensionLumpSumAtRetirement)}</span>
      </div>
    </div>
  );
};

export default StatePensionDetailsCard;
