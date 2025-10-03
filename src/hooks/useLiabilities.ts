
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Liability } from "@/types/NetAssetValue";
import { useAuth } from "@/hooks/useAuth";
import { sfmAllocationRegistry } from "@/utils/systemFields/core/sfmAllocationTracker";
// Update import to use the comprehensive bespoke allocation service
import { AutoAllocateBespoke } from "@/utils/systemFields/core/sfmBespokeAllocationService";

export function useLiabilities() {
  const { user } = useAuth();
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [isLoadingLiabilities, setIsLoadingLiabilities] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Helper function to get category name by ID
  const getCategoryName = useCallback(async (categoryId: number): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('liability_categories')
        .select('name')
        .eq('id', categoryId)
        .single();
      
      if (error || !data) {
        console.warn("Could not fetch liability category name:", error);
        return 'Unknown Category';
      }
      
      return data.name;
    } catch (error) {
      console.warn("Error fetching liability category name:", error);
      return 'Unknown Category';
    }
  }, []);

  const fetchLiabilities = useCallback(async () => {
    if (!user) return;
    
    // Prevent multiple simultaneous requests
    if (isLoadingLiabilities) {
      console.log("Liabilities fetch already in progress");
      return;
    }
    
    try {
      setIsLoadingLiabilities(true);
      setHasError(false);
      
      const { data, error } = await supabase
        .from('liabilities')
        .select('*, category:liability_categories(*)')
        .eq('member_id', user.id);

      if (error) throw error;
      
      setLiabilities(data || []);
      return data;
    } catch (error: unknown) {
      setHasError(true);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error loading liabilities:", errorMessage);
      
      // Only show toast for non-resource errors
      if (!errorMessage.includes("ERR_INSUFFICIENT_RESOURCES")) {
        toast({
          title: "Error loading liabilities",
          description: errorMessage,
          variant: "destructive",
        });
      }
      return [];
    } finally {
      setIsLoadingLiabilities(false);
    }
  }, [user, isLoadingLiabilities]);

  const handleAddLiability = useCallback(() => {
    setEditingLiability(null);
    setShowLiabilityForm(true);
  }, []);

  const handleEditLiability = useCallback((liability: Liability) => {
    setEditingLiability(liability);
    setShowLiabilityForm(true);
  }, []);

  const handleLiabilitySave = useCallback(async (liability: Partial<Liability>) => {
    if (!user) return null;

    try {
      // Validate required fields
      if (!liability.name || !liability.category_id) {
        toast({
          title: "Validation Error",
          description: "Liability name and category are required",
          variant: "destructive",
        });
        return null;
      }

      let result;
      
      if (editingLiability) {
        // Update existing liability
        result = await supabase
          .from('liabilities')
          .update({
            category_id: liability.category_id,
            name: liability.name,
            description: liability.description,
            value: liability.value,
            interest_rate: liability.interest_rate,
            account_number: liability.account_number,
          })
          .eq('id', editingLiability.id)
          .select('*, category:liability_categories(*)');
      } else {
        // Insert new liability
        result = await supabase
          .from('liabilities')
          .insert({
            member_id: user.id,
            category_id: liability.category_id,
            name: liability.name,
            description: liability.description,
            value: liability.value,
            interest_rate: liability.interest_rate,
            account_number: liability.account_number,
          })
          .select('*, category:liability_categories(*)');
      }

      if (result.error) {
        console.error("Supabase error:", result.error);
        
        let errorMessage = "Failed to save liability";
        if (result.error.code === '23503') {
          errorMessage = "Invalid category selected";
        } else if (result.error.code === '23505') {
          errorMessage = "Liability with this name already exists";
        } else if (result.error.code === '23502') {
          errorMessage = "Missing required information";
        }
        
        throw new Error(errorMessage);
      }
      
      if (editingLiability) {
        setLiabilities(liabilities.map(l => l.id === editingLiability.id ? result.data[0] : l));
        toast({
          title: "Liability updated",
          description: `${liability.name} has been updated.`,
        });
      } else {
        // New liability created - allocate SFM code using comprehensive bespoke allocation
        const newLiability = result.data[0];
        setLiabilities([...liabilities, newLiability]);
        
        // Use comprehensive bespoke SFM code allocation for new liabilities
        try {
          console.log(`🔄 Allocating comprehensive SFM code for new liability: ${liability.name}`);
          
          const categoryName = await getCategoryName(liability.category_id);
          console.log(`📋 Category name: ${categoryName}`);
          
          // Use bespoke allocation based on product type and description
          const productType = this.detectLiabilityProductTypeFromCategory(categoryName);
          const sfmCode = AutoAllocateBespoke.allocateForLiabilityProduct(
            productType, 
            `${liability.name} - ${liability.description || ''}`
          );
          
          console.log("🎯 Bespoke SFM allocation result:", sfmCode);
          
          if (sfmCode) {
            console.log(`✅ SFM code ${sfmCode} allocated for liability: ${liability.name}`);
            
            // Update the liability with the allocated SFM code
            const updateResult = await supabase
              .from('liabilities')
              .update({ sfm_code: sfmCode })
              .eq('id', newLiability.id)
              .select('*, category:liability_categories(*)');
            
            if (updateResult.error) {
              // Handle the case where sfm_code column doesn't exist yet
              if (updateResult.error.code === 'PGRST204') {
                console.warn(`⚠️ SFM code column not yet available for liabilities. Code ${sfmCode} allocated but not stored.`);
                toast({
                  title: "Success",
                  description: `Liability saved with SFM code: ${sfmCode} (pending database update)`,
                });
              } else {
                console.error(`❌ Failed to update liability with SFM code:`, updateResult.error);
                toast({
                  title: "Warning",
                  description: "Liability saved but SFM code assignment failed",
                  variant: "destructive",
                });
              }
            } else {
              // Update local state with the SFM code
              setLiabilities(prev => prev.map(l => 
                l.id === newLiability.id ? updateResult.data[0] : l
              ));
              console.log(`✅ Liability updated with SFM code: ${sfmCode}`);
              toast({
                title: "Success",
                description: `Liability saved with SFM code: ${sfmCode}`,
              });
            }
          } else {
            console.warn(`⚠️ Failed to allocate SFM code for liability: ${liability.name}`);
            toast({
              title: "Warning",
              description: "Liability saved but SFM code allocation failed",
              variant: "destructive",
            });
          }
        } catch (allocationError) {
          console.error(`❌ Error during SFM allocation for liability ${liability.name}:`, allocationError);
          toast({
            title: "Warning",
            description: "Liability saved but SFM code allocation failed",
            variant: "destructive",
          });
        }
        
        toast({
          title: "Liability added",
          description: `${liability.name} has been added to your liabilities.`,
        });
      }

      setShowLiabilityForm(false);
      setEditingLiability(null);
      
      return result.data[0];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error saving liability:", errorMessage);
      
      toast({
        title: "Error saving liability",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  }, [user, editingLiability, liabilities, getCategoryName]);

  /**
   * Bulk allocate SFM codes to existing liabilities without codes using comprehensive bespoke allocation
   */
  const bulkAllocateSFMCodes = useCallback(async () => {
    if (!user) return;
  
    const liabilitiesWithoutSFM = liabilities.filter(liability => !liability.sfm_code);
    
    if (liabilitiesWithoutSFM.length === 0) {
      toast({
        title: "No Action Needed",
        description: "All liabilities already have SFM codes assigned.",
      });
      return;
    }
  
    console.log(`🔧 Starting comprehensive bulk SFM allocation for ${liabilitiesWithoutSFM.length} liabilities`);
    
    let successCount = 0;
    let failureCount = 0;
  
    for (const liability of liabilitiesWithoutSFM) {
      try {
        const categoryName = liability.category?.name || 'Unknown Category';
        console.log(`📋 Processing liability: ${liability.name} (Category: ${categoryName})`);
        
        // Use comprehensive bespoke allocation
        const productType = detectLiabilityProductTypeFromCategory(categoryName);
        const sfmCode = AutoAllocateBespoke.allocateForLiabilityProduct(
          productType, 
          `${liability.name} - ${liability.description || ''}`
        );
  
        if (sfmCode) {
          // Update liability in database with new SFM code
          const { error } = await supabase
            .from('liabilities')
            .update({ sfm_code: sfmCode })
            .eq('id', liability.id);
  
          if (!error) {
            successCount++;
            console.log(`✅ Allocated ${sfmCode} to ${liability.name} (Product Type: ${productType})`);
          } else {
            failureCount++;
            console.error(`❌ Failed to update liability ${liability.name} with SFM code:`, error);
          }
        } else {
          failureCount++;
          console.error(`❌ Failed to allocate SFM code for ${liability.name} (Product Type: ${productType})`);
        }
      } catch (error: unknown) {
        failureCount++;
        console.error(`❌ Error processing liability ${liability.name}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  
    // Refresh liabilities to show updated SFM codes
    await fetchLiabilities();
  
    toast({
      title: "Comprehensive Bulk SFM Allocation Complete",
      description: `Successfully allocated: ${successCount}, Failed: ${failureCount}`,
      variant: failureCount > 0 ? "destructive" : "default",
    });
  
    console.log(`🎯 Comprehensive bulk allocation complete: ${successCount} success, ${failureCount} failures`);
  }, [user, liabilities, fetchLiabilities]);

  /**
   * Helper function to detect liability product type from category
   */
  const detectLiabilityProductTypeFromCategory = (categoryName: string): string => {
    const category = categoryName.toLowerCase();
    
    if (category.includes('mortgage')) {
      if (category.includes('main') || category.includes('residence') || category.includes('home')) {
        return 'mortgage_main_residence';
      } else if (category.includes('equity') || category.includes('release')) {
        return 'mortgage_equity_release';
      } else if (category.includes('investment') || category.includes('btl') || category.includes('buy to let')) {
        return 'mortgage_investment_property';
      }
      return 'mortgage_main_residence'; // Default mortgage type
    }
    
    if (category.includes('credit') && category.includes('card')) {
      return 'credit_card';
    }
    
    if (category.includes('loan')) {
      if (category.includes('inbl') || category.includes('principal')) {
        return 'other_debt_inbl_principal';
      }
      return 'other_debt_loan';
    }
    
    // Default fallback
    return 'other_debt_loan';
  };

  const handleDeleteLiability = useCallback(async (liabilityId: string) => {
    if (!user) return;
  
    try {
      // Get liability details before deletion for SFM code cleanup
      const liabilityToDelete = liabilities.find(l => l.id === liabilityId);
      
      const { error } = await supabase
        .from('liabilities')
        .delete()
        .eq('id', liabilityId);
  
      if (error) throw error;
      
      setLiabilities(liabilities.filter(l => l.id !== liabilityId));
      
      // Release the SFM code back to the registry using centralized service
      if (liabilityToDelete?.sfm_code) {
        try {
          const released = sfmAllocationRegistry.releaseCode(liabilityToDelete.sfm_code);
          if (released) {
            console.log(`✅ SFM code ${liabilityToDelete.sfm_code} successfully released and available for reallocation`);
          } else {
            console.warn(`⚠️ Failed to release SFM code ${liabilityToDelete.sfm_code}`);
          }
        } catch (releaseError) {
          console.error(`❌ Error releasing SFM code ${liabilityToDelete.sfm_code}:`, releaseError);
        }
      }
      
      toast({
        title: "Liability deleted",
        description: "The liability has been removed from your portfolio.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error deleting liability",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  }, [user, liabilities]);

  /**
   * Get SFM allocation statistics for liabilities
   */
  const getSFMAllocationStats = useCallback(() => {
    const liabilitiesWithSFM = liabilities.filter(liability => liability.sfm_code);
    const liabilitiesWithoutSFM = liabilities.filter(liability => !liability.sfm_code);
    
    return {
      totalLiabilities: liabilities.length,
      liabilitiesWithSFM: liabilitiesWithSFM.length,
      liabilitiesWithoutSFM: liabilitiesWithoutSFM.length,
      allocationPercentage: liabilities.length > 0 ? (liabilitiesWithSFM.length / liabilities.length) * 100 : 0,
      sfmCodes: liabilitiesWithSFM.map(liability => ({
        liabilityName: liability.name,
        sfmCode: liability.sfm_code,
        category: liability.category?.name,
        value: liability.value
      }))
    };
  }, [liabilities]);

  return {
    liabilities,
    editingLiability,
    showLiabilityForm,
    fetchLiabilities,
    handleAddLiability,
    handleEditLiability,
    handleLiabilitySave,
    handleDeleteLiability,
    setShowLiabilityForm,
    isLoadingLiabilities,
    hasError,
    // SFM functionality
    getSFMAllocationStats,
    bulkAllocateSFMCodes
  };
}
