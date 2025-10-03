
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authorisedMasterTrusts, personalPensionProviders, sippProviders } from '@/data/pensionProviders';

// Define the form schema with validation rules
export const fundingEligibilityFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters."
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters."
  }),
  addressLine1: z.string().min(3, {
    message: "Address Line 1 must be at least 3 characters."
  }),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().min(2, {
    message: "City must be at least 2 characters."
  }),
  postCode: z.string().min(5, {
    message: "Please enter a valid UK post code."
  }).refine(val => /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(val), {
    message: "Please enter a valid UK post code format."
  }),
  country: z.string().min(2, {
    message: "Please enter a valid country."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  mobile: z.string().min(10, {
    message: "Please enter a valid UK mobile number."
  }).refine(val => /^(\+44|0)\d{10}$/.test(val.replace(/\s+/g, '')), {
    message: "Please enter a valid UK mobile number format."
  }),
  workplaceProvider: z.string().optional().or(z.literal('')),
  personalProvider: z.string().optional().or(z.literal('')),
});

export type FundingEligibilityFormValues = z.infer<typeof fundingEligibilityFormSchema>;

interface FundingEligibilityFormFieldsProps {
  form: UseFormReturn<FundingEligibilityFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: FundingEligibilityFormValues) => Promise<void>;
}

const FundingEligibilityFormFields = ({ 
  form, 
  isSubmitting, 
  onSubmit 
}: FundingEligibilityFormFieldsProps) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField 
          control={form.control} 
          name="firstName" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="lastName" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>

      <FormField 
        control={form.control} 
        name="addressLine1" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 1</FormLabel>
            <FormControl>
              <Input placeholder="10 Downing Street" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <FormField 
        control={form.control} 
        name="addressLine2" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2 (optional)</FormLabel>
            <FormControl>
              <Input placeholder="Westminster" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField 
          control={form.control} 
          name="city" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="London" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="country" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="United Kingdom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
      
      <FormField 
        control={form.control} 
        name="postCode" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Post Code</FormLabel>
            <FormControl>
              <Input placeholder="SW1A 1AA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="email" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john.smith@example.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="mobile" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile</FormLabel>
            <FormControl>
              <Input placeholder="07700 900000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      {/* Workplace (Auto Enrolment) Pension Provider */}
      <FormField 
        control={form.control} 
        name="workplaceProvider" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Workplace Pension Provider (Auto Enrolment)</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workplace provider" />
                </SelectTrigger>
                <SelectContent>
                  {authorisedMasterTrusts.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      {/* Personal / SIPP Provider */}
      <FormField 
        control={form.control} 
        name="personalProvider" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Personal / SIPP Provider</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select personal/SIPP provider" />
                </SelectTrigger>
                <SelectContent>
                  {[...personalPensionProviders, ...sippProviders].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <Button type="submit" className="w-full text-gray-700" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit Details"}
      </Button>
    </form>
  );
};

export default FundingEligibilityFormFields;
