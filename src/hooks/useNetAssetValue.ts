
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "./useCategories";
import { useAssetsWithSFMAllocation } from "./useAssetsWithSFMAllocation";
import { useLiabilities } from "./useLiabilities";
import { useNetWorth } from "./useNetWorth";

export function useNetAssetValue() {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  
  const { assetCategories, liabilityCategories } = useCategories();
  const { 
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
    // Enhanced SFM functionality
    getSFMAllocationStats,
    bulkAllocateSFMCodes
  } = useAssetsWithSFMAllocation();
  
  const {
    liabilities,
    editingLiability,
    showLiabilityForm,
    fetchLiabilities,
    handleAddLiability,
    handleEditLiability,
    handleLiabilitySave,
    handleDeleteLiability,
    setShowLiabilityForm,
    isLoadingLiabilities
  } = useLiabilities();
  
  const { netWorth, fetchNetWorth, isLoading: isLoadingNetWorth } = useNetWorth();
  
  // Debounced refresh function to avoid hitting rate limits
  const refreshData = useCallback(async () => {
    // Only refresh if user is authenticated and enough time has passed (3 seconds)
    const now = Date.now();
    if (!user || (now - lastRefreshTime < 3000)) return;
    
    setLastRefreshTime(now);
    await Promise.all([
      fetchAssets(),
      fetchLiabilities()
    ]);
    
    // Calculate net worth after assets and liabilities are fetched
    await fetchNetWorth();
  }, [user, fetchAssets, fetchLiabilities, fetchNetWorth, lastRefreshTime]);

  // Fetch initial data when component mounts and user is authenticated
  useEffect(() => {
    if (user && !isInitialized) {
      refreshData();
      setIsInitialized(true);
    } else if (!user) {
      // Reset initialized state when user logs out
      setIsInitialized(false);
    }
  }, [user, refreshData, isInitialized]);
  
  // Status indicators for the UI
  const isLoading = isLoadingAssets || isLoadingLiabilities || isLoadingNetWorth;

  return {
    assetCategories,
    liabilityCategories,
    assets,
    liabilities,
    netWorth,
    showAssetForm,
    showLiabilityForm,
    editingAsset,
    editingLiability,
    handleAddAsset,
    handleEditAsset,
    handleAssetSave,
    handleDeleteAsset,
    setShowAssetForm,
    handleAddLiability,
    handleEditLiability,
    handleLiabilitySave,
    handleDeleteLiability,
    setShowLiabilityForm,
    refreshData,
    isLoading,
    // Enhanced SFM functionality
    getSFMAllocationStats,
    bulkAllocateSFMCodes
  };
}
