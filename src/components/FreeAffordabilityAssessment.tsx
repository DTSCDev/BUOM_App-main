import React from 'react';
import { FreePensionCalculationResults } from '@/components/FreeCalculatorResults';
import FreeAffordabilityAlert from '@/components/FreeAffordabilityAlert';
import FreePensionFundingAffordabilityAnalysis from '@/components/FreePensionFundingAffordabilityAnalysis';
import FreeNetPayAssumption from '@/components/FreeNetPayAssumption';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FreeAffordabilityAssessmentProps {
  results: FreePensionCalculationResults;
  onChangeTab: (tab: string) => void;
}

const PensionsUKStandards: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const standards = [
    {
      level: 'BASIC',
      color: 'bg-teal-600',
      single: 14400,
      couple: 22400,
      features: ['Covers all basic needs', 'Some social activities', 'No budget for car', 'Limited travel/holidays']
    },
    {
      level: 'MODERATE',
      color: 'bg-pink-600',
      single: 31300,
      couple: 43100,
      features: ['Financial security', 'Regular social activities', 'Budget for car replacement', 'Annual UK holidays']
    },
    {
      level: 'COMFORTABLE',
      color: 'bg-cyan-600',
      single: 43100,
      couple: 59000,
      features: ['Financial freedom', 'Regular dining out', 'New car every 5 years', 'Extended foreign holidays']
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-[#4FF456]">
            Pensions UK Retirement Living Standards
          </CardTitle>
          <a 
            href="https://www.retirementlivingstandards.org.uk/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            🔗 Visit Pensions UK Website
          </a>
        </div>
        <p className="text-gray-600 text-sm">
          The Pensions UK Retirement Living Standards help you understand how much money you might need in retirement. The figures below show annual income needed for different lifestyles:
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {standards.map((standard) => (
            <div key={standard.level} className="border rounded-lg overflow-hidden">
              <div className={`${standard.color} text-white text-center py-4`}>
                <h3 className="text-lg font-bold">{standard.level}</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <div className="font-semibold text-gray-700">SINGLE:</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(standard.single)}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-700">COUPLE:</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(standard.couple)}</div>
                  <div className="text-xs text-gray-500 mt-1">per year</div>
                </div>
                <div className="space-y-2">
                  {standard.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Source: Pensions UK Retirement Living Standards, last checked 14/5/2025
        </div>
      </CardContent>
    </Card>
  );
};

const FreeAffordabilityAssessment: React.FC<FreeAffordabilityAssessmentProps> = ({
  results,
  onChangeTab
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#4FF456] mb-4">
          Affordability Assessment
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze the affordability of your pension funding requirements
        </p>
      </div>

      <FreeAffordabilityAlert 
        results={results}
        onChangeTab={onChangeTab}
      />

      <FreePensionFundingAffordabilityAnalysis 
        results={results}
        onChangeTab={onChangeTab}
      />

      <FreeNetPayAssumption 
        results={results}
      />

      <PensionsUKStandards />
    </div>
  );
};

export default FreeAffordabilityAssessment;