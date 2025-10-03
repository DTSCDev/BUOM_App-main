import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { SFMCodeDisplay } from '@/components/Dashboard/SFMCodeDisplay';
import { formatCurrency } from '@/utils/pensionCalculations';

interface FreePensionFundingOptionsCardProps {
  totalProjectedPensionPot: number;
  requiredCapital: number;
  monthlyFundingCost: number;
  onChangeTab: (tab: string) => void;
}

const FreePensionFundingOptionsCard: React.FC<FreePensionFundingOptionsCardProps> = ({
  totalProjectedPensionPot, // SFM-009
  requiredCapital, // SFM-010
  monthlyFundingCost, // SFM-012
  onChangeTab
}) => {
  const progressPercentage = (totalProjectedPensionPot / requiredCapital) * 100; // SFM-008
  const capitalShortfall = requiredCapital - totalProjectedPensionPot; // SFM-011
  
  // SFM-101: Affordability Warning Status - triggers when SFM-012 > 0
  const showAffordabilityWarning = monthlyFundingCost > 0;

  return (
    <Card className={`p-6 ${progressPercentage >= 100 ? 'border-green-500' : 'border-orange-500'}`}>
      {/* SFM-101: Affordability Warning Alert */}
      {showAffordabilityWarning && (
        <Alert className="mb-4 border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Your estimated Top Up of {formatCurrency(monthlyFundingCost)} may not be Affordable. 
            Check your eligibility for risk-free financial assistance.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Funding Progress</span>
          <span className={`text-sm font-bold ${
            progressPercentage >= 100 ? 'text-green-600' : 'text-orange-600'
          }`}>
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              progressPercentage >= 100 ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* SFM values display */}
      <div className="space-y-4">
        {/* SFM-008: Progress Percentage */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Progress Percentage:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            <SFMCodeDisplay sfmCode="SFM-008" />
          </div>
        </div>
        
        {/* SFM-009: Current Projection */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Current Projection:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">£{totalProjectedPensionPot.toLocaleString()}</span>
            <SFMCodeDisplay sfmCode="SFM-009" />
          </div>
        </div>
        
        {/* SFM-010: Required Capital */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Required Capital:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">£{requiredCapital.toLocaleString()}</span>
            <SFMCodeDisplay sfmCode="SFM-010" />
          </div>
        </div>
        
        {/* SFM-011: Capital Shortfall */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Capital Shortfall:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">£{capitalShortfall.toLocaleString()}</span>
            <SFMCodeDisplay sfmCode="SFM-011" />
          </div>
        </div>
        
        {/* SFM-012: Monthly Funding Cost */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Monthly Funding Cost:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">£{monthlyFundingCost.toLocaleString()}</span>
            <SFMCodeDisplay sfmCode="SFM-012" />
          </div>
        </div>
      </div>

      {/* Check Affordability Button */}
      <div className="mt-6">
        <Button 
          onClick={() => onChangeTab('affordability')}
          className="w-full"
        >
          Check Affordability
        </Button>
      </div>
    </Card>
  );
};

export default FreePensionFundingOptionsCard;