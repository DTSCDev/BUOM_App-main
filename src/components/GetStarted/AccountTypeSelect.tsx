
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { accountTypes } from '@/data/accountTypesData';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './validationSchema';

type AccountTypeSelectProps = {
  form: UseFormReturn<FormValues>;
  onAccountTypeChange: (value: string) => void;
};

const AccountTypeSelect: React.FC<AccountTypeSelectProps> = ({ form, onAccountTypeChange }) => {
  return (
    <FormField
      control={form.control}
      name="accountType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">Select account type</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onAccountTypeChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AccountTypeSelect;
