
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Asset, Category } from "@/types/NetAssetValue";
import { Badge } from "@/components/ui/badge";
import { useAssetForm } from "@/hooks/useAssetForm";
import CategorySelector from "./CategorySelector";
import PensionTypeSelector from "./PensionTypeSelector";
import PensionProviderSelector from "./PensionProviderSelector";
import { useState } from "react";
import type { PensionProviderCategory } from "@/data/pensionProviders";
import FormActions from "./FormActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AssetFormProps {
  asset: Asset | null;
  categories: Category[];
  onSave: (asset: Partial<Asset>) => void;
  onCancel: () => void;
}

export default function AssetForm({ asset, categories, onSave, onCancel }: AssetFormProps) {
  const {
    formData,
    valueInput,
    isPensionCategory,
    handleChange,
    handleValueChange,
    handleSwitchChange,
    handleCategoryChange,
    handlePensionTypeChange,
    handleProviderChange,
    handleSubmit
  } = useAssetForm(asset, categories, onSave);

  const [selectedPensionType, setSelectedPensionType] = useState<string>("");

  const providerCategoryFromType = (type: string): PensionProviderCategory => {
    if (type === "Workplace DC Pension") return "workplace";
    if (type === "SIPP") return "sipp";
    // Default to personal for Personal Pension and other types
    return "personal";
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            Complete the form below to add your asset.
          </DialogDescription>
          <div className="flex items-center mt-1">
            <Badge variant="secondary" className="bg-yellow-200 text-amber-800">Premium Feature</Badge>
            <span className="ml-2 text-xs text-muted-foreground">Free for first 30 days</span>
          </div>
        </DialogHeader>
        <ScrollArea className="pr-4 max-h-[60vh]">
          <div className="space-y-4">
            <CategorySelector 
              categories={categories} 
              value={formData.category_id} 
              onChange={handleCategoryChange} 
            />

            {isPensionCategory && (
              <PensionTypeSelector 
                value={selectedPensionType} 
                onChange={(val) => { setSelectedPensionType(val); handlePensionTypeChange(val); }} 
              />
            )}

            {isPensionCategory && (
              <PensionProviderSelector 
                category={providerCategoryFromType(selectedPensionType)}
                value={formData.name || ""}
                onChange={(val) => handleProviderChange(val)}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Product Provider Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Value (£)</Label>
              <Input
                id="value"
                name="value"
                type="text"
                value={valueInput}
                onChange={handleValueChange}
                autoComplete="off"
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_liquid"
                checked={formData.is_liquid}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_liquid">Liquid Asset</Label>
            </div>

            {!asset && (
              <Alert variant="default" className="bg-blue-50">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Click "Save" to add this asset to your portfolio. You can edit or delete it later.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <FormActions onCancel={onCancel} onSubmit={handleSubmit} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
