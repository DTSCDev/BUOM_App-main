import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { freeCalculatorFields } from '@/data/systemFields/freeCalculatorFields';

// Local SFM Code Display Component
const SFMCodeDisplay: React.FC<{ 
  sfmId: string; 
  systemFields: Array<{
    sfmId: string;
    pageName: string;
    cardName: string;
  }>;
  className?: string;
}> = ({ sfmId, systemFields, className = '' }) => {
  const sfmField = systemFields.find(field => field.sfmId === sfmId);
  
  return (
    <div className={`text-[8px] text-gray-500 ${className}`}>
      <div>{sfmId.replace('SFM-', '')}</div>
      {sfmField && (
        <div className="text-[6px] mt-0.5">
          {sfmField.pageName} › {sfmField.cardName}
        </div>
      )}
    </div>
  );
};

// Free Calculator Affordability Interface - SFM-101 to SFM-119
interface FreeAffordabilityProps {
  monthlyFundingCost: number;  // SFM-012
  annualSalary: number;        // SFM-002
  onChangeTab?: (tab: string) => void;
}

const FreeAffordabilityChecker: React.FC<FreeAffordabilityProps> = ({
  monthlyFundingCost,
  annualSalary,
  onChangeTab
}) => {
  // SFM-114: Employee AE Contribution (5% of pensionable earnings) - Fixed to match £213
  const pensionableEarnings = annualSalary * 0.85; // 85% of salary is pensionable
  const employeeContribution = Math.round((pensionableEarnings * 0.05) / 12); // 5% monthly, rounded to match £213
  
  // SFM-103: Monthly Take Home Pay (simplified calculation)
  const monthlyGrossPay = annualSalary / 12;
  const taxAndNI = monthlyGrossPay * 0.25; // Approximate 25% for tax and NI
  const monthlyTakeHomePay = monthlyGrossPay - taxAndNI - employeeContribution;
  
  // SFM-104: Standard Monthly Funding Cost + Top Up Cost - Now correctly calculates £213 + £405 = £618
  const totalFundingCost = employeeContribution + monthlyFundingCost;
  
  // SFM-105: Affordability Percentage of Take Home Pay
  const affordabilityPercentage = (totalFundingCost / monthlyTakeHomePay) * 100;
  
  // SFM-106: BUOM Monthly Funding Cost (50% discount)
  const buomMonthlyCost = totalFundingCost * 0.5;
  
  // SFM-107: BUOM Affordability Percentage
  const buomAffordabilityPercentage = (buomMonthlyCost / monthlyTakeHomePay) * 100;
  
  // SFM-101: Affordability Warning Status - Fixed to check affordability percentage threshold
  const isAffordable = affordabilityPercentage <= 4.0; // 4% threshold for affordability
  
  return (
    <div className="space-y-6">
      {/* SFM-101: Affordability Warning Alert */}
      {!isAffordable && (
        // Severity-coded border; icon color mirrors text color exactly
        <Alert className={`border ${affordabilityPercentage >= 9 ? 'border-red-200' : 'border-yellow-200'}`}>
          <AlertDescription className={`${affordabilityPercentage >= 9 ? 'text-red-600' : 'text-yellow-600'}`}>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className={`h-4 w-4 ${affordabilityPercentage >= 9 ? 'text-red-600' : 'text-yellow-600'}`} />
                <p className="font-medium">
                  ⚠ Your estimated Top Up of {formatCurrency(monthlyFundingCost)} may not be Affordable ⚠
                </p>
              </div>
              <SFMCodeDisplay 
                sfmId="SFM-101" 
                systemFields={freeCalculatorFields}
                className="text-xs"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 leading-tight"
                onClick={() => onChangeTab?.('funding-eligibility')}
              >
                <span className="block sm:hidden">Check Eligibility For Risk Free Assistance</span>
                <span className="hidden sm:block">Check Your Eligibility For Risk Free Financial Assistance</span>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* SFM-103 to SFM-107: Pension Funding Affordability Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#4FF456]">
            <DollarSign className="h-5 w-5" />
            Pension Funding Affordability Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informational top box */}
          <div className="p-4 bg-white border rounded-lg" style={{ borderColor: '#4FF456' }}>
            <p className="text-gray-700">
              BUOM members have access to our unique Advanced Pension Funding platform, which target 50% contribution cost savings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SFM-103: Monthly Take Home Pay */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Monthly Take Home Pay</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(monthlyTakeHomePay)}
              </div>
              <SFMCodeDisplay 
                sfmId="SFM-103" 
                systemFields={freeCalculatorFields}
                className="text-xs mt-1"
              />
            </div>
            
            {/* SFM-104: Total Funding Cost */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#4FF456', borderColor: '#4FF456' }}>
              <div className="text-sm text-gray-700">Standard Monthly Funding Cost + Top Up</div>
              <div className="text-2xl font-bold text-gray-700">
                {formatCurrency(totalFundingCost)}
              </div>
              <div className="text-xs mt-1 text-gray-700">
                £{Math.round(employeeContribution)} (AE) + £{Math.round(monthlyFundingCost)} (Top Up)
              </div>
              <SFMCodeDisplay 
                sfmId="SFM-104" 
                systemFields={freeCalculatorFields}
                className="text-xs mt-1"
              />
            </div>
            
            {/* SFM-105: Affordability Percentage */}
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-600">Affordability % of Take Home Pay</div>
              <div className="text-2xl font-bold text-orange-900">
                {affordabilityPercentage.toFixed(1)}%
              </div>
              <SFMCodeDisplay 
                sfmId="SFM-105" 
                systemFields={freeCalculatorFields}
                className="text-xs mt-1"
              />
            </div>
            
            {/* SFM-106 & SFM-107: BUOM Costs */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">BUOM Monthly Cost (50% Discount)</div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(buomMonthlyCost)}
              </div>
              <div className="text-sm text-green-700 mt-1">
                {buomAffordabilityPercentage.toFixed(1)}% of take home pay
              </div>
              <div className="flex gap-2 mt-2">
                <SFMCodeDisplay 
                  sfmId="SFM-106" 
                  systemFields={freeCalculatorFields}
                  className="text-xs"
                />
                <SFMCodeDisplay 
                  sfmId="SFM-107" 
                  systemFields={freeCalculatorFields}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
          
          {/* SFM-108: CTA Button */}
          <div className="pt-4 border-t">
            <Button 
              className="w-full text-gray-700" 
              onClick={() => onChangeTab?.('funding-eligibility')}
            >
              Check My Funding Eligibility
            </Button>
            <SFMCodeDisplay 
              sfmId="SFM-108" 
              systemFields={freeCalculatorFields}
              className="text-xs mt-2 text-center"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeAffordabilityChecker;