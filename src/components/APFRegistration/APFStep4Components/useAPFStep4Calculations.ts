
import { useMemo } from "react";
import { calculateUnlimitedAPFSponsorships } from "@/utils/pension/apfSponsorshipCalculations";
import { calculateUnifiedPensionMetrics } from "@/utils/pension/unifiedCalculationEngine";
import { CalculationInput, CalculationResult } from "./types";
import { calculateCurrentAge, calculateExistingPensionValue } from "./calculationUtils";
import { calculateISAContributions } from "./isaCalculationUtils";

export const useAPFStep4Calculations = ({ profile, assets }: CalculationInput): CalculationResult => {
  return useMemo(() => {
    // ENHANCED: Better data validation and fallback handling
    if (!profile) {
      console.log('APFStep4 - No profile data available');
      return {
        unifiedResult: null,
        apfSponsorships: [],
        totalMaturityValue: 0,
        totalISAContributions: 0,
        hasError: true,
        errorMessage: 'Profile data not available'
      };
    }

    // Calculate current age with fallback
    const currentAge = calculateCurrentAge(profile);
    const annualSalary = profile?.annual_salary || 60000;
    
    // ENHANCED: Better pension value calculation with profile integration
    const existingPensionValue = calculateExistingPensionValue(assets);

    console.log('APFStep4 - ENHANCED Input values:', {
      currentAge,
      annualSalary,
      existingPensionValue,
      profileExists: !!profile,
      profileData: {
        email: profile?.email,
        pensionProvider: profile?.pension_provider,
        employeeContribution: profile?.pension_contribution_employee,
        employerContribution: profile?.pension_contribution_employer
      },
      assetsCount: assets?.length || 0,
      pensionAssets: assets?.filter(asset => 
        asset.category?.name?.toLowerCase().includes('pension') ||
        asset.name.toLowerCase().includes('pension')
      ).length || 0
    });

    // Main calculation logic
    const defaultValues: CalculationResult = {
      unifiedResult: null,
      apfSponsorships: [],
      totalMaturityValue: 0,
      totalISAContributions: 0,
      hasError: false,
      errorMessage: ''
    };

    try {
      // Step 1: Try unified calculation with enhanced error handling
      console.log('APFStep4 - Attempting enhanced unified calculation...');
      const unifiedResult = calculateUnifiedPensionMetrics(
        currentAge,
        annualSalary,
        existingPensionValue,
        false
      );

      if (!unifiedResult) {
        console.error('APFStep4 - Unified calculation returned null');
        return { ...defaultValues, hasError: true, errorMessage: 'Unified calculation failed' };
      }

      console.log('APFStep4 - Enhanced unified result success:', {
        currentCapitalShortfall: unifiedResult.currentCapitalShortfall,
        feasibleAPFFunding: unifiedResult.feasibleAPFFunding,
        totalProjectedAssets: unifiedResult.totalProjectedAssets,
        hasShortfall: unifiedResult.currentCapitalShortfall > 0,
        dataIntegrity: {
          usedRealPensionValue: existingPensionValue > 0,
          usedProfileSalary: annualSalary === profile?.annual_salary
        }
      });

      // Step 2: Calculate APF sponsorships with enhanced data
      let apfSponsorships = [];
      let totalMaturityValue = 0;

      if (unifiedResult.currentCapitalShortfall > 0) {
        try {
          console.log('APFStep4 - Calculating enhanced APF sponsorships...');
          apfSponsorships = calculateUnlimitedAPFSponsorships(
            currentAge,
            unifiedResult.currentCapitalShortfall,
            annualSalary,
            false,
            profile // Pass profile for enhanced calculations
          );
          totalMaturityValue = apfSponsorships.reduce((sum, sponsorship) => sum + (sponsorship.maturityValue || 0), 0);
          console.log('APFStep4 - Enhanced APF sponsorships calculated:', {
            count: apfSponsorships.length,
            totalMaturityValue,
            usedProfileData: !!profile
          });
        } catch (error) {
          console.error('APFStep4 - Error calculating APF sponsorships:', error);
        }
      }

      // Step 3: Calculate ISA contributions using extracted utility with profile integration
      const totalISAContributions = calculateISAContributions(
        apfSponsorships,
        annualSalary,
        currentAge,
        unifiedResult.currentCapitalShortfall,
        profile
      );

      console.log('APFStep4 - ENHANCED CALCULATION COMPLETE:', {
        totalISAContributions,
        dataQuality: {
          hasProfile: !!profile,
          hasAssets: (assets?.length || 0) > 0,
          hasPensionAssets: existingPensionValue > 0,
          profileComplete: !!(profile?.email && profile?.annual_salary && profile?.date_of_birth)
        }
      });

      return {
        unifiedResult,
        apfSponsorships,
        totalMaturityValue,
        totalISAContributions,
        hasError: false,
        errorMessage: ''
      };

    } catch (error) {
      console.error('APFStep4 - Critical error in enhanced calculations:', error);
      return { 
        ...defaultValues, 
        hasError: true, 
        errorMessage: error instanceof Error ? error.message : 'Unknown calculation error'
      };
    }
  }, [profile, assets]);
};
