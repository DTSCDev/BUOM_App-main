
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateBUOMMembershipNumber } from '@/utils/pensionCalculations';
import { FundingEligibilityFormValues, fundingEligibilityFormSchema } from '@/components/FundingEligibilityFormFields';

export const useFundingEligibilityForm = () => {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FundingEligibilityFormValues>({
    resolver: zodResolver(fundingEligibilityFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postCode: "",
      country: "United Kingdom",
      email: "",
      mobile: "",
      workplaceProvider: "",
      personalProvider: "",
    }
  });

  // Form submission handler
  const onSubmit = async (data: FundingEligibilityFormValues) => {
    try {
      setIsSubmitting(true);
      // Persist full eligibility data locally for data migration mapping
      localStorage.setItem('funding-eligibility-data', JSON.stringify(data));
      
      // Generate a BUOM membership number
      const newMembershipNumber = generateBUOMMembershipNumber();
      setMembershipNumber(newMembershipNumber);

      console.log('Submitting to Supabase with data:', {
        membership_id: newMembershipNumber,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        postcode: data.postCode,
        mobile: data.mobile,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        country: data.country,
        workplaceProvider: data.workplaceProvider,
        personalProvider: data.personalProvider,
      });

      // Save directly to Supabase - RLS policies now allow anonymous submissions
      const { error } = await supabase
        .from('free-rs-calculator')
        .insert({
          membership_id: newMembershipNumber,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          postcode: data.postCode,
          mobile: data.mobile,
          subscription_status: 'pending'
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        toast({
          title: "Error",
          description: `Database error: ${error.message}. Please try again later.`,
          variant: "destructive"
        });
        return;
      }

      // Store membership number in local storage for use in checkout
      localStorage.setItem('buomMembershipNumber', newMembershipNumber);

      // Show success message
      setIsSuccessDialogOpen(true);

      // Reset form
      form.reset();

      // Send toast notification
      toast({
        title: "Application Submitted Successfully",
        description: "Your funding eligibility details have been submitted."
      });

      // In a real implementation, you would send an email here
      console.log("Would send email to b2b@buom.app with:", {
        ...data,
        membershipNumber: newMembershipNumber
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
    membershipNumber,
    isSuccessDialogOpen,
    setIsSuccessDialogOpen
  };
};
