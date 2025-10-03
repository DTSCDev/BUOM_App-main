import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';
import { formatCurrency } from '@/utils/pensionCalculations';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PensionFundingOptionsCardProps {
  projectedPensionPot: number;
  monthlyFundingCost: number;
  progressPercentage: number;
  correctedRequiredCapital: number;
  shortfall: number;
  showFinancialAssistanceCTA: boolean;
  annualSalary: number;
  onChangeTab: (tab: string) => void;
  onDismissFinancialCTA: () => void;
}

const PensionFundingOptionsCard: React.FC<PensionFundingOptionsCardProps> = ({
  projectedPensionPot,
  monthlyFundingCost,
  progressPercentage,
  correctedRequiredCapital,
  shortfall,
  showFinancialAssistanceCTA,
  onChangeTab,
  onDismissFinancialCTA
}) => {
  // REMOVED SFM RESOLVER - Use direct props for free calculator
  const fundingProgress = progressPercentage;
  const currentProjection = projectedPensionPot;
  const requiredCapital = correctedRequiredCapital;
  const capitalShortfall = shortfall;
  const monthlyTopUpCost = monthlyFundingCost;

  const isOnTrack = fundingProgress >= 100;
  const isReasonablyOnTrack = fundingProgress >= 80;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Pension Funding Options
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Free calculator funding analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {showFinancialAssistanceCTA && capitalShortfall > 50000 && (
          <Alert className="border-[#4FF546]" style={{ backgroundColor: '#4FF546' }}>
            <AlertTriangle className="h-4 w-4 text-black" />
            <div className="flex items-start justify-between w-full">
              <div className="flex-1">
                <AlertDescription className="text-black">
                  <strong>You may qualify for risk-free financial assistance!</strong>
                  <br />
                  With a shortfall of {formatCurrency(capitalShortfall)}, you could be eligible for our Advanced Pension Funding program.
                </AlertDescription>
              </div>
              <Button onClick={onDismissFinancialCTA} variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0 text-black hover:text-gray-800">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 relative">
            <h3 className="font-medium text-gray-900">Funding Progress</h3>
            <div className={`text-3xl font-bold ${fundingProgress >= 100 ? 'text-green-600' : fundingProgress >= 80 ? 'text-yellow-500' : 'text-red-600'}`}>
              {Math.round(fundingProgress)}%
            </div>
            <Progress value={Math.min(fundingProgress, 100)} className={`h-3 ${fundingProgress >= 100 ? 'progress-green' : fundingProgress >= 80 ? 'progress-amber' : 'progress-red'}`} />
            <p className="text-sm text-gray-600">
              {isOnTrack ? "Congratulations! You're on track for retirement." : isReasonablyOnTrack ? "You're close to your retirement target." : "You have a pension funding gap that needs attention."}
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-008
            </div>
          </div>

          <div className="space-y-2 relative">
            <h3 className="font-medium text-gray-900">Current Projection</h3>
            <div className={`text-3xl font-bold ${fundingProgress >= 100 ? 'text-green-600' : fundingProgress >= 80 ? 'text-yellow-500' : 'text-red-600'}`}>
              {formatCurrency(currentProjection)}
            </div>
            <p className="text-sm text-gray-600">
              Projected pension pot at retirement
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-009
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 relative pb-6">
            <h3 className="font-medium text-gray-900">Required Capital assuming full State Pension</h3>
            <div className="text-3xl font-bold text-black">
              {formatCurrency(requiredCapital)}
            </div>
            <p className="text-sm text-gray-600">
              Capital needed for target retirement income
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-010
            </div>
          </div>

          <div className="space-y-2 relative pb-6">
            <h3 className="font-medium text-gray-900">
              {capitalShortfall > 0 ? "Estimated Shortfall" : "Surplus"}
            </h3>
            <div className={`text-3xl font-bold ${capitalShortfall > 0 ? 'text-[#9333EA]' : 'text-green-600'}`}>
              {formatCurrency(Math.abs(capitalShortfall))}
            </div>
            <p className="text-sm text-gray-600">
              {capitalShortfall > 0 ? "Additional capital needed" : "Excess above target"}
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-011
            </div>
          </div>
        </div>

        {capitalShortfall > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-2xl font-medium text-purple-600 mb-2">Existing Plan Top-Up Monthly Cost</h4>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {formatCurrency(monthlyTopUpCost)}
            </div>
            <p className="text-sm text-purple-600 mb-4">
              Additional monthly contribution needed to close your Estimated Shortfall
              <span className="ml-2 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
                SFM-012
              </span>
            </p>
            <div className="space-y-2">
              <Button onClick={() => onChangeTab("affordability")} className="w-full bg-purple-600 hover:bg-purple-700">
                Check Affordability
              </Button>
            </div>
          </div>
        )}

        {isOnTrack && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Well Done!</h4>
            <p className="text-sm text-green-700 mb-4">
              Your current pension contributions are sufficient to meet your retirement income target. 
              Consider reviewing your plan annually to ensure you stay on track.
            </p>
            <Button onClick={() => onChangeTab("parameters")} variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
              Review Parameters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PensionFundingOptionsCard;