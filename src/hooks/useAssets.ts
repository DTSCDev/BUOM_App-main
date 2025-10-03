import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Asset } from "@/types/NetAssetValue";
import { useAuth } from "@/hooks/useAuth";

export function useAssets() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchAssets = useCallback(async () => {
    if (!user) return;
    
    // Prevent multiple simultaneous requests
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
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error loading assets:", errorMessage);
      
      // Only show toast for non-resource errors
      if (!errorMessage.includes("ERR_INSUFFICIENT_RESOURCES")) {
        toast({
          title: "Error loading assets",
          description: errorMessage,
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

  const handleAssetSave = useCallback(async (asset: Partial<Asset>) => {
    if (!user) return null;

    console.log('=== ASSET SAVE START ===');
    console.log('Form data received in handleAssetSave:', asset);

    try {
      let result;
      
      // Prepare asset data for saving
      const assetData = {
        category_id: asset.category_id,
        name: asset.name,
        description: asset.description,
        value: asset.value,
        is_liquid: asset.is_liquid,
      };
      
      if (editingAsset) {
        console.log('=== UPDATING EXISTING ASSET ===');
        
        // Update existing asset
        result = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', editingAsset.id)
          .select('*, category:asset_categories(*)');
          
        console.log('Supabase UPDATE result:', result);
      } else {
        console.log('=== CREATING NEW ASSET ===');
        
        // Insert new asset
        result = await supabase
          .from('assets')
          .insert({
            member_id: user.id,
            ...assetData
          })
          .select('*, category:asset_categories(*)');
          
        console.log('Supabase INSERT result:', result);
      }

      if (result.error) {
        console.error('=== SUPABASE OPERATION FAILED ===');
        console.error('Error details:', result.error);
        throw result.error;
      }
      
      const savedAsset = result.data[0];
      console.log('=== SUCCESSFULLY SAVED ASSET ===');
      console.log('Saved asset from database:', savedAsset);
      
      if (editingAsset) {
        const updatedAssets = assets.map(a => a.id === editingAsset.id ? savedAsset : a);
        setAssets(updatedAssets);
        
        toast({
          title: "Asset updated",
          description: `${savedAsset.name} updated to £${savedAsset.value?.toLocaleString()}`,
        });
      } else {
        const newAssets = [...assets, savedAsset];
        setAssets(newAssets);
        
        toast({
          title: "Asset added",
          description: `${savedAsset.name} has been added to your assets.`,
        });
      }
      
      setShowAssetForm(false);
      console.log('=== ASSET SAVE COMPLETE ===');
      return savedAsset;
    } catch (error: unknown) {
      console.error("=== ASSET SAVE ERROR ===", error);
      toast({
        title: "Error saving asset",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
      return null;
    }
  }, [user, assets, editingAsset]);

  const handleDeleteAsset = useCallback(async (assetId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      
      setAssets(assets.filter(a => a.id !== assetId));
      
      toast({
        title: "Asset deleted",
        description: "The asset has been removed from your portfolio.",
      });
    } catch (error: unknown) {
      toast({
        title: "Error deleting asset",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
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
    // SFM functionality
    getSFMAllocationStats
  };
}
