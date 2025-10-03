
import { supabase } from '@/integrations/supabase/client';

interface CalculatorResults {
  firstName: string;
  lastName: string;
  email: string;
  postCode: string;
  mobile: string;
  dateOfBirth: string;
  annualSalary: number;
  existingPensionValue: number;
  targetIncomeAtRetirement: number;
  capitalShortfall: number;
  monthlyFundingCost: number;
  buomMembershipNumber?: string;
}

interface UserAsset {
  name: string;
  value: number;
  category_id: number; // Changed from string to number
  description: string;
}

export class UserJourneyService {
  
  // ENHANCED: Transfer calculator results to user profile with better error handling
  static async transferCalculatorResultsToProfile(
    userId: string, 
    results: CalculatorResults
  ): Promise<boolean> {
    try {
      console.log('🔄 TRANSFERRING CALCULATOR RESULTS TO PROFILE:', results);
      
      // Update member profile with calculator data
      const { error: profileError } = await supabase
        .from('members')
        .update({
          first_name: results.firstName,
          last_name: results.lastName,
          email: results.email,
          postcode: results.postCode,
          mobile: results.mobile,
          date_of_birth: results.dateOfBirth,
          annual_salary: results.annualSalary,
          membership_id: results.buomMembershipNumber
        })
        .eq('id', userId);

      if (profileError) {
        console.error('❌ Profile update failed:', profileError);
        return false;
      }

      // ENHANCED: Create pension asset if existingPensionValue > 0
      if (results.existingPensionValue > 0) {
        const pensionAsset: UserAsset = {
          name: 'Existing Workplace Pension',
          value: results.existingPensionValue,
          category_id: 1, // Assuming pension category ID is 1 - should be numeric
          description: 'Pension value from calculator assessment'
        };

        const { error: assetError } = await supabase
          .from('assets')
          .insert({
            member_id: userId, // Changed from user_id to member_id
            name: pensionAsset.name,
            value: pensionAsset.value,
            category_id: pensionAsset.category_id,
            description: pensionAsset.description
          });

        if (assetError) {
          console.error('❌ Asset creation failed:', assetError);
          // Don't fail the whole operation if asset creation fails
        } else {
          console.log('✅ Pension asset created successfully');
        }
      }

      console.log('✅ Calculator results transferred successfully');
      return true;

    } catch (error) {
      console.error('❌ Transfer failed:', error);
      return false;
    }
  }

  // ENHANCED: Get eligibility data from free calculator submissions
  static async getEligibilityData(membershipId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('free-rs-calculator')
        .select('*')
        .eq('membership_id', membershipId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to handle no results gracefully

      if (error) {
        console.error('❌ Failed to fetch eligibility data:', error);
        return null;
      }

      if (!data) {
        console.log('📝 No eligibility data found for membership:', membershipId);
        return null;
      }

      console.log('✅ Eligibility data retrieved:', data);
      return data;

    } catch (error) {
      console.error('❌ Eligibility data fetch failed:', error);
      return null;
    }
  }

  // ENHANCED: Create authenticated user profile from eligibility data
  static async createUserFromEligibilityData(
    userId: string, 
    eligibilityData: any
  ): Promise<boolean> {
    try {
      console.log('🔄 CREATING USER FROM ELIGIBILITY DATA:', eligibilityData);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('members')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (existingUser) {
        console.log('✅ User already exists, updating with eligibility data');
      }

      // Upsert user profile with eligibility data
      const { error } = await supabase
        .from('members')
        .upsert({
          id: userId,
          first_name: eligibilityData.first_name,
          last_name: eligibilityData.last_name,
          email: eligibilityData.email,
          postcode: eligibilityData.postcode,
          mobile: eligibilityData.mobile,
          membership_id: eligibilityData.membership_id
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('❌ User creation/update failed:', error);
        return false;
      }

      console.log('✅ User profile created/updated successfully');
      return true;

    } catch (error) {
      console.error('❌ User creation failed:', error);
      return false;
    }
  }

  // ENHANCED: Complete user journey flow
  static async completeUserJourney(
    userId: string,
    calculatorResults: CalculatorResults
  ): Promise<boolean> {
    try {
      console.log('🚀 STARTING COMPLETE USER JOURNEY');
      
      // Step 1: Transfer calculator results to profile
      const profileSuccess = await this.transferCalculatorResultsToProfile(userId, calculatorResults);
      if (!profileSuccess) {
        console.error('❌ Profile transfer failed');
        return false;
      }

      // Step 2: Get and integrate eligibility data if membership number exists
      if (calculatorResults.buomMembershipNumber) {
        const eligibilityData = await this.getEligibilityData(calculatorResults.buomMembershipNumber);
        if (eligibilityData) {
          await this.createUserFromEligibilityData(userId, eligibilityData);
        }
      }

      console.log('✅ USER JOURNEY COMPLETED SUCCESSFULLY');
      return true;

    } catch (error) {
      console.error('❌ Complete user journey failed:', error);
      return false;
    }
  }
}
