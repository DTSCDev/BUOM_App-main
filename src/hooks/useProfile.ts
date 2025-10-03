
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  mobile: string | null;
  date_of_birth: string | null;
  postcode: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  country: string | null;
  annual_salary: number | null;
  monthly_net_pay: number | null;
  pension_contribution_employee: number | null;
  pension_contribution_employer: number | null;
  pension_provider: string | null;
  membership_id: string | null;
  national_insurance_number: string | null;
  employment_type: 'paye_employee' | 'self_employed' | 'business_owner' | null;
  employer_name: string | null;
  employer_address: string | null;
  trading_name: string | null;
  company_number: string | null;
  business_address: string | null;
  works_from_home: boolean | null;
  // New PAYE and Director fields
  paye_tax_code: string | null;
  is_director: boolean | null;
  has_controlling_shares: boolean | null;
  director_nic_election: 'annual' | 'monthly' | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          // Map the database data to ProfileData interface
          const profileData: ProfileData = {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            mobile: data.mobile,
            date_of_birth: data.date_of_birth,
            postcode: data.postcode,
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city: data.city,
            country: data.country,
            annual_salary: data.annual_salary,
            monthly_net_pay: data.monthly_net_pay,
            pension_contribution_employee: data.pension_contribution_employee,
            pension_contribution_employer: data.pension_contribution_employer,
            pension_provider: data.pension_provider,
            membership_id: data.membership_id,
            national_insurance_number: data.national_insurance_number,
            employment_type: data.employment_type as 'paye_employee' | 'self_employed' | 'business_owner' | null,
            employer_name: data.employer_name,
            employer_address: data.employer_address,
            trading_name: data.trading_name,
            company_number: data.company_number,
            business_address: data.business_address,
            works_from_home: data.works_from_home,
            // New PAYE and Director fields
            paye_tax_code: data.paye_tax_code,
            is_director: data.is_director,
            has_controlling_shares: data.has_controlling_shares,
            director_nic_election: data.director_nic_election as 'annual' | 'monthly' | null,
          };
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Update profile data
  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user?.id || !profile) return;
    
    try {
      const { error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile({ ...profile, ...updates });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  return { profile, isLoading, updateProfile };
}
