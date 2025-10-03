
import React from 'react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface TargetIncomeDetailsCardProps {
  requiredIncome: number;
  correctedRequiredCapital: number;
  requiredIncomeAfterInflation: number;
  netIncomeTargetAtRetirement: number;
}

const TargetIncomeDetailsCard: React.FC<TargetIncomeDetailsCardProps> = ({
  requiredIncome,
  correctedRequiredCapital,
  requiredIncomeAfterInflation,
  netIncomeTargetAtRetirement
}) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg space-y-2">
      <h4 className="font-semibold text-green-900 dark:text-green-100">Target Income Details</h4>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Pension Income Target Today (50%)</span>
        <span className="font-medium">{formatCurrency(requiredIncome)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Required Capital Today</span>
        <span className="font-medium">{formatCurrency(correctedRequiredCapital)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Pension Income Target (after Inflation)</span>
        <span className="font-medium">{formatCurrency(requiredIncomeAfterInflation)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Net Income Value Target at Retirement</span>
        <span className="font-medium">{formatCurrency(netIncomeTargetAtRetirement)}</span>
      </div>
    </div>
  );
};

export default TargetIncomeDetailsCard;
