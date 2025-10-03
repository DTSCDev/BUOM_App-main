
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActionWarning } from "@/components/ui/action-warning";
import AssetCategory from "./AssetCategory";
import AssetFormFixed from "./AssetFormFixed";
import CSVImportDialog from "./CSVImportDialog";
import { PageHeader } from "./PageHeader";
import { Asset, Category } from "@/types/NetAssetValue";

interface AssetsSectionProps {
  assets: Asset[];
  categories: Category[];
  showAssetForm: boolean;
  editingAsset: Asset | null;
  onAddAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onAssetSave: (assetData: Asset) => Promise<void>;
  onDeleteAsset: (assetId: string) => Promise<void>;
  onSetShowAssetForm: (show: boolean) => void;
  onRefreshData: () => Promise<void>;
}

export function AssetsSection({
  assets,
  categories,
  showAssetForm,
  editingAsset,
  onAddAsset,
  onEditAsset,
  onAssetSave,
  onDeleteAsset,
  onSetShowAssetForm,
  onRefreshData
}: AssetsSectionProps) {
  const [showCSVImport, setShowCSVImport] = useState(false);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const assetsCount = assets.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if no assets added or total value seems low for average user
  const isIncomplete = assetsCount === 0 || totalAssets < 10000; // £10k threshold

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#030227]">Assets</h2>
            <ActionWarning message="Add Assets" show={isIncomplete} />
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Manage your asset portfolio and track your wealth</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddAsset}>
            <Plus className="mr-2 h-4 w-4" /> Add Asset
          </Button>
          <Button variant="outline" onClick={() => setShowCSVImport(true)}>
            Import CSV
          </Button>
          <Button variant="outline" onClick={onRefreshData}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => {
          const categoryAssets = assets.filter(
            (asset) => asset.category_id === category.id
          );
          
          return (
            <AssetCategory
              key={category.id}
              category={category}
              assets={categoryAssets}
              onEdit={onEditAsset}
              onDelete={onDeleteAsset}
              formatCurrency={formatCurrency}
              onAddNew={onAddAsset}
            />
          );
        })}
      </div>

      {showAssetForm && (
        <AssetFormFixed
          categories={categories}
          asset={editingAsset}
          onSave={onAssetSave}
          onCancel={() => onSetShowAssetForm(false)}
        />
      )}

      {showCSVImport && (
        <CSVImportDialog
          isOpen={showCSVImport}
          onClose={() => setShowCSVImport(false)}
          assetCategories={categories}
          liabilityCategories={[]}
          onImportAssets={async (assets) => {
            for (const asset of assets) {
              await onAssetSave({
                id: asset.id || crypto.randomUUID(),
                name: asset.name,
                value: asset.value,
                category_id: asset.category_id,
                created_at: asset.created_at || new Date().toISOString(),
                updated_at: asset.updated_at || new Date().toISOString(),
                member_id: asset.member_id || '',
                description: asset.description || '',
                is_imported: asset.is_imported || true,
                is_liquid: asset.is_liquid || false
              });
            }
            await onRefreshData();
          }}
          onImportLiabilities={() => {}}
        />
      )}
    </div>
  );
}
