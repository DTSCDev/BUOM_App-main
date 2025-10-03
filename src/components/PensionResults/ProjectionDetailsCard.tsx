
import React from 'react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface ProjectionDetailsCardProps {
  requiredCapitalAfterOtherIncome: number;
  annualAEContribution: number;
  totalContributionsPaidIn: number;
}

const ProjectionDetailsCard: React.FC<ProjectionDetailsCardProps> = ({
  requiredCapitalAfterOtherIncome,
  annualAEContribution,
  totalContributionsPaidIn
}) => {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg space-y-2">
      <h4 className="font-semibold text-orange-900 dark:text-orange-100">Projection Details</h4>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Required Capital at Retirement (after State Pension and other income)</span>
        <span className="font-medium">{formatCurrency(requiredCapitalAfterOtherIncome)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Annual AE Contribution</span>
        <span className="font-medium">{formatCurrency(annualAEContribution)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Total Contributions Paid In from Today</span>
        <span className="font-medium">{formatCurrency(totalContributionsPaidIn)}</span>
      </div>
    </div>
  );
};

export default ProjectionDetailsCard;
