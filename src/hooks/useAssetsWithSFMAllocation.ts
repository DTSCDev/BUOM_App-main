/**
 * Enhanced useAssets hook with automated SFM code allocation
 * 
 * This hook extends the base useAssets functionality to automatically
 * assign SFM codes when new assets are created, ensuring no duplicates
 * and maintaining full audit trails.
 */

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Asset } from "@/types/NetAssetValue";
import { useAuth } from "@/hooks/useAuth";
// Update import to use the comprehensive bespoke allocation service
import { AutoAllocateBespoke } from "@/utils/systemFields/core/sfmBespokeAllocationService";
import { sfmAllocationRegistry } from "@/utils/systemFields/core/sfmAllocationTracker";

export function useAssetsWithSFMAllocation() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Helper function to get category name by ID
  const getCategoryName = async (categoryId: number): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('name')
        .eq('id', categoryId)
        .single();
      
      if (error || !data) {
        console.warn("Could not fetch category name:", error);
        return 'Unknown Category';
      }
      
      return data.name;
    } catch (error) {
      console.warn("Error fetching category name:", error);
      return 'Unknown Category';
    }
  };

  const fetchAssets = useCallback(async () => {
    if (!user) return;
    
    if (isLoadingAssets) {
      console.log("Assets fetch already in progress");
      return;
    }
    
    try {
      setIsLoadingAssets(true);
      setHasError(false);
      
      const { data, error } = await supabase
        .from('assets')
        .select('*, category:asset_categories(*)')
        .eq('member_id', user.id);

      if (error) throw error;
      
      setAssets(data || []);
      return data;
    } catch (error: unknown) {
      setHasError(true);
      console.error("Error loading assets:", error instanceof Error ? error.message : "Unknown error");
      
      if (error instanceof Error && !error.message.includes("ERR_INSUFFICIENT_RESOURCES")) {
        toast({
          title: "Error loading assets",
          description: error.message,
          variant: "destructive",
        });
      }
      return [];
    } finally {
      setIsLoadingAssets(false);
    }
  }, [user, isLoadingAssets]);

  const handleAddAsset = useCallback(() => {
    setEditingAsset(null);
    setShowAssetForm(true);
  }, []);

  const handleEditAsset = useCallback((asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetForm(true);
  }, []);

  const handleAssetSave = async (assetData: {
    id?: string;
    name: string;
    category_id: string;
    description?: string;
    value?: string | number;
    is_liquid?: boolean;
  }) => {
    console.log("=== ENHANCED ASSET SAVE START ===");
    console.log("Raw asset data:", assetData);
    console.log("User ID:", user?.id);
  
    if (!user?.id) {
      console.error("No user ID available");
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Validate required fields
      if (!assetData.name || !assetData.category_id) {
        console.error("Missing required fields:", { name: assetData.name, category_id: assetData.category_id });
        toast({
          title: "Validation Error",
          description: "Asset name and category are required",
          variant: "destructive",
        });
        return;
      }
  
      // Prepare insert data without sfm_code initially
      const insertData = {
        category_id: parseInt(assetData.category_id),
        name: assetData.name.trim(),
        description: assetData.description?.trim() || null,
        value: parseFloat(String(assetData.value)) || 0,
        is_liquid: Boolean(assetData.is_liquid),
        is_imported: false,
        member_id: user.id,
      };
  
      console.log("Prepared insert data:", insertData);
  
      if (assetData.id) {
        // Update existing asset
        console.log("Updating existing asset with ID:", assetData.id);
        
        const { data, error } = await supabase
          .from('assets')
          .update(insertData)
          .eq('id', assetData.id)
          .eq('member_id', user.id)
          .select();
  
        if (error) {
          console.error("Supabase UPDATE error:", error);
          
          let errorMessage = "Failed to update asset";
          if (error.code === '23503') {
            errorMessage = "Invalid category selected";
          } else if (error.code === '23505') {
            errorMessage = "Asset with this name already exists";
          } else if (error.code === '23502') {
            errorMessage = "Missing required information";
          }
          
          toast({
            title: "Update Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
  
        console.log("Asset updated successfully:", data);
        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
      } else {
        // Create new asset
        console.log("Creating new asset...");
        
        const { data, error } = await supabase
          .from('assets')
          .insert(insertData)
          .select();
  
        if (error) {
          console.error("=== SUPABASE OPERATION FAILED ===");
          console.error("Error details:", error);
          
          let errorMessage = "Failed to save asset";
          if (error.code === '23503') {
            errorMessage = "Invalid category selected";
          } else if (error.code === '23505') {
            errorMessage = "Asset with this name already exists";
          } else if (error.code === '23502') {
            errorMessage = "Missing required information";
          } else if (error.code === 'PGRST204') {
            errorMessage = "Database schema issue - please contact support";
          }
          
          toast({
            title: "Save Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
  
        console.log("Supabase INSERT result:", data);
  
        // Use comprehensive bespoke SFM code allocation for new assets
        if (!editingAsset && data && data[0]) {
          console.log("🔧 Starting comprehensive SFM code allocation for new asset...");
          
          try {
            const categoryName = await getCategoryName(parseInt(assetData.category_id));
            console.log(`📋 Category name: ${categoryName}`);
            
            // Use bespoke allocation based on product type and description
            const productType = this.detectProductTypeFromCategory(categoryName);
            const sfmCode = AutoAllocateBespoke.allocateForAssetProduct(
              productType, 
              `${assetData.name} - ${assetData.description || ''}`
            );
            
            console.log("🎯 Bespoke SFM allocation result:", sfmCode);
  
            if (sfmCode) {
              console.log(`✅ SFM code allocated: ${sfmCode}`);
              
              // Update the asset with the allocated SFM code
              const { error: updateError } = await supabase
                .from('assets')
                .update({ sfm_code: sfmCode })
                .eq('id', data[0].id);
  
              if (updateError) {
                console.error("❌ Failed to update asset with SFM code:", updateError);
                if (updateError.code === 'PGRST204') {
                  console.error("❌ CRITICAL: sfm_code column does not exist in database!");
                  toast({
                    title: "Database Schema Error",
                    description: "SFM code column missing - please run database migration",
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Warning",
                    description: "Asset saved but SFM code assignment failed",
                    variant: "destructive",
                  });
                }
              } else {
                console.log(`🎉 Asset successfully updated with SFM code: ${sfmCode}`);
                toast({
                  title: "Success",
                  description: `Asset saved with SFM code: ${sfmCode}`,
                });
              }
            } else {
              console.error("❌ Bespoke SFM allocation failed");
              toast({
                title: "Warning", 
                description: "Asset saved but SFM code allocation failed",
                variant: "destructive",
              });
            }
          } catch (allocationError) {
            console.error("❌ Error during SFM allocation:", allocationError);
            toast({
              title: "Warning",
              description: "Asset saved but SFM code allocation failed",
              variant: "destructive",
            });
          }
        } else {
          // For updates, just show success
          toast({
            title: "Success",
            description: editingAsset ? "Asset updated successfully" : "Asset saved successfully",
          });
        }
  
        // Close the form after successful save
        setShowAssetForm(false);
        setEditingAsset(null);
      }
  
      // Refresh the assets list
      await fetchAssets();
      console.log("=== ENHANCED ASSET SAVE COMPLETE ===");
  
    } catch (error) {
      console.error("=== ENHANCED ASSET SAVE ERROR ===", error);
      console.error("Final error message:", error.message);
      
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  const handleDeleteAsset = useCallback(async (assetId: string) => {
    if (!user) return;

    try {
      // Get asset details before deletion for SFM code cleanup
      const assetToDelete = assets.find(a => a.id === assetId);
      
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      
      setAssets(assets.filter(a => a.id !== assetId));
      
      // In the handleDeleteAsset function, replace the release logic:
      // Actually release the SFM code back to the registry
      if (assetToDelete?.sfm_code) {
        try {
          const released = sfmAllocationRegistry.releaseCode(assetToDelete.sfm_code);
          if (released) {
            console.log(`✅ SFM code ${assetToDelete.sfm_code} successfully released and available for reallocation`);
          } else {
            console.warn(`⚠️ Failed to release SFM code ${assetToDelete.sfm_code}`);
          }
        } catch (releaseError) {
          console.error(`❌ Error releasing SFM code ${assetToDelete.sfm_code}:`, releaseError);
        }
      }
      
      toast({
        title: "Asset deleted",
        description: "The asset has been removed from your portfolio.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error deleting asset",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [user, assets]);

  /**
   * Get SFM allocation statistics for assets
   */
  const getSFMAllocationStats = useCallback(() => {
    const assetsWithSFM = assets.filter(asset => asset.sfm_code);
    const assetsWithoutSFM = assets.filter(asset => !asset.sfm_code);
    
    return {
      totalAssets: assets.length,
      assetsWithSFM: assetsWithSFM.length,
      assetsWithoutSFM: assetsWithoutSFM.length,
      allocationPercentage: assets.length > 0 ? (assetsWithSFM.length / assets.length) * 100 : 0,
      sfmCodes: assetsWithSFM.map(asset => ({
        assetName: asset.name,
        sfmCode: asset.sfm_code,
        category: asset.category?.name,
        value: asset.value
      }))
    };
  }, [assets]);

  /**
   * Bulk allocate SFM codes to existing assets without codes using comprehensive bespoke allocation
   */
  const bulkAllocateSFMCodes = useCallback(async () => {
    if (!user) return;

    const assetsWithoutSFM = assets.filter(asset => !asset.sfm_code);
    
    if (assetsWithoutSFM.length === 0) {
      toast({
        title: "No Action Needed",
        description: "All assets already have SFM codes assigned.",
      });
      return;
    }

    console.log(`🔧 Starting comprehensive bulk SFM allocation for ${assetsWithoutSFM.length} assets`);
    
    let successCount = 0;
    let failureCount = 0;

    for (const asset of assetsWithoutSFM) {
      try {
        const categoryName = asset.category?.name || 'Unknown Category';
        console.log(`📋 Processing asset: ${asset.name} (Category: ${categoryName})`);
        
        // Use comprehensive bespoke allocation
        const productType = detectProductTypeFromCategory(categoryName);
        const sfmCode = AutoAllocateBespoke.allocateForAssetProduct(
          productType, 
          `${asset.name} - ${asset.description || ''}`
        );

        if (sfmCode) {
          // Update asset in database with new SFM code
          const { error } = await supabase
            .from('assets')
            .update({ sfm_code: sfmCode })
            .eq('id', asset.id);

          if (!error) {
            successCount++;
            console.log(`✅ Allocated ${sfmCode} to ${asset.name} (Product Type: ${productType})`);
          } else {
            failureCount++;
            console.error(`❌ Failed to update asset ${asset.name} with SFM code:`, error);
          }
        } else {
          failureCount++;
          console.error(`❌ Failed to allocate SFM code for ${asset.name} (Product Type: ${productType})`);
        }
      } catch (error: unknown) {
        failureCount++;
        console.error(`❌ Error processing asset ${asset.name}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Refresh assets to show updated SFM codes
    await fetchAssets();

    toast({
      title: "Comprehensive Bulk SFM Allocation Complete",
      description: `Successfully allocated: ${successCount}, Failed: ${failureCount}`,
      variant: failureCount > 0 ? "destructive" : "default",
    });

    console.log(`🎯 Comprehensive bulk allocation complete: ${successCount} success, ${failureCount} failures`);
  }, [user, assets, fetchAssets]);

  return {
    assets,
    editingAsset,
    showAssetForm,
    fetchAssets,
    handleAddAsset,
    handleEditAsset,
    handleAssetSave,
    handleDeleteAsset,
    setShowAssetForm,
    isLoadingAssets,
    hasError,
    // Enhanced SFM functionality
    getSFMAllocationStats,
    bulkAllocateSFMCodes
  };
}

/**
 * Detect product type from category name for bespoke allocation
 */
const detectProductTypeFromCategory = (categoryName: string): string => {
  const category = categoryName.toLowerCase();
  
  // Map category names to product types for bespoke allocation
  if (category.includes('pension') || category.includes('retirement')) {
    if (category.includes('workplace') || category.includes('company')) {
      return 'workplace_pension';
    }
    if (category.includes('personal') || category.includes('private')) {
      return 'personal_pension';
    }
    if (category.includes('sipp')) {
      return 'sipp';
    }
    if (category.includes('ssas')) {
      return 'ssas';
    }
    return 'workplace_pension'; // Default pension type
  }
  
  if (category.includes('property') || category.includes('real estate')) {
    if (category.includes('main') || category.includes('primary') || category.includes('residence')) {
      return 'main_residence';
    }
    if (category.includes('btl') || category.includes('buy to let') || category.includes('rental')) {
      return 'btl_investment';
    }
    if (category.includes('commercial')) {
      return 'commercial_property';
    }
    return 'main_residence'; // Default property type
  }
  
  if (category.includes('isa')) {
    if (category.includes('cash')) return 'isa_cash';
    if (category.includes('stocks') || category.includes('shares')) return 'isa_stocks_shares';
    if (category.includes('innovative')) return 'isa_innovative_finance';
    if (category.includes('lifetime')) return 'isa_lifetime';
    if (category.includes('junior')) return 'isa_junior';
    return 'isa_cash'; // Default ISA type
  }
  
  if (category.includes('investment')) {
    if (category.includes('bond')) {
      if (category.includes('offshore')) return 'bond_offshore';
      return 'bond_onshore';
    }
    if (category.includes('seis')) return 'seis';
    if (category.includes('eis') || category.includes('vct')) return 'eis_vct';
    return 'other_investments';
  }
  
  if (category.includes('cash') || category.includes('savings')) {
    if (category.includes('premium') || category.includes('bonds')) return 'premium_bonds';
    return 'deposit';
  }
  
  // Default fallback
  return 'other_investments';
};