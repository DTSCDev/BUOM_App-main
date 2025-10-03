import { useState, useEffect, useCallback } from "react";
import { Asset, Category } from "@/types/NetAssetValue";

export function useAssetFormNew(asset: Asset | null, categories: Category[], onSave: (asset: Partial<Asset>) => void) {
  // Initialize form state
  const [formState, setFormState] = useState<Partial<Asset>>(() => {
    console.log("=== NEW HOOK INITIALIZATION ===");
    console.log("Asset:", asset);
    console.log("Categories:", categories);
    
    if (asset) {
      console.log("Using existing asset data");
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
    
    console.log("Using default form data:", defaultData);
    return defaultData;
  });

  const [isPension, setIsPension] = useState<boolean>(false);

  // Check if current category is pension
  useEffect(() => {
    const selectedCategory = categories.find(c => c.id === formState.category_id);
    const isPensionCategory = selectedCategory?.name === 'Pensions';
    console.log("Category check:", { 
      categoryId: formState.category_id, 
      categoryName: selectedCategory?.name, 
      isPension: isPensionCategory 
    });
    setIsPension(isPensionCategory);
  }, [formState.category_id, categories]);

  const updateFormField = useCallback((field: string, value: any) => {
    console.log(`Updating field ${field} to:`, value);
    setFormState(prev => {
      const updated = { ...prev, [field]: value };
      console.log("Updated form state:", updated);
      return updated;
    });
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Text field ${name} changed to:`, value);
    updateFormField(name, value);
  }, [updateFormField]);

  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    console.log(`Number field ${name} changed to:`, numValue);
    updateFormField(name, numValue);
  }, [updateFormField]);

  const handleSwitchChange = useCallback((checked: boolean) => {
    console.log("Switch changed to:", checked);
    updateFormField('is_liquid', checked);
  }, [updateFormField]);

  const handleCategoryChange = useCallback((value: string) => {
    const categoryId = parseInt(value);
    console.log("Category changed to:", categoryId);
    updateFormField('category_id', categoryId);
  }, [updateFormField]);

  const handlePensionTypeChange = useCallback((value: string) => {
    console.log("Pension type changed to:", value);
    const description = `Pension Type: ${value}`;
    updateFormField('description', description);
  }, [updateFormField]);

  return {
    formData: formState,
    isPensionCategory: isPension,
    handleChange: handleTextChange,
    handleNumberChange,
    handleSwitchChange,
    handleCategoryChange,
    handlePensionTypeChange
  };
}