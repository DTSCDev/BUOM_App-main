
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate, TablesInsert } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { getFreeCalculatorDataFromStorage } from "@/utils/dataMapping/freeCalculatorToMainAppMapper";

export interface ProfileData {
  id: string;
  first_name: string | null;
  middle_name?: string | null;
  last_name: string | null;
  email: string | null;
  mobile: string | null;
  date_of_birth: string | null;
  relationship_status: string | null;
  retirement_age: number | null;
  postcode: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  country: string | null;
  house_name?: string | null;
  annual_salary: number | null;
  monthly_net_pay: number | null;
  p11d?: string | null;
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
      if (!user?.id) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Attempt to fetch existing member profile
        const { data: existing, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        let data = existing;

        // If no member row exists yet for this authenticated user, auto-provision a minimal record
        if (!data) {
          // Require an email to create the record
          const email = user.email;
          if (!email) {
            throw new Error('Authenticated user missing email; cannot create member profile');
          }

          // Robustly derive first/last name from common metadata keys
          type UserMetadata = Partial<{
            first_name: string;
            firstName: string;
            given_name: string;
            last_name: string;
            lastName: string;
            family_name: string;
            full_name: string;
            name: string;
          }>;
          const meta = (user.user_metadata ?? {}) as UserMetadata;
          const fullName: string | undefined = meta.full_name || meta.name;
          const computedFirst: string | null =
            meta.first_name ?? meta.firstName ?? meta.given_name ??
            (typeof fullName === 'string' ? fullName.split(' ')[0] || null : null);
          const computedLast: string | null =
            meta.last_name ?? meta.lastName ?? meta.family_name ??
            (typeof fullName === 'string' ? (fullName.split(' ').slice(1).join(' ') || null) : null);

          const defaultInsert: TablesInsert<'members'> = {
            id: user.id,
            email,
            first_name: computedFirst,
            last_name: computedLast,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: created, error: insertError } = await supabase
            .from('members')
            .insert(defaultInsert)
            .select('*')
            .maybeSingle();

          if (insertError) throw insertError;
          data = created;
        }

        if (data) {
          // Helpers to safely read optional fields not present in generated types
          const extra = data as Record<string, unknown>;
          const readStringOrNull = (key: string): string | null => {
            const v = extra[key];
            return typeof v === 'string' ? v : null;
          };
          const readNumberOrNull = (key: string): number | null => {
            const v = extra[key];
            return typeof v === 'number' ? v : null;
          };

          // Map the database data to ProfileData interface
          let profileData: ProfileData = {
          id: data.id,
          first_name: data.first_name,
          middle_name: readStringOrNull('middle_name'),
          last_name: data.last_name,
          email: data.email,
            mobile: data.mobile,
            date_of_birth: data.date_of_birth,
            relationship_status: readStringOrNull('relationship_status'),
            retirement_age: readNumberOrNull('retirement_age'),
            postcode: data.postcode,
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city: data.city,
            country: data.country,
            annual_salary: data.annual_salary,
            monthly_net_pay: data.monthly_net_pay,
            p11d: readStringOrNull('p11d'),
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

          // Backfill missing critical fields from Free Calculator localStorage, if available
          try {
            const freeCalc = getFreeCalculatorDataFromStorage();
            if (freeCalc) {
              if (!profileData.date_of_birth && freeCalc.dateOfBirth) {
                profileData = { ...profileData, date_of_birth: freeCalc.dateOfBirth };
              }
              if ((profileData.annual_salary == null || profileData.annual_salary === 0) && typeof freeCalc.annualSalary === 'number') {
                profileData = { ...profileData, annual_salary: freeCalc.annualSalary };
              }
            }
          } catch (e) {
            console.warn('useProfile: Failed to read free calculator fallback', e);
          }
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
  const updateProfile = async (updates: Partial<ProfileData>): Promise<boolean> => {
    if (!user?.id || !profile) return false;
    
    try {
      // Adapt updates to Supabase members Update type to satisfy strict typing
      const memberUpdates: TablesUpdate<'members'> = {
        address_line1: updates.address_line1 ?? undefined,
        address_line2: updates.address_line2 ?? undefined,
        annual_salary: updates.annual_salary ?? undefined,
        business_address: updates.business_address ?? undefined,
        city: updates.city ?? undefined,
        company_number: updates.company_number ?? undefined,
        country: updates.country ?? undefined,
        date_of_birth: updates.date_of_birth ?? undefined,
        director_nic_election: updates.director_nic_election ?? undefined,
        email: updates.email ?? undefined,
        employer_address: updates.employer_address ?? undefined,
        employer_name: updates.employer_name ?? undefined,
        employment_type: updates.employment_type ?? undefined,
        first_name: updates.first_name ?? undefined,
        has_controlling_shares: updates.has_controlling_shares ?? undefined,
        last_name: updates.last_name ?? undefined,
        membership_id: updates.membership_id ?? undefined,
        mobile: updates.mobile ?? undefined,
        monthly_net_pay: updates.monthly_net_pay ?? undefined,
        national_insurance_number: updates.national_insurance_number ?? undefined,
        paye_tax_code: updates.paye_tax_code ?? undefined,
        pension_contribution_employee: updates.pension_contribution_employee ?? undefined,
        pension_contribution_employer: updates.pension_contribution_employer ?? undefined,
        pension_provider: updates.pension_provider ?? undefined,
        postcode: updates.postcode ?? undefined,
        trading_name: updates.trading_name ?? undefined,
        works_from_home: updates.works_from_home ?? undefined,
        is_director: updates.is_director ?? undefined,
      };

      const { error } = await supabase
        .from('members')
        .update(memberUpdates)
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
