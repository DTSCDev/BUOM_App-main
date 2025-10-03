
import React from "react";
import { Asset, Category } from "@/types/NetAssetValue";
import { useAssetSuggestions } from "@/hooks/useAssetSuggestions";
import AssetItem from "./AssetItem";
import { CategoryHeader } from "./CategoryHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AssetCategoryProps {
  category: Category;
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  formatCurrency: (amount: number) => string;
  onAddNew?: () => void; // Prop to handle direct add
}

export default function AssetCategory({ 
  category, 
  assets, 
  onEdit, 
  onDelete, 
  formatCurrency,
  onAddNew 
}: AssetCategoryProps) {
  const { displayItems, createSuggestionAsset } = useAssetSuggestions(category, assets);

  // Helper function to handle adding a suggested asset
  function handleAddSuggestion(item: any) {
    const newAsset = createSuggestionAsset(item);
    
    // Create a temporary asset for the edit form
    const tempAsset = {
      ...newAsset,
      id: "temp-id",
      member_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_imported: false
    } as Asset;
    
    onEdit(tempAsset);
  }

  return (
    <div className="mb-8">
      <CategoryHeader category={category} />
      
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayItems.map((item) => (
            <AssetItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              assets={assets}
              formatCurrency={formatCurrency}
              handleAddSuggestion={handleAddSuggestion}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed rounded-lg text-center">
          <p className="text-muted-foreground mb-3">No {category.name} added yet</p>
          <Button 
            variant="outline" 
            onClick={onAddNew || (() => {})}
            className="mx-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add {category.name}
          </Button>
        </div>
      )}
    </div>
  );
}
