
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

interface FundingEligibilitySuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  membershipNumber: string;
  onChangeTab?: (tab: string) => void;
}

const FundingEligibilitySuccessDialog = ({
  isOpen,
  onOpenChange,
  membershipNumber,
  onChangeTab
}: FundingEligibilitySuccessDialogProps) => {
  const handleContinue = () => {
    onOpenChange(false);
    if (onChangeTab) {
      onChangeTab('subscription');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            CONGRATULATIONS 🎉
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <p>You are eligible to apply for Risk Free Funding.</p>
            <p>Please now complete your subscription preference and note that no funds will be deducted until after Risk Free Funding is secure.</p>
            <p>You have been allocated a temporary BUOM membership, please check your email for further instructions and make a note of your membership number below.</p>
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md text-center">
              <p className="text-sm">Your temporary BUOM Membership number is:</p>
              <p className="text-lg font-bold">{membershipNumber}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FundingEligibilitySuccessDialog;
