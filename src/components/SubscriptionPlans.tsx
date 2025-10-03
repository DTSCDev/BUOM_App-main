import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SUBSCRIPTION_OPTIONS } from '@/utils/pensionParameters';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define Stripe price IDs - would normally come from an environment variable or API
const STRIPE_PRICE_IDS = {
  monthly: 'price_1PfagnKUMfYeSD67UeeXnonf',
  // Replace with your actual Stripe price IDs
  annual: 'price_1PfaglKUMfYeSD67DGqtAWDx',
  lifetime: 'price_1PfagqKUMfYeSD67BKfc7Yc7'
};
type PlanInterval = 'monthly' | 'annual' | 'lifetime';
const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanInterval>('annual');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePlanSelect = (plan: PlanInterval) => {
    setSelectedPlan(plan);
  };
  const handleCheckout = async (plan: PlanInterval) => {
    if (!isTermsAccepted) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }
    try {
      setIsProcessing(true);

      // Get the membership ID from local storage or generate a new one
      const membershipId = localStorage.getItem('buomMembershipNumber') || '';
      if (!membershipId) {
        toast({
          title: "Eligibility Check Required",
          description: "Please complete the funding eligibility form first.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Save subscription status to local storage
      localStorage.setItem('premiumSubscription', 'active');
      
      // Get calculator data from local storage if available
      try {
        const calculatorData = localStorage.getItem('retirement-calculator-data');
        if (calculatorData) {
          // Keep the calculator data in local storage for use in the Retirement Calculator
          console.log('Calculator data found in local storage:', JSON.parse(calculatorData));
        }
      } catch (error) {
        console.error('Error reading calculator data from local storage:', error);
      }

      // Call our Supabase Edge Function to create a checkout session
      const priceId = STRIPE_PRICE_IDS[plan];
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          membershipId
        }
      });
      if (error) {
        throw new Error(error.message);
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Checkout Error",
        description: "There was a problem starting the checkout process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency
    }).format(amount);
  };
  return <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#4FF456]">Choose Your Membership Plan</h2>
        <p className="mt-2 text-gray-700">Unlock Risk-Free Funding and 1x Better Outcomes</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`relative overflow-hidden transition ${selectedPlan === 'monthly' ? 'border-primary shadow-md' : ''} flex flex-col h-full`}>
          <div className="absolute top-0 right-0">
            <div className="bg-[#4FF456] text-gray-700 px-3 py-1 text-xs font-bold">
              Most Flexible
            </div>
            {selectedPlan === 'monthly' && <div className="bg-primary text-gray-700 px-3 py-1 mt-1 text-xs font-bold">
                Selected
              </div>}
          </div>
          <CardHeader>
            <CardTitle className="text-[#4FF456]">Monthly</CardTitle>
            <CardDescription className="text-gray-700">Pay monthly, no lock-in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-[#4FF456]">
              {formatCurrency(SUBSCRIPTION_OPTIONS.monthly.price)}<span className="text-sm font-normal text-gray-700"> /month</span>
            </div>
            <ul className="list-none space-y-2 text-sm mb-4 text-gray-700">
              <li>Guaranteed Advanced Pension Funding each year</li>
              <li>Monthly financial guidance and newsletter</li>
              <li>Access to personalised calculator parameters</li>
            </ul>
          </CardContent>
          <CardFooter className="mt-auto pt-4">
            <Button className={`w-full ${selectedPlan === 'monthly' ? 'bg-primary' : 'bg-muted'} text-gray-700`} onClick={() => handlePlanSelect('monthly')} disabled={isProcessing}>
              {selectedPlan === 'monthly' ? 'Selected' : 'Select Plan'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className={`relative overflow-hidden transition border-2 ${selectedPlan === 'annual' ? 'border-primary shadow-md' : 'border-muted'} flex flex-col h-full`}>
          <div className="absolute top-0 right-0">
            <div className="bg-green-600 text-white px-3 py-1 text-xs font-bold">
              Most Popular
            </div>
            {selectedPlan === 'annual' && <div className="bg-primary text-gray-700 px-3 py-1 mt-1 text-xs font-bold">
                Selected
              </div>}
          </div>
          <CardHeader>
            <CardTitle className="text-[#4FF456]">Annual</CardTitle>
            <CardDescription className="text-gray-700">
              Save £80 yearly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-[#4FF456]">
              {formatCurrency(SUBSCRIPTION_OPTIONS.annual.price)}<span className="text-sm font-normal text-gray-700"> /year</span>
            </div>
            <ul className="list-none space-y-2 text-sm mb-4 text-gray-700">
              <li>All Monthly benefits PLUS</li>
              <li>Save over 44% vs Monthly</li>
              <li>Pre-Qualify for The Power Of Ten (10x) Challenge</li>
              <li>1x Time Token™ to cover APF Bespoke Chartered Financial Advice Costs - worth £250</li>
            </ul>
          </CardContent>
          <CardFooter className="mt-auto pt-4">
            <Button className={`w-full ${selectedPlan === 'annual' ? 'bg-primary' : 'bg-muted'} text-gray-700`} onClick={() => handlePlanSelect('annual')} disabled={isProcessing}>
              {selectedPlan === 'annual' ? 'Selected' : 'Select Plan'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className={`relative overflow-hidden transition ${selectedPlan === 'lifetime' ? 'border-primary shadow-md' : ''} flex flex-col h-full`}>
          <div className="absolute top-0 right-0">
            <div className="bg-gray-700 text-white px-3 py-1 text-xs font-bold">
              Best Value
            </div>
            {selectedPlan === 'lifetime' && <div className="bg-primary text-gray-700 px-3 py-1 mt-1 text-xs font-bold">
                Selected
              </div>}
          </div>
          <CardHeader>
            <CardTitle className="text-[#4FF456]">VIP Offer</CardTitle>
            <CardDescription className="text-gray-700">
              Save £3,000 vs Annual costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-[#4FF456]">
              {formatCurrency(SUBSCRIPTION_OPTIONS.lifetime.price)}<span className="text-sm font-normal text-gray-700"> one-time</span>
            </div>
            <ul className="list-none space-y-2 text-sm mb-4 text-gray-700">
              <li>All Annual benefits PLUS</li>
              <li>1-1 Meeting with BUOM's Philanthropic Investor</li>
              <li>21yrs access to platform - worth £2,100</li>
              <li>5x Time Token™ to cover APF Bespoke Chartered Financial Advice Costs over 5yrs - worth £1,250</li>
            </ul>
          </CardContent>
          <CardFooter className="mt-auto pt-4">
            <Button className={`w-full ${selectedPlan === 'lifetime' ? 'bg-primary' : 'bg-muted'} text-gray-700`} onClick={() => handlePlanSelect('lifetime')} disabled={isProcessing}>
              {selectedPlan === 'lifetime' ? 'Selected' : 'Select Plan'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="pt-6">
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox id="terms" checked={isTermsAccepted} onCheckedChange={checked => setIsTermsAccepted(checked === true)} />
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
            I accept the Terms & Conditions and Privacy Policy
          </label>
        </div>
        
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-gray-700" disabled={!isTermsAccepted || isProcessing} onClick={() => handleCheckout(selectedPlan)}>
          {isProcessing ? "Processing..." : "Continue to Secure Payment"}
        </Button>
        
        <p className="text-xs text-center text-gray-700 mt-4">
          Your subscription will become active immediately after payment confirmation. Eligible for risk-free funding with a 100% Money Back Guarantee.
        </p>
      </div>
    </div>;
};
export default SubscriptionPlans;