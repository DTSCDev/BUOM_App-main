import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/pensionCalculations';

interface FreePensionFundingAnalysisProps {
  // SFM values passed directly from parent
  progressPercentage: number;        // SFM-008
  totalProjectedPensionPot: number;  // SFM-009
  requiredCapital: number;           // SFM-010
  capitalShortfall: number;          // SFM-011
  monthlyFundingCost: number;        // SFM-012
  affordabilityPercentage?: number;  // SFM-105
  
  // Input values for fallback calculations if needed
  currentAge: number;
  annualSalary: number;
  existingPensionValue: number;
  retirementAge: number;
  monthlyAECont: number;
  onChangeTab: (tab: string) => void;
}

const FreePensionFundingAnalysis: React.FC<FreePensionFundingAnalysisProps> = ({
  progressPercentage,        // SFM-008
  totalProjectedPensionPot,  // SFM-009
  requiredCapital,           // SFM-010
  capitalShortfall,          // SFM-011
  monthlyFundingCost,        // SFM-012
  affordabilityPercentage = 0,
  currentAge,
  annualSalary,
  existingPensionValue,
  retirementAge,
  monthlyAECont,
  onChangeTab
}) => {
  
  // SFM-101: Affordability Warning Status using robust thresholds
  const isAffordable = affordabilityPercentage < 4; // Green
  const isCaution = affordabilityPercentage >= 4 && affordabilityPercentage < 9; // Amber
  const isExpensive = affordabilityPercentage >= 9; // Red
  
  const isOnTrack = progressPercentage >= 100;
  const isReasonablyOnTrack = progressPercentage >= 80;

  // Toggle between Capital Values (default) and Income Values (Capital x 3.5%)
  const [isCapitalView, setIsCapitalView] = useState(true);

  const displayProjectedPensionPot = isCapitalView 
    ? totalProjectedPensionPot 
    : totalProjectedPensionPot * 0.035;
  const displayRequiredCapital = isCapitalView 
    ? requiredCapital 
    : requiredCapital * 0.035;
  const displayCapitalShortfall = isCapitalView 
    ? capitalShortfall 
    : capitalShortfall * 0.035;

  return (
    <Card className="border-2 border-[#4FF456] bg-blue-50/30 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: '#4FF456' }}>
          Pension Funding Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Free calculator funding analysis
        </p>
        {/* Right-aligned toggle matching SophisticatedPensionForm styling */}
        <div className="flex items-center justify-end gap-4">
          <span className={!isCapitalView ? 'font-medium' : 'text-gray-400'} style={!isCapitalView ? { color: '#4FF456' } : {}}>Income Values</span>
          <Switch
            checked={isCapitalView}
            onCheckedChange={setIsCapitalView}
          />
          <span className={isCapitalView ? 'font-medium' : 'text-gray-400'} style={isCapitalView ? { color: '#4FF456' } : {}}>Capital Values</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SFM-101: Affordability Alert with thresholds */}
        <Alert
          className={
            isAffordable ? 'border-green-200' : isCaution ? 'border-yellow-200' : 'border-red-200'
          }
          style={{ backgroundColor: isAffordable ? '#d1fae5' : isCaution ? '#fef9c3' : '#fee2e2' }}
        >
          <AlertTriangle className={`h-4 w-4 ${isAffordable ? 'text-green-700' : isCaution ? 'text-yellow-700' : 'text-red-700'}`} />
          <AlertDescription className={`${isAffordable ? 'text-green-800' : isCaution ? 'text-yellow-800' : 'text-red-800'}`}>
            {isAffordable
              ? `Your estimated Top Up of ${formatCurrency(monthlyFundingCost)} is Affordable.`
              : `Your estimated Top Up of ${formatCurrency(monthlyFundingCost)} may not be Affordable.`}
            {!isAffordable && ' Check your eligibility for risk-free financial assistance.'}
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 relative pb-6">
            <h3 className="font-medium text-gray-900">Funding Progress</h3>
            <div className={`text-3xl font-bold ${
              progressPercentage >= 100 ? 'text-green-600' : 
              progressPercentage >= 80 ? 'text-yellow-500' : 'text-red-600'
            }`}>
              {progressPercentage}%
            </div>
            <Progress 
              value={Math.min(progressPercentage, 100)} 
              className={`h-3 ${
                progressPercentage >= 100 ? 'progress-green' : 
                progressPercentage >= 80 ? 'progress-amber' : 'progress-red'
              }`} 
            />
            <p className="text-sm text-gray-600">
              {isOnTrack 
                ? "You're on track for your retirement target." 
                : isReasonablyOnTrack 
                ? "You're close to your retirement target." 
                : "You have a pension funding gap that needs attention."
              }
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-008
            </div>
          </div>

          <div className="space-y-2 relative pb-6">
            <h3 className="font-medium text-gray-900">Current Projection</h3>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(displayProjectedPensionPot)}
            </div>
            <p className="text-sm text-gray-600">
              {isCapitalView ? "Projected pension pot at retirement" : "Projected Income at retirement"}
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-009
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 relative pb-6">
            <h3 className="font-medium text-gray-900">{isCapitalView ? "Required Capital assuming full State Pension" : "Required Income assuming full State Pension"}</h3>
            <div className="text-3xl font-bold text-black">
              {formatCurrency(displayRequiredCapital)}
            </div>
            <p className="text-sm text-gray-600">
              {isCapitalView ? "Capital needed for target retirement income" : "Existing Plan Income Target at retirement"}
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-010
            </div>
          </div>

          <div className="space-y-2 relative pb-6">
            <h3 className="font-medium text-gray-900">Estimated Shortfall</h3>
            <div className="text-3xl font-bold text-[#9333EA]">
              {formatCurrency(displayCapitalShortfall)}
            </div>
            <p className="text-sm text-gray-600">
              {isCapitalView ? "Additional capital needed" : "Additional Income needed"}
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-011
            </div>
          </div>
        </div>

        {capitalShortfall > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 relative pb-6">
            <h4 className="text-2xl font-medium text-purple-600 mb-2">Existing Plan Top-Up Monthly Cost</h4>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {formatCurrency(monthlyFundingCost)}
            </div>
            <p className="text-sm text-purple-600 mb-4">
              Additional monthly contribution needed to close your Estimated Shortfall
            </p>
            <div className="absolute bottom-0 right-0 text-[8px] text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              SFM-012
            </div>
            <div className="space-y-2 mt-4">
              <Button onClick={() => onChangeTab("affordability")} className="w-full bg-purple-600 hover:bg-purple-700">
                Check Affordability
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FreePensionFundingAnalysis;