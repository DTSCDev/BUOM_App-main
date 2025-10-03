
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Last updated date for Pensions UK data
const PENSIONS_UK_LAST_UPDATED = "2025-05-14";

const PensionsUKStandards: React.FC = () => {
  const { toast } = useToast();

  // Add effect to remind to check Pensions UK updates every 6 months
  useEffect(() => {
    const checkPensionsUKUpdates = () => {
      const lastUpdated = new Date(PENSIONS_UK_LAST_UPDATED);
      const currentDate = new Date();
      const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
      if (currentDate.getTime() - lastUpdated.getTime() > sixMonthsInMs) {
        toast({
          title: "Pensions UK Data Check Required",
          description: "It's been over 6 months since the last Pensions UK standards update. Please check for new data at the Pensions UK website.",
          variant: "default",
          duration: 10000
        });
      }
    };
    checkPensionsUKUpdates();
  }, [toast]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Pensions UK Retirement Living Standards</h3>
        <a href="https://www.retirementlivingstandards.org.uk/" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
          <Link className="w-4 h-4 mr-1" />
          <span>Visit Pensions UK Website</span>
        </a>
      </div>
      <p className="text-muted-foreground mb-4">
        The Pensions UK Retirement Living Standards help you understand how much money you might need in retirement.
        The figures below show annual income needed for different lifestyles:
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="bg-teal-600 text-white dark:bg-teal-800">
            <CardTitle className="text-center">BASIC</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-2">
                <span className="font-medium">SINGLE:</span>
                <span className="text-2xl font-bold block">£14,400</span>
              </div>
              <div>
                <span className="font-medium">COUPLE:</span>
                <span className="text-2xl font-bold block">£22,400</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">per year</p>
              <div className="mt-4">
                <ul className="text-sm space-y-2">
                  <li>✓ Covers all basic needs</li>
                  <li>✓ Some social activities</li>
                  <li>✓ No budget for car</li>
                  <li>✓ Limited travel/holidays</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-pink-600 text-white dark:bg-pink-800">
            <CardTitle className="text-center">MODERATE</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-2">
                <span className="font-medium">SINGLE:</span>
                <span className="text-2xl font-bold block">£31,300</span>
              </div>
              <div>
                <span className="font-medium">COUPLE:</span>
                <span className="text-2xl font-bold block">£43,100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">per year</p>
              <div className="mt-4">
                <ul className="text-sm space-y-2">
                  <li>✓ Financial security</li>
                  <li>✓ Regular social activities</li>
                  <li>✓ Budget for car replacement</li>
                  <li>✓ Annual UK holidays</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-cyan-500 text-white dark:bg-cyan-700">
            <CardTitle className="text-center">COMFORTABLE</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-2">
                <span className="font-medium">SINGLE:</span>
                <span className="text-2xl font-bold block">£43,100</span>
              </div>
              <div>
                <span className="font-medium">COUPLE:</span>
                <span className="text-2xl font-bold block">£59,000</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">per year</p>
              <div className="mt-4">
                <ul className="text-sm space-y-2">
                  <li>✓ Financial freedom</li>
                  <li>✓ Regular dining out</li>
                  <li>✓ New car every 5 years</li>
                  <li>✓ Extended foreign holidays</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-right">
        Source: Pensions UK Retirement Living Standards, last checked {new Date(PENSIONS_UK_LAST_UPDATED).toLocaleDateString()}
      </div>
    </div>
  );
};

export default PensionsUKStandards;
