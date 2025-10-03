
import React from 'react';
import { Form } from '@/components/ui/form';
import FundingEligibilityFormFields from '@/components/FundingEligibilityFormFields';
import FundingEligibilitySuccessDialog from '@/components/FundingEligibilitySuccessDialog';
import { useFundingEligibilityForm } from '@/hooks/useFundingEligibilityForm';

interface FundingEligibilityFormProps {
  onChangeTab?: (tab: string) => void;
}

const FundingEligibilityForm: React.FC<FundingEligibilityFormProps> = ({ onChangeTab }) => {
  const {
    form,
    isSubmitting,
    onSubmit,
    membershipNumber,
    isSuccessDialogOpen,
    setIsSuccessDialogOpen
  } = useFundingEligibilityForm();

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <h2 className="font-bold mb-2 text-3xl text-gray-700">Check Your Funding Eligibility</h2>
        <p className="text-muted-foreground">
          Please complete the form below to check if you're eligible for risk-free funding options and to reserve your position for funding this tax-year.
        </p>
      </div>

      <Form {...form}>
        <FundingEligibilityFormFields form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </Form>
      
      <FundingEligibilitySuccessDialog 
        isOpen={isSuccessDialogOpen} 
        onOpenChange={setIsSuccessDialogOpen} 
        membershipNumber={membershipNumber}
        onChangeTab={onChangeTab}
      />
    </div>
  );
};

export default FundingEligibilityForm;
