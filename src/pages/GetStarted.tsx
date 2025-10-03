
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PageBackground from '@/components/Layout/PageBackground';

// Import refactored components
import { formSchema, FormValues } from '@/components/GetStarted/validationSchema';
import AccountTypeSelect from '@/components/GetStarted/AccountTypeSelect';
import InterestOptionsSelect from '@/components/GetStarted/InterestOptionsSelect';
import BulkCalculationDialog from '@/components/GetStarted/BulkCalculationDialog';

const GetStarted = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "",
      interests: []
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    if (data.accountType === 'employee') {
      // If the user is an employee, redirect them to the calculator
      navigate('/calculator');
    } else {
      // For other user types, show the dialog
      setShowDialog(true);
    }
    
    toast({
      title: "Account preferences saved",
      description: `Account type: ${data.accountType}, Interests: ${data.interests.join(", ")}`,
    });
  };

  // Update available interest options when the account type changes
  const handleAccountTypeChange = (value: string) => {
    setSelectedAccountType(value);
    form.setValue("accountType", value);
    form.setValue("interests", []);
  };

  return (
    <PageBackground>
      <div className="flex items-center justify-center min-h-screen">
        {/* Form Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-6 sm:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Create a FREE Account
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Account Type Selection */}
                <AccountTypeSelect 
                  form={form} 
                  onAccountTypeChange={handleAccountTypeChange} 
                />
                
                {/* Interest Options */}
                <InterestOptionsSelect 
                  form={form} 
                  selectedAccountType={selectedAccountType} 
                />
                
                <div className="flex justify-center pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 flex items-center gap-2 py-6 px-8">
                    Continue <ArrowRight size={16} />
                  </Button>
                </div>
                
                <div className="text-center text-sm mt-4">
                  <p>Already have an account? <Link to="/" className="text-blue-600 hover:underline">Log in here</Link></p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Dialog for non-employee users */}
      <BulkCalculationDialog 
        open={showDialog} 
        onOpenChange={setShowDialog} 
      />
    </PageBackground>
  );
};

export default GetStarted;
