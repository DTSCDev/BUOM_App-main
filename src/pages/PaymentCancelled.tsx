
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">
              Payment Cancelled
            </CardTitle>
            <CardDescription>
              Your payment process was cancelled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Payment Not Processed</h3>
              <p>You've cancelled the payment process. No charges have been made to your account.</p>
            </div>
            
            <div>
              <p className="mb-4">If you'd like to try again or have any questions about our subscription options, please return to the dashboard.</p>
              
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/">
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelled;
