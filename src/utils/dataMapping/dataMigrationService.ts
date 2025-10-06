import { supabase } from '@/integrations/supabase/client';
import { 
  mapFreeCalculatorToMainApp,
  getFreeCalculatorDataFromStorage,
  getEligibilityDataFromStorage,
  debugMappingResults,
  type MainAppMappedData,
  type ProfilePageData,
  type NetAssetValueData
} from './freeCalculatorToMainAppMapper';

// Interface for migration result
export interface MigrationResult {
  success: boolean;
  message: string;
  profileDataMigrated: boolean;
  netAssetValueDataMigrated: boolean;
  errors: string[];
  mappedData?: MainAppMappedData;
}

/**
 * Main data migration service that transfers Free Calculator data to Main App pageBasedSFMCode system
 */
export class DataMigrationService {
  private static instance: DataMigrationService;
  
  private constructor() {}
  
  public static getInstance(): DataMigrationService {
    if (!DataMigrationService.instance) {
      DataMigrationService.instance = new DataMigrationService();
    }
    return DataMigrationService.instance;
  }
  
  /**
   * Migrate Free Calculator data to Main App after successful subscription
   */
  public async migrateFreeCalculatorData(membershipNumber?: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      message: '',
      profileDataMigrated: false,
      netAssetValueDataMigrated: false,
      errors: []
    };
    
