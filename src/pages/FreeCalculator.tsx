import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SophisticatedPensionForm from "@/components/SophisticatedPensionForm";
import FreeCalculatorResults, { FreePensionCalculationResults } from "@/components/FreeCalculatorResults";
import FreeAffordabilityAssessment from "@/components/FreeAffordabilityAssessment";
import FundingEligibilityForm from "@/components/FundingEligibilityForm";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import PensionParameters from "@/components/PensionParameters";
import LoginPrompt from "@/components/Layout/LoginPrompt";

// Updated to use the new LoginPrompt component

const FreeCalculator: React.FC = () => {
  const [results, setResults] = useState<FreePensionCalculationResults | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Scroll to the Tabs element when switching to Affordability or Funding Eligibility
  useEffect(() => {
    if (activeTab === 'affordability' || activeTab === 'funding-eligibility') {
      const tabsEl = document.getElementById('free-calculator-tabs');
      if (tabsEl) {
        tabsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback to top if Tabs element is not found
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <LoginPrompt />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 mt-16">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#4FF456' }}>
            FREE Retirement Shortfall Calculator
          </h1>
          <p className="text-gray-700">
            This Free Retirement Calculator is Sponsored by FREE Benefits
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList id="free-calculator-tabs" className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 bg-gray-700 p-1">
            <TabsTrigger 
              value="calculator" 
              className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700"
              style={{ 
                color: activeTab === 'calculator' ? '#374151' : '#4FF456',
                backgroundColor: activeTab === 'calculator' ? '#4FF546' : 'transparent',
                opacity: activeTab === 'calculator' ? 1 : 0.6
              }}
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="affordability" 
              className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700"
              style={{ 
                color: activeTab === 'affordability' ? '#374151' : '#4FF456',
                backgroundColor: activeTab === 'affordability' ? '#4FF546' : 'transparent',
                opacity: activeTab === 'affordability' ? 1 : 0.6
              }}
            >
              Affordability
            </TabsTrigger>
            <TabsTrigger 
              value="funding-eligibility" 
              className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700"
              style={{ 
                color: activeTab === 'funding-eligibility' ? '#374151' : '#4FF456',
                backgroundColor: activeTab === 'funding-eligibility' ? '#4FF546' : 'transparent',
                opacity: activeTab === 'funding-eligibility' ? 1 : 0.6
              }}
            >
              Funding Eligibility
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700"
              style={{ 
                color: activeTab === 'subscription' ? '#374151' : '#4FF456',
                backgroundColor: activeTab === 'subscription' ? '#4FF546' : 'transparent',
                opacity: activeTab === 'subscription' ? 1 : 0.6
              }}
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger 
              value="parameters" 
              className="text-sm px-2 py-2 data-[state=active]:font-bold data-[state=active]:text-gray-700"
              style={{ 
                color: activeTab === 'parameters' ? '#374151' : '#4FF456',
                backgroundColor: activeTab === 'parameters' ? '#4FF546' : 'transparent',
                opacity: activeTab === 'parameters' ? 1 : 0.6
              }}
            >
              Parameters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-8">
            <SophisticatedPensionForm onCalculationComplete={setResults} />
            
            {results && (
              <div id="free-calculator-results" className="mt-8 space-y-8">
                <FreeCalculatorResults
                  results={results}
                  onChangeTab={setActiveTab}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="affordability" className="mt-8">
            {results ? (
              <FreeAffordabilityAssessment
                results={results}
                onChangeTab={setActiveTab}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Please complete the calculator first to view affordability analysis.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="funding-eligibility" className="mt-8">
            <FundingEligibilityForm onChangeTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="subscription" className="mt-8">
            <SubscriptionPlans />
          </TabsContent>

          <TabsContent value="parameters" className="mt-8">
            <PensionParameters />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default FreeCalculator;