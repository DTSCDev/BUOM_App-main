
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { migrateFreeCalculatorData, checkMigrationStatus } from '@/utils/dataMapping/dataMigrationService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get session_id from URL parameters
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setStatus('error');
          return;
        }
        
        // Set premium subscription status to active
        localStorage.setItem('premiumSubscription', 'active');
        
        // Log the retirement calculator data for debugging
        const retirementData = localStorage.getItem('retirement-calculator-data');
        if (retirementData) {
          console.log('Retirement Calculator Data:', JSON.parse(retirementData));
        }
        
        setStatus('success');
        
        // Start data migration process
        await handleDataMigration();
        
      } catch (error) {
        console.error('Error handling payment success:', error);
        setStatus('error');
      }
    };
    
    const handleDataMigration = async () => {
      try {
        console.log('Starting data migration...');
        
        // Check migration requirements
        const migrationCheck = checkMigrationStatus();
        
        if (!migrationCheck.requirements.isValid) {
          console.warn('Migration requirements not met:', migrationCheck.requirements.missingItems);
          return;
        }
        
        // Perform data migration
        const migrationResult = await migrateFreeCalculatorData();
        
        if (migrationResult.success) {
          console.log('✅ Data migration completed successfully');
        } else {
          console.error('❌ Data migration failed:', migrationResult.errors);
        }
        
      } catch (error) {
        console.error('Error during data migration:', error);
      }
    };
    
    handlePaymentSuccess();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">
              {status === 'loading' ? 'Processing Your Payment...' : 
               status === 'success' ? 'Payment Successful!' : 
               'Payment Verification Issue'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' ? 'Please wait while we verify your payment.' : 
               status === 'success' ? 'Your BUOM membership is now active.' : 
               'We encountered an issue verifying your payment.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-green-600 dark:text-green-400 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Thank You For Your Payment</h3>
                  <p>Your BUOM membership is now active and you can access all premium features.</p>
                </div>

                <div className="text-center space-y-4">
                  <p>Your membership gives you access to risk-free funding options and specialized financial advice.</p>
                  <p>Our team will be in touch shortly with next steps.</p>
                  
                  <div className="mt-6">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/">
                        Return to Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-red-600 dark:text-red-400 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Verification Issue</h3>
                  <p>We couldn't verify your payment. This could be temporary.</p>
                </div>

                <div className="text-center">
                  <p>Please try the following:</p>
                  <ul className="list-disc list-inside text-left mx-auto max-w-md py-4">
                    <li>Check your email for a payment confirmation from Stripe</li>
                    <li>Contact our support team if you believe this is an error</li>
                    <li>Try refreshing this page</li>
                  </ul>
                  
                  <div className="mt-6">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/">
                        Return to Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