    try {
      console.log('🚀 Starting Free Calculator to Main App data migration...');
      
      // Get membership number from parameter or localStorage
      const buomMembershipNumber = membershipNumber || localStorage.getItem('buomMembershipNumber');
      
      if (!buomMembershipNumber) {
        result.errors.push('BUOM membership number not found');
        result.message = 'Migration failed: No membership number available';
        return result;
      }
      
      // Get Free Calculator data from localStorage
      const freeCalcData = getFreeCalculatorDataFromStorage();
      if (!freeCalcData) {
        result.errors.push('Free Calculator data not found in localStorage');
        result.message = 'Migration failed: No Free Calculator data available';
        return result;
      }
      
      // Get eligibility data (this might need enhancement to store actual form data)
      const eligibilityData = getEligibilityDataFromStorage();
      if (!eligibilityData) {
        result.errors.push('Eligibility form data not found');
        // Continue migration with just calculator data
      }
      
      // Map Free Calculator data to Main App format
      const mappedData = mapFreeCalculatorToMainApp(freeCalcData, eligibilityData || {
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        email: '',
        postCode: '',
        country: '',
        mobile: ''
      });
      
      result.mappedData = mappedData;
      
      // Debug log the mapping results
      debugMappingResults(mappedData);
      
      // Migrate Profile data
      const profileMigrationSuccess = await this.migrateProfileData(buomMembershipNumber, mappedData.profileData);
      result.profileDataMigrated = profileMigrationSuccess;
      
      if (!profileMigrationSuccess) {
        result.errors.push('Failed to migrate Profile data');
      }
      
      // Migrate Net Asset Value data
      const navMigrationSuccess = await this.migrateNetAssetValueData(buomMembershipNumber, mappedData.netAssetValueData);
      result.netAssetValueDataMigrated = navMigrationSuccess;
      
      if (!navMigrationSuccess) {
        result.errors.push('Failed to migrate Net Asset Value data');
      }
      
      // Determine overall success
      result.success = profileMigrationSuccess || navMigrationSuccess;
      
      if (result.success) {
        result.message = 'Data migration completed successfully';
        
        // Mark migration as completed in localStorage
        localStorage.setItem('dataMigrationCompleted', 'true');
        localStorage.setItem('dataMigrationTimestamp', new Date().toISOString());
        
        console.log('✅ Free Calculator data migration completed successfully');
      } else {
        result.message = 'Data migration failed';
        console.error('❌ Free Calculator data migration failed');
      }
      
    } catch (error) {
      console.error('Error during data migration:', error);
      result.errors.push(`Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.message = 'Migration failed due to unexpected error';
    }
    
    return result;
  }
  
  /**
   * Migrate Profile page data to Main App
   */
  private async migrateProfileData(membershipNumber: string, profileData: ProfilePageData): Promise<boolean> {
    try {
      console.log('📋 Migrating Profile data...');
      
      // Check if there's any profile data to migrate
      const hasProfileData = Object.keys(profileData).length > 0;
      if (!hasProfileData) {
        console.log('No Profile data to migrate');
        return true; // Not an error, just no data
      }
      
      // Translate PRF codes to actual members table columns
      const dbUpdates: Record<string, unknown> = {};

      // Personal Information
      if (profileData['SFM-PRF-2003']) {
        dbUpdates.date_of_birth = profileData['SFM-PRF-2003'];
      }
      if (profileData['SFM-PRF-2041'] !== undefined) {
        dbUpdates.retirement_age = profileData['SFM-PRF-2041'];
      }

      // Employment Information
      if (profileData['SFM-PRF-2021'] !== undefined) {
        dbUpdates.annual_salary = profileData['SFM-PRF-2021'];
      }

      // Contact Information
      if (profileData['SFM-PRF-2005']) {
        dbUpdates.mobile = profileData['SFM-PRF-2005'];
      }

      // Address fields (Contact Information)
      if (profileData['SFM-PRF-2081']) {
        dbUpdates.house_name = profileData['SFM-PRF-2081'];
      }
      if (profileData['SFM-PRF-2082']) {
        dbUpdates.address_line1 = profileData['SFM-PRF-2082'];
      }
      if (profileData['SFM-PRF-2083']) {
        dbUpdates.address_line2 = profileData['SFM-PRF-2083'];
      }
      if (profileData['SFM-PRF-2084']) {
        dbUpdates.city = profileData['SFM-PRF-2084'];
      }
      if (profileData['SFM-PRF-2085']) {
        dbUpdates.postcode = profileData['SFM-PRF-2085'];
      }
      if (profileData['SFM-PRF-2086']) {
        dbUpdates.country = profileData['SFM-PRF-2086'];
      }

      // If no valid mapped fields, skip update gracefully
      if (Object.keys(dbUpdates).length === 0) {
        console.log('Profile mapping contained no updatable DB fields. Skipping.');
        return true;
      }

      // Store the translated updates in the members table
      const { error } = await supabase
        .from('members')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('membership_id', membershipNumber);
      
      if (error) {
        console.error('Error migrating Profile data:', error);
        return false;
      }
      
      console.log('✅ Profile data migrated successfully');
      return true;
      
    } catch (error) {
      console.error('Error in migrateProfileData:', error);
      return false;
    }
  }
  
  /**
   * Migrate Net Asset Value data to Main App
   */
  private async migrateNetAssetValueData(membershipNumber: string, navData: NetAssetValueData): Promise<boolean> {
    try {
      console.log('💰 Migrating Net Asset Value data...');
      
      // Check if there's any NAV data to migrate
      const hasNavData = Object.keys(navData).length > 0;
      if (!hasNavData) {
        console.log('No Net Asset Value data to migrate');
        return true; // Not an error, just no data
      }
      
      // First, get the member ID from membership_id
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('id')
        .eq('membership_id', membershipNumber)
        .single();

      if (memberError || !memberData) {
        console.error('Error finding member:', memberError);
        return false;
      }

      // Store the mapped data in the assets table
      // This integrates with the actual Net Asset Value storage mechanism
      const assetsToInsert = Object.entries(navData).map(([key, value]) => ({
        member_id: memberData.id,
        name: key,
        value: typeof value === 'number' ? value : 0,
        category_id: 1, // Default category, should be mapped properly
        description: `Migrated from free calculator: ${key}`,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('assets')
        .insert(assetsToInsert);
      
      if (error) {
        console.error('Error migrating Net Asset Value data:', error);
        return false;
      }
      
      console.log('✅ Net Asset Value data migrated successfully');
      return true;
      
    } catch (error) {
      console.error('Error in migrateNetAssetValueData:', error);
      return false;
    }
  }
  
  /**
   * Check if data migration has already been completed for this user
   */
  public static hasMigrationBeenCompleted(): boolean {
    return localStorage.getItem('dataMigrationCompleted') === 'true';
  }
  
  /**
   * Get migration timestamp if available
   */
  public static getMigrationTimestamp(): string | null {
    return localStorage.getItem('dataMigrationTimestamp');
  }
  
  /**
   * Clear migration flags (useful for testing or re-migration)
   */
  public static clearMigrationFlags(): void {
    localStorage.removeItem('dataMigrationCompleted');
    localStorage.removeItem('dataMigrationTimestamp');
  }
  
  /**
   * Validate that required data exists before attempting migration
   */
  public static validateMigrationRequirements(): { isValid: boolean; missingItems: string[] } {
    const missingItems: string[] = [];
    
    // Check for BUOM membership number
    if (!localStorage.getItem('buomMembershipNumber')) {
      missingItems.push('BUOM membership number');
    }
    
    // Check for Free Calculator data
    const freeCalcData = getFreeCalculatorDataFromStorage();
    if (!freeCalcData) {
      missingItems.push('Free Calculator data');
    }
    
    // Check for premium subscription status
    if (localStorage.getItem('premiumSubscription') !== 'active') {
      missingItems.push('Active premium subscription');
    }
    
    return {
      isValid: missingItems.length === 0,
      missingItems
    };
  }
}

/**
 * Convenience function to trigger data migration
 */
export async function migrateFreeCalculatorData(membershipNumber?: string): Promise<MigrationResult> {
  const migrationService = DataMigrationService.getInstance();
  return await migrationService.migrateFreeCalculatorData(membershipNumber);
}

/**
 * Convenience function to check migration status
 */
export function checkMigrationStatus(): {
  completed: boolean;
  timestamp: string | null;
  requirements: { isValid: boolean; missingItems: string[] };
} {
  return {
    completed: DataMigrationService.hasMigrationBeenCompleted(),
    timestamp: DataMigrationService.getMigrationTimestamp(),
    requirements: DataMigrationService.validateMigrationRequirements()
  };
}