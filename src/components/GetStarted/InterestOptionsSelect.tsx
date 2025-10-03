
import React from 'react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { interestOptions } from '@/data/accountTypesData';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './validationSchema';

type InterestOptionsSelectProps = {
  form: UseFormReturn<FormValues>;
  selectedAccountType: string;
};

const InterestOptionsSelect: React.FC<InterestOptionsSelectProps> = ({ form, selectedAccountType }) => {
  if (!selectedAccountType) return null;
  
  const availableInterestOptions = interestOptions[selectedAccountType] || [];
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="interests"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-lg font-medium">I am interested in</FormLabel>
              <FormMessage />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableInterestOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={form.getValues("interests").includes(option.id)}
                    onCheckedChange={(checked) => {
                      const currentInterests = form.getValues("interests");
                      if (checked) {
                        form.setValue("interests", [...currentInterests, option.id]);
                      } else {
                        form.setValue(
                          "interests",
                          currentInterests.filter((id) => id !== option.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default InterestOptionsSelect;
