import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Asset, Category } from "@/types/NetAssetValue";
import { Badge } from "@/components/ui/badge";
import CategorySelector from "./CategorySelector";
import PensionTypeSelector from "./PensionTypeSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

interface AssetFormFixedProps {
  asset: Asset | null;
  categories: Category[];
  onSave: (asset: Partial<Asset>) => void;
  onCancel: () => void;
}

export default function AssetFormFixed({ asset, categories, onSave, onCancel }: AssetFormFixedProps) {
  console.log("🚀 ASSET FORM FIXED - NEW VERSION LOADED");
  
  // Direct state management in component to avoid hook caching issues
  const [formData, setFormData] = useState<Partial<Asset>>(() => {
    console.log("📝 Initializing form data directly in component");
    if (asset) {
      return {
        category_id: asset.category_id,
        name: asset.name,
        description: asset.description || "",
        value: asset.value,
        is_liquid: asset.is_liquid || false,
      };
    }
    
    const defaultData = {
      category_id: categories[0]?.id || 1,
      name: "",
      description: "",
      value: 0,
      is_liquid: false,
    };
    
    console.log("📋 Default form data:", defaultData);
    return defaultData;
  });

  const [isPensionCategory, setIsPensionCategory] = useState<boolean>(false);

  // Check if current category is pension
  useEffect(() => {
    const selectedCategory = categories.find(c => c.id === formData.category_id);
    const isPension = selectedCategory?.name === 'Pensions';
    console.log("🏢 Category check:", { 
      categoryId: formData.category_id, 
      categoryName: selectedCategory?.name, 
      isPension 
    });
    setIsPensionCategory(isPension);
  }, [formData.category_id, categories]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`✏️ Field ${name} changed to:`, value);
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      console.log("📊 Updated form data:", updated);
      return updated;
    });
  }, []);

  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    console.log(`🔢 Number field ${name} changed to:`, numValue);
    setFormData(prev => {
      const updated = { ...prev, [name]: numValue };
      console.log("📊 Updated form data:", updated);
      return updated;
    });
  }, []);

  const handleSwitchChange = useCallback((checked: boolean) => {
    console.log("🔄 Switch changed to:", checked);
    setFormData(prev => {
      const updated = { ...prev, is_liquid: checked };
      console.log("📊 Updated form data:", updated);
      return updated;
    });
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    const categoryId = parseInt(value);
    console.log("📂 Category changed to:", categoryId);
    setFormData(prev => {
      const updated = { ...prev, category_id: categoryId };
      console.log("📊 Updated form data:", updated);
      return updated;
    });
  }, []);

  const handlePensionTypeChange = useCallback((value: string) => {
    console.log("🏦 Pension type changed to:", value);
    const description = `Pension Type: ${value}`;
    setFormData(prev => {
      const updated = { ...prev, description };
      console.log("📊 Updated form data:", updated);
      return updated;
    });
  }, []);

  const handleSave = () => {
    console.log("💾 SAVE BUTTON CLICKED - FIXED VERSION");
    console.log("📋 Current form data:", formData);
    console.log("📝 Name:", formData.name);
    console.log("💰 Value:", formData.value);
    
    // Validation
    if (!formData.name || formData.name.trim() === "") {
      console.log("❌ Validation failed: name is empty");
      alert("Please enter a product provider name.");
      return;
    }
    
    if (!formData.value || formData.value <= 0) {
      console.log("❌ Validation failed: value is invalid");
      alert("Please enter a valid value.");
      return;
    }

    console.log("✅ Validation passed, calling onSave");
    onSave(formData);
  };

  console.log("🎨 Rendering form with data:", formData);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"} (FIXED)</DialogTitle>
          <DialogDescription>
            Complete the form below to add your asset.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center mt-1 mb-4">
          <Badge variant="secondary" className="bg-yellow-200 text-amber-800">Premium Feature</Badge>
          <span className="ml-2 text-xs text-muted-foreground">Free for first 30 days</span>
        </div>
        <ScrollArea className="pr-4 max-h-[60vh]">
          <div className="space-y-4">
            <CategorySelector 
              categories={categories} 
              value={formData.category_id} 
              onChange={handleCategoryChange} 
            />

            {isPensionCategory && (
              <PensionTypeSelector 
                value="" 
                onChange={handlePensionTypeChange} 
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="name-fixed">Product Provider Name</Label>
              <Input
                id="name-fixed"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                spellCheck="false"
              />
              <div className="text-xs text-green-600 font-mono">✓ Current: "{formData.name}"</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value-fixed">Value (£)</Label>
              <Input
                id="value-fixed"
                name="value"
                type="number"
                step="1"
                min="0"
                value={formData.value}
                onChange={handleNumberChange}
                autoComplete="off"
              />
              <div className="text-xs text-green-600 font-mono">✓ Current: {formData.value}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description-fixed">Description (Optional)</Label>
              <Textarea
                id="description-fixed"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_liquid-fixed"
                checked={formData.is_liquid}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_liquid-fixed">Liquid Asset</Label>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save (FIXED)
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}