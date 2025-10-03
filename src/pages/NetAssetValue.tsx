
import { useState } from "react";
import { PageHeader } from "@/components/NetAssetValue/PageHeader";
import { NetWorthSummary } from "@/components/NetAssetValue/NetWorthSummary";
import { AssetsSection } from "@/components/NetAssetValue/AssetsSection";
import { LiabilitiesSection } from "@/components/NetAssetValue/LiabilitiesSection";
import AssetForm from "@/components/NetAssetValue/AssetForm";
import LiabilityForm from "@/components/NetAssetValue/LiabilityForm";
import CSVImportDialog from "@/components/NetAssetValue/CSVImportDialog";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { formatCurrency } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Asset, Liability } from "@/types/NetAssetValue";
import { Download, RefreshCw } from "lucide-react";
import { assetsToCSV, liabilitiesToCSV, downloadCSV } from "@/utils/csvUtils";

export default function NetAssetValue() {
  const {
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
    isLoading
  } = useNetAssetValue();

  // State for import dialogs
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importType, setImportType] = useState<"assets" | "liabilities">("assets");

  // Function to download all data as CSV
  const handleDownloadAllData = () => {
    // Create a combined CSV file with assets and liabilities
    const assetsCsv = assetsToCSV(assets);
    const liabilitiesCsv = liabilitiesToCSV(liabilities);
    
    const combinedCsv = 
      "ASSETS\n" + 
      assetsCsv + 
      "\n\nLIABILITIES\n" + 
      liabilitiesCsv;
    
    downloadCSV(combinedCsv, `net_worth_data_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Show import dialog for assets
  const handleImportAssets = () => {
    setImportType("assets");
    setShowImportDialog(true);
  };

  // Show import dialog for liabilities
  const handleImportLiabilities = () => {
    setImportType("liabilities");
    setShowImportDialog(true);
  };

  // Handle bulk import of assets
  const handleBulkImportAssets = async (assetsToImport: Partial<Asset>[]) => {
    for (const asset of assetsToImport) {
      await handleAssetSave(asset);
    }
  };

  // Handle bulk import of liabilities
  const handleBulkImportLiabilities = async (liabilitiesToImport: Partial<Liability>[]) => {
    for (const liability of liabilitiesToImport) {
      await handleLiabilitySave(liability);
    }
  };

  // Calculate totals for NetWorthSummary
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const calculatedNetWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader />
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => refreshData()} 
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button variant="outline" onClick={handleDownloadAllData}>
            <Download className="mr-2 h-4 w-4" /> Download All Data
          </Button>
        </div>
      </div>
      
      {/* Net Worth Summary */}
      <NetWorthSummary 
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        netWorth={calculatedNetWorth}
        assetsCount={assets.length}
        liabilitiesCount={liabilities.length}
      />

      {/* Liabilities Section - Positioned first */}
      <LiabilitiesSection
        categories={liabilityCategories}
        liabilities={liabilities}
        showLiabilityForm={showLiabilityForm}
        editingLiability={editingLiability}
        onAddLiability={handleAddLiability}
        onEditLiability={handleEditLiability}
        onLiabilitySave={handleLiabilitySave}
        onDeleteLiability={handleDeleteLiability}
        onSetShowLiabilityForm={setShowLiabilityForm}
        onRefreshData={refreshData}
      />

      {/* Assets Section */}
      <AssetsSection
        categories={assetCategories}
        assets={assets}
        showAssetForm={showAssetForm}
        editingAsset={editingAsset}
        onAddAsset={handleAddAsset}
        onEditAsset={handleEditAsset}
        onAssetSave={handleAssetSave}
        onDeleteAsset={handleDeleteAsset}
        onSetShowAssetForm={setShowAssetForm}
        onRefreshData={refreshData}
      />

      {/* Asset Form Dialog - Using proper AssetForm component with SFM-NAV-3XXX codes */}
      {showAssetForm && (
        <AssetForm
          asset={editingAsset}
          categories={assetCategories}
          onSave={handleAssetSave}
          onCancel={() => setShowAssetForm(false)}
        />
      )}

      {/* Liability Form Dialog */}
      {showLiabilityForm && (
        <LiabilityForm
          liability={editingLiability}
          categories={liabilityCategories}
          onSave={handleLiabilitySave}
          onCancel={() => setShowLiabilityForm(false)}
          onDelete={handleDeleteLiability}
        />
      )}

      {/* CSV Import Dialog */}
      {showImportDialog && (
        <CSVImportDialog
          isOpen={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          assetCategories={assetCategories}
          liabilityCategories={liabilityCategories}
          onImportAssets={handleBulkImportAssets}
          onImportLiabilities={handleBulkImportLiabilities}
        />
      )}
    </div>
  );
}
